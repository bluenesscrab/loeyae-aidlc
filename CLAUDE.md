# Loeyae AI-DLC（Claude Code 入口）

本文件只定义 Claude Code 的接入与能力适配。共享流程规则的唯一事实来源是 `steering/`，主入口为 `steering/core-workflow.md`；阶段路由、执行条件、审批级别和完成标准不在此重复。

## Claude Code 接入

Claude Code 通过 `.claude-plugin/plugin.json` 和 `.claude-plugin/marketplace.json` 发现插件，并按需读取共享的 `skills/`、`steering/` 与 `agents/`。平台安装总览见 `README.md`。

激活示例：

```text
使用 AI-DLC 开发用户认证模块
```

激活后必须先读取 `steering/core-workflow.md`，再按其中路由加载所需文件。

## Claude Code 能力适配

- **Skills**：`skills/` 仅作为平台无关薄入口，负责加载与路由，不复制共享流程规则。
- **子 Agent**：共享指令位于 `agents/`；Construction 分段执行可由 `.claude/workflows/aidlc-construction-batch.js` 适配 Claude Code。
- **Hooks**：Claude Code Hook 模板位于 `hooks/claude-code/`，用于 UI Mock 质量保障。
- **会话延续**：工作流状态记录在业务项目的 `docs/aidlc/state.md`。

## Hook 安装

```bash
# macOS / Linux
mkdir -p .claude/hooks
cp <aidlc-repo>/hooks/claude-code/*.sh .claude/hooks/
chmod +x .claude/hooks/*.sh
# 将 hooks/claude-code/settings-hooks.jsonc 内容合并到 .claude/settings.local.json
```

Windows 可将相同 `.sh` 文件复制到 `.claude\hooks\`，并合并 `settings-hooks.jsonc`。模板详情见 `hooks/README.md`。

## MCP 集成

插件清单声明以下远程服务：

- `loeyae-skills`：仅在 Java + Loeyae Boot Framework 项目的 Construction 阶段按需加载框架编码规范。
- `awesome-design`：仅在 UI Mock 场景且用户选择设计风格时使用。

自动注册失败时可手动执行：

```bash
claude mcp add --transport sse loeyae-skills https://mcp-skills.allbelieves.com/sse
claude mcp add --transport sse awesome-design https://mcp-design.allbelieves.com/sse
```

使用 `/mcp` 查看服务状态。MCP 不可用时，应明确告知用户，并仅依赖仓库内已有通用规则继续可执行部分。

## 三阶段术语

```text
Inception（规划） → Construction（实现与验证） → Operations（部署准备，条件）
```

Operations 为已确认的目标环境生成交付配置和可执行部署说明，不覆盖部署后的生产运维。完整流程统一见 `steering/core-workflow.md`。

## 故障排除

- **插件未发现**：检查 `.claude-plugin/` 清单及插件仓库配置。
- **MCP 连接失败**：运行 `/mcp`，检查远程服务网络可达性，必要时使用上述命令手动注册。
- **共享规则加载失败**：确认插件包包含 `steering/core-workflow.md`。
- **会话恢复失败**：确认业务项目中的 `docs/aidlc/state.md` 存在且为最新状态。
