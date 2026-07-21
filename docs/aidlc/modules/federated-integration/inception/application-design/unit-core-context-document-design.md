# U-C02-CORE-CONTEXT-DOCUMENT core-context-document 应用设计切片

- **unit_id / service_id**：`U-C02-CORE-CONTEXT-DOCUMENT` / `loeyae-aidlc`
- **设计源**：[components.md](components.md)、[component-methods.md](component-methods.md)、[application-services.md](application-services.md)、[component-dependency.md](component-dependency.md)
- **状态**：设计/静态生成；实现与运行 blocked/未验证

## 组件职责

| 组件 | 本单元职责 | 禁止边界 |
|------|------------|----------|
| `WorkspaceStateRepository` | 只从当前业务工作区读取/更新 state v2 与非敏感恢复记录 | 不读插件 state，不迁移 v3，不存 Secret/正文 |
| `RoleIntentBuilder` | 从角色、目标文档、提示词形成 RoleIntent/TargetDocument | 不明确时返回 NeedsUserInput，不扩大检索 |
| `MaterialSelectionService` | 合并自动结果与 include/exclude/old revision，形成解释性固定选择 | exclude 优先；未确认不得构建 bundle |
| `ContextBundleValidator` | 校验项目、修订、片段、来源状态、路径、降级和预算 | 不重写 Provider 事实，不接受跨项目/漂移/排除命中 |
| `FormalDocumentGenerator` | 在业务工作区生成事实分层文档并提交 Git/hash | 不把讨论/推断写成批准事实；本地失败不发布血缘 |
| `CitationAssembler` | 从实际使用片段形成固定 citation 和章节 hash | 不伪造 fragment，不漂移 revision |
| `LineagePublicationQueue` | 保存 Pending 并幂等发布/查询/对账血缘 | partial/失败不标记 synced，不复制正文 |
| `ReverseDocumentUploader` | 校验 repository/path/commit/hash 并上传说明 | 不修改代码/Git，不上传错配说明 |

## 方法切片

| 方法 | 用途 | 关键规则 |
|------|------|----------|
| `load(workspaceRoot): AidlcStateV2` | 唯一 state v2 恢复 | 缺失/无效阻断，不借用插件 state |
| `saveRecovery(state, action): AidlcStateV2` | 保存非敏感恢复动作 | 只保存必要引用和位置 |
| `build(role?, targetDocument?, prompt): RoleIntentResult` | 构建意图 | 不明确返回 NeedsUserInput |
| `select(intent, retrieval, explicitRules)` | 自动选择叠加显式规则 | exclude 优先；低置信/冲突/范围过大需确认 |
| `confirm(selection, userDecision)` | 固定 revision/fragment 范围 | 取消或未确认不继续 |
| `validate(bundle, binding, selection)` | 校验 bundle | 跨项目、漂移、排除命中阻断 |
| `generate(target, bundle, factPolicy)` | 生成事实分层草稿 | 只使用 bundle；推断必须标识 |
| `commit(workspace, draft)` | 写业务工作区并取得 hash/Git ref | 本地失败不准备血缘 |
| `assemble(artifact, usedFragments)` | 固定章节引用 | revisionId+fragmentId+locator+quoteHash |
| `buildPublishRequest(artifact, citations)` | 构建血缘请求 | 只发引用/章节摘要，不发正文权威 |
| `enqueue(generationId, request, idempotencyKey)` | 持久化 Pending | 仅必要非敏感引用 |
| `publish(pending)` | 发布并逐项处理 | 返回 Published/Partial/PendingRetry/Rejected |
| `reconcile(generationId)` | 查询并补发缺项 | 不重复逻辑血缘 |
| `prepareReverse(document, git)` | 校验说明与 Git | 错配 Rejected |
| `uploadReverse(upload, credentials)` | 幂等上传说明 | 不修改 Git |

## 应用服务切片

| 服务 | 本单元编排 |
|------|------------|
| `ResumeWorkflowService` | 定位当前业务工作区 → load state v2 → 接收 U-C01-CORE-PROVIDER-CLIENT 模式结果 → 建立平台无关会话 |
| `PrepareMaterialIntentService` | 构建角色/目标；缺失先询问；Online 使用 U-C01-CORE-PROVIDER-CLIENT 项目绑定，Legacy 结束远端分支 |
| `SelectMaterialService` | retrieval 结果 → include/exclude/old revision → 确认 → 经 U-C01-CORE-PROVIDER-CLIENT 创建 bundle → 校验固定条目 |
| `GenerateFormalDocumentService` | 事实分层草稿 → 内容校验 → 本地提交 → citations → 保存 Pending 血缘 |
| `PublishLineageService` | enqueue → U-C01-CORE-PROVIDER-CLIENT publish → 逐项处理 → query/reconcile → 更新非敏感恢复状态 |
| `UploadReverseDocumentService` | 读取说明 → 校验 Git path/commit/hash → prepare → 经 U-C01-CORE-PROVIDER-CLIENT 上传 → 保存固定 revision ref |
| `RecoverRemoteActionService` | 重载 state → 复核模式/凭据/版本 → 按原 idempotency key 重试或对账 |

## 业务规则与依赖

1. 正式文档提交与血缘发布是两个 Owner 边界；远端失败不删除本地正文。
2. Provider DTO 和传输失败只能经 U-C01-CORE-PROVIDER-CLIENT；U-C02-CORE-CONTEXT-DOCUMENT 不直接调用 `ssot-api`。
3. 任务、工时、进度、CI/测试、制品和部署结果缺外部稳定证据时标记未验证。
4. 平台只接收同一 Core 结果；平台名称不进入 RoleIntent、选择、引用或 state v2。

## 设计完成边界

U-C02-CORE-CONTEXT-DOCUMENT 的 state、意图、选择、bundle、正式文档、引用/血缘、逆向说明和恢复编排已静态拆分；持久化格式、模板算法、运行适配和证据仍待后续获批 Construction，当前未验证。
