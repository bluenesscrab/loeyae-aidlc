# 优先级：本工作流覆盖所有其他内置工作流
# 当用户请求软件开发时，始终优先遵循本工作流

---

## 团队强制规则

1. **使用简体中文交互**
2. **禁止在代码中留下 TODO、FIXME 或占位符** — 所有功能必须实现到位
3. **按需加载文档** — 避免不必要的 token 消耗
4. **如果某部分无法实现，必须明确告知用户原因并提出替代方案**
5. **不确定时必须问** — 遇到模糊需求、多种理解、信息不足时暂停并提问，不得用假设代替澄清
6. **说服式防护替代硬规则**（参见 `common-persuasion-defense.md`）
7. **支持团队协作** — 识别协作模式，按角色加载最小上下文
8. **步骤完成强制协议** — 每个步骤完成必须更新 state.md（参见 `common-step-completion-protocol.md`）

---

## 自适应工作流原则

**工作流适应工作，而非工作适应工作流。**

AI 模型根据以下因素智能评估需要哪些阶段：
1. 用户意图的清晰度和完整性
2. 现有代码库状态（如有）
3. 变更的复杂度和范围
4. 风险和影响评估

---

## 审批模式

**审批模式**控制工作流中哪些步骤需要等待用户确认。在 `state.md` 的"审批模式"字段中记录。

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `严格` | 所有审批点都等待用户确认 | 团队协作、高风险项目、新手 |
| `标准`（默认） | 仅强制审批点等待，默认审批点自动通过 | 单人开发、中等复杂度 |
| `自主` | 仅需求确认和架构决策等待 | 熟练开发者、低风险迭代 |

**自动升级规则**：
- 团队协作模式 → 自动升级为 `严格`
- 新项目首次 Inception → 至少 `标准`

**审批点分级**：

| 级别 | 含义 | 示例 |
|------|------|------|
| 🔴 强制审批 | 任何模式下都必须等待 | 需求确认、架构决策、产品级 Inception、安全相关变更 |
| 🟡 默认审批 | `严格`模式等待，`标准`/`自主`模式自动通过 | 代码生成计划、功能设计、NFR 设计、逆向工程 |
| 🟢 信息通知 | 仅展示完成消息，不等待 | 进度更新、审计记录、质量门禁通过 |

**`标准`模式下"自动通过"的行为**：
- 展示完成摘要（精简版，非完整消息）
- 不等待用户回复，直接进入下一步
- 在审计中记录"自动通过（标准模式）"
- 如果用户在任何时候说"等一下"或"暂停"，立即切换为等待模式

---

## 必须：规则详情加载

**加载策略**（参见 `common-token-management.md` 了解完整策略）：

**第一层 — 启动时加载（必须）**：
- `core-workflow.md` — 本文件（路由表 + 审批规则）

**第二层 — 恢复时按需加载**：
- `common-session-continuity.md` — 仅在检测到现有项目时
- `common-team-collaboration.md` — 仅在团队协作模式时

**第三层 — 进入阶段时加载**：
- 当前步骤的 steering 文件（如 `inception-requirements-analysis.md`）
- `common-step-completion-protocol.md` — 首次执行步骤完成时加载
- `common-content-validation.md` — 仅在需要创建文件时
- `common-question-format-guide.md` — 仅在需要提问时

**第四层 — 执行特定任务时加载**：
- `common-quality-gates.md` — 执行质量门禁检查时
- `common-complexity-assessment.md` — 工作区检测后评估复杂度时
- `common-audit-logging.md` — 首次写审计时
- `common-directory-structure.md` — 创建目录时
- `common-test-execution-strategy.md` — TDD 验证阶段、构建和测试阶段
- `construction-implementation-report.md` — 生成实施报告时
- 编码规范文件 — 仅在代码生成阶段

**禁止预加载**：
- ❌ 不要在启动时一次性加载所有通用规则文件
- ❌ 不要预加载后续阶段的 steering 文件
- ✅ 进入哪个阶段，加载哪个阶段的文件

## 必须：内容验证

创建任何文件之前，按 `common-content-validation.md` 规则验证内容。

## 必须：欢迎消息

启动时从 `common-welcome-message.md` 加载欢迎消息，仅显示一次。

---

# 自适应软件开发工作流

---

# INCEPTION 阶段

**目的**：规划、需求收集和架构决策 — 确定做什么（WHAT）和为什么做（WHY）

**架构模式**：
- **单模块模式**：小项目，传统流程
- **多模块模式**：大项目，先产品级 Inception，再按模块并行

## INCEPTION 步骤路由表

| # | 步骤 | 条件 | 审批 | 加载文件 |
|---|------|------|------|----------|
| 1 | 工作区检测 | 始终 | 🟢 自动继续 | `inception-workspace-detection.md` + `common-complexity-assessment.md` |
| 1.5 | 产品级 Inception | 多模块模式 | 🔴 强制 | `product-inception.md` + `product-module-division.md` + `product-contracts.md` |
| 1.6 | 模块选择 | 多模块 + 产品级完成 | 🔴 强制 | （展示菜单） |
| 2 | 逆向工程 | 存量项目 + 无现有产物 | 🟡 默认 | `inception-reverse-engineering.md` |
| 3 | 需求分析 | 始终（自适应深度） | 🔴 强制 | `inception-requirements-analysis.md` |
| 4 | 用户故事 | 条件（智能评估） | 🟡 默认 | `inception-user-stories.md` |
| 4.5 | UI Mock | 有前端页面需求 | 🔴 强制 | `inception-ui-mock.md` |
| 5 | 工作流规划 | 始终 | 🔴 强制 | `inception-workflow-planning.md` + `common-content-validation.md` |
| 6 | 应用设计 | 条件（新组件/服务） | 🟡 默认 | `inception-application-design.md` |
| 7 | 单元生成 | 条件（需分解） | 🟡 默认 | `inception-units-generation.md` |

**执行规则**：
- 进入每个步骤时加载对应 steering 文件，按其内部步骤执行
- 每个步骤完成后执行步骤完成强制协议（`common-step-completion-protocol.md`）
- 多模块模式下，步骤 2-7 在模块级执行，路径从 `docs/aidlc/inception/` 变为 `docs/aidlc/modules/{module-name}/inception/`

---

## 步骤条件详情

### 工作区检测
- 检查 state.md 是否存在（存在则恢复）
- 扫描现有代码，判断存量/全新
- 询问协作模式和架构模式（新项目）
- **必须**：完成后执行复杂度评估（加载 `common-complexity-assessment.md`）
- 自动进入下一阶段

### 产品级 Inception（多模块模式）
- **执行条件**：多模块模式 + 无产品级产出物
- **跳过条件**：单模块模式 或 产品级已完成
- 产出物：`docs/aidlc/product/`（product-overview.md、modules.md、contracts.md、decision-summary.md）

### 模块选择（多模块模式）
- **执行条件**：多模块 + 产品级完成
- 展示模块菜单，用户选择后更新 state.md 活跃模块
- 上下文加载规则：✅ `product/contracts.md` + 当前模块产出物；❌ 其他模块产出物

### 逆向工程
- **执行条件**：检测到现有代码库 + 无逆向工程产物
- **跳过条件**：全新项目 或 产物已存在

### 需求分析
- **始终执行**，深度自适应：最小（简单清晰）/ 标准（正常）/ 全面（复杂高风险）
- 全面深度额外加载：`inception-requirements-methods.md`、`inception-requirements-prioritization.md`、`inception-requirements-validation.md`、`inception-requirements-data-model.md`

### 用户故事
- **必须执行**：新面向用户功能、多角色、复杂验收标准
- **跳过**：纯内部重构、简单 bug、无用户影响

### UI Mock
- **必须执行**：有前端页面需求、交付外部团队、多端需统一展示
- **跳过**：纯后端/API、有 Figma 稿、用户明确不需要

### 应用设计
- **执行条件**：新组件/服务、需定义方法和业务规则、服务层设计
- **跳过条件**：变更在现有组件边界内、纯实现变更

### 单元生成
- **执行条件**：系统需分解为多个工作单元
- **跳过条件**：单一简单单元、无需分解

---

# 🟢 CONSTRUCTION 阶段

**目的**：详细设计、代码生成、审查、构建 — 确定怎么做（HOW）

## CONSTRUCTION 步骤路由表

### Per-Unit 循环（对每个单元执行）

| # | 步骤 | 条件 | 审批 | 加载文件 |
|---|------|------|------|----------|
| C1 | 功能设计 | 新数据模型 或 业务规则≥3 | 🟡 默认 | `construction-functional-design.md` |
| C2 | NFR 需求 | 明确性能指标 或 新安全机制 | 🟡 默认 | `construction-nfr-requirements.md` |
| C3 | NFR 设计 | C2 已执行 + 需特殊模式 | 🟡 默认 | `construction-nfr-design.md` |
| C4 | 基础设施设计 | 新基础设施组件 或 部署变更 | 🟡 默认 | `construction-infrastructure-design.md` |
| C5 | 代码生成 | 始终 | 🔴 强制 | `construction-code-generation.md` |
| C6 | 系统化调试 | 遇技术问题时触发 | — | `common-systematic-debugging.md` |

### 全局步骤（所有单元完成后）

| # | 步骤 | 条件 | 审批 | 加载文件 |
|---|------|------|------|----------|
| C7 | 最终全局审查 | 始终 | 🟢 信息 | `construction-code-review.md`（全局审查清单） |
| C8 | 构建和测试 | 始终 | 🔴 强制 | `construction-build-and-test.md` + `construction-implementation-report.md` |

**执行规则**：
- 每个单元完整完成（设计 + TDD + 审查通过 + 微型摘要）后再进入下一个单元
- 代码生成包含三部分：规划（含 MCP Skill 加载）→ TDD 执行 → 两阶段审查
- MCP Skill 加载不可跳过（仅 Loeyae Boot 项目，参见 `construction-code-generation.md`）
- 构建和测试通过后生成阶段级完整实施报告

### 手术式变更原则

- 每一行代码改动必须追溯到当前单元需求
- 禁止"顺手"重构无关代码
- 审查"建议改进"项记录到 state.md 待优化项，不在当前单元修复
- 无关死代码提一下但不删除（除非是自己改动产生的孤儿）

### 条件步骤的复杂度阈值

参见 `common-complexity-assessment.md` 的"Construction 条件步骤的复杂度阈值"章节。

---

# 🟠 OPERATIONS 阶段

**目的**：生成 CI/CD 配置和部署文档 — 如何运行和维护（HOW to operate）

## OPERATIONS 步骤路由表

| # | 步骤 | 条件 | 审批 | 加载文件 |
|---|------|------|------|----------|
| O1 | 部署需求分析 | 始终 | 🟢 信息 | `operations-operations.md` |
| O2 | 部署规划问答 | 始终 | 🟡 默认 | （同上） |
| O3 | CI/CD 配置生成 | 始终 | 🟢 信息 | （同上） |
| O4 | 部署文档生成 | 始终 | 🔴 强制 | （同上） |

**执行条件**（满足任一即执行）：
- 项目需部署到测试/生产环境
- 项目是可独立运行的服务
- 用户明确要求

**跳过条件**（满足任一即跳过）：
- 纯本地工具/CLI
- 纯库项目
- 用户明确不需要

---

## 最终全局审查

所有单元代码生成和审查完成后、构建和测试之前执行。加载 `construction-code-review.md` 的最终全局审查清单：
- 跨单元一致性（接口调用、数据模型、错误处理、命名风格）
- 集成完整性（协作、依赖、配置）
- 测试完整性（覆盖率、关键路径）

---

## 核心原则（速记）

- **先思考后编码**：Inception 先于 Construction，不假设不猜测
- **权衡可见**：做技术决策时，必须呈现至少 2 个备选方案和选择理由（如果只有 1 个合理方案，说明为什么其他方案不可行）
- **不确定时必须问**：遇到模糊需求、多种理解、信息不足时，**暂停编码并向用户提问**。不得用假设代替澄清。
- **简洁优先 + 最少代码**：用最简方式实现需求。不添加"以后可能用到"的代码、不做投机性抽象、不引入未被需求要求的功能。
- **精准修改 + 手术式变更**：只改必须的，只清理自己造成的混乱。每一行改动追溯到用户请求。
- **目标驱动执行**：代码生成前定义成功标准，循环（TDD + 审查）直到验证通过。
- **自适应执行** + **复杂度驱动**：流程复杂度匹配任务复杂度（`common-complexity-assessment.md`）
- **审批分级**：🔴 必等 / 🟡 按模式 / 🟢 不等待
- **步骤完成协议**：每步必更新 state.md（`common-step-completion-protocol.md`）
- **TDD 纪律**：没有失败测试就没有生产代码（`construction-tdd.md`）
- **两阶段审查**：规格合规 → 代码质量，审查未通过 = 任务未完成（`construction-code-review.md`）
- **系统化调试**：先找根因再修复，3+ 次失败质疑架构（`common-systematic-debugging.md`）
- **质量门禁**：每阶段通过才能继续（`common-quality-gates.md`）
- **完整审计**：分段记录，捕获完整原始输入（`common-audit-logging.md`）
- **Session 交接**：完成消息内置交接选项（`common-session-handoff.md`）
- **团队协作**：接力模式（Inception）+ 认领模式（Construction）（`common-team-collaboration.md`）
- **说服式防护**：理解为什么不能跳步（`common-persuasion-defense.md`）
- **实施报告**：单元级微型摘要 + 阶段级完整报告（`construction-implementation-report.md`）
- **目录结构**：应用代码在工作区根，文档在 docs/aidlc/（`common-directory-structure.md`）
