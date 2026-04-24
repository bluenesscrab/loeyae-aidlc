---
name: "loeyae-aidlc"
displayName: "Loeyae AI-DLC"
description: "基于 AI-DLC 方法论的团队开发工作流，覆盖需求分析、架构设计、代码生成和测试，集成 Loeyae Boot Framework 编码规范和 Vue 3 前端规范。"
keywords: ["aidlc", "开发工作流", "需求分析", "代码生成", "loeyae", "vue3", "spring-boot", "element-plus"]
author: "Loeyae Team"
---

# Loeyae AI-DLC

**关键首步**：必须先读取并加载 `steering/core-workflow.md`，然后再执行任何其他操作。这是不可协商的。在加载此文件之前，不要回复用户，不要启动任何工作流。

Loeyae AI-DLC 是基于 AI-DLC 方法论定制的团队开发工作流，自适应地调整工作流程以匹配项目需求，同时集成团队编码规范。

## 概述

两阶段自适应开发工作流：

- **Inception（规划阶段）** — 需求分析、用户故事、架构设计（做什么、为什么做）
- **Construction（实现阶段）** — 功能设计、代码生成、构建测试（怎么做）

## 激活方式

用户以以下方式开始请求时激活：
```
使用 AI-DLC，[描述你的开发需求]
```

## MCP 工具

本 Power 集成了 `loeyae-skills` MCP 服务，提供 Loeyae Boot Framework 编码规范：

- `get_skill_summary(name)` — 获取指定编码规范摘要（如 `loeyae-crud`、`loeyae-auth`）
- `search_skill(query)` — 按关键词搜索相关规范

在 Construction 阶段的代码生成环节，工作流会自动根据代码类型调用对应的 skill 获取编码规范。

## Steering 文件

所有 steering 文件位于 `steering/` 目录：

### 核心工作流
- `core-workflow.md` — 主工作流定义（必须首先加载）

### 通用规范（common-*）
- `common-process-overview.md` — 流程概览
- `common-welcome-message.md` — 欢迎消息
- `common-question-format-guide.md` — 问题格式指南
- `common-content-validation.md` — 内容验证规则
- `common-session-continuity.md` — 会话连续性
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
- `common-tech-frontend.md` — 前端编码规范（Vue 3 / Element Plus / TypeScript）
- `common-tech-security.md` — 安全编码规范
- `common-tech-testing.md` — 测试规范
- `common-database-design.md` — 数据库设计规范
- `common-figma-design-standards.md` — Figma 设计稿还原规范

### Inception 阶段
- `inception-workspace-detection.md` — 工作区检测
- `inception-reverse-engineering.md` — 逆向工程
- `inception-requirements-analysis.md` — 需求分析
- `inception-user-stories.md` — 用户故事
- `inception-workflow-planning.md` — 工作流规划
- `inception-application-design.md` — 应用设计
- `inception-units-generation.md` — 单元生成

### Construction 阶段
- `construction-functional-design.md` — 功能设计
- `construction-nfr-requirements.md` — NFR 需求
- `construction-nfr-design.md` — NFR 设计
- `construction-infrastructure-design.md` — 基础设施设计
- `construction-code-generation.md` — 代码生成（含 MCP Skill 集成）
- `construction-build-and-test.md` — 构建和测试

## 参考资源

- **方法论来源**: [AI-DLC (AWS)](https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/)
- **原始仓库**: [aidlc-workflows](https://github.com/aws-samples/aidlc-workflows)
