# Compact 后自动恢复

## 概述

当 AI Agent 上下文被 compact（压缩/截断）后，需要自动恢复到正确的执行位置，避免重复执行已完成的工作或遗漏未完成的工作。

**与其他 steering 的关系**：
- `common-context-optimization.md` — 定义 progress.md 格式和恢复优先级
- `common-session-continuity.md` — 定义 state.md 恢复流程
- **本文件** — 定义各平台的 compact 检测和恢复触发机制

---

## 恢复流程（通用）

### 检测点

在以下时机检测是否需要恢复：

1. **Session 开始时** — 检查是否有未完成的 Construction 任务
2. **Compact 后** — 检查 progress.md 确定恢复点
3. **用户请求恢复时** — 明确的"继续"/"恢复"指令

### 恢复步骤

```
1. 读取 docs/aidlc/construction/progress.md
2. 找到第一个状态 ≠ complete 的单元
3. 读取 docs/aidlc/state.md 确认当前阶段
4. 如果阶段 = Construction：
   a. 跳过所有 progress.md 中已 complete 的单元
   b. 从未完成单元继续执行
5. 如果阶段 ≠ Construction：
   a. 按 common-session-continuity.md 恢复
```

### 恢复信任链

```
progress.md（单元级真实记录）
    ↓ 优先
state.md（阶段级状态）
    ↓ 优先
Agent 记忆（可能因 compact 丢失）
```

---

## 平台适配

### Claude Code

在项目的 `CLAUDE.md` 中添加以下规则（compact 后会自动重读 CLAUDE.md）：

```markdown
## Construction 恢复规则

当你被要求继续 Construction 任务，或检测到上下文可能被压缩时：

1. **先读 progress.md**
   - 路径：`docs/aidlc/construction/progress.md`
   - 找到第一个状态不是 `complete` 的单元

2. **不要重复执行**
   - 所有标记 `complete` 的单元已经完成
   - 产出文件已存在，不需要重新生成

3. **从断点继续**
   - 从第一个未完成单元开始
   - 每个单元完成后更新 progress.md

4. **如果 progress.md 不存在**
   - 读取 state.md 确认是否在 Construction 阶段
   - 如果是，创建 progress.md 并从第一个单元开始
```

### OpenCode

在项目的 `AGENTS.md` 中添加以下规则：

```markdown
## Construction 恢复规则

检测到上下文压缩或收到"继续"指令时：

1. 读取 `docs/aidlc/construction/progress.md`
2. 信任 progress.md 中的完成状态
3. 跳过已完成单元，从未完成单元继续
4. 每个单元完成后立即更新 progress.md

### 恢复优先级

1. progress.md 单元状态（最高）
2. state.md 批次进度
3. 自身记忆（最低，可能不准确）
```

### Kiro

通过 SessionStart hook 注入恢复指令。

**Hook 配置**（`.kiro/hooks/construction-recovery.json`）：

```json
{
  "version": "v1",
  "hooks": [{
    "name": "Construction Recovery Check",
    "trigger": "SessionStart",
    "action": {
      "type": "agent",
      "prompt": "如果存在 docs/aidlc/construction/progress.md，先读取它确定 Construction 进度。所有标记 complete 的单元不需要重新执行。从第一个未完成单元继续。"
    }
  }]
}
```

**创建方式**：

```javascript
// 使用 createHook 工具创建
createHook({
  id: "construction-recovery",
  name: "Construction Recovery Check",
  trigger: "SessionStart",
  actionType: "agent",
  prompt: "如果存在 docs/aidlc/construction/progress.md，先读取它确定 Construction 进度。所有标记 complete 的单元不需要重新执行。从第一个未完成单元继续。"
})
```

---

## 恢复输出

恢复成功后输出：

```
🔄 检测到未完成的 Construction 任务
📊 进度：X/Y 单元已完成
⏭️ 从单元 [unit-id] 继续
```

恢复失败时输出：

```
⚠️ 无法确定恢复点
📁 progress.md：[存在/不存在]
📁 state.md：[存在/不存在]
❓ 请确认：从头开始 / 指定恢复点？
```

---

## 边界情况

### progress.md 不存在但 state.md 显示在 Construction

1. 读取 state.md 中的单元列表
2. 检查每个单元的产出目录是否存在代码文件
3. 根据文件存在情况推断进度
4. 创建 progress.md 记录推断结果
5. 向用户确认推断是否正确

### progress.md 与实际文件不一致

1. progress.md 标记 complete 但文件不存在 → 询问用户
2. progress.md 标记 pending 但文件存在 → 更新 progress.md 为 complete

### 跨模块任务

1. 每个模块有独立的 progress.md 节（用 `## module-name` 分隔）
2. 恢复时只恢复当前模块的进度
3. 模块间不共享恢复状态

---

## 与 state.md 的关系

| 维度 | state.md | progress.md |
|------|----------|-------------|
| 粒度 | 阶段/批次 | 单元 |
| 更新频率 | 阶段切换/批次完成 | 每个单元完成 |
| 恢复用途 | 确定当前阶段 | 确定单元级进度 |
| compact 敏感 | 中（批次级） | 低（单元级精确） |

**恢复时两者配合**：
1. state.md 确认当前在 Construction 阶段
2. progress.md 确定具体从哪个单元继续
