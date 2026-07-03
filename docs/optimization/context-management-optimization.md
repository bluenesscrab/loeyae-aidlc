# AI-DLC 上下文管理优化方案

> 版本：2.0
> 日期：2026-07-03
> 状态：已实施

## 问题背景

在长任务执行过程中（如 Construction 阶段多单元连续开发），AI-DLC 会遇到上下文溢出问题：

| 问题 | 影响 | 触发场景 |
|------|------|----------|
| 上下文撑爆 | 会话中断，工作状态丢失 | 多单元连续执行、大量文件修改 |
| 手动清理无记录 | 无法恢复中断前的工作状态 | 用户主动清理上下文 |
| 长任务无法连续 | 需要频繁手动干预 | 跨多个 Construction 单元 |

## 解决方案架构

### 设计原则

采用与 AI-DLC 一致的「单仓库三入口」模式：

- **平台无关规则**：定义在 `steering/common-context-optimization.md`（三平台共享）
- **子 Agent 指令**：定义在 `agents/` 目录（平台无关的 Markdown 定义）
- **平台适配层**：各平台用自身机制实现（Workflow / Sub-Agent / steering 规则）

```
steering/common-context-optimization.md   ← 分段规则（三平台共享）
agents/
├── orchestrator.md                       ← 调度器子 Agent 指令
└── batch-executor.md                     ← 批次执行者子 Agent 指令

平台适配：
├── Claude Code: .claude/workflows/       ← Workflow 脚本调用 agents/
├── Kiro: Hook (PostTaskExec)             ← Sub-Agent 调用 agents/
└── OpenCode: steering 规则               ← 无自动化，AI 自律执行
```

### 平台能力矩阵

| 能力 | Claude Code | Kiro | OpenCode |
|------|-------------|------|----------|
| 子 Agent（独立上下文） | ✅ Task 工具 | ✅ invoke_sub_agent | ⚠️ 有限 |
| Hook 系统 | ✅ PostToolUse 等 | ✅ PostTaskExec 等 | ❌ 无 |
| Workflow/Spec 分段 | ✅ .claude/workflows/ | ✅ Spec 任务 | ❌ 无 |
| 自动 Context Compaction | ❌ | ✅ 内置 | ❌ |

### 适配策略

| 平台 | 实现方式 | 自动化程度 |
|------|----------|-----------|
| **Claude Code** | Workflow 调度器 → 批次 Workflow（独立上下文） | 全自动 |
| **Kiro** | Sub-Agent 批次执行 + Spec 任务天然分段 + Context Compaction | 半自动 |
| **OpenCode** | steering 规则指导 AI 主动分段 + state.md 手动恢复 | 手动 |

---

## 核心规则（三平台共享）

详见 `steering/common-context-optimization.md`。核心要点：

### 分段策略

| 条件 | 策略 | 批次大小 |
|------|------|----------|
| 单元数 ≥ 10 | 强制分段 | 2 单元/批次 |
| 单元数 5-9 | 强制分段 | 3 单元/批次 |
| 单元数 < 5 | 连续执行 | 全部 |
| 单文件数 > 15 | 拆分单元 | 分为 2 批次 |

### state.md 增强字段

```markdown
## 执行策略

| 字段 | 值 |
|------|-----|
| 执行模式 | segmented / continuous |
| 批次大小 | 3 |
| 总批次 | 3 |
| 当前批次 | 2 |

## 批次进度

| 批次 | 单元 | 状态 | 完成时间 |
|------|------|------|----------|
| 1 | U01-U03 | ✅ 完成 | 2026-07-03T10:30:00 |
| 2 | U04-U06 | 🔄 进行中 | - |
| 3 | U07-U08 | ⏳ 待执行 | - |
```

### 进度提示

| 进度 | 提示 |
|------|------|
| 批次完成 | `✅ 批次 X 完成 · 进度 XX% · 产出 X 文件` |
| 50% | `💡 进度过半` |
| 70% | `⚠️ 进度 70%，建议检查状态` |

---

## 子 Agent 指令

### agents/orchestrator.md

调度器子 Agent，负责：
1. 读取 state.md 确定待执行单元
2. 按分段规则确定批次
3. 调度批次执行者
4. 更新 state.md 进度

### agents/batch-executor.md

批次执行者子 Agent，负责：
1. 接收批次内的单元列表
2. 对每个单元执行 TDD 循环
3. 验证构建
4. 执行两阶段审查
5. 报告批次结果

---

## 平台适配详情

### Claude Code

通过 `.claude/workflows/` 实现：
- `aidlc-orchestrator.js` — 调度器，读取 `agents/orchestrator.md` 指令
- `construction-batch.js` — 批次执行者，读取 `agents/batch-executor.md` 指令

每个 Workflow 拥有独立上下文，主会话保持轻量。

### Kiro

利用 Kiro 原生能力：
- **Spec 任务**：天然分段，每个 task 独立执行
- **Sub-Agent**：通过 `invoke_sub_agent` 调用 `general-task-execution`，传入 `agents/batch-executor.md` 指令
- **Context Compaction**：Kiro 内置机制，自动压缩旧上下文
- **Hook**：PostTaskExec 自动更新 state.md 批次进度

### OpenCode

无自动化基础设施，通过 steering 规则实现：
- AI 读取 `common-context-optimization.md` 中的分段规则
- AI 主动在批次间输出进度提示
- AI 主动更新 state.md
- 用户可通过 `/clear` + state.md 恢复继续

---

## 验证目标

- [ ] 主会话不因长任务溢出
- [ ] 状态通过 state.md 正确传递
- [ ] 批次失败后可从断点继续
- [ ] 三平台行为一致（规则层面）

---

## 相关文件

| 文件 | 用途 |
|------|------|
| `steering/common-context-optimization.md` | 共享规则（事实标准） |
| `agents/orchestrator.md` | 调度器子 Agent 指令 |
| `agents/batch-executor.md` | 批次执行者子 Agent 指令 |
| `steering/common-token-management.md` | Token 加载策略（互补） |
| `steering/common-session-continuity.md` | 会话恢复（互补） |
