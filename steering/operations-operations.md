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

### 1.1 读取项目上下文
- [ ] 从 `state.md` 读取项目类型、技术栈、后端框架
- [ ] 从 Construction 产物中读取构建方式（Maven/pnpm/pip 等）
- [ ] 识别项目的运行方式（JAR/Node.js/Python/静态资源等）
- [ ] 识别项目依赖的外部服务（数据库、Redis、消息队列等）

### 1.2 确定项目部署类型

根据 state.md 中的技术栈信息，自动匹配部署类型：

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

**指令**：根据步骤 1 的分析结果，生成与项目相关的部署问题。仅生成需要用户决策的问题，已有明确答案的不问。

### 问题类别（按需选择，不强制全部）

**部署环境**：
- 部署目标环境（Kubernetes / Docker Compose / 裸机）
- 环境分级（dev/test/staging/prod 或其子集）
- 私有镜像仓库地址

**服务配置**：
- 服务端口
- 健康检查端点（如有）
- 资源限制（CPU/内存）
- 副本数

**CI/CD 平台**：
- CI/CD 工具（Jenkins / GitLab CI / GitHub Actions）
- 代码仓库地址
- 构建触发方式（手动/自动）

**域名与网络**：
- 服务域名（如需要 Ingress）
- TLS 证书配置
- Ingress Controller 类型（Traefik / Nginx）

**部署策略**：
- 部署方式（滚动更新 / 蓝绿部署 / 金丝雀发布）
- 自动触发链（build 成功后自动 deploy test → deploy prod）

### 问题格式

使用 [回答]: 标签格式，每个问题提供 2-3 个建议选项：

```markdown
**Q1: 部署目标环境？**

A) Kubernetes（推荐，适合微服务和弹性伸缩）
B) Docker Compose（适合单机部署和开发环境）
C) 其他（请说明）

[回答]:
```

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

根据用户回答和项目类型，生成实际的配置文件。所有配置文件写入**工作区根目录**（与应用代码同级）。

### 5.1 Dockerfile

**位置**：`{工作区根目录}/Dockerfile`

**按项目类型生成**：

#### Spring Boot 项目
```dockerfile
# {项目名} Dockerfile
FROM eclipse-temurin:17-jre-alpine

LABEL maintainer="{团队名}"
LABEL description="{项目描述}"

WORKDIR /app

# 复制构建产物
COPY target/*.jar app.jar

# 创建非 root 用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# JVM 参数（容器友好）
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

EXPOSE {端口}

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

#### Node.js 项目
```dockerfile
# {项目名} Dockerfile
FROM node:18-alpine

LABEL maintainer="{团队名}"
LABEL description="{项目描述}"

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production

# 复制源代码
COPY {源代码目录} ./{源代码目录}

# 使用非 root 用户
USER node

EXPOSE {端口}

ENTRYPOINT ["node", "{入口文件}"]
```

#### Python 项目
```dockerfile
# {项目名} Dockerfile
FROM python:3.11-slim

LABEL maintainer="{团队名}"
LABEL description="{项目描述}"

WORKDIR /app

# 安装依赖
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 复制源代码
COPY {源代码目录} ./{源代码目录}

# 创建非 root 用户
RUN useradd -m appuser
USER appuser

EXPOSE {端口}

ENTRYPOINT ["python", "{入口文件}"]
```

#### Vue 3 前端项目
```dockerfile
# {项目名} Dockerfile - 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**通用规则**：
- 使用 Alpine 或 slim 基础镜像（最小化体积）
- 使用非 root 用户运行
- 合理利用 Docker 层缓存（依赖安装在源代码复制之前）
- 添加 LABEL 标注维护者和描述

### 5.2 Jenkinsfile

**位置**：`{工作区根目录}/Jenkinsfile`

**模板结构**（基于团队标准 Jenkins Pipeline）：

```groovy
node {
    properties([
            rateLimitBuilds([count: 3, durationName: 'hour', userBoost: true]),
            disableConcurrentBuilds(),
            buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10')),
            parameters([
                string(name: 'IMAGE_HUB', defaultValue: '{镜像仓库地址}', description: 'image hub'),
                string(name: 'IMAGE_NAME', defaultValue: '{镜像名称}', description: 'image name'),
                string(name: 'IMAGE_TAG', defaultValue: 'latest', description: 'image tag'),
                choice(choices: ['build', 'deploy'], description: 'task type', name: 'TASK_TYPE'),
                choice(choices: ['test', 'prod'], description: 'deploy env', name: 'ENV_LABEL'),
                gitParameter(branchFilter: 'origin/(.*)', defaultValue: 'main', name: 'BRANCH', type: 'PT_BRANCH', selectedValue: 'DEFAULT', useRepository: '{Git仓库地址}')
            ])
    ])
    stage("Checkout") {
        checkout(
            [
                $class: 'GitSCM',
                branches: [[name: params.BRANCH]],
                doGenerateSubmoduleConfigurations: false,
                extensions: [], submoduleCfg: [],
                userRemoteConfigs: [[credentialsId: '{Git凭证ID}', url: '{Git仓库地址}']]
            ]
        )
    }
    stage("Package") {
        if (params.TASK_TYPE == 'build') {
            sh """
            docker build -t ${params.IMAGE_HUB}${params.IMAGE_NAME}:latest ./
            """
        }
    }
    stage("Image push") {
        if (params.TASK_TYPE == 'build') {
            def latestTag = "${params.IMAGE_HUB}${params.IMAGE_NAME}:latest"
            withCredentials([dockerCert(credentialsId: 'docker-client', variable: 'DOCKER_CERT_PATH')]) {
                try {
                    sh """
                    docker push $latestTag
                    """
                }
                catch (exc) {
                    println("Push image failure")
                    print(exc.getMessage())
                    currentBuild.result = 'FAILURE'
                }
                sh """
                docker rmi $latestTag
                """
            }
        }
    }
    stage("deploy") {
        if (params.TASK_TYPE == 'deploy') {
            def buildId = 1
            if (params.ENV_LABEL == 'prod') {
                buildId = params.IMAGE_TAG
            } else {
                try {
                    buildId = Integer.valueOf(currentBuild.id)
                } catch (exc) {
                }
            }
            if (params.ENV_LABEL == 'test') {
                def imageTag = "${params.IMAGE_HUB}${params.IMAGE_NAME}:${buildId}"
                def latestTag = "${params.IMAGE_HUB}${params.IMAGE_NAME}:latest"
                withCredentials([dockerCert(credentialsId: 'docker-client', variable: 'DOCKER_CERT_PATH')]) {
                    try {
                        sh """
                            docker pull $latestTag
                            docker tag $latestTag $imageTag
                            docker push $imageTag
                            """
                    }
                    catch (exc) {
                        println("pull image failure")
                        print(exc.getMessage())
                        currentBuild.result = 'FAILURE'
                    }
                    try {
                        sh """
                        docker rmi $latestTag
                        """
                    } catch (exc) {
                        print(exc.getMessage())
                    }
                }
            }
            def source = "deployment-${params.ENV_LABEL}.yml"
            sh "sed -e 's#{TAG}#${buildId}#g' ${source} > deployment-{服务名}.yml"
            if (params.ENV_LABEL == 'prod') {
                sh "kubectl apply -f deployment-{服务名}.yml --kubeconfig=/home/bys/.kube/hq.config"
            } else {
                sh "kubectl apply -f deployment-{服务名}.yml"
            }
        }
    }
    stage("Post") {
        echo "success"
        def jobName = JOB_NAME
        if (params.TASK_TYPE == 'build' && currentBuild.currentResult == 'SUCCESS') {
            try {
                def nextJobName = jobName.replaceAll("assembly", "deploy")
                build job: nextJobName, parameters: [text(name: 'IMAGE_TAG', value: BUILD_ID), text(name: 'ENV_LABEL', value: 'test'), text(name: 'TASK_TYPE', value: 'deploy')], propagate: false, quietPeriod: 9, wait: false
            } catch (exc) {
                print(exc.getMessage())
            }
        }
        if (params.TASK_TYPE == 'deploy' && params.ENV_LABEL == 'test' && currentBuild.currentResult == 'SUCCESS') {
            try {
                def nextJobName = jobName + "-prod"
                build job: nextJobName, parameters: [text(name: 'IMAGE_TAG', value: BUILD_ID), text(name: 'ENV_LABEL', value: 'prod'), text(name: 'TASK_TYPE', value: 'deploy')], propagate: false, quietPeriod: 9, wait: false
            } catch (exc) {
                print(exc.getMessage())
            }
        }
    }
}
```

**Spring Boot 项目额外步骤**：在 Package 阶段前增加 Maven 构建：
```groovy
stage("Build") {
    if (params.TASK_TYPE == 'build') {
        sh """
        mvn clean package -DskipTests -P${params.ENV_LABEL}
        """
    }
}
```

**前端项目额外步骤**：在 Package 阶段前增加 pnpm 构建：
```groovy
stage("Build") {
    if (params.TASK_TYPE == 'build') {
        sh """
        pnpm install --frozen-lockfile
        pnpm build
        """
    }
}
```

### 5.3 Kubernetes 部署清单

**位置**：`{工作区根目录}/deployment-test.yml` 和 `{工作区根目录}/deployment-prod.yml`

**模板结构**：

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: {服务名}
  namespace: {命名空间}
spec:
  ports:
    - port: {服务端口}
      targetPort: {容器端口}
      name: {端口名称}
  selector:
    app: {服务名}

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {服务名}
  namespace: {命名空间}
spec:
  replicas: {副本数}
  selector:
    matchLabels:
      app: {服务名}
  template:
    metadata:
      labels:
        app: {服务名}
    spec:
      imagePullSecrets:
        - name: {镜像拉取密钥}
      containers:
        - name: {服务名}
          image: {镜像仓库地址}{镜像名称}:{TAG}
          imagePullPolicy: Always
          ports:
            - containerPort: {容器端口}
              protocol: TCP
              name: {端口名称}
          env:
            - name: TZ
              value: Asia/Shanghai
            # 项目特定环境变量
          resources:
            limits:
              memory: "{内存上限}"
              cpu: "{CPU上限}"
            requests:
              memory: "{内存请求}"
              cpu: "{CPU请求}"
          livenessProbe:
            httpGet:
              path: {健康检查路径}
              port: {容器端口}
            initialDelaySeconds: {初始延迟}
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: {健康检查路径}
              port: {容器端口}
            initialDelaySeconds: {初始延迟}
            periodSeconds: 10

---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: {Ingress类型}
  name: {服务名}
  namespace: {命名空间}
spec:
  rules:
    - host: {域名}
      http:
        paths:
          - path: /
            backend:
              serviceName: {服务名}
              servicePort: {端口名称}
  tls:
    - secretName: {TLS证书密钥名}
```

**test 与 prod 差异**：
- `replicas`：test 通常 1，prod 通常 2+
- `resources`：prod 的资源限制通常更高
- `namespace`：可能不同
- 环境变量：数据库连接、外部服务地址等

### 5.4 前端 Nginx 配置（仅前端项目）

**位置**：`{工作区根目录}/nginx.conf`

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理（如需要）
    location /api {
        proxy_pass {后端API地址};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 'ok';
        add_header Content-Type text/plain;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 5.5 .dockerignore

**位置**：`{工作区根目录}/.dockerignore`

根据项目类型生成，排除不需要进入镜像的文件：

```
# 通用
.git
.gitignore
*.md
docs/
.idea/
.vscode/
.kiro/

# Node.js 项目
node_modules/
npm-debug.log*

# Java 项目
target/
*.class
*.jar
!target/*.jar

# Python 项目
__pycache__/
*.pyc
.venv/
venv/

# 前端项目
dist/
node_modules/
```

---

## 步骤 6：生成部署文档

### 6.1 部署指南

**位置**：`docs/aidlc/operations/deployment-guide.md`

```markdown
# 部署指南

## 项目信息
- **项目名称**：{项目名}
- **项目类型**：{项目类型}
- **镜像名称**：{镜像仓库地址}{镜像名称}
- **部署环境**：test / prod

## CI/CD 流程概览

### 构建流程（TASK_TYPE = build）
1. Checkout：从 Git 仓库拉取指定分支代码
2. Build：执行项目构建（{构建命令}）
3. Package：`docker build` 构建镜像并标记为 latest
4. Image Push：推送镜像到私有仓库
5. Post：构建成功后自动触发 test 环境部署

### 部署流程（TASK_TYPE = deploy）
1. Checkout：拉取部署配置
2. Deploy（test）：
   - 拉取 latest 镜像
   - 重新标记为 buildId
   - 推送带版本号的镜像
   - sed 替换 deployment YAML 中的 {TAG}
   - kubectl apply 部署到 test 集群
3. Deploy（prod）：
   - 使用指定 IMAGE_TAG
   - sed 替换 deployment YAML 中的 {TAG}
   - kubectl apply 部署到 prod 集群（使用 hq.config）
4. Post：test 部署成功后自动触发 prod 部署

### 自动触发链
```
build 成功 → 自动 deploy test → 自动 deploy prod
```

## 环境配置

### test 环境
- **集群**：默认 kubeconfig
- **命名空间**：{命名空间}
- **域名**：{test域名}
- **副本数**：{test副本数}

### prod 环境
- **集群**：hq.config
- **命名空间**：{命名空间}
- **域名**：{prod域名}
- **副本数**：{prod副本数}

## 手动操作

### 手动构建
在 Jenkins 中选择：
- TASK_TYPE: build
- BRANCH: {目标分支}

### 手动部署
在 Jenkins 中选择：
- TASK_TYPE: deploy
- ENV_LABEL: test 或 prod
- IMAGE_TAG: {指定版本号}

### 回滚
1. 在 Jenkins 中选择 deploy
2. ENV_LABEL 选择目标环境
3. IMAGE_TAG 填写要回滚到的版本号

## 健康检查
- **端点**：{健康检查路径}
- **存活探针**：每 30 秒检查一次，初始延迟 {初始延迟} 秒
- **就绪探针**：每 10 秒检查一次，初始延迟 {初始延迟} 秒

## 资源配置
| 环境 | CPU 请求 | CPU 上限 | 内存请求 | 内存上限 |
|------|----------|----------|----------|----------|
| test | {值} | {值} | {值} | {值} |
| prod | {值} | {值} | {值} | {值} |

## 故障排除

### 镜像拉取失败
- 检查 imagePullSecrets 配置
- 确认镜像仓库凭证有效
- 确认镜像标签存在

### Pod 启动失败
- `kubectl logs {pod名} -n {命名空间}` 查看日志
- `kubectl describe pod {pod名} -n {命名空间}` 查看事件
- 检查资源限制是否过低

### 健康检查失败
- 确认应用已正常启动
- 检查健康检查端点是否可访问
- 调整 initialDelaySeconds（特别是 Java 项目启动较慢）
```

### 6.2 Operations 摘要

**位置**：`docs/aidlc/operations/operations-summary.md`

```markdown
# Operations 摘要

## 生成的配置文件
| 文件 | 位置 | 说明 |
|------|------|------|
| Dockerfile | {路径} | 容器化配置 |
| Jenkinsfile | {路径} | CI/CD Pipeline |
| deployment-test.yml | {路径} | K8s 测试环境部署清单 |
| deployment-prod.yml | {路径} | K8s 生产环境部署清单 |
| .dockerignore | {路径} | Docker 构建排除文件 |
| nginx.conf | {路径} | Nginx 配置（仅前端） |

## 部署架构
- **CI/CD 工具**：Jenkins
- **容器化**：Docker
- **编排**：Kubernetes
- **Ingress**：{Ingress类型}
- **镜像仓库**：{镜像仓库地址}

## 自动触发链
build → deploy test → deploy prod

## 状态
- **配置文件生成**：✅ 完成
- **部署文档**：✅ 完成
- **准备就绪**：是
```

---

## 步骤 7：质量门禁检查

### Operations 质量门禁清单

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

按以下结构展示完成消息：

1. **完成公告**（强制）：始终以此开头：

```markdown
# 🚀 Operations 阶段完成
```

2. **AI 摘要**（可选）：提供结构化要点摘要
   - 列出生成的配置文件及路径
   - 说明 CI/CD 流程（build → deploy test → deploy prod）
   - 列出关键部署参数（端口、域名、资源限制）
   - 保持事实性和内容聚焦

3. **格式化工作流消息**（强制）：始终以此格式结尾：

```markdown
> **📋 <u>**需要审查：**</u>**
> 请检查生成的配置文件：
> - **CI/CD 配置**：`Dockerfile`、`Jenkinsfile`
> - **部署清单**：`deployment-test.yml`、`deployment-prod.yml`
> - **部署文档**：`docs/aidlc/operations/`



> **🚀 <u>**下一步？**</u>**
>
> **你可以：**
>
> 🔧 **请求修改** - 根据审查结果要求修改配置文件
> ✅ **确认完成** - 项目开发全流程完成
> 📋 **新 Session 继续** - 复制 `state.md` 中的交接提示词到新对话继续

---
```

---

## 步骤 9：等待明确审批

- 在用户明确审批前不得继续
- 审批必须清晰且无歧义
- 如用户请求修改，更新配置文件并重复审批流程

---

## 步骤 10：记录审批并更新进度

- 在 audit.md 中记录审批及时间戳
- 记录用户的审批回复及时间戳
- 在 state.md 中标记 Operations 阶段完成
- 更新 state.md 的"下一步交接"字段

---

## 配置文件生成规则

### 通用规则
- 所有配置文件写入工作区根目录（与应用代码同级）
- 文档写入 `docs/aidlc/operations/`
- 配置文件中禁止硬编码密码、密钥、Token
- 使用环境变量或 Kubernetes Secret 管理敏感信息
- 镜像标签使用 `{TAG}` 占位符，由 Jenkins 在部署时替换

### 项目类型适配规则
- 从 state.md 读取项目类型和技术栈
- 根据项目类型选择对应的 Dockerfile 模板
- 根据构建工具选择 Jenkinsfile 中的 Build 阶段命令
- 根据运行时特性配置健康检查和资源限制

### Jenkins Pipeline 标准
- 使用参数化构建（IMAGE_HUB、IMAGE_NAME、IMAGE_TAG、TASK_TYPE、ENV_LABEL、BRANCH）
- build 任务：构建 → Docker build → 推送镜像
- deploy 任务：拉取镜像 → 重标记 → 推送 → sed 替换 → kubectl apply
- Post 阶段：build 成功自动触发 deploy test，deploy test 成功自动触发 deploy prod
- 使用 `dockerCert` 凭证进行镜像推送
- test 环境使用默认 kubeconfig，prod 环境使用 `/home/bys/.kube/hq.config`

### Kubernetes 部署标准
- 每个部署清单包含：Service + Deployment + Ingress
- 使用 imagePullSecrets 拉取私有镜像
- 配置 liveness 和 readiness 探针
- 设置资源 requests 和 limits
- 时区统一设置为 `Asia/Shanghai`
- Ingress 使用 TLS

---

## 目录结构

Operations 阶段产出物的目录结构：

```text
<工作区根目录>/
├── Dockerfile                    # 容器化配置
├── Jenkinsfile                   # CI/CD Pipeline
├── deployment-test.yml           # K8s 测试环境部署清单
├── deployment-prod.yml           # K8s 生产环境部署清单
├── .dockerignore                 # Docker 构建排除文件
├── nginx.conf                    # Nginx 配置（仅前端项目）
│
├── docs/
│   └── aidlc/
│       └── operations/           # Operations 阶段文档
│           ├── plans/
│           │   └── operations-plan.md    # 部署规划（含问答）
│           ├── deployment-guide.md       # 部署指南
│           └── operations-summary.md     # Operations 摘要
```
