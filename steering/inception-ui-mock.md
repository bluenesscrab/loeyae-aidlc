# UI Mock（询问用户选择）

**角色**：产品经理 / UI 设计师

**目的**：基于已完成的需求文档，生成 HTML 格式的页面原型，用于需求交接和多端开发对齐。

## 前置条件
- 需求分析必须完成
- 需求文档已完成
- 用户故事已完成
- 用户故事交叉验证（步骤 4.1）必须通过
- 工作区检测已完成（已知涉及的端和现有代码位置）

---

## 执行条件（询问用户选择）

**触发方式**：用户故事（及其交叉验证）完成后，主动询问 Boss 是否需要制作 UI Mock。

**询问模板**：
```markdown
Boss，用户故事已完成并通过交叉验证。

接下来是否需要制作 UI Mock（HTML 页面原型）？

- ✅ **需要 UI Mock** — 我将基于需求文档和用户故事生成页面原型
- ⏭️ **跳过 UI Mock** — 直接进入工作流规划

💡 **建议制作 UI Mock 的场景**：有前端页面需求、需交付外部团队、多端需统一展示
💡 **建议跳过的场景**：纯后端/API 项目、有 Figma 设计稿、简单改动
```

- 用户选择"需要" → 执行 UI Mock 步骤
- 用户选择"跳过" → 直接进入工作流规划

## 跳过条件

- 用户明确选择跳过

---

## 执行步骤

### 步骤 1：加载规则与上下文

1. 加载需求文档（`docs/aidlc/inception/requirements/requirements.md`）
2. 加载用户故事（如存在：`docs/aidlc/inception/user-stories/`）
3. 如为存量项目，加载逆向工程产物中的前端架构信息
4. **询问用户是否选择设计风格**（可选，见下方子流程）

**UI 风格确定规则**：
- **存量项目**：读取现有前端代码，提取实际使用的 UI 框架和组件风格（如 Element UI、uView），以现有风格为准。不询问设计风格选择。
- **新项目**：主动询问用户是否需要选择设计风格（见下方询问模板）。用户跳过则使用通用 UI 框架（Element UI / Ant Design）作为基准。

#### 设计风格选择（可选子流程）

**触发条件**：新项目，且不是存量项目的局部改造。

**询问模板**：
```markdown
Boss，是否需要为 UI Mock 选择一个设计风格参考？

- 🎨 **选择设计风格** — 我将展示可用的品牌设计风格供你选择，应用其配色和组件样式
- ⏭️ **使用默认风格** — 使用通用 UI 框架样式（Element UI / Ant Design）

💡 **选择设计风格的场景**：新产品需要统一视觉风格、希望参考知名产品的设计语言
💡 **使用默认风格的场景**：内部系统、快速验证、已有设计规范
```

**用户选择"选择设计风格"时的执行流程**：

1. 调用 MCP 工具 `list_design_styles` 获取风格列表，向用户展示：
```markdown
可用的设计风格分类：

**后台/工具类（productivity）**：Linear、Notion、Superhuman、Miro、Zapier、Slack、Cal.com、Intercom
**消费者端（consumer）**：Airbnb、Nike、Shopify、Starbucks、Uber、Spotify、Pinterest
**金融类（fintech）**：Stripe、Wise、Revolut、Binance、Coinbase、Kraken、Mastercard
**开发者工具（developer）**：Cursor、Vercel、Supabase、Warp、Expo、Raycast、Sentry、PostHog 等
**AI 平台（ai）**：Claude、OpenCode、xAI、Cohere、Mistral、VoltAgent 等
**设计工具（design）**：Figma、Framer、Webflow、Airtable、Clay
**汽车品牌（automotive）**：BMW、Ferrari、Lamborghini、Tesla、Bugatti
**媒体/消费电子（media）**：Apple、NVIDIA、SpaceX、PlayStation、The Verge

请选择一个风格名称，或告诉我想要的视觉方向（如"暗色极简"、"温暖友好"），我来推荐。
```

2. 用户选定后，调用 MCP 工具 `get_design_tokens(name)` 获取精简设计 tokens
3. 将 tokens 记录到 `state.md` 中（字段：`designStyle`）
4. 后续步骤 4 制作 HTML 时，使用 tokens 中的配色、字体、圆角替代默认样式

**用户选择"使用默认风格"或跳过时**：使用本文件中定义的默认样式模板，不调用 awesome-design MCP。

### 步骤 2：确定涉及的端

基于需求文档分析，确定本次需求涉及哪些端：
- 平台运营后台（PC）
- 商户 PC 后台
- 商户 APP
- 用户 APP / 小程序
- 其他（根据项目实际情况）

### 步骤 3：页面清单规划

**对每个端**，列出需要制作的页面：

1. **读取现有前端代码**（存量项目）：
   - 扫描路由文件，了解现有页面结构
   - 扫描相关组件，了解现有页面布局
   - 判断每个需求功能点对应的页面是"完全新增"还是"在现有页面上局部改造"

2. **新项目**：
   - 不需要读取现有代码
   - 所有页面都标记为"新增页面"
   - 重点放在页面结构和字段完整性上

3. **需要主动问用户的信息**（如果从需求文档中无法确定）：

| 缺失信息 | 为什么需要问 |
|---------|------------|
| 现有页面的实际布局 | 决定是新增还是局部改造 |
| 不同状态下的页面差异 | 决定需要做几个页面还是用条件表格 |
| 操作权限（谁能看/谁能改） | 决定页面上有没有操作按钮 |
| 字段在不同类型下是否相同 | 决定是否需要分开做多个页面 |

4. **输出页面清单表格**：

```markdown
## [端名称] 页面清单

| 序号 | 页面名称 | 类型 | 改造基础 | 说明 |
|------|---------|------|---------|------|
| 1 | 联票规则列表 | 新增页面 | — | 新建独立页面 |
| 2 | 订单列表 | 局部改动 | `views/order/index.vue` | 增加门票类型筛选 |
| 3 | 核销确认 | 新增弹窗 | — | 在订单详情中触发 |
```

5. **类型标签定义**：
   - `新增页面`：现有系统中不存在，完全新建
   - `局部改动`：在现有页面基础上增加/修改部分内容
   - `新增弹窗`：新增的弹窗/对话框/抽屉

6. **提交用户确认**：页面清单必须经用户确认后才能开始制作

### 步骤 4：逐端制作 HTML

**按端拆分文件**，每端一个 HTML 文件。

#### 文件命名规范
```
ui-mock/
├── platform-admin.html    # 平台运营后台
├── merchant-pc.html       # 商户PC后台
├── merchant-app.html      # 商户APP
├── user-app.html          # 用户APP/小程序
└── [其他端].html          # 按实际情况
```

#### HTML 整体结构
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[功能名称] - [端名称] UI Mock</title>
  <!-- PC端：引入实际使用的UI框架CSS -->
  <link rel="stylesheet" href="https://unpkg.com/element-ui@2.15.8/lib/theme-chalk/index.css">
  <!-- Mock 专用样式：通用样式 + 对应端专用样式（见文末「样式模板」） -->
  <style>/* 通用样式 + PC专用 或 APP专用，使用 mock-/phone- 前缀避免冲突 */</style>
</head>
<body>
  <!-- 顶部标题栏（sticky固定） -->
  <div class="mock-header">
    <h1>📋 [端名称] — [功能名称] UI Mock</h1>
    <p>涉及页面：[页面列表概要]</p>
  </div>
  <!-- 内容容器：flex-wrap 自动排列 -->
  <div class="mock-container">
    <!-- 页面卡片 -->
  </div>
</body>
</html>
```

#### 页面卡片结构（mock-box）— PC 端
```html
<div class="mock-box">
  <!-- 标题栏：页面名称 + 类型标签 -->
  <div class="mock-box-title">
    <span>页面名称</span>
    <span class="tag">新增页面</span>
  </div>
  <!-- 页面内容区：使用实际UI框架的class模拟真实页面 -->
  <div class="mock-box-body">
    <!-- 模拟的页面内容 -->
  </div>
  <!-- 业务说明区：紧跟在页面内容下方 -->
  <div class="mock-box-desc">
    <h4>业务说明</h4>
    <ul>
      <li><b>改造基础</b>：<code>现有代码路径</code></li>
      <li><b>改动点</b>：<span class="hl">高亮标注新增内容</span></li>
      <li><b>关键规则</b>：<span class="dg">危险标注限制性规则</span></li>
    </ul>
  </div>
</div>
```

#### 页面卡片结构 — APP 端（手机模拟器）
```html
<div class="mock-box">
  <div class="mock-box-title">
    <span>页面名称</span>
    <span class="tag">新增页面</span>
  </div>
  <div class="mock-box-body">
    <!-- 手机模拟器 -->
    <div class="phone-bar"><span>9:41</span></div>
    <div class="phone-nav"><span class="back">‹</span>导航标题</div>
    <div class="phone-body">
      <!-- 页面内容（高度约480px，overflow:auto） -->
    </div>
    <!-- 固定底部栏（如有）放在 phone-body 外面 -->
  </div>
  <div class="mock-box-desc">
    <h4>业务说明</h4>
    <ul>...</ul>
  </div>
</div>
```

#### 尺寸规范
| 端 | mock-box 宽度 | 内容区高度 | 说明 |
|----|--------------|-----------|------|
| PC 后台 | `min-width:700px; flex:1` | 自适应 | 一排最多2个，自动换行 |
| APP | `width:280px` 固定 | phone-body 约 480px | flex-wrap 自动排列 |

#### 容器布局规则
- 容器用 `display:flex; flex-wrap:wrap; gap:20px; align-items:flex-start`
- 不固定一排几个，由浏览器窗口宽度决定
- 全宽元素（如条件差异表格）用 `width:100%` 的 `mock-full` class

### 步骤 5：内容制作规则

#### 5.1 页面内容规则
- **页面展示的是最终用户/运营看到的样子**，不是开发文档
- 开发逻辑、校验规则、提示文字写在业务说明中，不出现在页面上
- 示例数据要合理（金额、日期、名称都像真实数据）

#### 5.2 局部改动的标记方式
- 仅在"局部改动"类型的页面中使用
- "新增页面"类型不需要内部标记（整个页面都是新的）
- 新增字段/区块用橙色边框包裹 + 右上角"新增"小标签：
```html
<th style="border:2px solid #e6a23c;position:relative">
  <span style="position:absolute;top:-9px;right:2px;background:#e6a23c;color:#fff;font-size:9px;padding:0 3px;border-radius:2px;line-height:14px">新增</span>
  字段名
</th>
```

#### 5.3 多状态/多类型页面的处理
- **不要**为每种类型做独立的完整页面
- **应该**做"组件库"（展示所有可能的 UI 区块样式）+ "条件差异表格"（标注每个状态/类型下使用哪些组件）
- 条件差异表格用 `mock-full` class 占满一行：
```html
<div class="mock-full">
  <h4>条件差异表</h4>
  <table>
    <tr><th>区块/字段</th><th>类型A</th><th>类型B</th><th>类型C</th></tr>
    <tr><td>某字段</td><td>显示</td><td>不显示</td><td>显示（文案不同）</td></tr>
  </table>
</div>
```

#### 5.4 业务说明必须包含的信息
| 信息 | 说明 | 何时必须 | 示例 |
|------|------|---------|------|
| 改造基础 | 现有代码文件路径 | 局部改动时必须 | `现有 PingTaiDuan/src/views/mall/order/index.vue` |
| 改动点 | 具体新增/修改了什么 | 始终必须 | 搜索栏增加"门票类型"下拉 |
| 关键规则 | 影响开发实现的业务规则 | 有规则时必须 | 规则使用后不可修改/删除 |
| 与其他端的区别 | 同一功能在不同端的差异 | 多端时必须 | 平台端仅查看，商户端有操作按钮 |

#### 5.5 高亮标记
- `.hl`（橙色 #e6a23c）：标注新增的内容、需要注意的改动点
- `.dg`（红色 #f56c6c）：标注限制性规则、不可操作的约束

### 步骤 6：精简优化

逐端制作完成后，执行精简优化：

1. **识别重复页面**：检查是否有多个页面结构几乎一致、只有个别字段不同
2. **合并为模板+条件表格**：保留1个模板页面，用 `mock-full` 条件差异表格标注差异
3. **检查页面数量合理性**：如果某端页面超过 10 个，考虑是否有可以合并的

### 步骤 7：用户审核

制作完成后，提交用户逐页审核：
1. 告知用户 HTML 文件已生成，可在浏览器中打开查看
2. 等待用户反馈
3. 根据反馈修正具体页面
4. 修正后再次提交确认

### 步骤 8：交叉审核（6 维度自检）

所有页面制作完成并经用户初步确认后，执行交叉审核：

| 维度 | 检查内容 | 检查方法 |
|------|---------|---------|
| A. 需求来源验证 | 每个页面/功能是否有需求文档中的明确来源？ | 逐页对照需求文档 FR 列表 |
| B. 现有系统复用 | 是否应该复用现有页面而非新建？ | 对照逆向工程产物/现有代码 |
| C. 状态完整性 | 所有业务状态是否都有 UI 展示？ | 检查状态机中每个状态的页面覆盖 |
| D. 多端一致性 | 一端产生的数据另一端能看到吗？ | 跨端数据流追踪 |
| E. 页面vs逻辑分离 | 页面只展示用户看到的，逻辑在业务说明中？ | 检查页面内容是否混入开发逻辑 |
| F. 操作路径闭环 | 用户从入口到结束每步都有页面承接？ | 按用户操作路径走一遍 |

**审核结果处理**：
- 发现问题 → 修正对应页面 → 更新业务说明
- 所有维度通过后，标记 UI Mock 完成

### 步骤 9：更新状态跟踪

更新 `docs/aidlc/state.md` 标记 UI Mock 完成。

### 步骤 10：展示完成消息

```markdown
# 🎨 UI Mock 完成

> **📋 <u>**需要审查：**</u>**
> 请在浏览器中打开以下文件查看 UI Mock：
> [列出生成的 HTML 文件路径]

> **🚀 Boss，<u>**下一步？**</u>**
>
> 🔧 **请求修改** - 指出需要修正的页面
> ✅ **确认并继续** - 确认 UI Mock，进入**UI Mock 交叉验证**
> 📋 **新 Session 继续** - 复制 `state.md` 中的交接提示词到新对话继续

---

> **💡 下一步执行提示词**（可直接复制使用）：
> ```
> 确认 UI Mock，执行 UI Mock 交叉验证审查
> ```
```

在用户明确确认前不得继续。

---

## 产出物

| 产出物 | 路径 | 说明 |
|--------|------|------|
| UI Mock HTML 文件 | `docs/aidlc/inception/ui-mock/[端名称].html` | 按端拆分 |
| 页面清单（嵌入 HTML header） | 每个 HTML 文件的 `<p>` 标签中 | 涉及页面列表 |

**多模块模式路径**：`docs/aidlc/modules/{module-name}/inception/ui-mock/`

---

## 踩坑规避规则（强制）

以下规则来自实践中的踩坑总结，必须遵守：

### 结构与布局
1. **页面和说明不分离**：每个 mock-box 内部包含 body + desc，形成自包含单元。禁止"页面一排、说明另一排"的布局。
2. **flex-wrap 自动排列**：不固定一排几个，由浏览器窗口宽度决定。
3. **引入实际 UI 框架 CSS**：PC 端引入 Element UI CDN CSS 使用真实 class name，不要用自定义 CSS 模拟。如选择了设计风格，可不引入 UI 框架 CSS，改用 design tokens 生成的自定义样式。
4. **Mock 专用 class 加前缀**：使用 `mock-`、`phone-` 等前缀，避免与引入的 UI 框架 CSS class 冲突。
5. **底部固定栏放在滚动容器外面**：APP 端的底部操作栏放在 phone-body 外面，避免跟随滚动。
6. **手机框不加圆角**：标题栏和手机框之间不要有圆角间隙。

### 内容准确性
7. **先读代码再决定类型**：必须先读现有前端代码，确认页面结构后再决定是"新增"还是"局部改动"。不要假设。
8. **多关联实体必须展示完整**：如联票=多景区，每个页面必须展示所有关联实体，不能只写1个。
9. **权限核对**：每个页面画完后核对权限矩阵——这个端能操作吗？只能查看的端不要加操作按钮。
10. **不重复做页面**：同一模板只有个别字段不同时，用1个模板+条件差异表格，不做多个独立页面。

### 内容分离
11. **页面只展示用户看到的**：开发逻辑（校验规则、触发条件、后端处理）写在业务说明中，不出现在页面 Mock 上。
12. **"新增页面"内部不做新增标记**：只有"局部改动"才用橙色边框标记新增部分。

### AI 执行层面
13. **大文件分段处理**：HTML 文件内容较长时，不要一次性替换全部内容（会超出输出限制）。应分段制作，或使用子 Agent 处理单个端的文件。
14. **先做结构再填内容**：先创建 HTML 骨架（所有 mock-box 的标题和空 body），确认结构正确后再逐个填充页面内容。

---

## 关联规范文件

> **按需加载**：以下文件提供 UI Mock 的细化规范，按场景自动或手动加载。

| 文件 | 触发方式 | 职责 |
|------|---------|------|
| `inception-ui-mock-styles.md` | 制作 HTML 时手动加载 | CSS 样式模板 |
| `inception-ui-mock-design-spec.md` | fileMatch: `**/*.html` | 设计规范：条件表生成、交互模式映射、表单联动、空状态 |
| `inception-ui-mock-reasoning-principles.md` | fileMatch: `**/*.html` | 推导原则：三层分离、内容决策、自检清单 |
| `inception-ui-mock-workflow.md` | manual inclusion | 两阶段工作流：骨架确认 → 内容填充（复杂项目推荐） |

---

## 样式模板

> **加载模板**：制作 HTML Mock 时，加载 `inception-ui-mock-styles.md` 获取完整的 CSS 样式模板。

**使用规则**：
- PC 端 HTML：引入**通用** + **PC 专用**样式
- APP 端 HTML：引入**通用** + **APP 专用**样式
- Mock 专用 class 加 `mock-`、`phone-` 前缀避免与 UI 框架冲突
- PC 端额外引入 Element UI CDN CSS 使用真实 class name

---

## 与 awesome-design MCP 的集成（设计风格应用）

当用户在步骤 1 中选择了设计风格时，按以下规则应用到 HTML Mock：

### 配色应用规则

从 `get_design_tokens` 返回的 `colors` 对象中提取颜色，映射到 Mock CSS 变量：

| Design Token | Mock 中的用途 |
|-------------|--------------|
| `colors.primary` | 主操作按钮背景、链接颜色、强调色 |
| `colors.canvas` / `colors.background` | 页面背景色 |
| `colors.surface-1` / `colors.surface` | 卡片和容器背景 |
| `colors.ink` / `colors.text` | 正文文字颜色 |
| `colors.ink-muted` / `colors.textSecondary` | 次要文字颜色 |
| `colors.hairline` / `colors.border` | 边框和分割线 |

### 字体应用规则

- 优先使用 tokens 中的 `typography.fontFamilies`
- 如果是私有字体（如 Linear Display），使用文档中建议的替代字体（如 Inter）
- 字体权重和字号遵循 tokens 定义的层级

### 圆角应用规则

- 按钮圆角：使用 `rounded.md` 或 `rounded.sm`
- 卡片圆角：使用 `rounded.lg`
- 输入框圆角：使用 `rounded.md`

### CSS 变量注入方式

在 HTML `<style>` 的 `:root` 中定义变量，Mock 样式引用这些变量：

```css
:root {
  /* 来自 awesome-design tokens */
  --mock-primary: #5e6ad2;        /* colors.primary */
  --mock-bg: #010102;             /* colors.canvas */
  --mock-surface: #0f1011;        /* colors.surface-1 */
  --mock-text: #f7f8f8;           /* colors.ink */
  --mock-text-muted: #8a8f98;     /* colors.ink-subtle */
  --mock-border: #23252a;         /* colors.hairline */
  --mock-radius-sm: 6px;          /* rounded.sm */
  --mock-radius-md: 8px;          /* rounded.md */
  --mock-radius-lg: 12px;         /* rounded.lg */
  --mock-font: Inter, -apple-system, sans-serif;
}
```

### 降级规则

- MCP 不可用时：使用 `inception-ui-mock-styles.md` 中的默认样式
- tokens 字段缺失时：缺失的字段使用默认值（Element UI / Ant Design 配色）
- 存量项目：始终以现有代码中的实际框架样式为准，不使用 design tokens

### state.md 记录

选择设计风格后，在 `state.md` 中记录：
```yaml
designStyle:
  name: "linear.app"
  source: "awesome-design MCP"
  appliedTokens: ["colors", "typography", "rounded"]
```

---

## 适用场景与局限

### 适合的场景
1. **外包项目的需求交接**：让开发团队快速理解要做什么
2. **在现有系统上做增量功能**：能清晰标注"改哪里、改什么"
3. **多端同步开发**：一次性展示所有端的页面，保持一致性
4. **AI 辅助开发的输入**：结构化的 HTML 比设计图更容易被 AI 解析

### 不适合的场景（应跳过 UI Mock，使用其他方式）
1. **需要精确视觉还原**：应该用 Figma
2. **复杂交互动效**：HTML Mock 无法展示动画、手势等
3. **全新产品从 0 设计且无任何参考**：可通过 awesome-design MCP 选择一个品牌风格作为参考起点
4. **用户测试/可用性验证**：需要可交互的高保真原型
