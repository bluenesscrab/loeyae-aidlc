# AI-DLC Consumer 应用服务与编排器

- **Provider 契约**：SSOT OpenAPI `1.0.0-candidate.1`
- **系统基线**：`../../../../../product/system-baseline/`
- **状态**：I12 设计候选；没有 Consumer 适配或运行证据

## 编排器

| 应用服务 | 触发 | 编排步骤 | 成功条件 | 失败/恢复 |
|----------|------|----------|----------|-----------|
| ResumeWorkflowService | 任一平台继续业务流程 | 定位当前业务工作区 → load state v2 → 校验模式配置 → 构建平台无关会话 | state v2 有效且模式明确 | state 缺失/无效或部分配置时阻断；不读插件 state |
| PrepareMaterialIntentService | 需要资料支持的正式文档步骤 | 识别角色/目标 → 缺失则询问 → Online 时解析 Provider 项目；Legacy 时结束远端分支 | Online 获唯一 binding，或 Legacy 明确零调用 | 项目/权限/版本失败保持当前步骤；在线失败不改判 Legacy |
| SelectMaterialService | Online 且项目已解析 | 调用 retrieval → 应用 include/exclude/old revision → 检测低置信/冲突/范围 → 用户确认 → 创建 bundle → 校验 bundle | ValidatedBundle 固定到 project/revision/fragment | 需确认则等待；排除命中/跨项目/漂移直接阻断 |
| GenerateFormalDocumentService | bundle 已验证或 Legacy 走既有本地输入 | 按事实状态生成草稿 → 内容校验 → 写业务工作区/Git → 形成章节 hash/citations → 保存待发布血缘 | 本地 artifact 已提交且引用完整 | 本地失败不远端发布；无来源推断必须标识 |
| PublishLineageService | 本地 artifact 与 citations 已提交 | enqueue → OpenAPI publish → 逐项处理 → query/reconcile → 更新非敏感恢复状态 | Provider 返回全部 published 且可查询 | partial/失败保持 Pending；有限重试后人工恢复，不伪造 synced |
| UploadReverseDocumentService | 用户选择上传逆向说明 | 读取选定说明 → 校验 Git path/commit/hash → prepare → 幂等上传 → 保存远端固定 revision ref | Provider 修订引用与本地 commit/hash 对应 | 错配阻断；Provider 不可用 PendingRetry；不修改 Git |
| RecoverRemoteActionService | state v2 存在待恢复动作 | 重新加载 state → 复核模式/凭据/版本 → 按原 idempotency key 重试或对账 | 远端实际状态与本地记录一致 | 不无限重试；权限/冲突/固定引用缺失交给用户处理 |

## Online 主流程

1. 平台把业务请求、当前 workspace 与短时凭据传给 Core。
2. Core 只从 workspace state v2 恢复，形成 RoleIntent/TargetDocument。
3. ProjectBindingService 调用 Provider 解析唯一项目。
4. MaterialSelectionService 调用检索、应用显式选择并在必要时等待用户确认。
5. Provider 创建 ContextBundle；Core 校验每个固定条目及降级状态。
6. FormalDocumentGenerator 在业务工作区产出正文并形成固定 citations。
7. LineagePublicationQueue 发布章节血缘；只有远端实际成功才关闭闭环。
8. 平台只呈现相同 Core 结果，不维护独立业务状态。

## Legacy 分支

- endpoint 与 project candidate 均缺失时进入 Legacy。
- Legacy 不构建 ProviderProjectBinding，不创建 Gateway，不探测 Provider，八项在线契约调用数为 0。
- Legacy 继续现有本地流程；其运行兼容性必须由 I13/C8 证明，I12 不宣称已验证。
- Online 模式的超时、503、权限失败或契约冲突均不得触发 Legacy。

## 失败决策

| 类别 | 决策 |
|------|------|
| 项目歧义/不存在/越权 | Block；修复候选/权限后从同一步骤重试 |
| 固定修订/片段缺失 | Block；不使用缓存或最新修订替代 |
| 低置信/来源冲突/预算不足 | Confirm；等待用户调整或确认 |
| 索引部分不可用且 Provider 返回可定位结果 | Degrade；保留实际路径和失败状态 |
| 429/503 且 retryable | Retry；最多 3 次，1/2/4 秒 |
| 血缘 partial | 保持 Pending；query/reconcile 后补发缺项 |

## 平台一致性

三平台必须调用同一编排器和端口；相同 state v2、角色、目标、显式选择和 Provider 响应应得到相同资料修订、片段引用、错误决策与下一流程状态。平台名称不进入项目事实。
