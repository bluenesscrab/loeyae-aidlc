# Figma 设计稿还原规范

## 核心原则

**设计稿是前端布局和样式的唯一真相来源。** design.md 中的布局描述仅作参考，有冲突时以 Figma 设计稿为准。design.md 不应重复描述 Figma 中已精确定义的视觉信息（gap、padding、font、color），而应聚焦技术架构和非视觉逻辑。

## 1. Figma 还原开发流程

### 1.1 自顶向下逐层解析

```
Step 1: 根节点 → 提取 background, gap, padding, width
Step 2: 一级子节点 → 提取 layout mode, sizing(fill/hug/fixed), borderRadius, fills
Step 3: 逐层深入 → 直到叶子节点的 textStyle 和 fills
Step 4: 检查节点间关系 → sizing:fill 对应 flex:1, sizing:hug 对应 width:auto
```

**绝不跳过任何层级。** 父容器的 background-color 和 gap 是区块间距的视觉来源，遗漏会导致间距"消失"。

### 1.2 截图占位处理

当检测到 Figma 节点内部只有 IMAGE/RECTANGLE 类型子节点，且 layout mode 为 `none` 时：

1. 标记为"截图占位"
2. **立即下载截图**进行视觉分析
3. 从截图中推断布局结构
4. 如果无法确定，请求用户确认

### 1.3 整体→局部→整体

```
1. 先搭建主页面骨架 → 所有容器的 layout 属性（bg, gap, padding, borderRadius）
2. 再开发各子组件 → 从 Figma 提取每个组件的内部结构
3. 每个子组件完成后 → 回到主页面验证整体效果
4. 最终整体对比 → 逐区块检查与设计稿的一致性
```

### 1.4 关键属性检查清单

每个组件开发完成后，对照此清单检查：

- [ ] 父容器 `background-color` 是否设置
- [ ] 父容器 `gap` 值是否正确
- [ ] 子节点 `sizing: fill` → CSS `flex: 1; min-width: 0`
- [ ] 子节点 `sizing: hug` → CSS `width: auto` 或 `flex-shrink: 0`
- [ ] 子节点 `sizing: fixed` → CSS `width: Xpx; height: Xpx`
- [ ] `borderRadius` 设置在正确的层级（不依赖父容器 overflow 裁剪）
- [ ] 文字节点: fontFamily, fontWeight, fontSize, lineHeight, color 全部从 Figma 提取
- [ ] Element Plus 组件样式覆盖使用 `:deep()` 选择器
- [ ] 组件在主页面中的 flex 属性（sizing:fill 的节点需要 `flex: 1`）

## 2. Figma MCP 使用规范

### 2.1 数据获取策略

| 场景 | depth | 说明 |
|------|-------|------|
| 页面整体结构 | 2-3 | 了解区块划分和容器关系 |
| 组件内部结构 | 4-6 | 提取完整的节点树和样式 |
| 文字样式确认 | 5-6 | 确保能看到 textStyle 和 fills |

### 2.2 关键数据提取

```
从 globalVars.styles 中提取:
- layout_*: mode, gap, padding, alignItems, justifyContent, sizing
- fill_*: 背景色/文字色
- style_*: fontFamily, fontWeight, fontSize, lineHeight, textAlignHorizontal

从 nodes 中提取:
- borderRadius: 圆角值
- fills: 背景色引用
- textStyle + fills: 文字样式 + 颜色
- componentProperties: 组件实例的实际值（如 Badge 的 value）
```

### 2.3 sizing 到 CSS 的映射

| Figma sizing | CSS |
|-------------|-----|
| `horizontal: fill` | `flex: 1; min-width: 0` |
| `horizontal: hug` | `width: auto` 或 `flex-shrink: 0` |
| `horizontal: fixed, width: X` | `width: Xpx` |
| `vertical: fill` | `flex: 1; min-height: 0`（column 布局）或 `align-self: stretch` |
| `vertical: hug` | `height: auto` |
| `vertical: fixed, height: X` | `height: Xpx` |

## 3. Element Plus 组件还原规范

### 3.1 Figma Component 到 Element Plus 的映射

当 Figma 节点的 `type` 为 `INSTANCE` 且 `componentId` 指向已知的 Element Plus 组件时，直接映射为对应的 `<el-xxx>` 组件，`componentProperties` 映射为 props：

```
Figma componentProperties → Element Plus props:
- Button: value→slot内容, type→type, style=text→link, size→size, plain→plain, round→round
- Tag: type→type, effect→effect, round→round, size→size, closable→closable
- Badge: type→type, dot=on→is-dot, value→value
- Progress: type→type, format=true→show-text, %=30→:percentage="30"
```

### 3.2 Figma 组件与前端组件的结构差异

Figma 中的组件是纯视觉的，不包含交互行为。以下场景会导致前端组件结构与 Figma 不一致，需要特别注意布局处理：

| Figma 表现 | 前端实际结构 | 布局影响 |
|-----------|-------------|---------|
| Button（带下拉菜单语义） | `el-dropdown > el-button` | dropdown 包裹层不继承 flex:1，需对 `.el-dropdown` 也设置 flex:1 |
| Button（带弹出确认框） | `el-popconfirm > el-button` | 同上，popconfirm 包裹层需处理 |
| Input（带搜索建议） | `el-autocomplete`（非 el-input） | 组件根元素不同，宽度行为不同 |
| Select（带远程搜索） | `el-select-v2` | 组件 class 不同 |

**规则**：当 Figma 中多个 Button 实例并排且 `sizing: fill` 时，检查前端是否有按钮需要被 dropdown/popconfirm/tooltip 等包裹。如果有，必须对包裹容器也设置 `flex: 1; min-width: 0`，确保与设计稿等宽。

### 3.3 Element Plus 样式覆盖规则

- 对 Element Plus 组件的样式覆盖**必须**使用 `:deep()` 选择器（Vue scoped 样式不穿透子组件）
- 优先使用 Element Plus 的 props 控制样式（type、size、effect），避免直接覆盖 CSS
- 设计稿中的自定义颜色（如 #6E6CF5 不在 Element Plus 预设中）使用 `color` prop 或 `style` 绑定

```vue
<!-- ✅ 正确：使用 props -->
<el-tag type="warning" effect="plain" round>股权基金</el-tag>

<!-- ✅ 正确：自定义颜色用 color prop 或 style -->
<el-tag :color="'#6E6CF5'" style="border-color: #6E6CF5; color: #fff;" round>项目储备</el-tag>

<!-- ✅ 正确：样式覆盖用 :deep() -->
<style scoped>
:deep(.el-avatar) { border-radius: 100px; }
</style>

<!-- ❌ 错误：scoped 中直接写子组件类名 -->
<style scoped>
.el-avatar { border-radius: 100px; }  /* 不生效 */
</style>
```

### 3.3 Element Plus 颜色体系

设计稿中的颜色值与 Element Plus CSS 变量的对应关系：

| 色值 | Element Plus 变量 | 语义 |
|------|------------------|------|
| #409EFF | --el-color-primary | 主色 |
| #67C23A | --el-color-success | 成功 |
| #E6A23C | --el-color-warning | 警告 |
| #F56C6C | --el-color-danger | 危险 |
| #909399 | --el-color-info | 信息 |
| #303133 | --el-text-color-primary | 主要文字 |
| #606266 | --el-text-color-regular | 常规文字 |
| #909399 | --el-text-color-secondary | 次要文字 |
| #DCDFE6 | --el-border-color | 边框 |
| #EBEEF5 | --el-border-color-lighter | 浅边框/分隔线 |
| #F5F7FA | --el-fill-color-light | 悬停背景 |

## 3. design.md 中前端部分的定位

| 应该写 | 不应该写 |
|--------|---------|
| 组件职责和数据来源 | 具体的 CSS 属性值 |
| Figma nodeId 与组件的映射关系 | 字体大小、颜色、间距等样式细节 |
| 数据加载策略、分页逻辑 | 布局方向（row/column）、flex 属性 |
| 路由跳转规则 | borderRadius、padding 等数值 |
| 非视觉的交互逻辑 | 已在 Figma 中精确定义的视觉信息 |
