# Loeyae AI-DLC

基于 AI-DLC 方法论的团队开发工作流，覆盖需求分析、架构设计、代码生成、测试和 CI/CD 部署，集成 Loeyae Boot Framework 编码规范和 Vue 3 前端规范。

> **仓库整合通知**：本仓库现已统一三个工具入口（Kiro / Claude Code / OpenCode）。原 `loeyae-cc-aidlc`（Claude Code 版）和 `loeyae-oc-aidlc`（OpenCode 版）的内容已迁入本仓库，后续维护以本仓库为准。如你仍在使用旧仓库，请迁移到 `https://github.com/loeyae/loeyae-aidlc`。

## 单仓库三入口

本仓库是 **一个仓库、三个工具入口** 的统一源。三个入口共享同一份 `steering/`（流程规则的唯一事实标准）和 `skills/`（平台无关的薄入口），从根本上消除"改一处要同步三处"的维护负担。

```
loeyae-aidlc/
├── steering/                 # ★ 唯一事实标准：50+ 流程规则文件（三入口共享）
│   ├── core-workflow.md      #   主工作流定义（所有流程细节以此为准）
│   ├── core-workflow-slim.md #   精简版（OpenCode bootstrap 注入用）
│   ├── common-*.md           #   通用规范 + 团队编码规范
│   ├── inception-*.md        #   Inception 阶段
│   ├── product-*.md          #   产品级 Inception（多模块）
│   ├── construction-*.md     #   Construction 阶段
│   ├── operations-*.md       #   Operations 阶段
│   └── quality-gate-*.md     #   质量门禁
│
├── skills/                   # ★ 平台无关薄入口（OpenCode 原生 skill 发现 + Claude Code）
│   ├── using-aidlc/          #   入口：复杂度路由
│   ├── aidlc-workflow/       #   三阶段编排
│   ├── aidlc-inception/      #   Inception 步骤路由
│   ├── aidlc-construction/   #   Construction 步骤路由
│   └── aidlc-operations/     #   Operations 步骤路由
│
├── .opencode/                # ← OpenCode 插件入口
│   ├── plugins/
│   │   └── loeyae-aidlc.js  #   插件主文件（config hook + messages.transform）
│   └── INSTALL.md            #   OpenCode 安装说明
│
├── scripts/
│   └── setup.mjs            #   MCP 注册脚本（首次安装兜底方案）
│
├── POWER.md                  # ← Kiro 入口
├── CLAUDE.md                 # ← Claude Code 入口
├── .claude-plugin/           # ← Claude Code 清单（plugin.json + marketplace.json）
├── package.json              # ← OpenCode 包定义（main 指向 .opencode/plugins/loeyae-aidlc.js）
├── mcp.json                  #   loeyae-skills MCP 服务配置（Kiro 格式）
└── docs/                     #   设计与分析文档
```

### 各入口如何读取共享资源

| 工具 | 入口文件 | 读取 steering/skills 的方式 | 忽略的文件 |
|------|----------|---------------------------|-----------|
| **Kiro** | `POWER.md` + `mcp.json` | IDE 直接读 `steering/` 目录 | `.opencode/`、`.claude-plugin/` |
| **Claude Code** | `.claude-plugin/plugin.json` + `CLAUDE.md` | skill 指示 AI 读 `steering/xxx.md` | `.opencode/`、`POWER.md` |
| **OpenCode** | `.opencode/plugins/loeyae-aidlc.js` | config hook 注入 `skills.paths` + messages.transform 注入 bootstrap | `POWER.md`、`CLAUDE.md`、`.claude-plugin/` |

每个工具只读取自己的入口清单，忽略其余文件，三套入口无冲突并置。

### 事实标准（Source of Truth）

**所有流程规则只在 `steering/` 中维护，`steering/core-workflow.md` 是主入口。** `skills/` 是薄入口：只负责复杂度路由、阶段编排和平台适配，流程细节一律通过加载对应 steering 文件获得，不重复内容。

## 安装

### OpenCode

在 `opencode.json`（全局或项目级）的 `plugin` 数组中添加：

```json
{
  "plugin": ["loeyae-aidlc@git+https://github.com/loeyae/loeyae-aidlc.git"]
}
```

重启 OpenCode 即可。插件会自动：
- 注册 skills 目录（通过 `config` hook）
- 注入 AI-DLC 工作流 bootstrap（通过 `messages.transform` hook）
- 尝试注册 `loeyae-skills` MCP 服务器

**MCP 服务注册（如果自动注入不生效）：**

```bash
# 方式 1：运行 setup 脚本（推荐）
bunx loeyae-aidlc

# 方式 2：手动添加到全局配置
# ~/.config/opencode/opencode.json (Linux/macOS)
# %APPDATA%/opencode/opencode.json (Windows)
{
  "mcp": {
    "loeyae-skills": {
      "type": "remote",
      "url": "https://mcp-skills.dev.loeyae.com/sse"
    }
  }
}
```

固定版本：

```json
{
  "plugin": ["loeyae-aidlc@git+https://github.com/loeyae/loeyae-aidlc.git#v1.8.0"]
}
```

详细安装说明见 [.opencode/INSTALL.md](.opencode/INSTALL.md)。

### Kiro

在 Kiro Powers 面板中添加本 Power（通过本地目录或 Git 仓库）。安装后 `loeyae-skills` MCP 服务自动配置。

### Claude Code

通过 marketplace 或 plugin 仓库安装：

```json
{
  "plugins": {
    "repositories": ["https://github.com/loeyae/loeyae-aidlc.git"]
  }
}
```

MCP 服务通过命令添加：

```bash
claude mcp add --transport sse loeyae-skills https://mcp-skills.dev.loeyae.com/sse
```

> **MCP 服务统一**：三个入口连接的是同一个远程 MCP 服务 `https://mcp-skills.dev.loeyae.com/sse`，只是配置格式不同。

## 使用方式

三个工具激活方式一致：

```
使用 AI-DLC，[描述你的开发需求]
```

工作流将：
1. 评估复杂度（简单→快速通道；中等→精简流程；复杂→完整流程）
2. 执行 Inception 阶段（需求、设计、单元生成）
3. 执行 Construction 阶段（功能设计 → TDD → 两阶段审查 → 构建测试）
4. 执行 Operations 阶段（条件 — CI/CD 配置生成、K8s 部署清单、部署文档）

## 工作流概述

```
Inception（规划） → Construction（实现） → Operations（部署，条件）
```

- **Inception**：做什么、为什么做。接力模式（PM + 架构师按步骤接力）
- **Construction**：怎么做。认领模式（开发者自主认领单元）、强制 TDD、两阶段审查、系统化调试
- **Operations**（条件）：如何运行维护。根据项目类型生成 Dockerfile、Jenkinsfile、K8s 部署清单、部署文档

**架构模式**：单模块（小项目传统流程）/ 多模块（大项目先产品级规划，再按模块并行）

完整流程定义见 `steering/core-workflow.md`。

## Operations 阶段说明

在 Construction 的"构建和测试"通过后条件执行，生成完整 CI/CD 配置和部署文档。

| 文件 | 说明 |
|------|------|
| `Dockerfile` | 容器化配置（按项目类型自动选基础镜像） |
| `Jenkinsfile` | CI/CD Pipeline（参数化构建，build/deploy 双模式） |
| `deployment-test.yml` / `deployment-prod.yml` | K8s 双环境部署清单 |
| `.dockerignore` | Docker 构建排除 |
| `nginx.conf` | Nginx 配置（仅前端项目） |

支持的项目类型：Spring Boot、Node.js、Python、Vue 3 前端、Go。

## MCP 集成

使用 `loeyae-skills` MCP 服务获取 Loeyae Boot Framework 编码规范（渐进式披露 v2.0）：

- `get_skill_outline(name)` — 获取 Skill 的章节大纲（导航用，极低 token）
- `get_skill_section(name, section)` — 获取指定章节内容（**优先使用**，按需加载）
- `get_skill_summary(name)` — 获取规范摘要（大纲 + 核心章节预览）
- `get_skill_content(name)` — 获取规范完整内容（谨慎使用，可能消耗大量 token）
- `search_skill(query)` — 搜索规范（返回章节级定位）

**渐进式披露策略**：优先 `outline` → `section`，避免直接调用 `get_skill_content` 导致 token 浪费。

**仅当项目为 Java + Loeyae Boot Framework 时**在 Construction 阶段调用。后端框架专有规范统一通过 MCP 按需加载，不在 steering 中维护。

## 故障排除

### OpenCode 插件不生效

1. 确认 `opencode.json` 中 plugin 配置正确
2. 检查日志：`opencode run --print-logs "hello" 2>&1 | grep -i aidlc`
3. 使用 `skill` 工具列出已发现的 skills，确认 aidlc 系列存在

### MCP 工具不可用

1. 运行 `bunx loeyae-aidlc` 注册 MCP 服务器到全局配置
2. 确认网络可达：`https://mcp-skills.dev.loeyae.com/sse`
3. 重启 OpenCode

### Windows 安装问题

如果 OpenCode 无法从 git URL 安装，使用本地安装：

```bash
npm install loeyae-aidlc@git+https://github.com/loeyae/loeyae-aidlc.git --prefix "%USERPROFILE%\.config\opencode"
```

然后在 `opencode.json` 中使用：

```json
{
  "plugin": ["~/.config/opencode/node_modules/loeyae-aidlc"]
}
```

## 参考资源

- **方法论来源**: [AI-DLC (AWS)](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)
- **原始仓库**: [aidlc-workflows](https://github.com/awslabs/aidlc-workflows)
