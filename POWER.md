---
name: "loeyae-aidlc"
displayName: "Loeyae AI-DLC"
version: "1.2.3"
description: "基于 AI-DLC 方法论的团队开发工作流，覆盖需求分析、架构设计、代码生成和测试，集成 Loeyae Boot Framework 编码规范和 Vue 3 前端规范。"
keywords: ["aidlc", "开发工作流", "需求分析", "代码生成", "loeyae", "vue3", "spring-boot", "element-plus"]
author: "Loeyae Team"
---

# Loeyae AI-DLC

**关键首步**：必须先读取并加载 `steering/core-workflow.md`，然后再执行任何其他操作。这是不可协商的。在加载此文件之前，不要回复用户，不要启动任何工作流。

Loeyae AI-DLC 是基于 AI-DLC 方法论定制的团队开发工作流，自适应地调整工作流程以匹配项目需求，同时集成团队编码规范。

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

**架构模式**：
- **单模块模式**：小项目，传统流程
- **多模块模式**：大项目，先产品级规划，再按模块并行开发

## 激活方式

用户以以下方式开始请求时激活：
```
使用 AI-DLC，[描述你的开发需求]
```

## MCP 工具

本 Power 集成了 `loeyae-skills` MCP 服务，提供 Loeyae Boot Framework 编码规范：

- `get_skill_summary(name)` — 获取指定编码规范摘要（快速预览）
- `get_skill_content(name)` — 获取指定编码规范完整内容（包含包路径等所有细节，编码时使用）
- `search_skill(query)` — 按关键词搜索相关规范

**适用条件**：仅当项目为 Java 且引用了 Loeyae Boot Framework 时，才在 Construction 阶段调用 MCP Skill。工作区检测阶段会自动识别框架并记录到 state.md。

**可用 Skill 分类**：
- 核心业务：`loeyae-crud`、`loeyae-auth`、`loeyae-validation`、`loeyae-error-handling`、`loeyae-data-access`、`loeyae-web-infra`、`loeyae-data-security`、`loeyae-dict`
- 基础设施：`loeyae-cache`、`loeyae-message`、`loeyae-message-audit`、`loeyae-job`、`loeyae-mail`、`loeyae-feign`、`loeyae-license`、`loeyae-cms`、`loeyae-mybatis-audit`
- 工具与模式：`loeyae-utils`、`loeyae-decide`、`loeyae-optional-util`、`loeyae-test`、`loeyae-test-base`、`loeyae-test-utils`、`loeyae-framework-modules`、`loeyae-database-design`
- 低代码：`loeyae-lowcode-getting-started`、`loeyae-lowcode-crud-template`、`loeyae-lowcode-flow`、`loeyae-lowcode-groovy`、`loeyae-lowcode-amis`、`loeyae-lowcode-component-dev`、`loeyae-lowcode-api-integration`、`loeyae-lowcode-best-practices`

## Steering 文件

所有 steering 文件位于 `steering/` 目录：

### 核心工作流
- `core-workflow.md` — 主工作流定义（必须首先加载）

### 通用规范（common-*）
- `common-process-overview.md` — 流程概览
- `common-welcome-message.md` — 欢迎消息
- `common-question-format-guide.md` — 问题格式指南
- `common-content-validation.md` — 内容验证规则
- `common-quality-gates.md` — 质量门禁规则（检查清单）
- `common-persuasion-defense.md` — 说服式防护与验证纪律（替代硬规则的执行方式）
- `common-systematic-debugging.md` — 系统化调试（四阶段根因分析流程）
- `common-session-continuity.md` — 会话连续性
- `common-session-handoff.md` — Session 交接提示词（阶段完成时生成可复制的新 session 提示词）
- `common-team-collaboration.md` — 团队协作模型（接力模式 + 认领模式）
- `common-token-management.md` — Token 管理策略（分层摘要 + 审计分段 + 按需加载 + 文档切片）
- `common-terminology.md` — 术语表
- `common-depth-levels.md` — 自适应深度说明
- `common-error-handling.md` — 错误处理
- `common-overconfidence-prevention.md` — 过度自信防范
- `common-workflow-changes.md` — 工作流变更管理
- `common-ascii-diagram-standards.md` — ASCII 图标准

### 团队编码规范（common-*）
- `common-tech-backend.md` — 后端编码规范（Java / Spring Boot / Loeyae Boot）
- `common-tech-backend-annotations.md` — 后端框架注解与工具类速查
- `common-tech-backend-modules.md` — 框架模块索引与依赖组合
- `common-tech-backend-practices.md` — 后端最佳实践与快速开始
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
- `construction-code-generation.md` — 代码生成（含 MCP Skill 集成）
- `construction-build-and-test.md` — 构建和测试

## 参考资源

- **方法论来源**: [AI-DLC (AWS)](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)
- **原始仓库**: [aidlc-workflows](https://github.com/awslabs/aidlc-workflows)