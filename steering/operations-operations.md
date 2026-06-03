# 运维阶段（Operations）

**目的**：为项目生成 CI/CD 配置文件和部署文档，覆盖容器化、持续集成、持续部署的完整流程

**聚焦**：如何运行和维护（HOW to operate）

## 前置条件
- Construction 阶段的"构建和测试"必须通过
- 项目需要部署到服务器/集群环境
- state.md 中已记录项目类型和技术栈信息

## 执行条件与跳过条件

**执行条件**（满足任一即执行）：
- 项目需要部署到测试/生产环境
- 项目是可独立运行的服务（Web 服务、API 服务、MCP 服务等）
- 用户明确要求生成部署配置

**跳过条件**（满足任一即跳过）：
- 纯本地工具/CLI 工具
- 纯库项目（供其他项目引用，自身不独立部署）
- 用户明确表示不需要部署

---

## 步骤 1：分析部署需求

- [ ] 从 `state.md` 读取项目类型、技术栈、后端框架
- [ ] 从 Construction 产物中读取构建方式（Maven/pnpm/pip 等）
- [ ] 识别项目的运行方式（JAR/Node.js/Python/静态资源等）
- [ ] 识别项目依赖的外部服务（数据库、Redis、消息队列等）
- [ ] 确定项目部署类型（参见下方部署类型表）

| 项目类型 | 构建工具 | 运行时 | 容器基础镜像 |
|---------|----------|--------|-------------|
| Spring Boot | Maven | JDK 17+ | eclipse-temurin:17-jre-alpine |
| Node.js 服务 | npm/pnpm | Node.js 18+ | node:18-alpine |
| Python 服务 | pip/poetry | Python 3.11+ | python:3.11-slim |
| Vue 3 前端 | pnpm | Nginx | nginx:alpine |
| UniApp 前端 | pnpm | Nginx | nginx:alpine |
| Go 服务 | go build | 静态二进制 | alpine:latest |

---

## 步骤 2：生成部署规划问题

根据步骤 1 的分析结果，生成与项目相关的部署问题。仅生成需要用户决策的问题。

**问题类别**（按需选择，不强制全部）：
- 部署环境（Kubernetes / Docker Compose / 裸机）
- 环境分级（dev/test/staging/prod）
- 私有镜像仓库地址
- 服务端口、健康检查端点
- 资源限制（CPU/内存）、副本数
- CI/CD 工具和构建触发方式
- 域名与 Ingress 配置
- 部署策略（滚动/蓝绿/金丝雀）

使用 [回答]: 标签格式，每个问题提供 2-3 个选项。

---

## 步骤 3：保存部署规划

- [ ] 将规划保存为 `docs/aidlc/operations/plans/operations-plan.md`
- [ ] 包含所有 [回答]: 标签供用户输入
- [ ] 等待用户回答所有问题

---

## 步骤 4：收集和分析答案

- [ ] 等待用户完成所有 [回答]: 标签
- [ ] 审查模糊或含糊的回复
- [ ] 如需要则添加后续问题
- [ ] 确认所有部署决策已明确

---

## 步骤 5：生成 CI/CD 配置文件

> **⚠️ 进入此步骤时，加载 `operations-templates.md` 获取各项目类型的完整模板。**

根据用户回答和项目类型，生成实际的配置文件。所有配置文件写入**工作区根目录**。

需要生成的文件清单：

| 文件 | 位置 | 条件 |
|------|------|------|
| Dockerfile | 工作区根目录 | 始终 |
| Jenkinsfile | 工作区根目录 | 始终 |
| deployment-test.yml | 工作区根目录 | 始终 |
| deployment-prod.yml | 工作区根目录 | 始终 |
| .dockerignore | 工作区根目录 | 始终 |
| nginx.conf | 工作区根目录 | 仅前端项目 |

**生成规则**：
- 从 `operations-templates.md` 加载对应项目类型的模板
- 将模板中的 `{占位符}` 替换为步骤 2-4 中确认的实际值
- Spring Boot 项目：在 Jenkinsfile Package 阶段前增加 Maven Build 阶段
- 前端项目：在 Jenkinsfile Package 阶段前增加 pnpm Build 阶段
- test 与 prod 部署清单的差异：replicas、resources、namespace、环境变量

---

## 步骤 6：生成部署文档

生成以下文档到 `docs/aidlc/operations/`：

### deployment-guide.md
- 项目信息（名称、类型、镜像名称、环境）
- CI/CD 流程概览（build 流程 + deploy 流程 + 自动触发链）
- 环境配置（test + prod 的集群、命名空间、域名、副本数）
- 手动操作指南（构建、部署、回滚）
- 健康检查配置
- 资源配置表
- 故障排除（镜像拉取失败、Pod 启动失败、健康检查失败）

### operations-summary.md
- 生成的配置文件清单（文件 + 路径 + 说明）
- 部署架构概要（CI/CD 工具、容器化、编排、Ingress、镜像仓库）
- 自动触发链（build → deploy test → deploy prod）
- 状态确认

---

## 步骤 7：质量门禁检查

- [ ] Dockerfile 遵循最佳实践（非 root 用户、层缓存优化、最小基础镜像）
- [ ] Jenkinsfile 包含完整的 build/deploy 流程
- [ ] Kubernetes 部署清单包含 Service + Deployment + Ingress
- [ ] 健康检查已配置（liveness + readiness）
- [ ] 资源限制已设置（requests + limits）
- [ ] 环境变量已配置（时区、项目特定变量）
- [ ] imagePullSecrets 已配置
- [ ] test 和 prod 部署清单均已生成
- [ ] .dockerignore 已生成
- [ ] 部署文档完整（流程说明 + 手动操作 + 故障排除）
- [ ] 配置文件中无硬编码密码或密钥
- [ ] {TAG} 占位符在部署清单中正确使用

---

## 步骤 8：展示完成消息

```markdown
# 🚀 Operations 阶段完成

[AI 摘要：配置文件清单 + CI/CD 流程 + 关键参数]

> **📋 需要审查：**
> - CI/CD 配置：`Dockerfile`、`Jenkinsfile`
> - 部署清单：`deployment-test.yml`、`deployment-prod.yml`
> - 部署文档：`docs/aidlc/operations/`

> **🚀 下一步？**
> 🔧 请求修改 | ✅ 确认完成 | 📋 新 Session 继续
```

---

## 步骤 9：等待审批并更新进度

- 🔴 **强制审批** — 任何模式下都必须等待
- 审批通过后：更新 state.md 标记 Operations 完成 + 记录审计

---

## 配置文件生成规则

### 通用规则
- 所有配置文件写入工作区根目录
- 文档写入 `docs/aidlc/operations/`
- 禁止硬编码密码、密钥、Token — 使用环境变量或 K8s Secret
- 镜像标签使用 `{TAG}` 占位符

### Jenkins Pipeline 标准
- 参数化构建：IMAGE_HUB、IMAGE_NAME、IMAGE_TAG、TASK_TYPE、ENV_LABEL、BRANCH
- build：构建 → Docker build → 推送镜像
- deploy：拉取 → 重标记 → 推送 → sed 替换 → kubectl apply
- Post 自动触发链：build → deploy test → deploy prod
- test 用默认 kubeconfig，prod 用 `/home/bys/.kube/hq.config`

### Kubernetes 部署标准
- 每个清单：Service + Deployment + Ingress
- imagePullSecrets + liveness/readiness 探针 + resources limits
- 时区 `Asia/Shanghai`
- Ingress 配 TLS
