# AI-DLC 主工作流路由

> 本文件只定义阶段路由、执行条件、审批级别和按需加载入口。步骤详情由对应 steering 文件定义。

## 强制规则

1. 使用简体中文交互，并称呼用户为 Boss。
2. 不确定时先提一个关键问题，不得用假设代替澄清。
3. 禁止 TODO、FIXME、空实现和未经验证的完成声明。
4. 每步完成执行 `common-step-completion-protocol.md`，以 `docs/aidlc/state.md` 为唯一恢复状态源。
5. 下一步说明必须附可直接复制的执行提示词。

## 审批模式

| 模式 | 等待规则 | 适用场景 |
|------|----------|----------|
| 严格 | 🔴、🟡均等待 | 团队协作、高风险项目 |
| 标准（默认） | 仅🔴等待 | 单人开发、中等复杂度 |
| 自主 | 仅需求确认、架构与安全决策等待 | 低风险迭代 |

团队协作自动使用严格模式；新项目首次 Inception 不得低于标准模式。🟢步骤仅通知，任何模式下均不得跳过其验证。

## 按需加载

| 时机 | 加载文件 |
|------|----------|
| 启动 | 本文件；首次启动再加载 `common-welcome-message.md` |
| 工作区检测后 | `common-complexity-assessment.md` |
| 恢复会话 | `common-session-continuity.md` |
| 变更请求 | `common-workflow-changes.md` + `change-request-process.md` |
| 进入步骤 | 路由表指定文件 |
| 创建文件 | `common-content-validation.md` |
| 执行门禁 | `common-quality-gates.md` |
| TDD、构建测试 | `common-test-execution-strategy.md` |

禁止启动时预加载全部规则。目录、审计、协作、提问和交接分别按 `common-directory-structure.md`、`common-audit-logging.md`、`common-team-collaboration.md`、`common-question-format-guide.md`、`common-session-handoff.md` 按需加载。

## 意图路由

工作区检测后读取 `state.md` 并按下表路由；无法唯一判断时询问用户。

| 意图 | 判定 | 路由 |
|------|------|------|
| 继续开发 | 继续、恢复、接着做 | `common-session-continuity.md` |
| 变更已有功能 | 修改、调整、重构现有功能 | CR1-CR5 |
| 新增功能 | 新功能且现有产物中不存在 | Inception 追加模式 |
| 新项目 | 无 state.md | Inception |

## Inception 路由

> 目标：确认开发什么、为什么开发以及如何验收。具体方法、产物和回退规则均在加载文件中定义。

| # | 步骤 | 条件 | 审批 | 加载文件 |
|---|------|------|------|----------|
| I1 | 工作区检测 | 始终 | 🟢 | `inception-workspace-detection.md` + `common-complexity-assessment.md` |
| I2 | 产品级 Inception | 多模块且尚未完成 | 🔴 | `product-inception.md` + `product-module-division.md` + `product-contracts.md` |
| I3 | 模块选择 | 多模块且产品级完成 | 🔴 | `product-inception.md` |
| I4 | 逆向工程 | 存量项目且无有效逆向产物 | 🟡 | `inception-reverse-engineering.md` |
| I5 | 需求分析 | 标准/完整流程 | 🔴 | `inception-requirements-analysis.md` |
| I6 | 需求审查 | I5 完成 | 🔴 | `inception-cross-validation.md`（a/b） |
| I7 | 用户故事 | 已生成需求文档 | 🔴 | `inception-user-stories.md` |
| I8 | 用户故事审查 | I7 完成 | 🔴 | `inception-cross-validation.md`（c/d） |
| I9 | UI Mock | 用户选择且存在界面需求 | 🔴 | `inception-ui-mock.md` |
| I10 | UI Mock 审查 | I9 已执行 | 🔴 | `inception-cross-validation.md`（e） |
| I11 | 工作流规划 | 标准/完整流程 | 🔴 | `inception-workflow-planning.md` |
| I12 | 应用设计 | 新接口、跨模块、多端或复杂业务规则 | 🟡 | `inception-application-design.md` |
| I13 | 测试用例派生 | I7、I12 已完成且存在可执行场景 | 🟡 | `test-case-derivation.md` |
| I14 | 单元生成 | 需拆分多个工作单元 | 🟡 | `inception-units-generation.md` |

快速通道的最小需求确认和跳过条件以 `common-complexity-assessment.md` 为准。多模块的模块级产物路径以 `common-directory-structure.md` 为准。

## Construction 入场门禁

若存在新接口、跨模块/服务调用、多端改动或复杂业务规则，I12 必须完成；若工作量超出单次执行范围或需多个工作单元，I14 必须完成。缺失时阻断并返回对应 Inception 步骤。

## Construction 路由

> 目标：按单元完成设计、TDD 实现、审查和可复现验证。所有条件阈值由 `common-complexity-assessment.md` 定义。

| # | 步骤 | 条件 | 审批 | 加载文件 |
|---|------|------|------|----------|
| C1 | 功能设计 | 新数据模型或业务规则达到阈值 | 🟡 | `construction-functional-design.md` |
| C2 | NFR 需求 | 明确性能指标或新增安全机制 | 🟡 | `construction-nfr-requirements.md` |
| C3 | NFR 设计 | C2 识别出特殊模式 | 🟡 | `construction-nfr-design.md` |
| C4 | 基础设施设计 | 新基础设施组件或部署架构变更 | 🟡 | `construction-infrastructure-design.md` |
| C5 | TDD 代码生成与两阶段审查 | 始终 | 🔴 | `construction-code-generation.md` + `construction-tdd.md` + `construction-code-review.md` |
| C6 | 系统化调试 | 出现技术失败 | — | `common-systematic-debugging.md` |
| C7 | 最终全局审查 | 所有单元完成 | 🟢 | `construction-code-review.md` |
| C8 | 实际构建和测试 | 始终 | 🔴 | `construction-build-and-test.md` + `construction-implementation-report.md` |

每个单元必须按“设计（条件）→ TDD → 规格合规审查 → 代码质量审查 → 影响域验证”闭环完成。C8 未取得实际命令证据时，Construction 不得标记完成。

## Operations 路由（部署准备，条件）

> 目标：为需要部署的项目生成与已确认目标环境匹配的交付配置和可执行部署说明；不覆盖部署后的生产运营。

| # | 步骤 | 条件 | 审批 | 加载文件 |
|---|------|------|------|----------|
| O1 | 部署需求与目标确认 | 独立服务、需部署或用户明确要求 | 🔴 | `operations-operations.md` |
| O2 | 交付配置生成 | O1 完成 | 🟡 | `operations-operations.md` + `operations-templates.md`（按需） |
| O3 | 配置验证与部署文档 | O2 完成 | 🔴 | `operations-operations.md` + `common-quality-gates.md` |

纯库、纯本地工具或用户明确不需要部署时跳过 Operations，并在 `state.md` 记录原因。

## Change Request 路由

| # | 步骤 | 条件 | 审批 | 加载文件 |
|---|------|------|------|----------|
| CR1 | 变更范围定位 | 始终 | 🟢 | `change-request-process.md` |
| CR2 | 影响评估 | 始终 | 🔴 | `change-request-process.md` |
| CR3 | 变更计划 | CR2 已确认 | 🔴 | `change-request-process.md` |
| CR4 | 执行变更与基准回写 | CR3 已确认 | 按受影响步骤 | 对应阶段 steering |
| CR5 | 一致性验证 | CR4 完成 | 🟢 | `change-request-process.md` + `inception-cross-validation.md` |

新增功能采用追加模式，从 I5 开始，仅追加受影响产物并对新增/受影响单元执行 Construction。任何需求语义或接口契约变化必须走 CR，不得只改代码。

## 完成标准

| 范围 | 完成条件 |
|------|----------|
| Inception | 必需产物经用户确认，交叉审查通过，执行/跳过决定写入 state.md |
| Construction | TDD、两阶段审查、全局审查、实际构建和测试均有证据且通过 |
| Operations | 仅生成选定部署目标需要的文件，配置语法/静态验证通过，部署说明可执行 |
| 会话连续性 | state.md、审计与下一步交接一致，可在三平台恢复 |
