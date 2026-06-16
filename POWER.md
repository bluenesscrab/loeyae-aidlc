---
name: "loeyae-aidlc"
displayName: "Loeyae AI-DLC"
version: "1.10.3"
description: "基于 AI-DLC 方法论的团队开发工作流。当用户消息中出现 AI-DLC 或 aidlc 时必须激活，无论任务复杂度如何。覆盖需求分析、架构设计、代码生成和测试，集成 Loeyae Boot Framework 编码规范和 Vue 3 前端规范。"
keywords: ["aidlc", "AI-DLC", "继续上次的工作", "认领单元", "团队协作模式", "loeyae", "功能设计", "用户故事", "架构设计", "单元生成", "代码审查", "逆向工程", "根因分析", "修改功能", "变更需求", "调整功能", "改动需求", "需求变更"]
author: "Loeyae Team"
---

# Loeyae AI-DLC

**关键首步**：必须先读取并加载 `steering/core-workflow.md`，然后再执行任何其他操作。这是不可协商的。在加载此文件之前，不要回复用户，不要启动任何工作流。

Loeyae AI-DLC 是基于 AI-DLC 方法论定制的团队开发工作流，自适应地调整工作流程以匹配项目需求，同时集成团队编码规范。

> **单仓库三入口**：本仓库同时是 Kiro Power、Claude Code 插件、OpenCode 插件的统一源。三个入口共享同一份 `steering/`（流程规则事实标准）和 `skills/`（平台无关薄入口）。Kiro 入口为本 `POWER.md`，Claude Code 入口为 `CLAUDE.md` + `.claude-plugin/`，OpenCode 入口为 `plugin.json` + `src/`。详见 `README.md`。

## 概述

两阶段自适应开发工作流，支持团队协作和多模块并行开发：

- **产品级 Inception（多模块模式）** — 模块划分、接口契约（产品边界）
- **Inception（规划阶段）** — 需求分析、用户故事、架构设计（做什么、为什么做）
  - 支持**接力模式**：PM 和架构师按步骤接力完成
- **Construction（实现阶段）** — 功能设计、TDD 代码生成、两阶段审查、构建测试（怎么做）
  - 支持**认领模式**：开发者自主认领单元，独立开发
  - **强制 TDD**：RED-GREEN-REFACTOR 循环，没有失败测试就没有生产代码
  - **平台自适应子 Agent**：支持子 Agent 的平台派发独立实现者，不支持则单 Agent 两阶段自审
  - **两阶段代码审查**：规格合规审查 → 代码质量审查
  - **系统化调试**：四阶段根因分析，3+ 次修复失败则质疑架构
  - **说服式防护**：通过内化原因阻止跳步，替代硬规则
- **Operations（运维阶段，条件）** — CI/CD 配置文件生成、K8s 部署清单、部署文档（如何运行和维护）
  - 根据项目类型自动选择模板（Spring Boot / Node.js / Python / Vue 3）
  - 生成完整 Jenkins Pipeline（build → push → deploy 自动触发链）
  - 生成 Kubernetes 部署清单（test/prod 双环境）

**架构模式**：
- **单模块模式**：小项目，传统流程
- **多模块模式**：大项目，先产品级规划，再按模块并行开发

## Onboarding

### 前置条件

- **Kiro IDE** 已安装并正常运行
- **MCP 服务可用**：`loeyae-skills` MCP 服务（`https://mcp-skills.allbelieves.com/sse`）需要网络可达；`awesome-design` MCP 服务（`https://mcp-design.allbelieves.com/sse`）可选（UI Mock 设计风格选择时使用）
- **项目类型**：适用于任何软件开发项目；如果是 Java + Loeyae Boot Framework 项目，将自动启用编码规范集成

### 安装

1. 在 Kiro Powers 面板中添加本 Power（通过本地目录或 Git 仓库）
2. 安装后 `loeyae-skills` 和 `awesome-design` MCP 服务会自动配置
3. 验证：在聊天中输入 `使用 AI-DLC，展示欢迎消息` 确认 Power 正常激活

### 基本配置

无需额外配置。Power 激活后会自动检测工作区环境（技术栈、框架版本、项目结构），并将检测结果记录到 `docs/aidlc/state.md`。

## 激活方式

用户以以下方式开始请求时激活：
```
使用 AI-DLC，[描述你的开发需求]
```

## MCP 工具

### loeyae-skills（编码规范）

本 Power 集成了 `loeyae-skills` MCP 服务，提供 Loeyae Boot Framework 编码规范（渐进式披露 v2.0）：

- `get_skill_outline(name)` — 获取 Skill 的章节大纲（导航用，极低 token）
- `get_skill_section(name, section)` — 获取指定章节内容（**优先使用**，按需加载，避免 token 浪费）
- `get_skill_summary(name)` — 获取摘要信息（大纲 + 核心章节预览）
- `get_skill_content(name)` — 获取完整内容（谨慎使用，可能消耗大量 token）
- `search_skill(query)` — 按关键词搜索相关规范（返回章节级定位）

**渐进式披露策略**：优先 `outline` → `section`，避免直接调用 `get_skill_content` 导致 token 浪费。

**适用条件**：仅当项目为 Java 且引用了 Loeyae Boot Framework 时，才在 Construction 阶段调用 MCP Skill。工作区检测阶段会自动识别框架并记录到 state.md。

**可用 Skill 分类**：
- 核心业务：`loeyae-crud`、`loeyae-auth`、`loeyae-validation`、`loeyae-error-handling`、`loeyae-data-access`、`loeyae-web-infra`、`loeyae-data-security`、`loeyae-dict`
- 基础设施：`loeyae-cache`、`loeyae-message`、`loeyae-message-audit`、`loeyae-job`、`loeyae-mail`、`loeyae-feign`、`loeyae-license`、`loeyae-cms`、`loeyae-mybatis-audit`
- 工具与模式：`loeyae-utils`、`loeyae-decide`、`loeyae-optional-util`、`loeyae-test`、`loeyae-test-base`、`loeyae-test-utils`、`loeyae-framework-modules`、`loeyae-database-design`、`loeyae-database-naming`、`loeyae-project-structure`
- 低代码：`loeyae-lowcode-getting-started`、`loeyae-lowcode-crud-template`、`loeyae-lowcode-flow`、`loeyae-lowcode-groovy`、`loeyae-lowcode-amis`、`loeyae-lowcode-component-dev`、`loeyae-lowcode-api-integration`、`loeyae-lowcode-best-practices`
- 工作流：`loeyae-flowable`、`loeyae-flowable-integration`、`loeyae-flowable-approval`、`loeyae-flowable-deploy`、`loeyae-flowable-instance`、`loeyae-flowable-editor`

### awesome-design（UI 设计风格）

集成 `awesome-design` MCP 服务，提供品牌设计风格查询，用于 UI Mock 阶段：

- `list_design_styles(category?)` — 列出可用设计风格（支持按分类筛选：productivity、consumer、fintech、developer、ai、design、automotive、media）
- `get_design_style(name)` — 获取指定风格的完整 DESIGN.md 内容
- `get_design_tokens(name)` — 获取精简设计 tokens（配色、字体、间距、圆角、关键组件）

**适用条件**：Inception 阶段 UI Mock 步骤中，当用户选择使用设计风格时调用。存量项目沿用现有框架风格，不调用此服务。

## Steering 文件

所有 steering 文件位于 `steering/` 目录：

### 核心工作流
- `core-workflow.md` — 主工作流定义（必须首先加载）
- `core-workflow-slim.md` — 精简版工作流（仅 OpenCode 入口每次对话注入使用；Kiro 不使用）

### 通用规范（common-*）
- `common-process-overview.md` — 流程概览
- `common-welcome-message.md` — 欢迎消息
- `common-question-format-guide.md` — 问题格式指南
- `common-content-validation.md` — 内容验证规则
- `common-quality-gates.md` — 质量门禁规则（检查清单）
- `common-complexity-assessment.md` — 复杂度评估与快速通道（分级 + 阈值）
- `common-step-completion-protocol.md` — 步骤完成强制协议（state.md 更新 + 微型摘要 + 审计）
- `common-audit-logging.md` — 审计日志规范（分段化 + 格式 + 工具使用）
- `common-directory-structure.md` — 目录结构规范（单模块 + 多模块）
- `common-persuasion-defense.md` — 说服式防护与验证纪律（替代硬规则的执行方式）
- `common-systematic-debugging.md` — 系统化调试（四阶段根因分析流程）
- `common-session-continuity.md` — 会话连续性
- `common-session-handoff.md` — Session 交接提示词（写入 state.md + 完成消息内置选项）
- `common-team-collaboration.md` — 团队协作模型（接力模式 + 认领模式）
- `common-token-management.md` — Token 管理策略（分层摘要 + 审计分段 + 按需加载 + 文档切片）
- `common-terminology.md` — 术语表
- `common-depth-levels.md` — 自适应深度说明
- `common-error-handling.md` — 错误处理
- `common-overconfidence-prevention.md` — 过度自信防范
- `common-workflow-changes.md` — 工作流变更管理（变更入口 + 影响评估 + 8 种变更类型处理）
- `common-ascii-diagram-standards.md` — ASCII 图标准

### 团队编码规范（common-*）
- `common-tech-frontend-pc.md` — 前端编码规范（PC端 / Vue 3 / Element Plus）
- `common-tech-frontend-uniapp.md` — 前端编码规范（微信小程序&APP / UniApp）
- `common-tech-security.md` — 安全编码规范
- `common-tech-testing.md` — 测试规范
- `common-database-design.md` — 数据库设计规范
- `common-figma-design-standards.md` — Figma 设计稿还原规范

### Inception 阶段
- `inception-workspace-detection.md` — 工作区检测
- `inception-reverse-engineering.md` — 逆向工程
- `inception-requirements-analysis.md` — 需求分析主流程（按需加载子文件）
  - `inception-requirements-methods.md` — 专业方法论（仅全面深度加载）
  - `inception-requirements-prioritization.md` — 优先级排序（标准+全面深度加载）
  - `inception-requirements-validation.md` — 5维度验证+迭代回退（标准+全面深度加载）
  - `inception-requirements-data-model.md` — 数据建模（仅全面深度加载）
- `inception-user-stories.md` — 用户故事
- `inception-ui-mock.md` — UI Mock（HTML 页面原型制作）
- `inception-workflow-planning.md` — 工作流规划
- `inception-application-design.md` — 应用设计
- `inception-units-generation.md` — 单元生成

### 产品级 Inception（多模块模式）
- `product-inception.md` — 产品级 Inception 步骤定义
- `product-module-division.md` — 模块划分规则和问题模板
- `product-contracts.md` — 模块间接口契约规范

### Construction 阶段
- `construction-tdd.md` — 测试驱动开发（强制 TDD 规范）
- `construction-subagent-execution.md` — 平台自适应子 Agent 执行
- `construction-code-review.md` — 两阶段代码审查（规格合规 → 代码质量）
- `construction-functional-design.md` — 功能设计
- `construction-nfr-requirements.md` — NFR 需求
- `construction-nfr-design.md` — NFR 设计
- `construction-infrastructure-design.md` — 基础设施设计
- `construction-code-generation.md` — 代码生成（流程编排）
- `construction-loeyae-compliance.md` — Loeyae Boot 编码规范加载与合规验证（MCP Skill 表 + 逐项对照）
- `construction-build-and-test.md` — 构建和测试
- `construction-implementation-report.md` — 实施与验收报告（单元级微型摘要 + 阶段级完整报告）

### Operations 阶段
- `operations-operations.md` — CI/CD 配置生成与部署文档（流程编排）
- `operations-templates.md` — 配置模板（Dockerfile + Jenkinsfile + K8s + Nginx，按需加载）

### Change Request（变更请求）
- `change-request-process.md` — 变更请求详细流程（CR1-CR5 步骤定义、模板、执行规则）

### 质量门禁
- `quality-gate-implementation.md` — 质量门禁实现细则（各阶段检查项的具体执行标准）

## 参考资源

- **方法论来源**: [AI-DLC (AWS)](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)
- **原始仓库**: [aidlc-workflows](https://github.com/awslabs/aidlc-workflows)

## Troubleshooting

### MCP 服务连接失败

**症状**：调用 MCP Skill 工具时报错 "Connection refused" 或超时

**解决方案**：
1. 确认网络可达：检查是否能访问 `https://mcp-skills.allbelieves.com/sse`
2. 检查 Kiro MCP 面板中 `loeyae-skills` 服务状态是否为 "Connected"
3. 如果显示断开，点击重新连接或重启 Kiro
4. 如果持续失败，MCP 服务可能暂时不可用，可以跳过 Skill 调用继续开发（编码规范将依赖 steering 文件中的通用规范）

### Steering 文件加载失败

**症状**：AI 提示无法读取某个 steering 文件

**解决方案**：
1. 确认 Power 安装路径正确且文件完整
2. 检查 `steering/` 目录下是否存在对应文件
3. 尝试重新安装 Power（移除后重新添加）

### 工作区检测未识别技术栈

**症状**：`state.md` 中技术栈信息为空或不正确

**解决方案**：
1. 确认项目根目录包含标识文件（如 `pom.xml`、`package.json`、`build.gradle`）
2. 手动告知 AI 技术栈信息：`技术栈是 Spring Boot + Loeyae Boot Framework`
3. AI 会更新 `state.md` 中的技术栈记录

### 会话恢复时上下文丢失

**症状**：使用"继续上次的工作"后 AI 不知道当前进度

**解决方案**：
1. 确认 `docs/aidlc/state.md` 文件存在且内容是最新的
2. 如果 state.md 丢失，检查 Git 历史恢复
3. 手动提供上下文：`当前在 Construction 阶段，正在开发 [unit-name] 单元，已完成功能设计`

### 多模块模式下模块间接口不一致

**症状**：开发时发现实际接口与 `contracts.md` 定义不匹配

**解决方案**：
1. 以 `contracts.md` 为准，修改代码适配契约
2. 如果确实需要变更接口，使用：`更新 contracts.md，[变更描述]`
3. 通知其他模块开发者拉取最新 contracts.md