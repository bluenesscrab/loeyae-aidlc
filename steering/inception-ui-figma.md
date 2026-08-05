# UI 设计 — Figma 模式

**角色**：产品经理 / UI 设计师

**目的**：基于已完成的需求文档，通过 Figma MCP Server 在 Figma 中创建原生设计稿，用于需求交接、设计协作和多端开发对齐。

## 前置条件

- 需求分析必须完成
- 需求文档已完成
- 用户故事已完成
- 用户故事交叉验证（I8）必须通过
- 工作区检测已完成（已知涉及的端和现有代码位置）
- Figma MCP Server 已配置（`mcp.json` 中存在 `figma` server）

---

## 适用场景

- 团队已使用 Figma 作为设计工具
- 需要高保真视觉设计交付
- 需要设计师与开发者在 Figma 中协作
- 需要可交互原型（Prototype）
- 需要 Dev Mode 标注和资产导出

## 不适用场景（应选择 HTML Mock 模式）

- 团队无 Figma 账号或 seat 不满足（需 Dev/Full Seat）
- 纯内部快速验证，不需要设计协作
- 离线环境
- 简单改动，HTML Mock 足够

---

## 执行步骤

### 步骤 0：确认 Figma 来源并初始化状态

根据 I9 入口选择确定来源：

- `流程创建`：执行步骤 1-8，由流程创建唯一主 Figma 文件
- `外部提供`：用户提供目标 Figma 文件链接；执行步骤 1 后调用 `get_metadata` 验证访问权限并获取顶层 Page 列表，验证成功后直接使用该文件，不调用 `create_new_file`

路由确定后立即在 state.md 初始化：

```markdown
- **UI 设计方式**：figma
- **Figma 来源**：{流程创建/外部提供}
- **产物位置**：{待创建/用户提供的 URL}
- **设计状态**：selected
- **当前批次**：1
- **下一操作**：执行 Figma 身份与能力确认
```

外部文件验证失败时不得记录为“跳过”；应提示用户更正链接/权限，或经用户确认切换 HTML Mock。

### 步骤 1：环境、身份与能力确认

1. 调用 `whoami` 确认认证状态和 seat 类型
2. **检查结果**：
   - 未认证 → MCP client 触发 OAuth 流程，引导用户在浏览器中授权后重新调用 `whoami`
   - Starter/Collab seat（低调用额度）→ 提示限制，由用户选择继续或回退 HTML Mock
   - Dev/Full Seat → 继续
   - 客户端不支持官方 Figma Remote MCP，或 `whoami` 不可用 → 阻断 Figma 模式，提供切换到受支持客户端或 HTML Mock 两个选项
3. `whoami` 成功仅代表认证通过；首次使用该客户端的写入路径时，必须在正式设计前完成最小写入验证。`外部提供`且只读消费设计时可跳过写入验证。
4. `外部提供`路径必须对用户提供的文件调用 `get_metadata`，验证访问权限并取得顶层 Page 列表；成功后立即将 `设计状态` 更新为 `file_created`，失败时按步骤 0 处理。

### 步骤 2：设计资源准备

**执行条件**：仅 `流程创建`。`外部提供`以现有文件为正式设计基准，不重新选择设计系统或写入设计资源，直接进入步骤 3。

1. **询问用户是否有已有设计系统**：

```markdown
Boss，确认一下 Figma 设计资源：

- 🎨 **使用团队设计系统** — 我将搜索并复用你们已有的 Figma 组件库和变量
- 🆕 **从零创建** — 我将为本项目建立基础设计变量（配色、间距、字体）
- 📋 **提供参考文件** — 给我一个 Figma 文件链接作为风格参考
```

2. **用户选择"使用团队设计系统"时**：
   - 调用 `get_libraries` 查看可用设计库
   - 调用 `search_design_system` 搜索相关组件（按钮、表单、卡片、导航等）
   - 记录可复用组件清单

3. **用户选择"从零创建"时**：
   - 可选：调用 awesome-design MCP 的 `get_design_tokens` 获取品牌风格 tokens
   - 将 tokens 映射为 Figma Variables（在步骤 4 中通过 `use_figma` 创建）

4. **用户选择"提供参考文件"时**：
   - 对参考文件调用 `get_metadata` + `get_variable_defs` 提取设计规范
   - 记录配色、字体、间距、圆角等关键参数

### 步骤 3：确定涉及的端与页面清单

**复用 `inception-ui-mock.md` 步骤 2-3 的逻辑**：

1. 确定本次需求涉及哪些端（PC 后台 / 商户 APP / 用户 APP 等）
2. 列出每端的页面清单（新增页面 / 局部改动 / 新增弹窗）
3. 提交用户确认

**页面清单表格格式同 HTML Mock 模式**。

### 步骤 4：准备唯一主 Figma 文件与页面结构

1. **准备唯一主文件**：
   - `流程创建`：调用 `create_new_file` 创建 `[项目名称] UI Design`，成功后立即把返回链接写入 state.md，并将 `设计状态` 更新为 `file_created`
   - `外部提供`：使用步骤 1 已验证的文件链接，不创建新文件；保留 `设计状态: file_created`
   - 一个 AI-DLC 项目只能有一个主 Figma 文件，禁止按模块创建多个文件

2. **建立 Page / Frame 结构与登记**：
   - `流程创建`：通过 `use_figma` 创建所需结构
   - `外部提供`：通过 `get_metadata` 定位已有 Page 和 Frame，并通过 `get_screenshot` 验证页面；将页面名、nodeId、`completed` 状态及截图结果写入 state.md。缺少计划页面或无法定位时阻断并请用户更正文件或由设计方补齐，不得由流程静默写入
   - 单模块项目按端使用 Page，如 `platform-admin`、`user-app`
   - 多模块项目按 `{module}-{endpoint}` 使用 Page，如 `order-platform-admin`、`member-user-app`
   - 每个页面对应一个顶层 Frame；登记后立即更新 state.md 的 `Figma 页面进度`

3. **设置设计变量**（仅 `流程创建`，且步骤 2 中确定了设计系统）：
   - 通过 `use_figma` 创建 Variable Collection
   - 设置 Color、Spacing、Typography 变量

4. **Frame 尺寸规范**：

| 端 | Frame 宽度 | 说明 |
|----|-----------|------|
| PC 后台 | 1440px | Desktop 标准 |
| 平板 | 768px | iPad 竖屏 |
| 手机 APP | 375px | iPhone 标准 |
| 小程序 | 375px | 同手机 |

### 步骤 5：逐页设计

**执行条件**：仅 `流程创建`。`外部提供`在步骤 4 完成页面登记和截图验证后直接进入步骤 6，不调用 `use_figma`。

对每个页面，按以下顺序通过 `use_figma` 设计：

1. **页面骨架**：
   - 创建顶层 Frame，设置 Auto Layout（垂直方向）
   - 添加导航栏 / 顶部栏
   - 划分内容区域

2. **内容填充**：
   - 添加组件实例（如有设计系统：复用搜索到的组件）
   - 添加表单字段、表格列、操作按钮
   - 填入合理的示例数据

3. **状态与交互**：
   - 多状态页面使用 Variants 或并列 Frame 表达
   - 弹窗/抽屉作为独立 Frame 放置在对应页面旁

4. **标注说明**：
   - 对需要特别说明的区域添加 Annotation
   - 局部改动页面标注改动范围

5. **自检与增量状态**：
   - 每完成 3-5 个页面，调用 `get_screenshot` 视觉检查
   - 确认布局合理、对齐正确、内容完整
   - 每个页面验证后立即把对应行更新为 `completed`，记录验证结果
   - 更新 `当前批次` 和 `下一操作`；不得依赖对话记忆保存进度

### 步骤 6：阶段性提交审核

**分批提交**（避免做完全部才发现方向偏差）：

1. 第一批完成后（通常是核心流程的 3-5 个关键页面）提交审核：

```markdown
Boss，第一批核心页面已完成设计：

📎 Figma 文件链接：[链接]

已完成的页面：
- [端名称] / [页面名称]
- ...

请在 Figma 中查看，可直接在设计稿上添加评论。

- ✅ **方向正确，继续** — 我将完成剩余页面
- 🔧 **需要调整** — 请告诉我需要修改的内容
- 🔄 **风格方向不对** — 我们重新讨论设计方向
```

2. 提交审核前将 `设计状态` 更新为 `review_pending`，`下一操作` 写为“等待用户审核第 {N} 批页面”；`外部提供`路径将已登记并完成截图验证的页面作为首批提交
3. 根据反馈调整时：
   - `流程创建`：将 `设计状态` 改回 `designing`，更新待修改页面行后继续剩余页面
   - `外部提供`：记录待调整项并请用户或设计方更新原文件；更新后重新执行 `get_metadata`、`get_variable_defs`、`get_screenshot` 并刷新页面进度，不得由流程调用 `use_figma` 修改
4. 全部完成后进行整体审核

### 步骤 7：整体审核与完善

全部页面完成后：

1. 提供完整文件链接，请用户整体审核
2. 根据反馈处理：`流程创建`通过 `use_figma` 修改；`外部提供`由用户或设计方更新原文件后重新验证，不调用写入工具
3. 如需导出资产（图标、配图），通过 `download_assets` 准备

### 步骤 8：交叉审核（6 维度自检）

复用 `inception-cross-validation.md`（e）的审查维度，适配 Figma 模式：

| 维度 | 检查内容 | 检查方法 |
|------|---------|---------|
| A. 需求来源验证 | 每个页面是否有需求文档中的明确来源 | 逐页对照需求文档 FR 列表 |
| B. 现有系统复用 | 是否复用了团队设计系统组件 | 检查 Component 使用情况 |
| C. 状态完整性 | 所有业务状态是否都有 UI 展示 | 检查状态机覆盖 |
| D. 多端一致性 | 多端数据流是否闭环 | 跨端数据追踪 |
| E. 设计规范一致性 | Variables 和 Components 使用是否一致 | 按 `inception-cross-validation.md`（e）的 Figma 证据表逐 Frame 记录，不使用百分比估算 |
| F. 操作路径闭环 | 用户操作路径是否有页面承接 | 按用户流程走查 |

### 步骤 9：确认状态可恢复

I9 完成时核对 `docs/aidlc/state.md` 的 `## UI 设计（I9 条件）` 区块：

```markdown
- **UI 设计方式**：figma
- **Figma 来源**：{流程创建/外部提供}
- **产物位置**：{唯一主 Figma 文件链接}
- **设计状态**：review_pending
- **当前批次**：{最后批次号}
- **下一操作**：执行 I10 UI 设计交叉验证
- **涉及端**：{端名称列表}
- **页面数**：{数量}
- **设计风格**：{团队设计系统名/自建}
- **风格来源**：{Figma 团队库/参考文件/不适用}
```

同时确认 `Figma 页面进度` 中所有计划页面均有唯一 nodeId 且状态为 `completed`。I10 通过后由 `inception-cross-validation.md` 将 `设计状态` 更新为 `approved`。

`UI 设计方式: figma` 是 Construction 阶段加载 `common-figma-design-standards.md` 和选择 Figma 版页面对照表格式的判定依据，必须写入。

### 步骤 10：展示完成消息

```markdown
# 🎨 UI 设计完成（Figma 模式）

> **📋 <u>需要审查：</u>**
> Figma 文件链接：[链接]
>
> 设计概要：
> - [端1]：[N] 个页面
> - [端2]：[M] 个页面
> - 使用设计系统：[名称]

> **🚀 Boss，<u>下一步？</u>**
>
> 🔧 **请求修改** — 在 Figma 中评论或告诉我需要修正的页面
> ✅ **确认并继续** — 确认设计，进入**UI 设计交叉验证**
> 📋 **新 Session 继续** — 复制 `state.md` 中的交接提示词到新对话继续

---

> **💡 下一步执行提示词**（可直接复制使用）：
> ```
> 确认 UI 设计，执行 UI 设计交叉验证审查
> ```
```

在用户明确确认前不得继续。

---

## 产出物

| 产出物 | 位置 | 说明 |
|--------|------|------|
| Figma 设计文件 | Figma 云端（用户 Drafts） | 包含所有端的完整页面设计 |
| 文件链接 | `state.md` 中记录 | 用于后续 Construction 阶段引用 |

**多模块模式**：整个 AI-DLC 项目使用一个主 Figma 文件；按 `{module}-{endpoint}` 创建 Page 分隔模块和端，禁止为每个模块创建独立文件。

---

## 与 Construction 阶段的衔接

Figma 模式产出的设计稿在 Construction 阶段通过以下方式使用：

1. **`get_design_context`** — 获取选中 frame 的结构化代码表达（默认 React + Tailwind，可定制）
2. **`get_variable_defs`** — 提取设计变量，确保代码使用正确的 token
3. **`get_screenshot`** — 视觉参考，用于实现后的对比验证
4. **`get_code_connect_map`** — 如果建立了 Code Connect，直接映射到代码组件

---

## Figma MCP 工具速查

| 工具 | 用途 | 本流程使用阶段 |
|------|------|---------------|
| `whoami` | 确认身份和 seat | 步骤 1 |
| `create_new_file` | 创建新 Figma 文件 | 步骤 4 |
| `use_figma` | 创建/编辑设计内容（核心工具） | 步骤 4-7 |
| `get_libraries` | 查看可用设计库 | 步骤 2 |
| `search_design_system` | 搜索组件/变量/样式 | 步骤 2、5 |
| `upload_assets` | 上传图片/图标 | 步骤 5 |
| `get_screenshot` | 截图自检 | 步骤 5 |
| `get_metadata` | 获取节点结构概览 | 步骤 2（参考文件） |
| `get_variable_defs` | 提取变量定义 | 步骤 2（参考文件） |
| `download_assets` | 导出资产 | 步骤 7 |

---

## 注意事项

### Beta 状态

- `use_figma`（Write to Canvas）目前为 Beta，免费使用中，未来可能收费
- 如遇到工具不可用或能力限制，回退到 HTML Mock 模式

### 速率限制

- Dev/Full Seat：按分钟限流（同 Figma REST API Tier 1）
- 大型项目分批设计，避免密集调用
- 单次 `use_figma` 调用尽量包含多个操作，减少调用次数

### 设计质量保障

- 始终使用 Auto Layout，不使用绝对定位
- 使用 Variables 而非硬编码值
- 组件化：重复出现的 UI 模式封装为 Component
- 命名语义化（如 `HeaderNav`、`OrderListItem`，不用 `Frame 1`、`Group 5`）
- 每批次完成后 `get_screenshot` 自检

### 回退机制

以下情况自动回退到 HTML Mock 模式：
- `whoami` 显示 seat 不满足
- `use_figma` 连续失败 3 次
- 用户明确要求切换

回退时告知用户原因，加载 `inception-ui-mock.md` 继续执行。
