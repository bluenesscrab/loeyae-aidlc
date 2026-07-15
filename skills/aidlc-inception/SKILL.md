---
name: aidlc-inception
description: "AI-DLC Inception 阶段路由：工作区、需求、故事、设计、测试用例和工作单元规划。"
---

# Inception 阶段

开始时宣布：“使用 aidlc-inception 执行 Inception 阶段”。

本 Skill 仅负责路由。执行条件、审批和顺序以 `steering/core-workflow.md` 的 Inception 路由为准，步骤详情按需加载对应 steering；不得在本文件另行定义流程规则。

## 路由映射

| 路由 | 加载文件 |
|------|----------|
| I1 工作区检测 | `inception-workspace-detection.md` + `common-complexity-assessment.md` |
| I2-I3 产品级/模块 | `product-inception.md` + `product-module-division.md` + `product-contracts.md` |
| I4 逆向工程 | `inception-reverse-engineering.md` |
| I5-I6 需求与审查 | `inception-requirements-analysis.md` + `inception-cross-validation.md` |
| I7-I8 用户故事与审查 | `inception-user-stories.md` + `inception-cross-validation.md` |
| I9-I10 UI Mock 与审查 | `inception-ui-mock.md` + `inception-cross-validation.md` |
| I11 工作流规划 | `inception-workflow-planning.md` |
| I12 应用设计 | `inception-application-design.md` |
| I13 测试用例派生 | `test-case-derivation.md` |
| I14 单元生成 | `inception-units-generation.md` |

全面深度需求分析所需方法、排序、验证和数据模型文件，由 `inception-requirements-analysis.md` 决定并按需加载。

## 平台适配

- 每步完成执行 `common-step-completion-protocol.md`，只以 `docs/aidlc/state.md` 记录恢复状态。
- 产物路径按 `common-directory-structure.md`，单模块与多模块不得混用。
- 创建文件前加载 `common-content-validation.md`。
- Inception 完成后按 core 的 Construction 入场门禁判断，不自行跳过 I12 或 I14。

**NEXT SKILL:** `aidlc-construction`
