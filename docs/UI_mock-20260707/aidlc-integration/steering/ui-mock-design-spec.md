---
inclusion: auto
---

# UI Mock 设计规范

生成或编辑 HTML 格式的 UI Mock 时，必须遵循以下规范。

---

## 0. iframe 拆分架构（强制）

UI Mock 采用 iframe 拆分模式：每个页面（mock-box）的 UI 视觉内容为独立 HTML 文件，主文件通过 iframe 引入。

### 0.1 子页面规范

子页面是完整独立的 HTML 文件，**只包含纯 UI 视觉内容**：

- 有完整的 `<!DOCTYPE>`、`<head>`、`<style>`
- 样式全部内联（不依赖外部 CSS 文件）
- 只画 UI 本体：表格、表单、按钮布局、弹窗等
- **不包含**：mock-box-title、条件表、推导说明、业务规则（这些在主文件中）

#### PC 端子页面模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1920">
  <title>页面名称</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
      width: 1920px;
      min-height: 1080px;
      background: #f0f2f5;
      padding: 20px;
    }
  </style>
</head>
<body>
  <!-- 纯 UI 视觉内容 -->
</body>
</html>
```

#### 移动端子页面模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=375">
  <title>页面名称</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
      width: 375px;
      min-height: 812px;
      background: #f5f5f5;
    }
  </style>
</head>
<body>
  <!-- 纯 UI 视觉内容 -->
</body>
</html>
```

### 0.2 主文件 mock-box 结构

#### 布局A：无条件表（简单页面）

```html
<div class="mock-box mock-box-app">
  <div class="mock-box-title">
    <span class="tag">新增页面</span>
    #N 页面名称
    <span style="margin-left:auto;font-size:11px;opacity:0.7">关联: US-XX</span>
    <a class="btn-open" href="子目录/文件名.html" target="_blank">新窗口打开 ↗</a>
  </div>
  <div class="mock-box-body" style="display:flex; justify-content:center; padding:12px;">
    <div class="iframe-wrapper-mobile">
      <iframe src="子目录/文件名.html"></iframe>
    </div>
  </div>
  <div class="mock-box-desc">
    <h4>推导说明</h4>
    <ul>...</ul>
    <h4>业务规则</h4>
    <ul>...</ul>
  </div>
</div>
```

#### 布局B：有条件表（多状态页面，左右并排）

```html
<div class="mock-box mock-box-full" style="display:flex; align-items:stretch; flex-wrap:nowrap; height:860px;">
  <!-- 左边：标题+iframe+说明 -->
  <div class="phone-col" style="width:420px; min-width:420px; display:flex; flex-direction:column; overflow-y:auto;">
    <div class="mock-box-title">...</div>
    <div class="mock-box-body" style="flex:1; display:flex; justify-content:center; padding:12px; overflow-y:auto;">
      <div class="iframe-wrapper-mobile"><iframe src="..."></iframe></div>
    </div>
    <div class="mock-box-desc">...</div>
  </div>
  <!-- 右边：条件差异表 -->
  <div style="flex:1; min-width:0; padding:12px; background:#fafafa; border-left:1px solid #ebeef5; overflow-y:auto;">
    <details open>
      <summary>📋 条件表标题</summary>
      <div class="condition-panel"><table>...</table></div>
    </details>
  </div>
</div>
```

**选择依据**：≥2 种状态 → 布局B；无状态差异 → 布局A。

### 0.3 条件表横向滚动（强制）

```css
.condition-panel { overflow-x: auto; }
.condition-panel table { min-width: 500px; }
```

---

## 1. UI Mock 生成流程

### 步骤 1：状态分析 → 步骤 2：生成条件表 → 步骤 3：生成页面 Mock → 步骤 4：局部改动处理

局部改动页面：
- **必须保持不变**：Tab 栏、搜索栏已有字段、表格已有列、操作列已有按钮
- **允许增量变更**：新增字段/列/按钮（用黄色边框+「新增」标注）

---

## 2. 表单条件联动规范

radio/select/toggle 不同选项导致不同子组件时，**必须展示每种选项对应的子组件**。

---

## 3. 交互模式映射表

| 按钮动作 | 交互方式 |
|----------|----------|
| 查看详情 | 详情弹框 |
| 新增/添加 | 表单弹框 |
| 编辑/修改 | 表单弹框（预填） |
| 删除/解绑 | 确认弹框 |
| 导出/下载 | 直接触发 + Toast |

---

## 4. 生成前自检清单

- [ ] 多状态页面已生成条件表
- [ ] 表单联动每种选项的展开态都已画出
- [ ] 局部改动页面已完整还原现有页面全部元素
- [ ] 每个子页面是完整独立 HTML
- [ ] 子页面中无 mock-box-title、条件表、推导说明
- [ ] 主文件包含缩放脚本
- [ ] iframe src 路径正确
