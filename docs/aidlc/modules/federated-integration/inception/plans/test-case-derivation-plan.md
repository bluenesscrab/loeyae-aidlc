# I13 测试用例派生计划（AI-DLC Consumer）

## 计划状态

- **CR ID**：`CR-I5-SCOPE-001`
- **阶段**：CR4 B5 / I13 测试用例派生
- **风险级别**：L4
- **状态**：`completed`
- **启动时间**：2026-07-19T14:36:22Z
- **状态模式版本**：2
- **授权前提**：SSOT 权威 `CR4-B5-I12-APPLICATION-DESIGN-APPROVAL-055=A`
- **批准边界**：055 只授权关闭双仓 I12 并进入 I13；不授权启动 I14、Construction、实施代码、修改平台适配或声明运行能力已验证。
- **审批结果**：SSOT 权威 `CR4-B5-I13-TEST-CASE-APPROVAL-058=A`（2026-07-20T08:30:01Z）
- **Provider 权威计划**：`../../../../../../../loeyae-ssot-server/docs/aidlc/modules/federated-ssot/inception/plans/test-case-derivation-plan.md`；实际跨仓位置以双仓 `state.md` 为准
- **目标用例目录**：`../application-design/test-cases/`；44 个 Consumer UC-D、索引与追踪已由权威 058=A 批准，I13 已关闭

## Consumer 派生边界

1. 从本仓 13 个 Consumer 故事、34 个 Gherkin Scenario、四份已批准 Core Consumer 设计和 Provider OpenAPI 3.1 `1.0.0-candidate.1` 派生用例。
2. 本仓不复制 Provider Schema、权限规则、资料事实、解析/索引状态机或内部基础设施；契约用例必须引用 Provider 唯一机器事实。
3. Kiro、Claude Code、OpenCode 只验证经 Core 暴露的同一业务语义，不按平台重复资料选择、错误/降级、引用或血缘规则。
4. 未配置 SSOT 的 Legacy 必须证明远程调用数为 0；在线模式失败不得静默回退 Legacy，平台切换不得产生多份 state。
5. 外部证据必须可复现且不含 Secret；静态文档或 Schema 检查不得表述为 Consumer、Legacy、三平台或 E2E 运行验证。
6. I14、Construction、`src/`、平台插件、Hook、MCP、package/config 和发布包均不在当前授权范围内。

## 双仓来源与聚合策略

| 来源 | 数量/版本 | Consumer 用途 |
|------|-----------|---------------|
| SSOT Provider 用户故事 | 12 个故事、34 个 Gherkin Scenario | 建立 Provider 前置条件、稳定错误与可观察状态 |
| AI-DLC Consumer 用户故事 | 13 个故事、34 个 Gherkin Scenario | 资料选择、ContextBundle、正式文档、引用/血缘、Legacy 与恢复 |
| 双仓合计 | 25 个故事、68 个 Gherkin Scenario | 建立需求—故事—设计—用例跨仓追踪 |
| Provider 机器契约 | OpenAPI 3.1，`1.0.0-candidate.1`，19 个 operationId | Consumer 类型、错误、重试与版本组合的唯一契约来源 |

采用 Provider 权威计划定义的 A—J 十个参数化用例簇，不执行 68 个 Scenario × 19 个 operations × 3 个平台的全笛卡尔展开。Consumer 重点承担以下切片：

- B：项目解析、鉴权拒绝和越权零泄露的 Consumer 映射。
- E：自动/显式资料选择、包含/排除、固定旧版、ContextBundle 预算、低置信、冲突和显式降级。
- F：正式文档固定引用、章节血缘、逆向说明 Git commit/path/hash 关联和代码权威边界。
- G：`Idempotency-Key`、超时结果未知、partial、429/503、1/2/4 秒退避且最多 3 次、恢复与版本并存。
- H：Online/Legacy、Secret 隔离、未配置时零远程调用和在线失败不静默回退。
- I：Kiro/Claude Code/OpenCode 经 Core 的 conformance、同一 state v2 和平台接力。
- J：两个真实脱敏项目的端到端闭环与外部证据边界。

## 执行锚点缺口

| 必需输入 | 当前状态 | Consumer 关闭条件 |
|----------|----------|-------------------|
| Provider API 环境与身份 | 缺失 | 登记非敏感环境/身份别名、Owner 与受控引用 |
| Provider 依赖和可重置测试数据 | 未实施/未验证 | 固定版本、项目隔离、故障注入和恢复方式 |
| 两个真实脱敏项目 | 缺失 | 使用稳定项目别名及受控资料来源引用 |
| Core 与三平台测试命令 | 缺失 | 明确工作目录、单次命令、退出码和前置条件 |
| 契约、conformance 与 E2E 报告位置 | 缺失 | 明确可追踪路径、运行 ID、保留 Owner 和时间 |
| Provider/Core/三平台版本组合 | 缺失 | 固定提交、制品摘要、依赖版本和兼容结论 |
| 检索、恢复、性能与安全阈值 | 缺失 | 明确样本、量化阈值、失败条件和批准 Owner |

任一必需输入缺失时，仅阻断 `execution_ready`、实际运行和 C8 证据结论，不阻断 I13 设计级用例派生与评审。设计用例可标记 `design_status=ready`，但必须同时保持 `execution_status=blocked`、`status=blocked` 并列出 `blocked_by`；I13 严格审批通过前不得关闭 I13、启动 I14 或修改实现。

## 派生与审批清单

- [x] 校验 SSOT 权威 `CR4-B5-I12-APPLICATION-DESIGN-APPROVAL-055=A`，关闭双仓 I12 并获准进入 I13。
- [x] 盘点双仓 25 个故事、68 个 Gherkin Scenario、Provider OpenAPI 候选和 19 个 operationId。
- [x] 对齐 Provider A—J 十个参数化用例簇和 Consumer 责任切片。
- [x] 识别环境、身份、依赖、真实项目、命令、报告、版本组合和阈值缺口。
- [x] 校验 SSOT Provider 唯一登记方式决策 `CR4-B5-I13-EVIDENCE-ANCHOR-DECISION-056=A`；采用受控证据登记引用与稳定脱敏别名。
- [ ] 引用并等待 SSOT Provider `CR4-B5-I13-EVIDENCE-ANCHOR-REGISTRATION-057` 完整登记和复审全部非敏感运行锚点；当前 0/12，仅阻断执行就绪和运行验证。
- [x] 生成并验证 Consumer/Core/三平台模块级测试用例正文及追踪矩阵：34 个产品 UC-D、10 个技术 UC-D，34/34 个源 Gherkin 场景逐字且唯一覆盖。
- [x] 取得 SSOT 权威 `CR4-B5-I13-TEST-CASE-APPROVAL-058=A` 独立严格审批；双仓 I13 已关闭并获准进入 I14 规划。

## 权威证据登记入口

SSOT 权威 `CR4-B5-I13-EVIDENCE-ANCHOR-DECISION-056=A` 已选择“受控证据登记引用 + 稳定脱敏别名”；该答案只冻结登记方式，不证明实际锚点已存在。

唯一活动问题和答案仅位于 SSOT Provider 计划：

`../../../../../../../loeyae-ssot-server/docs/aidlc/modules/federated-ssot/inception/plans/test-case-derivation-plan.md`

SSOT 权威 057 已选择 A，但截至 2026-07-19T15:42:43Z，A 强制要求的 `environment_ref`、`api_base_url_alias`、`identity_ref`、`owner_ref`、`runtime_dependencies_ref`、`project_ref_01`、`project_ref_02`、`test_command_ref`、`report_location_ref`、`version_matrix_ref`、`thresholds_ref`、`secret_injection_ref` 共 12 个非敏感键值均未登记，因此 057 未闭合并继续阻断后续运行解除；它不再阻断 I13 设计级用例派生与评审。

2026-07-20T01:03:07Z 已按双仓现有 OpenAPI、system baseline、配置清单、state 和 `package.json` 逐键复核：可安全自动登记的实际受控引用为 0/12。`/api` 仅为相对路径，Bearer 与 `aidlc.ssot.auth_token_ref` 仅为设计/逻辑配置，候选契约版本、仓库提交、npm 版本、10 秒超时和最多 3 次尝试均只是局部事实，不能替代实际环境、身份、Owner、依赖、两个真实项目、测试命令、报告位置、完整版本矩阵、完整阈值或 Secret 注入引用。逐键意义、证据和缺口仅在 Provider 权威计划维护；本仓不复制答案标签或伪造运行锚点。

2026-07-20T03:25:22Z 已按 Boss 选择 A 修正阶段时序：057 仅控制运行解除，Consumer 44 个 UC-D 已按 `design_status=ready`、`execution_status=blocked`、`status=blocked` 生成并完成设计级验证。当前唯一审批入口是 Provider 权威 `CR4-B5-I13-TEST-CASE-APPROVAL-058`；批准前不关闭 I13、不启动 I14/Construction、不修改代码或平台适配，也不声明运行能力已验证。

## 严格审批入口

双仓 I13 设计产物的唯一答案位于 SSOT Provider 计划 `CR4-B5-I13-TEST-CASE-APPROVAL-058`；本仓不复制 `[回答]:`。058 是设计产物审批，不替代继续有效的 057 运行锚点门禁。

## 审批关闭记录

2026-07-20T08:30:01Z 已回读 SSOT Provider 权威答案 058=A。Boss 批准双仓 I13 设计级测试用例与追踪结论；Consumer 44 个 UC-D 保持 `design_status=ready`、`execution_status=blocked`、`status=blocked`，057 继续以 0/12 阻断运行。双仓进入 I14 规划，但不授权生成 I14 产物、Construction、代码或平台适配。

## 回答后的继续提示词

`已填写 CR4-B5-I14-UNIT-PLAN-APPROVAL-059，请继续 AI-DLC 变更请求流程`
