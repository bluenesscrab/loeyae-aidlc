---
name: aidlc-construction
description: "AI-DLC Construction 阶段 - 完整闭环执行：设计 → TDD 代码生成 → 两阶段审查 → 构建测试。不依赖外部 skill。"
---

# Construction 阶段

**开始时宣布：** "使用 aidlc-construction 执行 Construction 阶段"

**目的**：详细设计、NFR 实现、代码生成、代码审查、构建测试 — 确定怎么做（HOW）

> **薄入口说明**：本 skill 是步骤路由 + 平台执行模式选择。每个步骤的执行细节以对应 `steering/construction-*.md` 为准，整体流程、条件阈值、审批分级、手术式变更以 `steering/core-workflow.md` 的 CONSTRUCTION 章节为准。本 skill 不复制这些细节。

## 核心规则

1. 使用简体中文交互
2. 按需加载 steering 文件 — 每个步骤开始时加载对应文件
3. 禁止在代码中留下 TODO/FIXME
4. 每个步骤完成后更新 `docs/aidlc/state.md` 和对应分段审计文件
5. 完整闭环 — 所有步骤在本 skill + steering 内完成，不依赖外部 skill
6. 审批分级、完成消息、复杂度阈值按 `core-workflow.md` 执行

## 执行策略：Per-Unit 循环

```
对每个工作单元执行：
  1. 功能设计（条件）          → construction-functional-design.md
  2. NFR 需求（条件）          → construction-nfr-requirements.md
  3. NFR 设计（条件）          → construction-nfr-design.md
  4. 基础设施设计（条件）       → construction-infrastructure-design.md
  5. 代码生成（必执行）         → construction-code-generation.md
     - 第一部分：规划（含 MCP Skill 加载 + TDD 执行序列）
     - 第二部分：TDD 执行（RED→GREEN→REFACTOR）→ construction-tdd.md
     - 第三部分：两阶段代码审查 → construction-code-review.md
  6. 系统化调试（条件，遇技术问题触发）→ common-systematic-debugging.md

所有单元完成后：
  7. 最终全局审查（必执行）     → construction-code-review.md 全局审查清单
  8. 构建和测试（必执行）       → construction-build-and-test.md
```

条件步骤的执行/跳过阈值见 `core-workflow.md` 的"Construction 条件步骤的复杂度阈值"。每个单元完整完成（设计 + TDD 实现 + 审查通过）后再进入下一个单元。

## 平台自适应执行模式

加载 `steering/construction-subagent-execution.md`，检测当前平台是否支持子 Agent 派发：

- **支持（如 Claude Code 有 Agent 工具）→ 子 Agent 模式**：派发实现者子 Agent（TDD）+ 规格审查子 Agent + 质量审查子 Agent。各子 Agent 的指令模板、状态处理（DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED）见 `construction-subagent-execution.md`。
- **不支持（如 Kiro / OpenCode 单 Agent）→ 单 Agent 两阶段自审模式**：自行执行 TDD 循环，完成后切换"规格审查员"视角逐项对照规格，再切换"质量审查员"视角检查质量。额外纪律：强制重读规格、逐项检查、记录证据、自我质疑。

两种模式的完整定义均在 `construction-subagent-execution.md`，本 skill 不复制模板。

## MCP Skill 加载（强制，不可跳过）

代码生成规划阶段，按 `steering/construction-code-generation.md` 的加载策略：
- **前置检查**：从 `state.md` 读取 `后端框架` 字段，仅当 `= Loeyae Boot` 时调用 `loeyae-*` MCP Skill
- 后端（Loeyae Boot）：MCP `get_skill_summary`/`get_skill_content` 获取框架规范 + `common-tech-security.md` + `common-database-design.md`
- 后端（非 Loeyae Boot）：按项目自身风格 + `common-tech-security.md` + `common-database-design.md`
- 前端：PC → `common-tech-frontend-pc.md`；小程序/APP → `common-tech-frontend-uniapp.md`；有 Figma → `common-figma-design-standards.md`
- 测试：`common-tech-testing.md`；Loeyae Boot 测试 → MCP `get_skill_summary("loeyae-test")`
- Fallback：MCP 不可达时退回 steering 通用规范

## 两阶段审查与 TDD 铁律（速记，完整版见 steering）

- **TDD**：RED → 验证失败 → GREEN → 验证通过 → REFACTOR。没有失败测试就没有生产代码，违反则删除代码重新开始。（`construction-tdd.md`）
- **审查**：阶段 1 规格合规（完整/准确/无多余/接口契约）→ 阶段 2 代码质量（关键/重要/建议）。顺序不可颠倒，发现问题必须修复并重新审查。（`construction-code-review.md`）
- **手术式变更**：审查发现的"建议改进"记录到 state.md 的"待优化项"，不在当前单元修复。（`core-workflow.md`）

## 文档输出

```
docs/aidlc/construction/
├── plans/{unit-name}-code-generation-plan.md
├── audit-construction-{unit-name}.md
├── {unit-name}/{functional-design,nfr-requirements,nfr-design,infrastructure-design}/
└── build-and-test/
```

## 构建和测试（验证纪律）

按 `construction-build-and-test.md` 执行：后端构建（exit 0）、前端构建（exit 0）、全量单测（0 失败）、集成测试、前端 lint（0 错误）等。**每个"通过"声明必须附带实际命令输出作为证据**，禁止"应该通过"。

## 完成与移交

所有步骤完成后更新 `state.md` 标记 Construction 完成，记录到审计。然后：

> Construction 阶段完成。现在进入 Operations 阶段（CI/CD 配置生成、K8s 部署清单、部署文档，条件执行）。

**NEXT SKILL:** Use aidlc-operations

## 红旗信号

绝不：跳过审查 / 带未修复问题继续 / 规格合规未过就做质量审查 / 修复后不重新审查 / 接受"差不多合规" / 因"很简单"跳步 / 忽略 MCP Skill 加载 / 省略测试 / 不验证编译。

```
每个单元 = 设计 + TDD + 两阶段审查
审查未通过 = 任务未完成
没有捷径。
```
