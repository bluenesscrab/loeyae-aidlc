# Loeyae AI-DLC Power

基于 AI-DLC 方法论的团队开发工作流，覆盖需求分析、架构设计、代码生成、测试和 CI/CD 部署，集成 Loeyae Boot Framework 编码规范和 Vue 3 前端规范。

## 快速开始

在 Kiro 中安装本 Power 后，使用以下方式激活：

```
使用 AI-DLC，[描述你的开发需求]
```

## 当前架构

```
Inception（规划） → Construction（实现） → Operations（部署，条件）
```

- **Inception**：需求分析、用户故事、架构设计（做什么、为什么做）
  - 团队协作：接力模式 — PM 和架构师按步骤接力
- **Construction**：功能设计、代码生成、构建测试（怎么做）
  - 团队协作：认领模式 — 开发者自主认领单元，独立开发
- **Operations**（条件执行）：CI/CD 配置生成、K8s 部署（如何运行和维护）
  - 根据项目类型自动选择模板（Spring Boot / Node.js / Python / Vue 3）
  - 生成 Dockerfile、Jenkinsfile、K8s 部署清单、部署文档

## Operations 阶段说明

Operations 阶段在 Construction 的"构建和测试"通过后条件执行，为项目生成完整的 CI/CD 配置文件和部署文档。

### 执行条件

- 项目需要部署到测试/生产环境
- 项目是可独立运行的服务（Web 服务、API 服务、MCP 服务等）
- 用户明确要求生成部署配置

### 跳过条件

- 纯本地工具/CLI 工具
- 纯库项目（供其他项目引用，自身不独立部署）
- 用户明确表示不需要部署

### 生成的配置文件

| 文件 | 说明 |
|------|------|
| `Dockerfile` | 容器化配置（根据项目类型自动选择基础镜像和构建方式） |
| `Jenkinsfile` | CI/CD Pipeline（参数化构建，build/deploy 双模式） |
| `deployment-test.yml` | K8s 测试环境部署清单（Service + Deployment + Ingress） |
| `deployment-prod.yml` | K8s 生产环境部署清单 |
| `.dockerignore` | Docker 构建排除文件 |
| `nginx.conf` | Nginx 配置（仅前端项目） |

### CI/CD 流程

```
build 成功 → 自动 deploy test → 自动 deploy prod
```

- **build 任务**：Checkout → Build → Docker build → Push 镜像
- **deploy 任务**：Pull 镜像 → 重标记版本 → Push → sed 替换 {TAG} → kubectl apply
- **自动触发链**：Post 阶段级联触发下一环境部署

### 支持的项目类型

| 项目类型 | 基础镜像 | 构建方式 |
|---------|----------|----------|
| Spring Boot | eclipse-temurin:17-jre-alpine | Maven → JAR → Docker |
| Node.js | node:18-alpine | npm ci → Docker |
| Python | python:3.11-slim | pip install → Docker |
| Vue 3 前端 | nginx:alpine | pnpm build → 多阶段构建 |
| Go | alpine:latest | go build → 静态二进制 |

### 部署基础设施

- **CI/CD 工具**：Jenkins（参数化构建）
- **容器化**：Docker（私有镜像仓库）
- **编排**：Kubernetes
- **Ingress**：Traefik / Nginx（可配置）
- **环境**：test（默认 kubeconfig）+ prod（hq.config）
