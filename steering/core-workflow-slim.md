<!-- 本文件是 OpenCode 入口的精简路由指令。完整规则定义在 core-workflow.md 中，本文件不复制规则内容。Kiro 与 Claude Code 入口不使用本文件。-->

# AI-DLC 路由指令（OpenCode 入口）

## 加载策略

**启动时**：本文件自动注入。进入工作流后，通过 `aidlc_load_steering("core-workflow.md")` 加载完整规则。

**核心原则**：只加载当前任务需要的最小上下文，其余按需获取。

## 意图识别

收到用户消息后，判断意图：
- 包含"AI-DLC"/"aidlc" → 进入 aidlc-inception 工作流
- 复杂/新功能/架构变更 → 进入 aidlc-inception 工作流
- 简单 bug 修复/配置变更/单文件小改 → 直接编码

## 进入工作流后

1. 加载 `core-workflow.md`（完整规则定义：团队规则、审批模式、三阶段路由表、复杂度评估、核心原则）
2. 执行工作区检测（`inception-workspace-detection.md`）
3. 按 `core-workflow.md` 的复杂度评估决定执行路径
4. 按路由表进入对应阶段

## 快速参考（非权威，以 core-workflow.md 为准）

- **三阶段**：INCEPTION（做什么）→ CONSTRUCTION（怎么做）→ OPERATIONS（如何运行）
- **复杂度**：简单→快速通道 / 中等→精简流程 / 复杂→完整流程
- **审批**：🔴 强制必等 / 🟡 按模式 / 🟢 不等待
- **语言**：使用简体中文交互
