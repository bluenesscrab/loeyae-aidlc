# Loeyae AI-DLC

基于 AI-DLC 方法论的团队开发工作流，覆盖需求分析、架构设计、代码生成、测试和 CI/CD 部署，集成 Loeyae Boot Framework 编码规范和 Vue 3 前端规范。

> **仓库整合通知**：本仓库现已统一三个工具入口（Kiro / Claude Code / OpenCode）。原 `loeyae-cc-aidlc`（Claude Code 版）和 `loeyae-oc-aidlc`（OpenCode 版）的内容已迁入本仓库，后续维护以本仓库为准。如你仍在使用旧仓库，请迁移到 `https://github.com/loeyae/loeyae-aidlc`。

## 单仓库三入口

本仓库是 **一个仓库、三个工具入口** 的统一源。三个入口共享同一份 `steering/`（流程规则的唯一事实标准）和 `skills/`（平台无关的薄入口），从根本上消除"改一处要同步三处"的维护负担。

```
loeyae-aidlc/
├── steering/                 # ★ 唯一事实标准：50 个流程规则文件（三入口共享）
│   ├── core-workflow.md      #   主工作流定义（所有流程细节以此为准）
│   ├── core-workflow-slim.md #   精简版（仅 OpenCode 入口注入用）
│   ├── common-*.md           #   通用规范 + 团队编码规范
│   ├── inception-*.md        #   Inception 阶段
│   ├── product-*.md          #   产品级 Inception（多模块）
│   ├── construction-*.md     #   Construction 阶段
│   ├── operations-*.md       #   Operations 阶段
│   └── quality-gate-*.md     #   质量门禁
│
├── skills/                   # ★ 平台无关薄入口（Claude Code + OpenCode 共享）
│   ├── using-aidlc/          #   入口：复杂度路由
│   ├── aidlc-workflow/       #   三阶段编排
│   ├── aidlc-inception/      #   Inception 步骤路由
│   ├── aidlc-construction/   #   Construction 步骤路由
│   └── aidlc-operations/     #   Operations 步骤路由
│
├── POWER.md                  # ← Kiro 入口
├── CLAUDE.md                 # ← Claude Code 入口
├── .claude-plugin/           # ← Claude Code 清单（plugin.json + marketplace.json）
├── plugin.json               # ← OpenCode 清单
├── package.json              # ← OpenCode 包定义（含 build 脚本）
├── src/index.ts              # ← OpenCode 运行时（注入 slim 工作流 + 提供加载工具）
├── tsconfig.json             # ← OpenCode 构建配置
├── mcp.json                  #   loeyae-skills MCP 服务配置（Kiro 格式）
└── docs/                     #   设计与分析文档
```

### 各入口如何读取共享资源

| 工具 | 入口文件 | 读取 steering/skills 的方式 | 忽略的文件 |
|------|----------|---------------------------|-----------|
| **Kiro** | `POWER.md` + `mcp.json` | IDE 直接读 `steering/` 目录 | `.claude-plugin/`、`plugin.json`、`src/`、`package.json` |
| **Claude Code** | `.claude-plugin/plugin.json` + `CLAUDE.md` | skill 指示 AI 读 `steering/xxx.md` | `POWER.md`、`plugin.json`、`src/` |
| **OpenCode** | `plugin.json` + `package.json` + `src/index.ts` | TS 运行时 `readFileSync` 读 `steering/` + `skills/` | `POWER.md`、`CLAUDE.md`、`.claude-plugin/` |

每个工具只读取自己的入口清单，忽略其余文件，因此三套入口可以无冲突地并置在同一仓库根目录。

### 事实标准（Source of Truth）

**所有流程规则只在 `steering/` 中维护，`steering/core-workflow.md` 是主入口。** `skills/` 是薄入口：只负责复杂度路由、阶段编排和平台适配，流程细节一律通过加载对应 steering 文件获得，不重复内容。这保证 skill 永远不会与 steering 脱节。

## 安装

### Kiro

在 Kiro Powers 面板中添加本 Power（通过本地目录或 Git 仓库 `https://github.com/loeyae/loeyae-aidlc.git`）。安装后 `loeyae-skills` MCP 服务自动配置。

### Claude Code

通过 marketplace 或 plugin 仓库安装：

```json
{
  "plugins": {
    "repositories": ["https://github.com/loeyae/loeyae-aidlc.git"]
  }
}
```

Claude Code 读取根目录 `.claude-plugin/plugin.json` 和 `skills/`。

### OpenCode

项目级：在 `.opencode/` 配置中引用本插件；或全局安装到 `~/.opencode/plugins/`。OpenCode 运行时需要编译产物 `dist/index.js`，**`dist/` 不提交到仓库**，安装时自动构建：

```bash
npm install   # 会自动触发 prepare 脚本执行 tsc 构建（生成 dist/）
# 如需手动重建：
npm run build
```

> 从 Git 仓库作为依赖安装时，npm 会自动安装 devDependencies 并运行 `prepare` 脚本完成构建，无需额外操作。

> **MCP 配置差异**：根 `mcp.json` 采用 Kiro 格式。OpenCode 按其自身约定配置 `loeyae-skills` MCP 服务（`type: "sse"` + `url`），Claude Code 通过 `claude mcp add --transport sse loeyae-skills https://mcp-skills.dev.loeyae.com/sse` 添加。三者连接的是同一个远程 MCP 服务。

## 使用方式

三个工具激活方式一致：

```
使用 AI-DLC，[描述你的开发需求]
```

工作流将：
1. 评估复杂度（简单→快速通道；中等→精简流程；复杂→完整流程）
2. 执行 Inception 阶段（需求、设计、单元生成）
3. 执行 Construction 阶段（规划 → TDD → 两阶段审查 → 最终全局审查 → 构建测试）
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

使用 `loeyae-skills` MCP 服务获取 Loeyae Boot Framework 编码规范（`get_skill_summary` / `get_skill_content` / `search_skill`）。**仅当项目为 Java + Loeyae Boot Framework 时**在 Construction 阶段调用。后端框架专有规范统一通过 MCP 按需加载，不在 steering 中维护。

## 参考资源

- **方法论来源**: [AI-DLC (AWS)](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)
- **原始仓库**: [aidlc-workflows](https://github.com/awslabs/aidlc-workflows)
