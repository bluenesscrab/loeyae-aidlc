# 工作区检测

**目的**：确定工作区状态，检查是否存在 AI-DLC 项目

## 步骤 1：检查现有 AI-DLC 项目

检查 `aidlc-docs/aidlc-state.md` 是否存在：
- **存在**：从上次阶段恢复（加载之前阶段的上下文）
- **不存在**：继续进行新项目评估

## 步骤 2：扫描工作区现有代码

**判断工作区是否有现有代码：**

### 后端代码扫描
- 扫描源代码文件（.java, .kt, .kts, .scala, .groovy, .py, .go, .rs, .rb, .php, .c, .h, .cpp, .hpp, .cc, .cs, .fs 等）
- 检查后端构建文件（pom.xml, build.gradle, Makefile, Cargo.toml 等）
- 识别后端项目结构指标

### 前端代码扫描
- 扫描前端源代码文件（.vue, .tsx, .jsx, .ts, .js, .css, .scss, .less）
- 检查前端构建文件（package.json, vite.config.ts, tsconfig.json 等）
- 检测前端框架依赖（在 package.json 中查找）：
  - Vue 3 相关：`vue`, `vue-router`, `pinia`
  - 构建工具：`vite`, `@vitejs/plugin-vue`
  - UI 框架：`element-plus`, `ant-design-vue`
  - 工具库：`axios`, `@vueuse/core`
- 识别前端目录结构（`src/views/`, `src/components/`, `src/api/`, `src/store/`, `src/router/`）

### 通用检查
- 查找项目结构指标
- 确定工作区根目录（非 aidlc-docs/）

**记录发现：**
```markdown
## 工作区状态
- **现有代码**：[是/否]
- **编程语言**：[发现的语言列表]
- **后端构建系统**：[Maven/Gradle/其他（如发现）]
- **后端框架**：[Spring Boot/其他（如发现）]
- **前端技术栈**：[Vue 3/React/其他/无]
- **前端 UI 框架**：[Element Plus/Ant Design Vue/其他/无]
- **前端构建工具**：[Vite/Webpack/其他/无]
- **项目结构**：[单体/微服务/库/空]
- **工作区根目录**：[绝对路径]
```

## 步骤 3：确定下一阶段

**如果工作区为空（无现有代码）**：
- 设置标志：`brownfield = false`
- 下一阶段：需求分析

**如果工作区有现有代码**：
- 设置标志：`brownfield = true`
- 检查 `aidlc-docs/inception/reverse-engineering/` 中是否存在逆向工程产物
- **如果逆向工程产物存在**：加载它们，跳到需求分析
- **如果无逆向工程产物**：下一阶段为逆向工程

## 步骤 4：创建初始状态文件

创建 `aidlc-docs/aidlc-state.md`：

```markdown
# AI-DLC 状态跟踪

## 项目信息
- **项目类型**：[全新项目/存量项目]
- **开始日期**：[ISO 时间戳]
- **当前步骤**：INCEPTION - 工作区检测

## 工作区状态
- **现有代码**：[是/否]
- **需要逆向工程**：[是/否]
- **工作区根目录**：[绝对路径]
- **前端技术栈**：[Vue 3/React/无]
- **前端 UI 框架**：[Element Plus/无]

## 代码位置规则
- **应用代码**：工作区根目录（绝对不在 aidlc-docs/ 中）
- **文档**：仅在 aidlc-docs/
- **结构模式**：参见 code-generation.md 关键规则

## 阶段进度
[随工作流推进填充]
```

## 步骤 5：展示完成消息

**存量项目：**
```markdown
# 🔍 工作区检测完成

工作区分析结果：
• **项目类型**：存量项目
• [AI 生成的工作区发现摘要，使用要点列表]
• **下一步**：进入**逆向工程**分析现有代码库...
```

**全新项目：**
```markdown
# 🔍 工作区检测完成

工作区分析结果：
• **项目类型**：全新项目
• **下一步**：进入**需求分析**...
```

## 步骤 6：自动继续

- **无需用户确认** — 此步骤仅为信息展示
- 自动进入下一阶段：
  - **存量项目**：逆向工程（如无现有产物）或需求分析（如产物已存在）
  - **全新项目**：需求分析
