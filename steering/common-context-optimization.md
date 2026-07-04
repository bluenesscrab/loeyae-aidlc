# 长任务自动分段执行

## 概述

当 Construction 阶段包含多个单元时，自动将执行过程分段为独立批次，避免上下文溢出。

**与其他 steering 的关系**：
- `common-token-management.md` — 管**加载**（恢复时加载什么）
- `common-session-continuity.md` — 管**恢复**（中断后如何继续）
- **本文件** — 管**执行**（执行期间如何分段）

---

## 分段策略（强制规则）

### 分段触发条件

在 Construction 阶段开始时，根据待执行单元数量**自动**确定执行模式：

| 条件 | 执行模式 | 批次大小 |
|------|----------|----------|
| 单元数 < 5 | continuous（连续） | 全部 |
| 单元数 5-9 | segmented（分段） | 3 单元/批次 |
| 单元数 ≥ 10 | segmented（分段） | 2 单元/批次 |

### 超大单元检测

单个单元预计产出文件 > 15 个时，将该单元拆为 2 个子批次：
- 子批次 1：Entity / Mapper / Service（基础层）
- 子批次 2：Controller / DTO / 测试（接口层）

### 跨模块任务

多模块模式下，每个模块的单元作为独立批次组，不跨模块混合。

---

## state.md 执行策略字段

进入分段模式时，在 state.md 中增加以下字段：

```markdown
## 执行策略

| 字段 | 值 |
|------|-----|
| 执行模式 | segmented |
| 批次大小 | 3 |
| 总批次 | 3 |
| 当前批次 | 1 |

## 批次进度

| 批次 | 单元 | 状态 | 完成时间 | 产出文件数 |
|------|------|------|----------|-----------|
| 1 | U01-U03 | 🔄 进行中 | - | - |
| 2 | U04-U06 | ⏳ 待执行 | - | - |
| 3 | U07-U08 | ⏳ 待执行 | - | - |
```

**更新时机**：每个批次完成后立即更新 state.md。

---

## 进度提示

### 批次完成提示

每个批次完成后输出：

```
✅ 批次 X/N 完成
📊 进度：XX%（Y/Z 单元）
📁 产出：X 个文件
```

### 进度阈值提示

| 进度 | 提示内容 |
|------|----------|
| 50% | `💡 进度过半` |
| 70% | `⚠️ 进度 70%，如响应变慢可检查 state.md` |
| 100% | `🎉 任务完成！` |

### 启动提示

分段模式启动时输出：

```
🚀 启动任务：[task-name]
📋 策略：分段模式
   - 单元数量：X
   - 批次大小：Y 单元/批次
   - 总批次：Z
```

---

## 执行流程

### 连续模式（< 5 单元）

正常执行，每个单元派发独立 subagent。按 `agents/batch-executor.md` 的流程执行。

### 分段模式（≥ 5 单元）

```
1. 确定分段策略，更新 state.md 执行策略字段
2. 输出启动提示
3. 对每个单元：
   a. 派发独立 subagent 执行（平台适配，见上方）
   b. subagent 完成后更新 progress.md
   c. 主 agent 输出单行状态（如"U03 完成，继续 U04"）
   d. 如果单元失败，决定重试/跳过/停止
4. 按批次边界检查进度（用于提示）
5. 所有单元完成后，输出最终完成提示
```

**注意**：分段模式下，"批次"仅用于进度提示和状态记录，实际执行粒度是**每单元一个 subagent**。

---

## 平台适配

### 支持独立上下文的平台

| 平台 | 机制 | 用法 |
|------|------|------|
| Claude Code | Task 工具 / Workflow | **每个单元**派发为独立 Task，传入 `agents/batch-executor.md` 指令 |
| Kiro | invoke_sub_agent | **每个单元**委托给 `general-task-execution` sub-agent |

**每单元 subagent 的优势**：
- 单个 subagent 上下文小，不会爆
- 主 Agent 负载轻，只做调度 + 写 progress.md
- 即使主 Agent compact，progress.md 已持久化
- 单元失败不污染主 Agent 上下文

### 不支持独立上下文的平台

| 平台 | 降级策略 |
|------|----------|
| OpenCode | AI 在当前上下文中连续执行，但严格遵守**每单元**状态更新。在 70% 进度时主动建议用户 `/clear` + progress.md 恢复。 |

---

## 文件传递规则（防上下文膨胀）

### 强制规则

| 规则 | 说明 |
|------|------|
| ❌ 禁止 paste 内容 | 禁止将需求/设计/代码内容直接 paste 到 subagent dispatch prompt |
| ✅ 路径传递 | 所有 artifact 通过文件路径传递，subagent 自行读取 |
| ❌ 禁止累积摘要 | 禁止在主 agent 中累积前序批次/单元的执行摘要 |
| ✅ 最小状态 | 主 agent 只保持：state.md 路径 + progress.md 路径 + 当前单元编号 + todo list |

### Narration 限制

- 主 agent 在工具调用之间**最多输出一行**状态说明
- ❌ 禁止在 session 中输出完整的"已完成工作回顾"
- ❌ 禁止在调度下一单元前总结上一单元的详细执行过程

### 正确示例

```
# 正确：dispatch 时只传路径
invoke_sub_agent(
  prompt="执行单元 U03，读取 docs/aidlc/inception/requirements/unit-order-requirements.md"
)

# 正确：单行状态
"U03 完成，继续 U04"
```

### 错误示例

```
# 错误：paste 内容
invoke_sub_agent(
  prompt="执行以下需求：1. 用户可以下单 2. 订单包含商品列表..."  # ❌ 内容 paste
)

# 错误：长篇回顾
"U03 已完成！我们实现了以下功能：订单创建、订单查询、订单取消，
共生成 8 个文件，测试覆盖率 85%，审查通过..."  # ❌ 累积摘要
```

---

## 批次间上下文传递

批次/单元执行者**只接收**以下上下文：

| 内容 | 来源 |
|------|------|
| 单元的需求切片路径 | `docs/aidlc/inception/requirements/unit-{name}-requirements.md` |
| 单元的故事切片路径 | `docs/aidlc/inception/user-stories/unit-{name}-stories.md` |
| 单元的设计切片路径 | `docs/aidlc/inception/application-design/unit-{name}-design.md` |
| 共享接口路径 | `shared-interfaces.md` |
| 编码规范引用 | MCP Skill 名称或 steering 文件名 |

**禁止传递**：
- 其他批次/单元的执行历史
- 完整的 Inception 产出物内容
- 主 Agent 的会话历史
- 任何文件的完整内容（只传路径）

---

## 实时进度账本（Progress Ledger）

### 位置

`docs/aidlc/construction/progress.md`

### 格式

```markdown
# Construction 进度账本

| 单元 | 状态 | 完成时间 | 文件数 | 执行者 |
|------|------|----------|--------|--------|
| U01 | ✅ complete | 2024-01-15T10:30:00 | 6 | subagent |
| U02 | ✅ complete | 2024-01-15T10:45:00 | 8 | subagent |
| U03 | 🔄 in_progress | - | - | subagent |
| U04 | ⏳ pending | - | - | - |
```

### 更新规则

1. **更新时机**：每个单元代码生成 + 审查通过后，**立即**追加/更新一行
2. **更新责任**：
   - 子 Agent 模式：子 Agent 完成单元后更新
   - 单 Agent 模式：主 Agent 在单元完成后更新
3. **格式约束**：`Unit-{id}: complete ({ISO8601 timestamp}, files: {count})`
4. **原子性**：每次只更新一行，不重写整个文件

### 恢复规则（优先级从高到低）

```
1. 信任 progress.md      ← 最高优先级（持久化的真实执行记录）
2. 信任 state.md 批次进度 ← 次优先级（可能略滞后）
3. 信任自身记忆          ← 最低优先级（compact 后丢失）
```

### Compact/恢复后行为

1. 先读 `progress.md`
2. 找到第一个状态不是 `complete` 的单元
3. 从该单元继续执行
4. **不要**重新执行已标记 `complete` 的单元

---

## 失败处理

### 批次执行失败

1. 在 state.md 中标记批次状态为 `❌ 失败`
2. 记录失败原因和失败单元
3. 停止后续批次执行
4. 输出失败信息，等待用户决定

### 恢复执行

从失败点恢复时：
1. 读取 state.md 批次进度
2. 跳过已完成的批次
3. 从失败批次的失败单元重新开始

---

## 与单元执行者的关系

本文件定义**整体分段策略**和**上下文优化规则**。具体单元执行按 `agents/batch-executor.md` 的规则：

- 每个单元一个独立 subagent
- subagent 自行读取文件（主 agent 只传路径）
- subagent 完成后更新 progress.md
- 主 agent 保持轻量，只做调度

两者是不同层级的上下文管理：
- **本文件**：宏观策略（分段、进度、恢复）
- **batch-executor.md**：单元执行细节（TDD、审查、验证）
