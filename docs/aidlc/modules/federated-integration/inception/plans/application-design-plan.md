# I12 应用设计计划（AI-DLC Consumer）

## 计划状态

- **CR ID**：`CR-I5-SCOPE-001`
- **阶段**：CR4 B5 / I12 应用设计
- **风险级别**：L4
- **状态**：`approved`
- **启动时间**：2026-07-19T10:51:43Z
- **完成时间**：2026-07-19T14:36:22Z
- **状态模式版本**：2
- **授权前提**：SSOT 权威 `CR4-B5-I11-WORKFLOW-PLAN-APPROVAL-053=A`
- **决策结果**：SSOT 权威 `CR4-B5-I12-MACHINE-CONTRACT-FORMAT-DECISION-054=A`
- **批准证据**：SSOT 权威 `CR4-B5-I12-APPLICATION-DESIGN-APPROVAL-055=A`
- **下一步骤**：I13 计划已建立；SSOT 权威 `CR4-B5-I13-EVIDENCE-ANCHOR-DECISION-056=A` 已冻结登记方式，当前等待 `CR4-B5-I13-EVIDENCE-ANCHOR-REGISTRATION-057`
- **Provider 计划**：`../../../../../../../loeyae-ssot-server/docs/aidlc/modules/federated-ssot/inception/plans/application-design-plan.md`；实际跨仓位置以双仓 `state.md` 为准
- **授权边界**：055 已批准并关闭双仓 I12，只允许进入 I13 测试用例派生规划；不授权启动 I14、Construction、修改 Core、Kiro Power、Claude Code/OpenCode 插件、Hook、MCP、配置或发布包，也不证明 Consumer、Legacy、E2E 或三平台运行能力。

## 设计目标与固定边界

1. `loeyae-aidlc` Core 是八项 Provider 契约的唯一直接 Consumer；Kiro、Claude Code、OpenCode 仅调用 Core，不复制项目解析、资料选择、错误/降级或血缘规则。
2. 业务工作区继续以 state v2 作为唯一流程恢复源；平台不是项目属性，不创建三份状态。
3. 自动选择必须服从显式包含、排除和指定旧版；ContextBundle、引用和血缘固定到资料修订与片段。
4. AI-DLC 不复制 SSOT 原件、片段库、向量、图、权限规则或 Provider 机器 Schema；本地只保存非敏感绑定引用、选择事实、固定引用和待恢复动作。
5. 未配置 SSOT 时保持 Legacy 且八项在线契约调用数为 0；在线模式失败不得静默回退 Legacy。
6. I13、I14、Construction 和 Operations 均不在本计划执行范围内。

## 权威输入

- `../requirements/requirements.md`
- `../requirements/data-model.md`
- `../user-stories/personas.md`
- `../user-stories/stories.md`
- `execution-plan.md`
- `../../../../../product/contracts.md`
- `../../../../../product/system-baseline/`（I12 按触发条件建立）
- SSOT Provider 的需求、故事、契约和 I12 权威计划

## 设计执行清单

### A. 前置决策

- [x] 校验 SSOT 权威 `CR4-B5-I11-WORKFLOW-PLAN-APPROVAL-053=A`，关闭 I11 并获准启动 I12。
- [x] 核对 Provider/Consumer 对称模型、八项契约、Legacy 与三平台薄适配边界。
- [x] 已校验 SSOT 权威 `CR4-B5-I12-MACHINE-CONTRACT-FORMAT-DECISION-054=A`；Consumer 只引用 Provider OpenAPI 3.1 单一权威。

### B. Consumer 契约与系统基线

- [x] 只从 Provider 唯一机器事实来源映射 Consumer 类型、操作、稳定错误和版本协商设计；不得复制或手工分叉 Schema。
- [x] 更新本仓 `docs/aidlc/product/contracts.md` 的 Provider 来源、版本、Consumer 状态、兼容结论和证据入口。
- [x] 在 `docs/aidlc/product/system-baseline/service-catalog.md` 记录 Core、三平台薄适配和测试边界。
- [x] 在 `runtime-dependencies.md` 记录 Core→`ssot-api` 直接调用、三平台→Core 间接调用、消费者反向索引和失败行为。
- [x] 在 `external-systems.md` 记录 SSOT Provider、业务工作区/Git、身份/凭据适配器边界。
- [x] 在 `configuration-inventory.md` 记录非敏感 endpoint/项目候选引用、作用域、消费者、生效、缺失和回滚；不得记录 Secret 值。
- [x] 在 `consistency-scenarios.md` 记录本地正式文档提交、固定引用、远端血缘回写、逆向说明上传和待恢复状态。

### C. 强制应用设计产物

- [x] 生成 `../application-design/components.md`，定义 state 恢复、接入模式、项目解析、资料选择、上下文、文档生成、引用/血缘、逆向上传和平台适配组件。
- [x] 生成 `../application-design/component-methods.md`，定义进程内方法签名、Provider 类型引用和高层用途；详细业务逻辑留待 Construction。
- [x] 生成 `../application-design/application-services.md`，定义在线/Legacy、资料选择、ContextBundle 接受、正式文档生成、血缘发布和恢复编排器。
- [x] 生成 `../application-design/component-dependency.md`，定义 Core 内依赖、Provider 调用、三平台间接关系、数据流和失败不推进边界。

### D. 对齐、验证与审批

- [x] 与 SSOT Provider 的机器契约、四份核心应用设计和产品级系统基线逐项对齐八项契约、对象映射、错误/降级、版本组合和回滚边界。
- [x] 验证本仓不创建产品 UI 或 frontend-* 设计产物，不把 SSOT 静态 Mock 转换为本仓前端任务。
- [x] 验证 Markdown、表格、链接及适用文本结构，无占位标记、空实现或未经证实的运行结论。
- [x] 更新双仓计划、state v2 和审计，将 I12 置为 `pending_approval` 并等待 SSOT 权威严格审批。
- [x] I12 已由 SSOT 权威 `CR4-B5-I12-APPLICATION-DESIGN-APPROVAL-055=A` 明确批准；I13 仅进入计划，056=A 已冻结登记方式并等待 057 实际锚点登记，未创建测试用例正文、工作单元或任何实现。

## 权威审批入口

054 已在 SSOT Provider 计划回答为 `A`。双仓 I12 的唯一严格审批门禁位于：

`../../../../../../../loeyae-ssot-server/docs/aidlc/modules/federated-ssot/inception/plans/application-design-plan.md`

SSOT 权威 `CR4-B5-I12-APPLICATION-DESIGN-APPROVAL-055=A` 已关闭双仓 I12；`CR4-B5-I13-EVIDENCE-ANCHOR-DECISION-056=A` 已选择受控引用与稳定脱敏别名。I13 的唯一当前输入门禁位于 Provider `test-case-derivation-plan.md` 中的 `CR4-B5-I13-EVIDENCE-ANCHOR-REGISTRATION-057`；本仓不复制答案标签。I14/Construction 仍未启动。

## 审批后的继续提示词

`已填写 CR4-B5-I13-EVIDENCE-ANCHOR-REGISTRATION-057，请继续 AI-DLC 变更请求流程`
