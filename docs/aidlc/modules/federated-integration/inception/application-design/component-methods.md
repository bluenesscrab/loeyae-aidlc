# AI-DLC Consumer 组件方法

- **范围**：`CR-U-P01-CROSS-PROJECT-IMPORT-001 / CR4 B3` Consumer I12 进程内端口与高层用途，不是实现代码
- **Provider 类型权威**：SSOT `contracts/ssot-api-v3.openapi.json#/components/schemas/*`，`3.0.0-candidate.1`
- **状态**：Provider/Portal 已稳定；Core v3 设计候选，未实现或运行验证

## WorkspaceStateRepository / IntegrationModeResolver

| 方法签名 | 高层用途 | 边界 |
|----------|----------|------|
| `load(workspaceRoot): AidlcStateV2` | 从当前业务工作区恢复唯一 state v2 | 缺失/无效时阻断；不借用插件 state，不迁移 state v3 |
| `saveRecovery(state, action: RecoveryAction): AidlcStateV2` | 保存非敏感失败位置与恢复动作 | 不保存 Secret、token 或完整资料正文 |
| `resolve(config: SsotBindingConfig): Legacy / Online / ConfigError` | 双缺失 Legacy、双存在 Online、部分配置 ConfigError | Provider 运行失败不改变 Online 模式 |

## RoleIntentBuilder / ProjectBindingService

| 方法签名 | 高层用途 | 边界 |
|----------|----------|------|
| `build(role?, targetDocument?, prompt): RoleIntentResult` | 形成角色与目标文档意图 | 不明确时返回 NeedsUserInput，不扩大检索 |
| `resolveProject(intent, config, credentials): ProviderProjectBinding` | 解析调用方工作区项目 | 只传候选和短时凭据，不猜项目 |
| `authorizeTargetProject(binding, targetProjectId, credentials): AuthorizedProjectBinding` | 对每个读取、列表、检索、Context、血缘、逆向、解析/索引目标项目取得并固定授权 | 不继承、合并或推导其他项目权限；未授权 Block |

## ProviderContractGateway

下列方法沿用 v3 OpenAPI 的既有 operationId；DTO 必须生成或自动校验，不复制字段定义。

| 方法签名 | operationId | 契约与边界 |
|----------|-------------|------------|
| `resolveProject(request)` | `resolveProject` | PROJECT；返回项目隔离结果 |
| `search(projectId, request)` | `searchProjectMaterials` | RETRIEVAL；默认只检索 active，archived 自动命中 0 |
| `createBundle(projectId, request, idempotencyKey)` | `createContextBundle` | CONTEXT；每个目标项目先授权 |
| `getRevision(projectId, materialId, revisionId)` | `getMaterialRevision` | MATERIAL；显式固定旧 revision 在读取授权仍有效时不漂移 |
| `getIndexStatus(projectId, materialId, revisionId)` | `getRevisionIndexStatus` | INDEX-STATUS；目标项目授权不可降级 |
| `publishLineage(projectId, request, idempotencyKey)` | `publishLineageRecords` | LINEAGE；仅向授权目标项目写入既有血缘能力 |
| `queryLineage(projectId, request)` | `queryLineageRecords` | LINEAGE；固定旧 revision 的血缘不漂移 |
| `uploadReverseRevision(projectId, reverseDocumentId, request, idempotencyKey, ifMatch?)` | `createReverseDocumentRevision` | REVERSE-DOC；仅既有逆向写，不等同 `createMaterialRevision` |

所有方法固定 header `X-SSOT-Contract-Version: 3.0.0-candidate.1` 并传播 correlationId；写调用使用稳定 idempotency key，条件写按契约使用 If-Match。Gateway 不提供 `createMaterial`、`archiveMaterial`、`restoreMaterialStatus`、`restoreMaterialRevision`、`createMaterialRevision` 或其他跨项目生命周期写方法。

## MaterialSelectionService / ContextBundleValidator

| 方法签名 | 高层用途 | 边界 |
|----------|----------|------|
| `select(intent, retrievalByProject, explicitRules): MaterialSelectionResult` | 汇总已授权目标项目结果并应用 include/exclude/old revision | 默认自动选择只含 active；archived 自动命中 0；项目间结果保持隔离 |
| `confirm(selection, userDecision): ConfirmedSelection` | 固定用户接受的 project/revision/fragment 范围 | 取消或未确认不得构建 bundle |
| `validate(bundle, authorizedBindings, selection): ValidatedBundle` | 校验逐条目标授权、固定引用、排除、source state、route、degradation、budget | 未授权、跨项目串用、漂移或排除命中阻断 |

## FormalDocumentGenerator / CitationAssembler

| 方法签名 | 高层用途 | 边界 |
|----------|----------|------|
| `generate(target, bundle, factPolicy): DraftArtifact` | 在既有阶段目录生成事实分层草稿 | 有来源内容保留 projectId/revisionId/fragmentId；历史恢复不改写既有引用 |
| `commit(workspace, draft): GenerationArtifact` | 写入业务工作区并取得 content hash/Git ref | 本地失败不准备远端血缘 |
| `assemble(artifact, usedFragments): CitationSet` | 形成固定 citations | 必含 projectId+revisionId+fragmentId+locator+quoteHash |
| `buildPublishRequest(artifact, citations): Provider:LineagePublishRequest` | 形成 v3 血缘请求 | 只发送引用/章节摘要，不发送正文权威 |

## LineagePublicationQueue / ReverseDocumentUploader / RecoveryCoordinator

| 方法签名 | 高层用途 | 边界 |
|----------|----------|------|
| `enqueue(generationId, request, idempotencyKey): PendingLineage` | 远端调用前保存可恢复动作 | 保存目标 projectId 与固定引用，不保存敏感正文 |
| `publish(pending): Published / Partial / PendingRetry / Rejected` | 向已授权目标项目发布并逐项处理 | partial/失败不标记 synced |
| `reconcile(generationId): ReconciliationResult` | 按固定 project/revision 查询并补发缺项 | 不漂移到恢复后新 revision，不重复逻辑血缘 |
| `prepareReverse(document, git, targetProject): ReverseDocUpload` | 校验说明、Git 与目标项目 | 目标项目未授权或错配时 Rejected |
| `uploadReverse(upload, credentials): Uploaded / PendingRetry / Rejected` | 幂等上传逆向说明 | 不修改 Git，不开放资料 revision 创建 |
| `decide(error: Provider:SsotError, operation): Block / Retry / Confirm / Degrade` | 按稳定 code/retryable/impact 决策 | 权限/隔离/固定引用失败 Block；不以 message 决策 |
