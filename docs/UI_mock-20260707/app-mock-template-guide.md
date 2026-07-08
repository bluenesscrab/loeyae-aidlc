# APP 端 UI Mock 主文件模板使用指南

## 概述

`app-mock-template.html` 是用于 APP 端（user-app / merchant-app）UI Mock 的主文件框架模板。采用手机壳外框（375×812，iPhone标准尺寸）展示子页面，配合条件表描述多状态差异。

---

## 文件结构

```
docs/aidlc/modules/{模块名}/inception/ui-mock/
├── user-app.html                ← 主文件（从模板复制）
├── user-app/                    ← 子页面目录
│   ├── 01-page-name.html        ← 独立子页面（375×812）
│   ├── 02-page-name.html
│   └── 03-page-name.html
```

---

## 与 PC 端模板的对比

| 对比项 | PC 端模板 | APP 端模板（本模板） |
|--------|----------|-------------------|
| iframe 视窗 | 1920×1080，16:9 无边框 | 375×812，手机壳圆角边框 |
| 默认一排 | 无条件表时：一排两个（50%宽） | 无条件表时：固定 420px 宽 |
| 有条件表时 | 左 50% + 右 flex:1 | 左 420px 固定 + 右 flex:1 |
| 容器样式 | `.iframe-wrapper-pc`（16:9缩放） | `.iframe-wrapper-mobile`（手机壳边框） |
| 子页面 viewport | `width=1920` | `width=375` |
| 缩放控制 | ✅ 滑块 30%~500% | ✅ 滑块 30%~300% |
| 新窗口打开 | ✅ | ✅ |
| 缩放时行为 | iframe 内部 transform scale | 手机壳整体 transform scale + 容器宽高自适应 |

---

## 两种布局模式

### 布局 A：无条件表（固定宽度，可并排）

适用于：纯表单页、纯列表页（无多状态差异）

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

关键点：
- 使用 `.mock-box-app` 类（默认 `width: 420px`，缩放时自动扩展）
- `.mock-box-body` 设置 `overflow: auto`，缩放放大后可滚动查看
- 多个布局A的 mock-box 会自动并排（flex-wrap）

### 布局 B：有条件表（全宽左右并排）

适用于：多状态页面（≥2 种状态导致 UI 差异）

```html
<div class="mock-box mock-box-full" style="display:flex; align-items:stretch; flex-wrap:nowrap; height:860px;">

  <!-- 左边：手机壳（宽度与布局A一致） -->
  <div class="phone-col" style="width:420px; min-width:420px; display:flex; flex-direction:column; overflow-y:auto; overflow-x:auto;">
    <div class="mock-box-title">
      ...
      <a class="btn-open" href="子目录/文件名.html" target="_blank">新窗口打开 ↗</a>
    </div>
    <div class="mock-box-body" style="flex:1; display:flex; justify-content:center; padding:12px; overflow-y:auto;">
      <div class="iframe-wrapper-mobile">
        <iframe src="子目录/文件名.html"></iframe>
      </div>
    </div>
    <div class="mock-box-desc">...</div>
  </div>

  <!-- 右边：条件表（吃掉剩余空间） -->
  <div style="flex:1; min-width:0; padding:12px; background:#fafafa; border-left:1px solid #ebeef5; overflow-y:auto;">
    <details open>
      <summary>📋 条件表标题</summary>
      <div class="condition-panel">
        <table>...</table>
      </div>
    </details>
  </div>

</div>
```

关键点：
- 左侧必须加 `class="phone-col"`，缩放时 JS 会同步调整其宽度
- 左侧宽度与布局A的 mock-box-app 保持视觉一致
- 右侧 `flex:1` 占满剩余空间
- 外层固定 `height:860px`，内部通过 `overflow-y:auto` 滚动

---

## 缩放控制器

顶部右侧的缩放控制器控制所有手机壳的缩放：

| 操作 | 效果 |
|------|------|
| 拖动滑块 | 30% ~ 300% 连续缩放 |
| 点击 −/+ | 步进 ±10% |
| 点击「重置」 | 回到 100% |

缩放时的行为：
- 手机壳整体 `transform: scale()` 放大/缩小
- mock-box-app / phone-col 的宽度自动跟随扩展
- mock-box-body 的高度自动跟随调整
- 放大后父容器出现滚动条，可滚动查看

---

## 子页面规范

每个子页面是完整独立的 HTML 文件：

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
    /* 页面专属样式 */
  </style>
</head>
<body>
  <!-- 纯 UI 视觉内容 -->
</body>
</html>
```

要求：
- `body` 宽度固定 `375px`
- 最小高度 `812px`，内容多时高度自适应（手机壳内可滚动）
- 样式全部内联，不依赖外部 CSS
- **只画 UI 本体**：导航栏、卡片、列表、按钮等
- **不包含**：mock-box-title、条件表、推导说明、业务规则（这些放主文件）

---

## 子页面的两种内容模式

### 模式1：完整页面（无多状态差异时）

直接画一个完整的页面效果，适用于纯表单、纯列表等。

```html
<body>
  <div class="nav-bar">...</div>
  <div class="card">...</div>
  <div class="bottom-bar">...</div>
</body>
```

### 模式2：组件库展览（有多状态差异时）

每个区块画一个"最大集"（包含所有可能出现的元素），配合主文件条件表描述各状态下的显隐。

```html
<body>
  <span class="block-label">A 导航栏</span>
  <!-- 导航栏内容 -->

  <span class="block-label">B 头部状态区</span>
  <span class="block-desc">具体显隐见主文件B条件表</span>
  <!-- 展示所有可能元素的最大集 -->

  <span class="block-label">H 底部操作栏</span>
  <span class="block-desc">具体按钮见主文件H条件表</span>
  <!-- 展示所有可能按钮 -->
</body>
```

组件库展览的标签样式：
```css
.block-label { display: inline-block; background: #2979ff; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 3px; margin: 8px 16px 4px; }
.block-desc { font-size: 10px; color: #999; margin-left: 4px; }
```

---

## 手机壳样式

```css
.iframe-wrapper-mobile {
  border: 8px solid #1a1a2e;
  border-radius: 24px;
  overflow: hidden;
  width: 375px;
  height: 812px;
}
.iframe-wrapper-mobile iframe {
  width: 375px;
  height: 812px;
  border: none;
}
```

- 深色边框模拟手机外壳
- 圆角 24px 模拟真机弧度
- 内容超出 812px 时手机壳内自动出现滚动条

---

## 缩放脚本（主文件必须包含）

```javascript
let currentZoom = 1;

function scalePhones() {
  document.querySelectorAll('.iframe-wrapper-mobile').forEach(wrapper => {
    wrapper.style.transform = `scale(${currentZoom})`;
    wrapper.style.transformOrigin = 'top center';
  });
  const scaledWidth = 375 * currentZoom + 16 + 24 + 16;
  const boxWidth = Math.max(420, scaledWidth);
  const scaledHeight = 812 * currentZoom + 16 + 24;

  // 布局A：调整 mock-box-app 尺寸
  document.querySelectorAll('.mock-box-app').forEach(box => {
    box.style.width = boxWidth + 'px';
  });
  document.querySelectorAll('.mock-box-app .mock-box-body').forEach(body => {
    body.style.height = scaledHeight + 'px';
  });
  // 布局B：调整左侧 phone-col 尺寸
  document.querySelectorAll('.mock-box-full .phone-col').forEach(col => {
    col.style.width = boxWidth + 'px';
    col.style.minWidth = boxWidth + 'px';
  });
  document.querySelectorAll('.mock-box-full .phone-col .mock-box-body').forEach(body => {
    body.style.height = scaledHeight + 'px';
  });
}

function setZoom(value) {
  currentZoom = parseFloat(value);
  document.getElementById('zoomRange').value = currentZoom;
  document.getElementById('zoomValue').textContent = Math.round(currentZoom * 100) + '%';
  scalePhones();
}

function adjustZoom(delta) {
  let newZoom = Math.round((currentZoom + delta) * 100) / 100;
  newZoom = Math.max(0.3, Math.min(3, newZoom));
  setZoom(newZoom);
}
```

---

## 使用步骤

1. **复制模板**：将 `app-mock-template.html` 复制到目标模块的 `ui-mock/` 目录，重命名（如 `user-app.html`）
2. **创建子页面目录**：在同级创建子页面文件夹（如 `user-app/`）
3. **修改头部信息**：更新 `<title>`、`<h1>` 项目名、`<p>` 进度描述
4. **按需选择布局**：
   - 无状态差异 → 布局 A（`.mock-box-app`）
   - 有状态差异 → 布局 B（`.mock-box-full` + `.phone-col`）
5. **创建子页面 HTML**：每个页面一个独立文件，375×812 设计基准
6. **更新 iframe src**：确保路径指向正确的子页面文件

---

## 注意事项

- 子页面必须可单独在浏览器中打开预览（完整 HTML）
- 条件表只放主文件中，不要放进子页面
- 推导说明和业务规则只放主文件的 `.mock-box-desc` 区域
- 布局B左侧 div 必须加 `class="phone-col"`，否则缩放不会同步
- `.mock-box-app` 的 `.mock-box-body` 需要 `overflow: auto`，确保缩放后可滚动
