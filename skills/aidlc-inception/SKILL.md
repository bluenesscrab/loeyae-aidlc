---
name: aidlc-inception
description: "AI-DLC Inception 阶段 - 工作区检测、逆向工程、需求分析、用户故事、UI Mock、工作流规划、应用设计、单元生成。用于需要完整规划的复杂任务。"
---

# Inception 阶段

**开始时宣布：** "使用 aidlc-inception 执行 Inception 阶段"

**目的**：规划、需求收集、架构决策 — 确定做什么（WHAT）和为什么做（WHY）

> **薄入口说明**：本 skill 是步骤路由。每个步骤的执行细节以对应 `steering/inception-*.md` 为准，整体流程、条件判断、审批分级以 `steering/core-workflow.md` 的 INCEPTION 章节为准。本 skill 不复制这些细节。

## 核心规则

1. 使用简体中文交互
2. 按需加载 steering 文件 — 每个步骤开始时加载对应文件
3. 禁止在代码中留下 TODO/FIXME
4. 每个步骤完成后更新 `docs/aidlc/state.md` 和对应分段审计文件
5. 审批分级与完成消息按 `core-workflow.md` 执行（不再硬编码"等待批准"）

## 步骤路由

按下表顺序执行；条件步骤的执行/跳过判断见对应 steering 与 `core-workflow.md`。多模块模式下，Inception 步骤在模块级执行。

| # | 步骤 | 必需 | 加载文件 | 产出路径 |
|---|------|------|----------|----------|
| 1 | 工作区检测 | 始终 | `inception-workspace-detection.md` | `docs/aidlc/state.md` |
| 1.5 | 产品级 Inception | 条件（多模块） | `product-inception.md` + `product-module-division.md` + `product-contracts.md` | `docs/aidlc/product/` |
| 1.6 | 模块选择 | 条件（多模块） | （core-workflow 模块菜单） | 更新 state.md 活跃模块 |
| 2 | 逆向工程 | 条件（存量项目） | `inception-reverse-engineering.md` | `inception/reverse-engineering/` |
| 3 | 需求分析 | 始终（自适应深度） | `inception-requirements-analysis.md` + `common-depth-levels.md` | `inception/requirements/` |
| 4 | 用户故事 | 条件 | `inception-user-stories.md` | `inception/user-stories/` |
| 4.5 | UI Mock | 条件（有前端页面） | `inception-ui-mock.md` | `inception/ui-mock/` |
| 5 | 工作流规划 | 始终 | `inception-workflow-planning.md` + `common-content-validation.md` | `inception/plans/` |
| 6 | 应用设计 | 条件 | `inception-application-design.md` | `inception/application-design/` |
| 6.5 | 测试用例派生 | 条件（步骤 6 已执行） | `test-case-derivation.md` | `inception/application-design/test-cases/` |
| 7 | 单元生成 | 条件 | `inception-units-generation.md` | `inception/application-design/unit-of-work*.md` |

**全面深度需求分析**额外加载：`inception-requirements-methods.md`（专业方法论）、`inception-requirements-prioritization.md`（MoSCoW + RICE）、`inception-requirements-validation.md`（5 维度验证）、`inception-requirements-data-model.md`（数据建模）。

## 文档结构

拆分模式，完整定义见 `core-workflow.md` 的"目录结构"章节。单模块用 `docs/aidlc/inception/`，多模块用 `docs/aidlc/modules/{module-name}/inception/`。

## 完成与移交

所有 Inception 步骤完成后：
1. 更新 `docs/aidlc/state.md` — 标记 Inception 完成，更新"下一步交接"字段
2. 在分段审计文件记录完成
3. 提交文档到 git（如适用）

> Inception 阶段完成。设计文档为拆分模式，分布在 `docs/aidlc/inception/`（或模块级目录）。现在进入 Construction 阶段。

**NEXT SKILL:** Use aidlc-construction
