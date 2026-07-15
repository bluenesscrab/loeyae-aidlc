# Loeyae AI-DLC

基于 AI-DLC 方法论的完整开发流程闭环，覆盖 Inception（规划）、Construction（实现与验证）和按条件执行的 Operations（部署准备），集成 Loeyae Boot Framework 编码规范和 Vue 3 前端规范。

> **仓库整合通知**：本仓库统一维护 Kiro、Claude Code 和 OpenCode 三个平台入口。原 `loeyae-cc-aidlc` 与 `loeyae-oc-aidlc` 已并入本仓库，后续以 `https://github.com/loeyae/loeyae-aidlc` 为准。

## 单仓库三入口

`steering/` 是共享流程规则的唯一事实来源，主入口为 `steering/core-workflow.md`；`skills/` 仅提供平台无关的薄入口。平台入口只负责加载、路由和能力适配。

```text
loeyae-aidlc/
├── steering/                         # 共享流程规则
│   ├── core-workflow.md              # 主工作流路由与事实入口
│   ├── core-workflow-slim.md         # OpenCode bootstrap 使用的精简入口
│   ├── common-quality-gates.md       # 质量门禁
│   ├── common-*.md
│   ├── inception-*.md
│   ├── construction-*.md
│   └── operations-*.md
├── skills/                           # 平台无关薄入口
├── agents/                           # 平台无关子 Agent 指令
│   ├── orchestrator.md
│   └── batch-executor.md
├── hooks/                            # 各平台 Hook 模板与说明
│   ├── kiro/
│   ├── claude-code/
│   └── README.md
├── .opencode/
│   ├── plugins/
│   │   └── loeyae-aidlc.js           # OpenCode 真实插件入口
│   └── INSTALL.md
├── .claude-plugin/                   # Claude Code 插件清单
├── POWER.md                          # Kiro Power 入口
├── CLAUDE.md                         # Claude Code 入口
├── package.json                      # OpenCode 包与发布清单
├── mcp.json                          # Kiro MCP 配置
└── scripts/setup.mjs                 # OpenCode MCP 注册脚本
```

| 平台 | 入口 | 共享资源加载方式 |
|------|------|------------------|
| Kiro | `POWER.md` + `mcp.json` | Power 按需读取 `steering/`、`skills/`、`agents/` 和 `hooks/kiro/` |
| Claude Code | `CLAUDE.md` + `.claude-plugin/` | 插件入口按需读取共享资源，并适配 Claude Workflow/Hook |
| OpenCode | `package.json` + `.opencode/plugins/loeyae-aidlc.js` | `main` 加载插件；插件注册 skills 并注入 bootstrap |

OpenCode 不使用根目录 `plugin.json`；`package.json` 及其 `main` 指向的 `.opencode/plugins/loeyae-aidlc.js` 是真实入口。

## 安装

### OpenCode

在全局或项目级 `opencode.json` 的 `plugin` 数组中添加：

```json
{
  "plugin": ["loeyae-aidlc@git+https://github.com/loeyae/loeyae-aidlc.git"]
}
```

固定到当前版本：

```json
{
  "plugin": ["loeyae-aidlc@git+https://github.com/loeyae/loeyae-aidlc.git#v1.19.0"]
}
```

重启 OpenCode 后，插件会注册 skills、注入 AI-DLC bootstrap，并尝试注册 `loeyae-skills` MCP 服务。详细说明见 [.opencode/INSTALL.md](.opencode/INSTALL.md)。

MCP 自动注册未生效时，可运行：

```bash
bunx loeyae-aidlc
```

### Kiro

在 Kiro Powers 面板中通过本地目录或 Git 仓库添加本 Power。平台接入与 MCP 能力见 [POWER.md](POWER.md)。

### Claude Code

通过 marketplace 或插件仓库安装：

```json
{
  "plugins": {
    "repositories": ["https://github.com/loeyae/loeyae-aidlc.git"]
  }
}
```

平台接入、Hook 和 MCP 配置见 [CLAUDE.md](CLAUDE.md)。

## 使用方式

三个平台均可使用：

```text
使用 AI-DLC，[描述你的开发需求]
```

工作流按复杂度自适应执行：

```text
Inception（规划） → Construction（实现与验证） → Operations（部署准备，条件）
```

- **Inception**：确认开发什么、为什么开发以及如何验收。
- **Construction**：按单元完成设计、TDD 实现、审查和可复现验证。
- **Operations**：为已确认的目标环境生成交付配置和可执行部署说明；不覆盖部署后的生产运维。

阶段路由、执行条件、审批级别和完成标准统一以 [`steering/core-workflow.md`](steering/core-workflow.md) 为准。

## 平台能力

- **MCP 编码规范**：Java + Loeyae Boot Framework 项目可通过 `loeyae-skills` 按需加载框架规范。
- **UI 设计风格**：UI Mock 场景可选用 `awesome-design`。
- **子 Agent**：共享指令位于 `agents/`，各平台按自身能力适配执行。
- **Hooks**：模板位于 `hooks/`，安装方式见 [hooks/README.md](hooks/README.md)。

三个入口连接相同的远程 MCP 服务；具体注册格式由各平台入口文档定义。

## OpenCode 故障排除

### 插件未加载

1. 确认 `opencode.json` 中的插件配置正确。
2. 检查日志：`opencode run --print-logs "hello" 2>&1 | grep -i aidlc`。
3. 使用 `skill` 工具确认 aidlc 系列 skills 已发现。

### MCP 工具不可用

1. 运行 `bunx loeyae-aidlc` 注册 MCP 服务。
2. 确认 `https://mcp-skills.allbelieves.com/sse` 网络可达。
3. 重启 OpenCode。

### Windows 本地安装

```bash
npm install loeyae-aidlc@git+https://github.com/loeyae/loeyae-aidlc.git --prefix "%USERPROFILE%\.config\opencode"
```

然后在 `opencode.json` 中使用本地包路径。

## 参考资源

- [AI-DLC 方法论](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)
- [原始 aidlc-workflows 仓库](https://github.com/awslabs/aidlc-workflows)
