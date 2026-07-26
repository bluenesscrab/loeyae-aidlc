# U-C02-CORE-CONTEXT-DOCUMENT core-context-document 应用设计切片

- **unit_id / service_id**：`U-C02-CORE-CONTEXT-DOCUMENT` / `loeyae-aidlc`
- **变更**：`CR-U-P01-CROSS-PROJECT-IMPORT-001 / CR4 B3 / Consumer I12`
- **契约边界**：经 U-C01 消费 Provider `contracts/ssot-api-v3.openapi.json` / `3.0.0-candidate.1`
- **状态**：Provider/Portal 已稳定；U-C02 Core v3 设计候选，未实现或运行验证

## 组件职责

| 组件 | 本单元职责 | 禁止边界 |
|------|------------|----------|
| `WorkspaceStateRepository` | 读取/更新当前业务工作区 state v2 与非敏感恢复记录 | 不读插件 state，不迁移 state v3，不存 Secret/正文 |
| `RoleIntentBuilder` | 形成 RoleIntent/TargetDocument 及显式目标项目范围 | 不明确时询问，不扩大项目或检索范围 |
| `MaterialSelectionService` | 合并已授权目标项目结果与 include/exclude/固定旧 revision | 默认只选 active；archived 自动命中 0；项目结果不混用 |
| `ContextBundleValidator` | 校验逐目标项目授权、project/revision/fragment、来源状态、路径、降级和预算 | 不接受未授权项目、串项目、漂移或排除命中 |
| `FormalDocumentGenerator` | 在业务工作区生成事实分层文档并提交 Git/hash | 不把推断写成 Provider 事实；恢复不改写已有引用 |
| `CitationAssembler` | 形成固定 project/revision/fragment citation 和章节 hash | 不伪造 fragment，不漂移 revision |
| `LineagePublicationQueue` | 保存 Pending 并经 U-C01 发布/查询/对账授权目标项目血缘 | partial/失败不标记 synced；不漂移到新 revision |
| `ReverseDocumentUploader` | 校验目标项目授权与 repository/path/commit/hash，经 U-C01 上传逆向说明 | 不修改 Git；不开放资料 revision 创建 |

## 方法切片

| 方法 | 用途 | 关键规则 |
|------|------|----------|
| `load(workspaceRoot): AidlcStateV2` | 唯一 state v2 恢复 | 缺失/无效阻断；不迁移 state v3 |
| `saveRecovery(state, action): AidlcStateV2` | 保存非敏感恢复动作 | 固定目标 projectId、revisionId 和原 idempotency key |
| `build(role?, targetDocument?, prompt): RoleIntentResult` | 构建意图 | 不明确返回 NeedsUserInput |
| `select(intent, retrievalByProject, explicitRules)` | 按项目选择并叠加显式规则 | 默认只 active；archived 自动命中 0；exclude 优先 |
| `confirm(selection, userDecision)` | 固定 project/revision/fragment | 未确认不继续 |
| `validate(bundle, authorizedBindings, selection)` | 校验 bundle | 所有目标项目须授权；串项目/漂移/排除命中 Block |
| `generate(target, bundle, factPolicy)` | 生成事实分层草稿 | 只使用固定 bundle；历史恢复不改写引用 |
| `commit(workspace, draft)` | 写业务工作区并取得 hash/Git ref | 本地失败不准备血缘 |
| `assemble(artifact, usedFragments)` | 固定章节引用 | projectId+revisionId+fragmentId+locator+quoteHash |
| `buildPublishRequest(artifact, citations)` | 构建 v3 血缘请求 | 只发引用/章节摘要，不发正文权威 |
| `enqueue/publish/reconcile` | 发布和对账固定血缘 | 目标项目须授权；不重复逻辑血缘、不漂移 revision |
| `prepareReverse/uploadReverse` | 校验并上传逆向说明 | 目标项目须授权；不等同 `createMaterialRevision` |

## 应用服务切片

| 服务 | 本单元编排 |
|------|------------|
| `ResumeWorkflowService` | load state v2 → 接收 U-C01 模式结果 → 建立平台无关会话 |
| `PrepareMaterialIntentService` | 构建角色/目标；Online 逐目标项目请求 U-C01 授权，Legacy 结束远端分支 |
| `SelectMaterialService` | 按项目检索 → active 默认过滤 → 显式 include/exclude/旧 revision → 确认 → 经 U-C01 创建 Context → 校验固定条目 |
| `GenerateFormalDocumentService` | 草稿 → 本地提交 → 固定 citations → 保存 Pending 血缘 |
| `PublishLineageService` | enqueue → 经 U-C01 publish/query → 按固定 project/revision 对账 |
| `UploadReverseDocumentService` | 校验目标授权及 Git → 经 U-C01 上传既有逆向说明 → 保存固定远端引用 |
| `RecoverRemoteActionService` | 重载 state v2 → 复核目标授权/v3 版本 → 按原 idempotency key 和固定引用重试或对账 |

## B1 权威边界与恢复语义

1. 读取、列表、检索、Context、血缘、逆向、解析/索引均要求目标项目授权；U-C02 不直接调用 `ssot-api`，只经 U-C01。
2. Provider/Portal 的 `createMaterial`、`archiveMaterial`、`restoreMaterialStatus`、`restoreMaterialRevision` 四个写入例外仅为直接能力；U-C02 不新增、不实现、不暴露这些入口，`createMaterialRevision` 不开放。
3. 默认自动检索/Context 只 active，archived 自动命中 0。
4. 已有读取授权时，显式固定旧 revision 和血缘保持原引用；archive 不使其漂移到其他 revision。
5. 历史内容恢复产生的新 revision 只影响后续默认读取，不改变既有 citation、lineage、Pending 或恢复动作。
6. Legacy 保持零 Provider 调用；state 保持 v2 与当前恢复语义。
7. Kiro、Claude Code、OpenCode 只经 Core，不协商 v3、零直连 Provider。

## 设计完成边界

本切片仅静态拆分 U-C02 的 v3 消费语义、目标项目授权、active 默认过滤、固定 revision、Context、引用/血缘、逆向说明和 state v2 恢复边界；未修改平台适配单元，也不宣称实现或运行验证。
