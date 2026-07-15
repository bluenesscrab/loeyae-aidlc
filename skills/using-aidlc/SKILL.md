---
name: using-aidlc
description: "AI-DLC 工作流入口；用户明确提到 AI-DLC 或 aidlc 时必须激活。"
---

<SUBAGENT-STOP>
作为已派发的单元子 Agent 时，按调度指令执行，不重新进入入口路由。
</SUBAGENT-STOP>

# Using AI-DLC

本 Skill 只决定是否进入 AI-DLC。进入后必须先加载 `steering/core-workflow.md`，再执行工作区检测和复杂度评估；不得在本文件复制阶段细节。

## 路由

| 条件 | 行为 |
|------|------|
| 用户明确包含 AI-DLC/aidlc | 必须进入工作流，即使任务简单也由快速通道处理 |
| 未明确使用 AI-DLC，但任务涉及新功能、架构、高风险或多文件协作 | 建议进入工作流 |
| 未明确使用 AI-DLC 且为清晰低风险小改 | 可直接处理 |

进入工作流后的阶段 Skill：`aidlc-inception` → `aidlc-construction` → `aidlc-operations`（仅需部署准备时）。恢复、变更请求和新增功能由 `core-workflow.md` 的意图路由决定，不强制从 Inception 重新开始。

生成代码时，仅 Java + Loeyae Boot 项目按 `construction-loeyae-compliance.md` 调用 `loeyae-skills` MCP；优先 outline → section。UI Mock 设计风格仅在用户选择时调用 `awesome-design`。
