# AI-DLC 上下文优化实施指南

> 快速参考：实施步骤和文件清单
> 详细方案：参见 [auto-context-management.md](./auto-context-management.md)

## 实施文件清单

| # | 文件 | 用途 | 状态 |
|---|------|------|------|
| 1 | `steering/common-context-optimization.md` | 分段规则（三平台共享） | ✅ 已创建 |
| 2 | `agents/orchestrator.md` | 调度器子 Agent 指令 | ✅ 已创建 |
| 3 | `agents/batch-executor.md` | 批次执行者子 Agent 指令 | ✅ 已创建 |
| 4 | Kiro Hook 配置 | PostTaskExec 自动更新进度 | ✅ 已创建 |
| 5 | POWER.md / CLAUDE.md 引用 | 入口文件更新 | ✅ 已更新 |

## 各平台实施步骤

### Claude Code

1. 在使用 AI-DLC 的项目中创建 `.claude/workflows/aidlc-orchestrator.js`
2. 在使用 AI-DLC 的项目中创建 `.claude/workflows/construction-batch.js`
3. Workflow 脚本读取 `agents/orchestrator.md` 和 `agents/batch-executor.md` 作为指令

**注意**：Workflow 脚本属于项目工作区，不在 AI-DLC 仓库中维护。AI-DLC 仅提供 agents 指令定义。

### Kiro

1. Spec 模式下无需额外配置 — task 列表天然分段
2. Vibe 模式下：AI 读取 `common-context-optimization.md` 后自动使用 Sub-Agent
3. Hook 已配置：PostTaskExec 自动更新 state.md

### OpenCode

无需额外文件。AI 通过 steering 规则自律执行分段策略。

## 验证方法

### 小任务测试（< 5 单元）

预期行为：连续执行，不分段。

### 中任务测试（5-9 单元）

预期行为：
- 自动分为 3 单元/批次
- 每批次完成后更新 state.md
- 输出进度提示

### 大任务测试（≥ 10 单元）

预期行为：
- 自动分为 2 单元/批次
- Claude Code/Kiro：子 Agent 独立上下文执行
- OpenCode：AI 主动建议 /clear 时机
- 主会话不溢出

### 断点恢复测试

模拟批次 2 执行到一半中断，验证：
- state.md 记录了正确的批次进度
- 恢复后从中断点继续
- 不重复执行已完成的批次
