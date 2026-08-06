# P0/P1 能力型 Skill 提炼实施方案

> **状态**：Mermaid 横切前置规范和全部 P0 能力已实施；P1 候选尚未进入实现。
>
> **维护方式**：新增评估项时，先更新“评估结论与优先级”及对应能力卡；确认范围后才进入“实施批次”。本文件是本次 Skill 化规划的事实来源，不复制 `steering/` 中的具体流程规则。

## 1. 背景与目标

本方案整理本 Session 已完成的两轮评估：

1. 全流程阶段评估确认：稳定输入输出、可跨场景复用且能与审批/状态/门禁隔离的能力，适合提炼为 Skill；阶段路由和治理不可提炼。
2. UI 专项评估确认：HTML UI Mock 与 Figma 设计均具有独立输入输出，已分别提炼为能力型 Skill；页面计划、用户审核、state/audit 和 I10 保持在 steering 编排层。

目标是在不改变 AI-DLC 治理边界的前提下，逐批将 P0/P1 能力提炼为平台无关薄 Skill，并继续由三个平台按目录发现。

## 2. 事实与边界

### 2.1 共享事实来源

| 信息类型 | 唯一事实来源 |
|----------|--------------|
| 阶段路由、条件、审批和完成标准 | `steering/core-workflow.md` |
| 能力执行的具体规则 | 对应 `steering/*.md` |
| 平台无关能力入口 | `skills/` |
| 三平台入口与安装总览 | `README.md` |
| Kiro、Claude Code、OpenCode 平台适配 | `POWER.md`、`CLAUDE.md`、`.opencode/`、`package.json` |
| 会话恢复状态 | 业务项目的 `docs/aidlc/state.md` |

### 2.2 不可下沉到 Skill 的职责

以下职责继续保留在 steering 编排层，任何新增 Skill 均不得复制或接管：

- 阶段路由、步骤触发条件、审批等级和完成判定；
- 用户确认、模式选择和变更请求分流；
- `state.md`、审计、交接与步骤完成协议；
- 质量门禁、`approved/blocked` 决策和跨产物审查；
- CR1—CR5 生命周期；
- 生产部署和部署后的生产运维。

### 2.3 能力 Skill 的统一最小契约

每个 Skill 只应包含：

1. frontmatter 中的唯一 `name` 和简短 `description`；
2. 调用方必须提供的输入；
3. 应加载的唯一或按需 steering 入口；
4. 标准化输出、证据和未解决问题；
5. 输入不足时返回 `NEEDS_CONTEXT`；
6. 明确禁止更新 state/audit、代替用户审批、放行门禁或宣布阶段完成。

Skill 不得复述 steering 中的完整流程、前置审批、失败升级策略或质量门禁。

## 3. 评估结论与优先级

> 历史评估没有在仓库中留下正式的 P0/P1 汇总表。以下优先级根据已确认的复用度、输入输出稳定性、跨阶段影响和实现依赖重新归档；后续评估应在本节追加或调整，而不是将结论散落在审计记录中。

### 3.1 P0：已实施能力

| 能力 | Skill | 当前状态 | 规则来源 | 触发位置 |
|------|-------|----------|----------|----------|
| HTML UI Mock 设计 | `aidlc-ui-mock-design` | 已实施 | `inception-ui-mock-generation.md` | I9 HTML Mock |
| Figma 设计/外部登记 | `aidlc-figma-design` | 已实施 | `inception-ui-figma-generation.md` | I9 Figma |

两项能力共用 `inception-ui-page-planning.md`。I9 保留模式选择、页面计划确认、用户审核与状态更新；I10 通过 `inception-cross-validation.md` 对 canonical `page-plan.md` 和模式产物进行一致性审查。

### 3.2 P0：本批已实施能力

| 能力 | 规划 Skill | 规则来源 | 触发位置 | 评估依据 |
|------|------------|----------|----------|----------|
| 测试用例派生 | `aidlc-test-case-derivation` | `test-case-derivation.md` | I13 | 输入来源和 UC-D 输出结构稳定，产物被 I13、TDD、代码审查和 C8 消费 |
| 代码审查 | `aidlc-code-review` | `construction-code-review.md` | C5、C7、复杂缺陷修复后 | Spec/Standards 双轴输入、报告格式和修复复审闭环稳定，可跨审查场景复用 |
| 系统化调试 | `aidlc-systematic-debugging` | `common-systematic-debugging.md` | C6、TDD/构建/集成失败 | 失败输入、四阶段方法、调试记录和停止条件稳定，可跨技术失败复用 |

三项能力已按薄入口实施并接入阶段路由。Mermaid 两层规范作为文档产出的横切前置能力，仍保留在 `steering/common-mermaid-diagram-standards.md` 与 `steering/common-mermaid-syntax-rules.md`，不提炼为 Skill。

### 3.3 P1：候选能力

P1 能力已被阶段评估识别为具备 Skill 化潜力，但尚需在实际实施前完成一次输入—输出—消费者复核。若无法形成稳定契约，应保留为 steering。

| 能力 | 规划 Skill | 当前规则来源 | 触发位置 | 实施前复核重点 |
|------|------------|--------------|----------|----------------|
| 逆向工程 | `aidlc-reverse-engineering` | `inception-reverse-engineering.md` | I4 | 证据采集范围、存量系统类型和输出目录是否可统一 |
| 用户故事生成 | `aidlc-user-story-generation` | `inception-user-stories.md` | I7 | personas、故事、验收映射和用户审批边界 |
| 应用设计 | `aidlc-application-design` | `inception-application-design.md` | I12 | 多端、接口、数据、一致性等条件产物能否以同一契约表达 |
| 工作单元生成 | `aidlc-unit-generation` | `inception-units-generation.md` | I14 | 单元粒度、依赖、认领与协作状态的分界 |
| 构建测试证据 | `aidlc-build-test-evidence` | `construction-build-and-test.md`、`construction-implementation-report.md` | C8 | 真实命令执行、原始输出和报告生成必须严格区分 |
| 交付配置生成 | `aidlc-delivery-config-generation` | `operations-operations.md`、`operations-templates.md` | O2 | 已确认目标环境与配置模板的输入契约 |
| 部署准备验证 | `aidlc-deployment-validation` | `operations-operations.md`、`common-quality-gates.md` | O3 | 静态配置验证与实际生产部署的边界 |

### 3.4 明确不提炼的职责

- 主工作流、审批模式和复杂度路由；
- 需求澄清、需求审查、I8/I10 交叉验证；
- `state.md`、审计、交接、完成协议；
- CR 生命周期和质量门禁；
- TDD 编排本身；
- O1 部署目标/环境确认与生产运维。

## 4. P0 详细实施设计

### 4.1 `aidlc-test-case-derivation`

**新增文件**：`skills/aidlc-test-case-derivation/SKILL.md`

**调用输入**：

- 用例类型（产品或技术）；
- 已批准需求、故事或已批准风险来源；
- 可执行锚点；
- 模块/服务范围；
- 适用的现有测试与覆盖证据。

**加载规则**：`steering/test-case-derivation.md`。

**返回输出**：

- 新增或更新的 UC-D 用例文件；
- 用例索引和来源映射；
- 覆盖缺口、冲突和未决项；
- 结构自检结果。

**禁止项**：不批准需求或风险来源；不更新 `state.md`；不判定 I13 完成；不执行 TDD 或 C8。

**接线修改**：

- 在 `skills/aidlc-inception/SKILL.md` 的 I13 路由中声明调用该能力；
- `steering/core-workflow.md` 继续保留 I13 的条件、审批和 `test-case-derivation.md` 入口，不加入能力细节；
- I13 编排继续判断来源是否已批准，并负责步骤完成协议。

**验收标准**：每个 UC-D 都能反向追溯来源和锚点，且 I13、TDD、审查、C8 可通过索引消费。

### 4.2 `aidlc-code-review`

**新增文件**：`skills/aidlc-code-review/SKILL.md`

**调用输入**：

- 审查范围与变更集；
- 适用 Spec、契约、设计和 Standards；
- 测试、构建与运行证据；
- 审查模式（单元双轴审查或全局审查）；
- 影响域。

**加载规则**：`steering/construction-code-review.md`。

**返回输出**：

- Spec/Standards 双轴审查报告；
- 含定位与严重度的问题清单；
- 修复建议和复审结果；
- 证据不足或技术阻断项。

**禁止项**：不决定 C5/C7 是否触发；不合并或批准代码；不把“无问题”解释为 Construction 完成。

**接线修改**：

- 在 `skills/aidlc-construction/SKILL.md` 中，C5 声明 TDD 后调用该 Skill，C7 声明以全局审查模式调用同一 Skill；
- 保留 `construction-code-review.md` 对模式选择、标准、报告格式、修复闭环和平台降级的事实定义；
- 如 `construction-subagent-execution.md` 有调度规则，只补充能力调用约定，不改变调度权责。

**验收标准**：C5 与 C7 复用同一能力，但通过调用方输入区分范围和模式；修复后可以重新调用生成可追溯复审结论。

### 4.3 `aidlc-systematic-debugging`

**新增文件**：`skills/aidlc-systematic-debugging/SKILL.md`

**调用输入**：

- 可复现错误和复现步骤；
- 原始日志、堆栈、环境信息；
- 已尝试操作和结果；
- 影响范围、相关代码或契约；
- 当前验证命令。

**加载规则**：`steering/common-systematic-debugging.md`。

**返回输出**：

- 假设—验证记录；
- 根因证据或明确未决结论；
- 最小修复建议；
- 修复后验证结果或升级所需上下文。

**禁止项**：不臆测根因；不绕过三次失败停止条件；不决定是否回退 Inception/CR；不更新 state/audit。

**接线修改**：

- `skills/aidlc-construction/SKILL.md` 的 C6 改为调用该 Skill；
- TDD、构建、集成和审查失败保留原有故障路由，仅在进入 C6 后消费该能力；
- 修复仍须返回 TDD、审查和 C8 验证链。

**验收标准**：无法复现或证据不足时可明确返回阻断；调试记录可被修复、审查与 C8 消费。

## 5. P1 实施原则与顺序

### 5.1 批次顺序

| 批次 | 范围 | 前置条件 | 完成条件 |
|------|------|----------|----------|
| 0 | 基线核对 | 本文件评估项已确认 | 每项具备输入—输出—消费者矩阵 |
| 1 | P0 测试用例派生 | I13 规则与消费者已核对 | Skill、I13 接线、语义复审与静态验证通过 |
| 2 | P0 代码审查与调试 | C5/C6/C7 边界已核对 | 两个 Skill、Construction 接线与修复闭环验证通过 |
| 3 | P1 Inception | P0 全部稳定 | 按 I4 → I7 → I12 → I14 单项实施和验证 |
| 4 | P1 C8 与 Operations | P1 Inception 不引入治理冲突 | C8、O2、O3 分别实施和验证 |

### 5.2 P1 逐项准入规则

每项 P1 在创建 Skill 前必须回答：

1. 调用方可提供哪些不可猜测的输入？
2. 输出会被哪些后续步骤消费？
3. 当前 steering 是否混有审批、state、门禁或跨步骤协调？
4. 如有混合职责，能否先抽出纯 generation/execution steering？
5. 平台能力不足时，如何由编排层返回 `blocked` 而不是由 Skill 自动变更流程？

任意一项无法明确时，停止提炼并将结论写回本文件的“评估待补充项”。

## 6. 统一实施与验证流程

### 6.1 单项实施步骤

1. 阅读候选 steering、消费者和阶段入口；
2. 明确输入、输出、阻断项和禁止项；
3. 必要时先抽出纯 execution steering；
4. 新增 `skills/aidlc-{capability}/SKILL.md`；
5. 仅修改受影响阶段入口的路由说明；
6. 运行职责语义审查；
7. 执行静态、引用和发布包验证；
8. 最小追加 `state.md`、审计摘要和分段审计，不覆盖并行工作流。

### 6.2 每批验证清单

- `git diff --check`；
- `node --check ".opencode/plugins/loeyae-aidlc.js"`；
- Skill frontmatter、目录名和唯一名称检查；
- 受影响 Markdown 内部引用存在性检查；
- 旧职责、重复门禁与废弃引用搜索；
- `npm pack --dry-run --json`，确认新增 Skill 和 steering 进入发布包；
- 语义审查：无双重门禁、审批循环、输入枚举漂移、状态恢复缺口或平台能力误声明；
- 三平台实际发现烟测仅在具备对应客户端时执行；未执行时必须明确标为未验证。

## 7. 平台兼容性策略

当前不新增逐 Skill 注册表：

- Kiro Power 按需读取 `skills/`；
- Claude Code 插件按需读取共享 `skills/`；
- OpenCode 插件将整个 `skills/` 目录加入 `config.skills.paths`；
- `package.json` 发布清单包含整个 `skills/` 与 `steering/` 目录。

因此新增 Skill 的平台兼容性默认通过目录发现与发布包清单验证。只有入口机制、发布清单或平台能力声明变化时，才修改 `README.md`、`POWER.md`、`CLAUDE.md`、`.opencode/` 或 `package.json`。

## 8. 评估待补充项

| 编号 | 待确认问题 | 当前处理 | 结论状态 |
|------|------------|----------|----------|
| E-001 | P1 候选是否全部维持 P1，或有项目优先级需提升至 P0 | 不实施，等待 Boss 评估补充 | 待确认 |
| E-002 | I4、I7、I12、I14 是否应分别拆出纯 execution steering | 在逐项准入时分析 | 待确认 |
| E-003 | C8 是否只提炼证据结构化，还是包含命令编排辅助 | 保持“真实命令证据不可替代”边界 | 待确认 |
| E-004 | O2/O3 是否存在可复用的部署目标模板契约 | 不扩展至生产部署或生产运维 | 待确认 |
| E-005 | 是否为后续能力建立显式 P0/P1/P2 评估矩阵 | 本文件暂作为汇总事实来源 | 待确认 |

## 9. 当前执行决策

- 已实施：两个 UI 设计 P0 Skill、测试用例派生、代码审查和系统化调试三个 P0 Skill；
- 已实施横切前置：Mermaid 两层共享规范与现有示例迁移，不新增 Mermaid Skill；
- 尚未实施：全部 P1 候选；
- 当前阶段：P0 实施、阶段接线、语义复审和静态发布验证已完成；P1 继续按逐项准入规则评估；
- 下一项建议：补充或确认 E-001 至 E-005，再决定 P1 实施批次。
