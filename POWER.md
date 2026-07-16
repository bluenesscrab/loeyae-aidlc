---
name: "loeyae-aidlc"
displayName: "Loeyae AI-DLC"
version: "1.20.0"
description: "基于 AI-DLC 方法论的完整开发流程闭环。当用户消息中出现 AI-DLC 或 aidlc 时必须激活。覆盖 Inception 规划、Construction 实现与验证，以及按条件执行的 Operations 部署准备；不覆盖部署后的生产运维。"
keywords: ["aidlc", "AI-DLC", "继续上次的工作", "认领单元", "团队协作模式", "loeyae", "功能设计", "用户故事", "架构设计", "单元生成", "代码审查", "逆向工程", "根因分析", "修改功能", "变更需求", "调整功能", "改动需求", "需求变更"]
author: "Loeyae Team"
---

# Loeyae AI-DLC（Kiro Power 入口）

**关键首步**：激活后必须先读取 `steering/core-workflow.md`，再执行其他操作。阶段路由、执行条件、审批级别和完成标准均以该文件为准，本入口不重复共享流程细节。

## Kiro 接入

1. 在 Kiro Powers 面板中通过本地目录或 Git 仓库添加本 Power。
2. Power 激活后，Kiro 按需读取共享的 `steering/`、`skills/`、`agents/` 和 `hooks/kiro/`。
3. 在聊天中输入 `使用 AI-DLC，展示欢迎消息` 验证接入。

本仓库同时支持 Claude Code 和 OpenCode；各平台入口与安装总览见 `README.md`。OpenCode 的真实入口是 `package.json` 及其 `main` 指向的 `.opencode/plugins/loeyae-aidlc.js`。

## Kiro 能力适配

- **工作流加载**：首先加载 `steering/core-workflow.md`，随后按其中路由按需读取规则，禁止预加载全部 steering。
- **会话延续**：工作流状态记录在业务项目的 `docs/aidlc/state.md`。
- **子 Agent**：读取 `agents/` 中的平台无关指令，通过 Kiro `invoke_sub_agent` 能力执行；不可用时按共享规则降级。
- **Hooks**：Kiro 模板位于 `hooks/kiro/`，复制与使用说明见 `hooks/README.md`。
- **MCP**：`mcp.json` 声明 `loeyae-skills` 和可选的 `awesome-design` 服务。

## MCP 使用边界

- `loeyae-skills`：仅在 Java + Loeyae Boot Framework 项目的 Construction 阶段按需加载框架编码规范；优先使用 outline 和 section 类工具。
- `awesome-design`：仅在 UI Mock 场景且用户选择设计风格时使用。
- MCP 不可用时，应明确告知用户，并仅依赖仓库中已存在的通用规则继续可执行部分。

## 三阶段术语

```text
Inception（规划） → Construction（实现与验证） → Operations（部署准备，条件）
```

Operations 只为已确认的目标环境生成交付配置和可执行部署说明，不覆盖部署后的生产运维。具体流程统一见 `steering/core-workflow.md`。

## 故障排除

- **Power 未激活**：确认 Power 安装目录完整，并重新在 Kiro Powers 面板加载。
- **MCP 连接失败**：检查 Kiro MCP 面板连接状态及远程服务网络可达性。
- **Steering 加载失败**：确认安装包包含 `steering/core-workflow.md`，必要时重新安装 Power。
- **会话恢复失败**：确认业务项目中的 `docs/aidlc/state.md` 存在且为最新状态。
