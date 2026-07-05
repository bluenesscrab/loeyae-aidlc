---
name: using-aidlc
description: "AI-DLC 工作流入口 - 当用户消息中出现 AI-DLC 或 aidlc 时必须激活，无论任务复杂度如何。禁止跳过，禁止直接编码。"
---

<SUBAGENT-STOP>
如果你是作为子代理执行特定任务，请跳过此 skill。
</SUBAGENT-STOP>

# Using AIDLC

> **薄入口说明**：本 skill 只负责"是否进入工作流"和"路由到哪个阶段"。所有流程细节的唯一事实标准是 `steering/core-workflow.md`。进入工作流后，按需加载对应 steering 文件，不在 skill 中重复流程规则。

## 指令优先级

AIDLC skills 覆盖默认行为，但 **用户指令始终优先**：

1. **用户明确指令**（CLAUDE.md / 直接请求）— 最高优先级
2. **AIDLC skills** — 覆盖默认行为
3. **默认系统提示** — 最低优先级

## 规则

**在响应或操作之前调用相关 skills。** 即使只有 1% 的可能性，也应该检查。

**强制规则**：当用户消息以"使用 AI-DLC"开头或包含"AI-DLC"/"aidlc"时，**必须进入 aidlc-inception 工作流**，禁止走简单任务路径。用户选择使用 AI-DLC 是有意为之。

## 工作流选择

```
用户请求
  → 包含"AI-DLC"/"aidlc"？
    是 → 进入 aidlc-inception（跳过复杂度预判，复杂度评估在工作区检测后由 core-workflow 执行）
    否 → 评估复杂度
      → 复杂/新功能/架构变更/多文件？
        是 → aidlc-inception → aidlc-construction → aidlc-operations（条件）
        否 → 直接编码（简单 bug 修复、配置变更、单文件小改）
```

**关键**：一旦进入工作流，**复杂度的细分（简单/中等/复杂）和快速通道判断由 `steering/core-workflow.md` 在工作区检测后统一执行**。本 skill 不重复该判断逻辑——即使是简单任务，用户明确要求 AI-DLC 时也要进入工作流，由 core-workflow 的"快速通道"高效处理，而非跳过工作流直接编码（直接编码会丢失强制的 MCP Skill 加载和 TDD 纪律）。

## 三阶段路由

| 阶段 | Skill | 加载的事实标准 |
|------|-------|---------------|
| Inception（做什么/为什么） | `aidlc-inception` | `steering/core-workflow.md` 的 INCEPTION 章节 + 各步骤 steering |
| Construction（怎么做） | `aidlc-construction` | `steering/core-workflow.md` 的 CONSTRUCTION 章节 + TDD/审查 steering |
| Operations（如何运行维护） | `aidlc-operations` | `steering/operations-operations.md` |

各阶段的步骤清单、条件判断、审批分级见对应 skill 与 `steering/core-workflow.md`，此处不重复。

## 文档路径

统一路径，完整定义见 `steering/core-workflow.md` 的"目录结构"章节。核心约定：

| 文档 | 路径 |
|------|------|
| Inception 产物 | `docs/aidlc/inception/` |
| Construction 设计产物 | `docs/aidlc/construction/{unit-name}/` |
| Operations 产物 | `docs/aidlc/operations/` |
| 工作流状态 | `docs/aidlc/state.md` |
| 审计摘要（必加载） | `docs/aidlc/audit-summary.md` |

## MCP Skill 集成

生成代码时，仅当项目为 Loeyae Boot 时调用 `loeyae-skills` MCP 服务获取编码规范。MCP Skill 服务采用**渐进式披露**策略：

1. `get_skill_outline(name)` — 查看规范章节结构（导航用，极低 token）
2. `get_skill_section(name, section)` — 按需加载指定章节（**优先使用**，低-中 token）
3. `get_skill_summary(name)` — 获取大纲 + 前 3 个章节摘要（快速预览）
4. `get_skill_content(name)` — 获取完整规范（谨慎使用，高 token）
5. `search_skill(query)` — 搜索关键词，返回章节级定位

详见 `steering/construction-code-generation.md` 的 MCP Skill 加载策略。

## 警示信号

这些想法意味着停止：

| 想法 | 现实 |
|------|------|
| "用户说了 AI-DLC 但任务很简单，不需要走工作流" | 用户明确选择 AI-DLC 是有意为之。进入工作流，由快速通道高效处理。 |
| "这太简单了，直接编码" | 简单任务由 core-workflow 的快速通道处理，仍保留 MCP Skill 加载和 TDD。 |
| "我记得工作流" | 工作流会演进。读取 `steering/core-workflow.md`。 |
| "跳过 Construction 设计" | 没有功能设计的代码缺少业务规则细节。 |
| "跳过代码审查" | 审查未通过 = 任务未完成。 |
| "会话恢复了，我直接继续编码" | 先执行恢复检查点：读 state.md → 激活 skill → 宣布状态。见 `common-session-continuity.md`。 |
| "会话摘要已告诉我任务了" | 会话摘要不含 AI-DLC 流程状态。以 state.md 为唯一事实来源。 |

## 团队规则

1. **使用简体中文交互**
2. **代码中不留 TODO/FIXME** — 所有功能必须完整实现
3. **按需加载文档** — 避免不必要的 token 消耗
4. **如果无法实现，说明原因并提出替代方案**

## 激活

开始时宣布：

- 复杂任务 / 明确要求 AI-DLC："使用 aidlc-inception 执行完整的 Inception 阶段"
- 简单任务（未要求 AI-DLC）：直接编码
