# AI-DLC Consumer 组件方法

- **范围**：进程内端口与高层用途，不是实现代码
- **Provider 类型权威**：SSOT `contracts/ssot-api-v1.openapi.json#/components/schemas/*`
- **状态**：设计候选，未实现或运行验证

## WorkspaceStateRepository / IntegrationModeResolver

| 方法签名 | 高层用途 | 边界 |
|----------|----------|------|
| `load(workspaceRoot): AidlcStateV2` | 从当前业务工作区恢复唯一 state v2 | 缺失/无效时阻断；不借用插件 state |
| `saveRecovery(state, action: RecoveryAction): AidlcStateV2` | 保存非敏感失败位置与恢复动作 | 不保存 Secret、token 或完整资料正文 |
| `resolve(config: SsotBindingConfig): Legacy / Online / ConfigError` | 两项核心配置均缺失为 Legacy；均存在为 Online；部分配置为错误 | Provider 运行失败不改变 Online 模式 |

## RoleIntentBuilder / ProjectBindingService

| 方法签名 | 高层用途 | 边界 |
|----------|----------|------|
| `build(role?, targetDocument?, prompt): RoleIntentResult` | 形成角色与目标文档意图 | 不明确时返回 NeedsUserInput，不调用 Provider 扩大检索 |
| `resolveProject(intent, config, credentials): ProviderProjectBinding` | 经 Gateway 调用 `resolveProject` | 只传候选和短时 Bearer；不猜项目 |
| `assertBinding(binding, state): AuthorizedBinding` | 校验 Provider project 与业务工作区绑定一致 | 冲突时保持当前 state v2 |

## ProviderContractGateway

以下方法的 Provider DTO 必须从 OpenAPI 生成或自动校验；不得复制字段定义。

| 方法签名 | operationId | 契约 |
|----------|-------------|------|
| `resolveProject(request): Provider<ProjectResolutionResponse>` | `resolveProject` | PROJECT |
| `search(projectId, request): Provider<RetrievalResponse>` | `searchProjectMaterials` | RETRIEVAL |
| `createBundle(projectId, request, idempotencyKey): Provider<ContextBundleResponse>` | `createContextBundle` | CONTEXT |
| `getRevision(projectId, materialId, revisionId): Provider<RevisionResponse>` | `getMaterialRevision` | MATERIAL |
| `getIndexStatus(projectId, materialId, revisionId): Provider<IndexStatusResponse>` | `getRevisionIndexStatus` | INDEX-STATUS |
| `publishLineage(projectId, request, idempotencyKey): Provider<LineagePublishResponse>` | `publishLineageRecords` | LINEAGE |
| `queryLineage(projectId, request): Provider<LineageQueryResponse>` | `queryLineageRecords` | LINEAGE |
| `uploadReverseRevision(projectId, reverseDocumentId, request, idempotencyKey, ifMatch?): Provider<ReverseDocumentRevisionResponse>` | `createReverseDocumentRevision` | REVERSE-DOC |

所有方法固定 header `X-SSOT-Contract-Version: 1.0.0-candidate.1`，接收/返回 correlationId；传输失败统一进入 RecoveryCoordinator。

## MaterialSelectionService / ContextBundleValidator

| 方法签名 | 高层用途 | 边界 |
|----------|----------|------|
| `select(intent, retrieval, explicitRules): MaterialSelectionResult` | 自动结果叠加 include/exclude/old revision | exclude 优先；低置信/冲突/范围过大返回 NeedsConfirmation |
| `confirm(selection, userDecision): ConfirmedSelection` | 固定用户接受的 revision/fragment 范围 | 取消或未确认不得构建 bundle |
| `validate(bundle, binding, selection): ValidatedBundle` | 校验 project、固定引用、排除、source state、route、degradation、budget | 任一跨项目/漂移/排除命中阻断生成 |

## FormalDocumentGenerator / CitationAssembler

| 方法签名 | 高层用途 | 边界 |
|----------|----------|------|
| `generate(target, bundle, factPolicy): DraftArtifact` | 在既有阶段目录生成事实分层草稿 | 只使用 bundle 条目；推断必须标识 |
| `commit(workspace, draft): GenerationArtifact` | 写入业务工作区并取得可引用 content hash/Git ref | 本地失败不准备远端血缘 |
| `assemble(artifact, usedFragments): CitationSet` | 为每个有来源章节形成固定 citations | 必须包含 revisionId+fragmentId+locator+quoteHash |
| `buildPublishRequest(artifact, citations): Provider:LineagePublishRequest` | 形成 OpenAPI 血缘请求 | 只发送引用/章节摘要，不发送正文权威 |

## LineagePublicationQueue / ReverseDocumentUploader / RecoveryCoordinator

| 方法签名 | 高层用途 | 边界 |
|----------|----------|------|
| `enqueue(generationId, request, idempotencyKey): PendingLineage` | 在远端调用前保存可恢复动作 | 只保存必要非敏感引用 |
| `publish(pending): Published / Partial / PendingRetry / Rejected` | 调用 Provider 并逐项处理结果 | partial/失败不标记 synced |
| `reconcile(generationId): ReconciliationResult` | 查询 Provider 并补发缺项 | 不重复创建逻辑血缘 |
| `prepareReverse(document, git): ReverseDocUpload` | 校验路径、commit 和 content hash | 错配时 Rejected |
| `uploadReverse(upload, credentials): Uploaded / PendingRetry / Rejected` | 幂等上传并保存远端 revision ref | 不修改 Git |
| `decide(error: Provider:SsotError, operation): Block / Retry / Confirm / Degrade` | 稳定错误决策 | 仅 retryable/429/503 最多 3 次，退避 1/2/4 秒 |

详细文档模板、事实分层算法、客户端生成工具、持久化格式和平台实现属于后续获批工作单元。
