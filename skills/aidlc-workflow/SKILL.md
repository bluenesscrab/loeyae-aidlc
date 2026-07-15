---
name: aidlc-workflow
description: "AI-DLC 核心编排薄入口，协调 Inception、Construction 与条件执行的部署准备。"
---

# AI-DLC 工作流编排

开始时宣布：“使用 aidlc-workflow 协调开发工作流”。

唯一流程事实来源是 `steering/core-workflow.md`。本 Skill 只指定加载顺序，不复制步骤、条件、审批、目录或完成规则。

## 启动顺序

1. 加载 `steering/core-workflow.md`。
2. 执行工作区检测并创建或恢复 `docs/aidlc/state.md`。
3. 按 `common-complexity-assessment.md` 选择快速、精简或完整路径。
4. 根据 core 的意图和阶段路由加载当前步骤文件。

## 阶段路由

| 阶段 | Skill | 边界 |
|------|-------|------|
| Inception | `aidlc-inception` | 需求、验收、设计和工作拆分 |
| Construction | `aidlc-construction` | TDD 实现、审查、实际构建测试 |
| Operations（条件） | `aidlc-operations` | 部署配置与部署说明准备，不含部署后生产运维 |

状态、审计、质量门禁、恢复和交接分别加载 `common-step-completion-protocol.md`、`common-audit-logging.md`、`common-quality-gates.md`、`common-session-continuity.md`、`common-session-handoff.md`。
