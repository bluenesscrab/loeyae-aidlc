---
name: aidlc-operations
description: "AI-DLC Operations 阶段 - CI/CD 配置生成、K8s 部署清单、部署文档。在 Construction 构建和测试通过后条件执行。"
---

# Operations 阶段

**开始时宣布：** "使用 aidlc-operations 执行 Operations 阶段"

**目的**：为项目生成 CI/CD 配置文件和部署文档 — 如何运行和维护（RUN & MAINTAIN）

> **薄入口说明**：本 skill 是步骤路由。执行细节、配置模板、问题清单以 `steering/operations-operations.md` 为准；整体流程与审批分级以 `steering/core-workflow.md` 的 OPERATIONS 章节为准。本 skill 不复制模板。

## 核心规则

1. 使用简体中文交互
2. 按需加载 steering 文件
3. 每个步骤完成后更新 `docs/aidlc/state.md` 和 `docs/aidlc/operations/audit-operations.md`
4. 前置条件：必须在 Construction 的"构建和测试"通过后执行
5. 配置文件中不留硬编码密码 — 使用环境变量或 Secret

## 执行条件

**满足任一即执行**：项目需部署到测试/生产环境；项目是可独立运行的服务；用户明确要求生成部署配置。

**满足任一即跳过**：纯本地工具/CLI；纯库项目；用户明确表示不需要部署。

## 步骤路由

加载 `steering/operations-operations.md`，按序执行：

| # | 步骤 | 说明 |
|---|------|------|
| 1 | 部署需求分析 | 从 state.md 读项目类型/技术栈，确定部署类型，识别外部依赖 |
| 2 | 部署规划问答 | 提出部署环境/资源/特殊配置问题，记录到 `operations/plans/operations-plan.md` |
| 3 | CI/CD 配置生成 | Dockerfile、Jenkinsfile、deployment-test.yml、deployment-prod.yml、.dockerignore、nginx.conf（仅前端）→ 写入工作区根目录 |
| 4 | 部署文档生成 | `operations/deployment-guide.md` + `operations/operations-summary.md` |
| 5 | 质量门禁检查 | 按 `common-quality-gates.md` 的 OPERATIONS 检查项 |
| 6 | 完成确认 | 更新 state.md，展示完成消息，🔴 强制审批 |

配置文件模板（各项目类型的基础镜像/构建方式）和质量门禁检查项详见 `operations-operations.md` 与 `common-quality-gates.md`。

## 文档输出

```
docs/aidlc/operations/
├── plans/operations-plan.md
├── audit-operations.md
├── deployment-guide.md
└── operations-summary.md
```

CI/CD 配置文件（Dockerfile、Jenkinsfile、deployment-*.yml 等）写入**工作区根目录**，不在 docs/ 中。

## 完成与移交

Operations 完成后更新 state.md 标记完成，记录审计。

> AI-DLC 工作流完成。Inception 产物在 `docs/aidlc/inception/`，Construction 产物在 `docs/aidlc/construction/`，Operations 产物在 `docs/aidlc/operations/`，代码在工作区根目录。所有阶段已完成，项目可以部署。

## 强制规则

- 配置文件中不留硬编码密码 — 使用环境变量或 Secret
- Dockerfile 遵循最佳实践 — 非 root 用户、层缓存优化、最小基础镜像
- K8s 部署清单包含资源限制和健康检查
- 部署文档可操作 — 步骤清晰，可直接执行
