# 工作区检测

**目的**：确定工作区状态，检查是否存在 AI-DLC 项目

## 步骤 1：检查现有 AI-DLC 项目

检查 `docs/aidlc/state.md` 是否存在：
- **存在**：从上次阶段恢复（加载之前阶段的上下文）
- **不存在**：继续进行新项目评估

## 步骤 2：扫描工作区现有代码

**判断工作区是否有现有代码：**

### 后端代码扫描
- 扫描源代码文件（.java, .kt, .kts, .scala, .groovy, .py, .go, .rs, .rb, .php, .c, .h, .cpp, .hpp, .cc, .cs, .fs 等）
- 检查后端构建文件（pom.xml, build.gradle, Makefile, Cargo.toml 等）
- 识别后端项目结构指标

### 前端代码扫描
- **源代码文件**：扫描前端源代码文件（.vue, .tsx, .jsx, .ts, .js, .css, .scss, .less）
- **构建配置**：检查前端构建文件（package.json, vite.config.ts, tsconfig.json, windi.config.ts 等）
- **技术栈检测**（在 package.json 中查找核心依赖）：
  - **框架**：Vue 3, TypeScript
  - **构建工具**：Vite
  - **UI 框架**：Element Plus, Element Plus Icons
  - **状态管理**：Pinia
  - **路由**：Vue Router
  - **国际化**：Vue I18n
  - **样式**：Sass, Windi CSS, stylelint
  - **表单生成器**：@form-create/element-ui
  - **HTTP 请求**：Axios
  - **工具库**：@vueuse/core, dayjs, crypto-js, qrcode, lodash-es, province-city-china
  - **图表**：ECharts, echarts-wordcloud
  - **富文本**：@wangeditor/editor, @wangeditor/editor-for-vue
  - **图片处理**：cropperjs, vue-color
- **目录结构识别**：
  - `src/api/`（API 接口定义，按模块组织）
  - `src/components/`（全局组件）
  - `src/config/`（全局配置）
  - `src/directives/`（全局指令）
  - `src/hooks/`（Composables）
  - `src/layouts/`（布局组件）
  - `src/locales/`（国际化文件）
  - `src/permission/`（权限管理）
  - `src/router/`（路由配置）
  - `src/store/`（Pinia Store）
  - `src/styles/`（全局样式）
  - `src/types/`（类型定义）
  - `src/utils/`（工具函数）
  - `src/views/`（页面组件）
- **规范检查**：
  - 命名规范：组件文件 PascalCase, CSS类 kebab-case, 文件夹 kebab-case
  - 代码风格：2空格缩进, 单引号, 无分号, 标签属性超过2个时换行
  - 导入顺序：Vue 相关 → 第三方库 → 项目内部（@别名）→ 相对路径
  - 优先使用项目现有组件：ContentWrap, Dialog, Form, Table, UploadFile, UploadImg, Icon, Pagination
  - TypeScript 使用：避免 any 类型，使用 type 关键字导入类型

### 通用检查
- 查找项目结构指标
- 确定工作区根目录（非 docs/aidlc/）

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
- 检查 `docs/aidlc/inception/reverse-engineering/` 中是否存在逆向工程产物
- **如果逆向工程产物存在**：加载它们，跳到需求分析
- **如果无逆向工程产物**：下一阶段为逆向工程

## 步骤 4：创建初始状态文件

创建 `docs/aidlc/state.md`：

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
- **应用代码**：工作区根目录（绝对不在 docs/aidlc/ 中）
- **文档**：仅在 docs/aidlc/
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
