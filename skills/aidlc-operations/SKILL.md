---
name: aidlc-operations
description: "AI-DLC 部署准备阶段路由：按已确认目标生成交付配置、验证配置并编写部署说明。"
---

# Operations：部署准备

开始时宣布：“使用 aidlc-operations 执行部署准备阶段”。

本 Skill 仅负责平台路由。执行条件、审批和完成标准以 `steering/core-workflow.md` 为准，详细步骤以 `steering/operations-operations.md` 为准。

## 边界

- 前置条件：Construction 的实际构建和测试已通过并有证据。
- 执行范围：部署目标确认、目标相关配置生成、配置验证、部署与回滚说明。
- 不覆盖：部署后的监控、告警、事故响应、运营反馈和系统退役。
- 纯库、纯本地工具或用户明确不需要部署时记录理由并跳过。

## 路由映射

| 路由 | 加载文件 |
|------|----------|
| O1 部署需求与目标确认 | `operations-operations.md` |
| O2 交付配置生成 | `operations-operations.md`；仅按目标加载 `operations-templates.md` 相关章节 |
| O3 配置验证与部署文档 | `operations-operations.md` + `common-quality-gates.md` |

只生成用户确认的平台文件，不得固定生成 Jenkinsfile 或 Kubernetes 清单。完成后执行 `common-step-completion-protocol.md`，以 `docs/aidlc/state.md` 为唯一恢复状态源。
