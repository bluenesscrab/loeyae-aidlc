# Loeyae AI-DLC（Claude Code 入口）

基于 AI-DLC 方法论的开发工作流插件，完整闭环执行。本文件是 Claude Code 平台的入口，与 Kiro Power（`POWER.md`）、OpenCode 插件（`plugin.json` + `src/`）共享同一份 `steering/` 和 `skills/`。

## 概述

三阶段自适应开发工作流，支持团队协作和多模块并行开发：

- **产品级 Inception（多模块模式）** — 模块划分、接口契约（产品边界）
- **Inception** — 需求分析、架构设计（做什么、为什么做）
  - 支持**接力模式**：PM 和架构师按步骤接力完成
  - **专业方法论**：利益相关者分析、用户画像、旅程图、竞品分析（全面深度）
  - **优先级排序**：MoSCoW + RICE 模型
  - **5 维度验证**：真实性、完整性、一致性、可行性、可验证性 + 迭代回退
- **Construction** — 功能设计、TDD 代码生成、两阶段审查、构建测试（怎么做）
  - 支持**认领模式**：开发者自主认领单元，独立开发
  - **强制 TDD**：RED-GREEN-REFACTOR 循环，没有失败测试就没有生产代码
  - **平台自适应子 Agent**：Claude Code 支持子 Agent，派发独立实现者 + 独立审查者
  - **两阶段代码审查**：规格合规审查 → 代码质量审查
  - **系统化调试**：四阶段根因分析，3+ 次修复失败则质疑架构
  - **说服式防护**：通过内化原因阻止跳步，替代硬规则
- **Operations（条件）** — CI/CD 配置文件生成、K8s 部署清单、部署文档（如何运行和维护）

**架构模式**：
- **单模块模式**：小项目，传统流程
- **多模块模式**：大项目，先产品级规划，再按模块并行开发

## 完整闭环

Claude Code 入口完整执行所有阶段，不依赖外部 skill：

```
aidlc-inception → aidlc-construction → aidlc-operations（条件）
```

## Skills（薄入口）

`skills/` 是平台无关的薄入口：仅负责复杂度路由、阶段编排和平台适配，所有流程细节通过加载 `steering/` 对应文件获得。三平台共享同一份 skills。

| Skill | 说明 |
|-------|------|
| `using-aidlc` | 入口 - 复杂度评估和工作流选择 |
| `aidlc-workflow` | 核心工作流编排（指向 `steering/core-workflow.md`） |
| `aidlc-inception` | Inception 阶段路由 |
| `aidlc-construction` | Construction 阶段路由 - 设计 → TDD → 审查 → 构建 |
| `aidlc-operations` | Operations 阶段路由 - CI/CD 配置、K8s 部署清单、部署文档 |

## 事实标准（Source of Truth）

**所有流程规则的唯一事实标准是 `steering/` 目录**，尤其是 `steering/core-workflow.md`。skill 不重复流程细节，只在需要时加载对应 steering 文件：

- 完整工作流、审批模式、复杂度分级/快速通道、手术式变更、目录结构 → `steering/core-workflow.md`
- TDD 规则 → `steering/construction-tdd.md`
- 两阶段审查 → `steering/construction-code-review.md`
- 子 Agent 执行 → `steering/construction-subagent-execution.md`
- 质量门禁 → `steering/common-quality-gates.md`
- 说服式防护 → `steering/common-persuasion-defense.md`
- 其余规则见 `steering/` 下对应文件

## 文档路径

统一路径（与 Kiro 入口、OpenCode 入口共享），详见 `steering/core-workflow.md` 的"目录结构"章节。核心约定：

- AIDLC 过程文档：`docs/aidlc/`
- 工作流状态：`docs/aidlc/state.md`
- 审计：`docs/aidlc/audit-summary.md`（极简时间线）+ 各阶段分段审计文件
- 应用代码：工作区根目录（绝不放在 `docs/` 中）

## MCP 集成

### loeyae-skills（编码规范）

使用 `loeyae-skills` MCP 服务获取编码规范：

- `mcp__loeyae-skills__get_skill_summary(name)` — 获取指定编码规范摘要（快速预览）
- `mcp__loeyae-skills__get_skill_content(name)` — 获取指定编码规范完整内容（编码时使用）
- `mcp__loeyae-skills__search_skill(query)` — 搜索规范

**适用条件**：仅当项目为 Java 且引用了 Loeyae Boot Framework 时，才在 Construction 阶段调用 MCP Skill。工作区检测阶段会自动识别框架并记录到 state.md。

**自动注册**：安装插件后，`loeyae-skills` 和 `awesome-design` MCP 服务器会通过 `plugin.json` 中的 `mcpServers` 字段自动注册，无需手动配置。

**手动配置**（仅在自动注册失败时）：

```bash
claude mcp add --transport sse loeyae-skills https://mcp-skills.dev.loeyae.com/sse
claude mcp add --transport sse awesome-design https://mcp-design.dev.loeyae.com/sse
```

或在项目根目录创建 `.mcp.json`：

```json
{
  "mcpServers": {
    "loeyae-skills": {
      "type": "sse",
      "url": "https://mcp-skills.dev.loeyae.com/sse"
    },
    "awesome-design": {
      "type": "sse",
      "url": "https://mcp-design.dev.loeyae.com/sse"
    }
  }
}
```

**可用 Skill 分类**：
- 核心业务：`loeyae-crud`、`loeyae-auth`、`loeyae-validation`、`loeyae-error-handling`、`loeyae-data-access`、`loeyae-web-infra`、`loeyae-data-security`、`loeyae-dict`
- 基础设施：`loeyae-cache`、`loeyae-message`、`loeyae-message-audit`、`loeyae-job`、`loeyae-mail`、`loeyae-feign`、`loeyae-license`、`loeyae-cms`、`loeyae-mybatis-audit`
- 工具与模式：`loeyae-utils`、`loeyae-decide`、`loeyae-optional-util`、`loeyae-test`、`loeyae-test-base`、`loeyae-test-utils`、`loeyae-framework-modules`、`loeyae-database-design`
- 低代码：`loeyae-lowcode-getting-started`、`loeyae-lowcode-crud-template`、`loeyae-lowcode-flow`、`loeyae-lowcode-groovy`、`loeyae-lowcode-amis`、`loeyae-lowcode-component-dev`、`loeyae-lowcode-api-integration`、`loeyae-lowcode-best-practices`
- 工作流：`loeyae-flowable`、`loeyae-flowable-integration`、`loeyae-flowable-approval`、`loeyae-flowable-deploy`、`loeyae-flowable-instance`、`loeyae-flowable-editor`

### awesome-design（UI 设计风格）

使用 `awesome-design` MCP 服务获取品牌设计风格，用于 UI Mock 阶段：

- `mcp__awesome-design__list_design_styles(category?)` — 列出可用设计风格（支持按分类筛选）
- `mcp__awesome-design__get_design_style(name)` — 获取指定风格的完整 DESIGN.md
- `mcp__awesome-design__get_design_tokens(name)` — 获取精简设计 tokens（配色、字体、间距、圆角）

**适用条件**：Inception 阶段的 UI Mock 步骤中，当用户选择使用设计风格时调用。

**自动注册**：与 `loeyae-skills` 一起通过插件自动注册。

**手动验证**：在 Claude Code 中运行 `/mcp` 查看服务器状态。

**可用风格分类**：productivity（后台工具）、consumer（消费者端）、fintech（金融）、developer（开发者工具）、ai（AI 平台）、design（设计工具）、automotive（汽车）、media（媒体/消费电子）

## 快速开始

```
用户: 使用 AI-DLC 开发用户认证模块
```

插件将依次评估复杂度 → 执行 Inception → Construction（规划 → TDD → 两阶段审查 → 构建测试）→ Operations（条件）。

## Steering 文件清单

完整规范见 `steering/` 目录。关键文件：

| File | Purpose |
|------|---------|
| `core-workflow.md` | 主工作流定义（事实标准） |
| `common-tech-frontend-pc.md` | 前端编码规范（Vue 3 / Element Plus - PC） |
| `common-tech-frontend-uniapp.md` | 前端编码规范（Vue 3 / UniApp） |
| `common-tech-security.md` | 安全编码规范 |
| `common-database-design.md` | 数据库设计规范（通用部分；框架专有部分见 MCP Skill） |
| `common-tech-testing.md` | 测试规范（通用部分；框架专有部分见 MCP Skill） |
| `operations-operations.md` | Operations 阶段执行 |

> 注：后端框架专有规范（Loeyae Boot 的注解、CRUD 模板、模块索引等）不在 steering 中维护，统一通过 `loeyae-skills` MCP 服务按需加载。

## Troubleshooting

### MCP 服务连接失败

**症状**：调用 `get_skill_content` 或 `search_skill` 时报错或超时

**解决方案**：
1. 运行 `/mcp` 查看服务器状态
2. 确认网络可达：`https://mcp-skills.dev.loeyae.com/sse` 和 `https://mcp-design.dev.loeyae.com/sse`
3. 如果插件自动注册失败，手动添加：
   ```bash
   claude mcp add --transport sse loeyae-skills https://mcp-skills.dev.loeyae.com/sse
   claude mcp add --transport sse awesome-design https://mcp-design.dev.loeyae.com/sse
   ```
4. 如果持续失败，可跳过 Skill 调用继续开发（退回 steering 文件中的通用规范）

### 工作区检测未识别技术栈

**症状**：`state.md` 中技术栈信息为空

**解决方案**：
1. 确认项目根目录包含标识文件（`pom.xml`、`package.json` 等）
2. 手动告知：`技术栈是 Spring Boot + Loeyae Boot Framework`

### 会话恢复时上下文丢失

**症状**：使用"继续上次的工作"后 AI 不知道当前进度

**解决方案**：
1. 确认 `docs/aidlc/state.md` 存在且内容最新
2. 手动提供上下文：`当前在 Construction 阶段，正在开发 [unit-name] 单元`
