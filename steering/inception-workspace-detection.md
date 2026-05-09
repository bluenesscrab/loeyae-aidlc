# 工作区检测

**目的**：确定工作区状态，检查是否存在 AI-DLC 项目

## 步骤 1：检查现有 AI-DLC 项目

检查 `docs/aidlc/state.md` 是否存在：
- **存在**：判断协作模式并恢复
  - 检查 state.md 中是否标记"协作模式：团队协作"
  - **团队协作模式**：进入步骤 1.1（团队模式判断）
  - **单人模式**：从上次阶段恢复（加载之前阶段的上下文）
- **不存在**：继续进行新项目评估

### 步骤 1.1：团队模式判断（仅团队协作模式）

检查当前项目的 Inception 和 Construction 状态，确定进入哪种子模式：

**A) 接力模式（Inception 阶段未完成）**：
- 读取 state.md 中的"Inception 进度"表
- 确定哪些步骤已完成、由谁完成
- 确定下一个待执行的步骤
- 展示接力恢复提示（参见步骤 7）

**B) 认领模式（Inception 阶段已完成，Construction 待开始或进行中）**：
- 读取 state.md 中的"单元认领状态"表
- 确定哪些单元待认领、哪些已被认领
- 展示认领提示（参见步骤 8）

**C) 继续开发模式（已认领单元，Construction 进行中）**：
- 读取 state.md 确认当前用户已认领的单元
- 只加载该单元相关的最小上下文
- 从上次中断处继续 Construction 流程

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

**询问协作模式**：在创建 state.md 之前，询问用户：

```markdown
**请选择工作模式：**

A) 单人模式 — 一个人完成所有阶段
B) 团队协作模式 — 多人按角色分工协作

[回答]:
```

创建 `docs/aidlc/state.md`：

```markdown
# AI-DLC 状态跟踪

## 项目信息
- **项目类型**：[全新项目/存量项目]
- **协作模式**：[单人模式/团队协作]
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

## 团队信息（仅团队协作模式）
- **当前操作人**：[姓名/角色]

## Inception 进度（仅团队协作模式）
| 步骤 | 状态 | 负责人 | 完成时间 |
|------|------|--------|----------|
| 工作区检测 | 🔄 进行中 | [姓名] | - |
| 需求分析 | ⏳ 待开始 | - | - |
| 用户故事 | ⏳ 待开始 | - | - |
| 应用设计 | ⏳ 待开始 | - | - |
| 单元生成 | ⏳ 待开始 | - | - |
| 工作流规划 | ⏳ 待开始 | - | - |

## 单元认领状态（Inception 完成后填充）
[待单元生成完成后填充]

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

---

## 步骤 7：接力模式恢复提示（仅团队协作模式）

当检测到团队协作模式且 Inception 未完成时，展示：

```markdown
**检测到进行中的团队协作项目。**

**Inception 进度：**
| 步骤 | 状态 | 负责人 |
|------|------|--------|
[从 state.md 读取并展示]

**下一步**：[下一个待执行的步骤]

**你要以什么角色继续？**

A) 产品经理 — [根据下一步骤描述具体工作]
B) 架构师 — [根据下一步骤描述具体工作]
C) 回顾已完成的步骤

[回答]:
```

选择角色后：
1. 更新 state.md 中的"当前操作人"
2. 只加载与当前步骤相关的前序产出物（不加载完整 audit）
3. 加载前序步骤的决策摘要（decision-summary.md）
4. 进入对应步骤

## 步骤 8：认领模式提示（仅团队协作模式）

当检测到 Inception 已完成、Construction 待开始时，展示：

```markdown
**Inception 阶段已完成，可以开始 Construction。**

**单元认领状态：**
| 单元 | 状态 | 认领人 | 前置依赖 |
|------|------|--------|----------|
[从 state.md / unit-of-work.md 读取并展示]

**你想认领哪个单元？**

[列出所有"待认领"状态的单元作为选项]

[回答]:
```

认领后：
1. 更新 `unit-of-work.md` 中该单元的状态为"已认领"
2. 更新 state.md 中的"单元认领状态"表
3. 记录认领人和特性分支名
4. 只加载该单元相关的最小上下文（参见 common-team-collaboration.md）
5. 创建特性分支（如用户确认）
6. 进入 Construction 阶段
