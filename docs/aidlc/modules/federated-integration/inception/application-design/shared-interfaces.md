# Consumer 共享接口与契约边界

- **设计源**：[components.md](components.md)、[component-methods.md](component-methods.md)、[application-services.md](application-services.md)、[component-dependency.md](component-dependency.md)
- **Provider 语义索引源**：`docs/aidlc/product/contracts.md`
- **Provider 字段权威**：SSOT `contracts/ssot-api-v1.openapi.json`，版本 `1.0.0-candidate.1`
- **状态**：设计/静态生成；Consumer 适配和运行均 blocked/未验证

## 八项 Provider 契约

| 契约 | U-C01-CORE-PROVIDER-CLIENT Gateway operationId | Core 消费语义 | Owner/失败边界 |
|------|---------------------------|---------------|----------------|
| `SSOT-PROJECT-001` | `resolveProject` | 只提交配置候选与短时访问上下文，接受唯一授权项目；不猜项目 | U-C01-CORE-PROVIDER-CLIENT；歧义/不存在/越权 Block，保持 state v2 |
| `SSOT-MATERIAL-001` | `getMaterialRevision` | 默认最新、显式旧版；选择、bundle、citation 固定修订/片段 | U-C01-CORE-PROVIDER-CLIENT 传输、U-C02-CORE-CONTEXT-DOCUMENT 语义；固定引用缺失不得替换为最新 |
| `SSOT-RETRIEVAL-001` | `searchProjectMaterials` | 当前项目内按角色/目标/提示词检索；保留 include/exclude/old revision 和实际路径 | U-C02-CORE-CONTEXT-DOCUMENT 选择；低置信/冲突/范围过大 Confirm |
| `SSOT-CONTEXT-001` | `createContextBundle` | 固定项目/资料/修订/片段/来源状态/预算/降级，只用于当前目标文档 | U-C02-CORE-CONTEXT-DOCUMENT 校验；跨项目、漂移、排除命中 Block |
| `SSOT-REVERSE-DOC-001` | `createReverseDocumentRevision` | repository/path/commit/content hash 对应，返回固定说明修订 | U-C02-CORE-CONTEXT-DOCUMENT；错配 Rejected，重试不产生逻辑重复修订 |
| `SSOT-LINEAGE-001` | `publishLineageRecords`、`queryLineageRecords` | 发布 FragmentCitation、DocumentSection 摘要和 LineageRecord；正文留在 Git | U-C02-CORE-CONTEXT-DOCUMENT；partial/失败保持 Pending 并对账，不标记 synced |
| `SSOT-INDEX-STATUS-001` | `getRevisionIndexStatus` | 观察解析/全文/向量/图索引状态和明确降级路径 | U-C01-CORE-PROVIDER-CLIENT 错误、U-C02-CORE-CONTEXT-DOCUMENT 校验；权限/项目失败不可降级 |
| `SSOT-FAILURE-001` | 全部 operation 的 `SsotError` | 稳定 code/retryable/impact 驱动 Block/Retry/Confirm/Degrade，message 只展示 | U-C01-CORE-PROVIDER-CLIENT；不以消息驱动逻辑，不无限重试 |

所有 Provider DTO 必须从 OpenAPI 生成或自动校验，不得在 Consumer 或平台适配层手写第二套字段定义。所有在线调用固定 header `X-SSOT-Contract-Version: 1.0.0-candidate.1`，传播 correlationId；写操作使用稳定 idempotency key，条件写按契约使用 If-Match。

## Core 与三平台端口

| 端口 | 输入 | 输出 | 可变差异 | 不可变语义 |
|------|------|------|----------|------------|
| `KiroAdapter` → Core | workspace、平台无关命令、用户输入、短时凭据引用 | Core 结果、确认请求、恢复动作、呈现模型 | Kiro 工具调用和交互 | RoleIntent、TargetDocument、选择、bundle、引用、错误决策、state v2 |
| `ClaudeAdapter` → Core | 同一标准输入 | 同一标准输出 | Plugin 入口和交互 | 同上；不得复制业务规则 |
| `OpenCodeAdapter` → Core | 同一标准输入 | 同一标准输出 | Plugin 入口和交互 | 同上；不得复制业务规则 |

平台不得直接依赖 Provider OpenAPI DTO、`ssot-api`、Worker、数据库、对象存储或索引；不得维护第二份业务 state。相同输入产生的资料修订、片段引用、错误决策和下一流程状态必须一致。

## Online / Legacy / ConfigError 接口

`IntegrationModeResolver.resolve(config)` 只允许以下三态：

| 配置 | 模式 | Gateway 行为 | 恢复行为 |
|------|------|--------------|----------|
| endpoint、project candidate 均存在 | Online | 可在项目绑定后调用 Provider | 远端失败保持 Online 和当前 state v2，不回退 Legacy |
| 两者均缺失 | Legacy | Gateway 不实例化或不接收调用，八项调用总数为 0 | 继续既有本地流程 |
| 仅一项存在 | ConfigError | 不调用 Provider | 阻断并要求修复配置 |

## 配置与 Secret 边界

- endpoint、project candidate 属于非敏感绑定配置；短时 Bearer、委托令牌、测试身份和 Secret 由各平台受控运行时注入。
- Git、state v2、提示词正文、普通日志和生成文档不得保存 Secret、令牌或敏感原文；只允许保存受控非敏感引用。
- Provider projectId 必须与已授权 binding 一致；路径 projectId、解析结果与访问范围冲突时 Block。
- 三平台分发物不得包含本仓自举 `docs/aidlc/`，平台名称不得进入业务项目事实。

## 版本与兼容边界

1. 当前唯一候选版本为 `1.0.0-candidate.1`；候选不等于已适配或已验证。
2. 新主版本兼容窗口至少 90 日，并等待 Provider 与全部直接 Consumer 的版本组合证据；未知组合不得宣称兼容。
3. Provider/Consumer 双仓契约索引与机器契约必须一致；发现未知 Consumer、破坏性字段或无法回滚状态时停止实现。
4. U-C03-KIRO-ADAPTER—U-C05-OPENCODE-ADAPTER 只依赖 Core 端口版本，不直接协商 Provider 版本。

## 失败、重试与恢复接口

`RecoveryCoordinator.decide(error, operation)` 返回 `Block / Retry / Confirm / Degrade`：

| 条件 | 决策 |
|------|------|
| 项目歧义/不存在、权限拒绝、固定修订/片段缺失、版本冲突 | Block；不使用缓存或最新修订替代 |
| 低置信、来源冲突、范围过大、预算不足 | Confirm；等待用户调整或确认 |
| 部分索引不可用且 Provider 返回可定位结果 | Degrade；保留实际路径、失败状态与影响 |
| `retryable` 的 429/503 | Retry；最多 3 次，退避 1/2/4 秒 |
| 血缘 partial、传输超时结果未知 | Pending；query/reconcile 后补发缺项，不重复逻辑血缘 |

## state v2 边界

- `WorkspaceStateRepository.load(workspaceRoot)` 只读取当前业务工作区 state v2；缺失/无效时阻断，不借用插件 state，不迁移 v3。
- `saveRecovery(state, action)` 只保存流程位置、generationId、idempotency key、correlationId、固定引用和非敏感恢复动作。
- 平台切换复用同一业务 state；Provider 或索引失败不得推进当前步骤；恢复从同一步骤开始。

## 引用、正文与血缘边界

1. `FormalDocumentGenerator.commit` 先把正文写入业务工作区/Git并取得 content hash/Git ref；本地失败时不得准备远端血缘。
2. `CitationAssembler.assemble` 为每个有来源章节生成包含 revisionId、fragmentId、locator、quoteHash 的固定 citation；不得伪造片段或漂移修订。
3. `LineagePublicationQueue.enqueue` 在远端调用前保存非敏感 Pending；`publish/reconcile` 只发送引用、章节定位/摘要和状态，不发送正文权威。
4. 血缘失败不删除本地正文，也不标记闭环完成；源资料更新后历史引用继续指向生成时修订。

## 运行状态

上述均为 I12/I14 设计接口。12 个运行锚点仍为 `0/12`，Provider/Consumer 适配、Legacy 零调用、三平台 conformance、版本组合、故障恢复和 E2E 均未运行验证。
