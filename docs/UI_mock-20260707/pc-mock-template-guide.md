# PC 端 UI Mock 主文件模板使用指南

## 概述

`pc-mock-template.html` 是用于 PC 端（platform-admin / merchant-pc）UI Mock 的主文件框架模板。它与现有的 `user-app.html`（移动端）模板是同一套架构，核心差异在于 iframe 视窗从手机尺寸（375×812）替换为 PC 尺寸（1920×1080，16:9 比例缩放显示）。

---

## 文件结构

```
docs/aidlc/modules/{模块名}/inception/ui-mock/
├── platform-admin.html          ← 主文件（从模板复制）
├── platform-admin/              ← 子页面目录
│   ├── 01-rule-list.html        ← 独立子页面（1920×1080）
│   ├── 02-rule-form.html
│   └── 03-rule-detail.html
```

---

## 与移动端模板的对比

| 对比项 | 移动端模板（user-app） | PC 端模板（本模板） |
|--------|----------------------|-------------------|
| iframe 视窗 | 375×812，手机边框圆角 | 1920×1080，16:9 无边框 |
| 默认一排 | 无条件表时：单个居中 | 无条件表时：**一排两个** |
| 有条件表时 | 左 420px 固定 + 右 flex:1 | 左 50% + 右 flex:1 |
| 容器 class | `.iframe-wrapper-mobile` | `.iframe-wrapper-pc` |
| 子页面 viewport | `width=375` | `width=1920` |
| 缩放控制 | 无 | ✅ 顶部全局缩放滑块（30%~500%） |
| 新窗口打开 | 无 | ✅ 每个 mock-box 标题栏右侧「新窗口打开 ↗」按钮 |

---

## 两种布局模式

### 布局 A：无条件表（一排两个）

适用于：纯表单页、纯列表页（无多状态差异）

```html
<div class="mock-box mock-box-half">
  <div class="mock-box-title">
    <span class="tag">新增页面</span>
    #N 页面名称
    <span style="margin-left:auto;font-size:11px;opacity:0.7">关联: US-XX</span>
    <a class="btn-open" href="子目录/文件名.html" target="_blank">新窗口打开 ↗</a>
  </div>
  <div class="mock-box-body" style="padding:10px;">
    <div class="iframe-wrapper-pc">
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
- 使用 `.mock-box-half` 类（`width: calc(50% - 10px)`）
- flex-wrap 自动让两个 half 并排一行
- 标题栏右侧「新窗口打开 ↗」按钮可在新标签页中查看子页面原始尺寸

### 布局 B：有条件表（全宽左右并排）

适用于：多状态页面（≥2 种状态导致 UI 差异）

```html
<div class="mock-box mock-box-full" style="display:flex; align-items:stretch; flex-wrap:nowrap; height:560px;">

  <!-- 左边：与半宽等宽的 iframe -->
  <div style="width:calc(50% - 10px); min-width:0; display:flex; flex-direction:column; overflow-y:auto;">
    <div class="mock-box-title">
      ...
      <a class="btn-open" href="子目录/文件名.html" target="_blank">新窗口打开 ↗</a>
    </div>
    <div class="mock-box-body" style="flex:1; padding:10px; overflow-y:auto;">
      <div class="iframe-wrapper-pc">
        <iframe src="子目录/文件名.html"></iframe>
      </div>
    </div>
    <div class="mock-box-desc">...</div>
  </div>

  <!-- 右边：条件表（吃掉剩余空间） -->
  <div class="mock-box-condition" style="flex:1; min-width:0; padding:12px; background:#fafafa; border-left:1px solid #ebeef5; overflow-y:auto;">
    <details open class="state-condition-panel">
      <summary>📋 条件表标题</summary>
      <div class="condition-panel" style="overflow-x:auto;">
        <table>...</table>
      </div>
    </details>
  </div>

</div>
```

关键点：
- 左边 PC 视窗宽度与布局 A 的半宽保持一致
- 右边用 `flex:1` 占满剩余空间，给条件表更大的展示面积

---

## 缩放控制器

顶部右侧的缩放控制器控制所有 iframe 的放大/缩小：

| 操作 | 效果 |
|------|------|
| 拖动滑块 | 30% ~ 500% 连续缩放 |
| 点击 −/+ | 步进 ±10% |
| 点击「重置」 | 回到 100%（默认适配容器宽度） |

放大后 iframe 容器会出现滚动条，可以拖动查看页面细节。所有 iframe 同步缩放，方便上下滚动连续对比多个页面。

---

## 子页面规范

每个子页面是完整独立的 HTML 文件：

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
    /* 页面专属样式 */
  </style>
</head>
<body>
  <!-- 纯 UI 视觉内容 -->
</body>
</html>
```

要求：
- `body` 宽度固定 `1920px`
- 最小高度 `1080px`，内容多时高度自适应
- 样式全部内联，不依赖外部 CSS
- **只画 UI 本体**：表格、表单、按钮、弹窗等
- **不包含**：mock-box-title、条件表、推导说明、业务规则（这些放主文件）

---

## 使用步骤

1. **复制模板**：将 `pc-mock-template.html` 复制到目标模块的 `ui-mock/` 目录，重命名为对应端名称（如 `platform-admin.html`）
2. **创建子页面目录**：在同级创建子页面文件夹（如 `platform-admin/`）
3. **修改头部信息**：更新 `<title>`、`<h1>` 项目名、`<p>` 进度描述
4. **按需选择布局**：
   - 无状态差异的页面 → 用布局 A（`.mock-box-half`）
   - 有状态差异的页面 → 用布局 B（全宽左右并排）
5. **创建子页面 HTML**：每个页面一个独立文件，1920×1080 设计基准
6. **更新 iframe src**：确保路径指向正确的子页面文件

---

## 缩放脚本（主文件必须包含）

```javascript
let currentZoom = 1;

function scaleIframes() {
  document.querySelectorAll('.iframe-wrapper-pc').forEach(wrapper => {
    const iframe = wrapper.querySelector('iframe');
    if (!iframe) return;
    const containerWidth = wrapper.clientWidth;
    const baseScale = containerWidth / 1920;
    const finalScale = baseScale * currentZoom;
    iframe.style.transform = `scale(${finalScale})`;
    const baseHeight = containerWidth * 9 / 16;
    const finalHeight = baseHeight * currentZoom;
    wrapper.style.paddingBottom = '0';
    wrapper.style.height = finalHeight + 'px';
  });
}

function setZoom(value) {
  currentZoom = parseFloat(value);
  document.getElementById('zoomRange').value = currentZoom;
  document.getElementById('zoomValue').textContent = Math.round(currentZoom * 100) + '%';
  scaleIframes();
}

function adjustZoom(delta) {
  let newZoom = Math.round((currentZoom + delta) * 100) / 100;
  newZoom = Math.max(0.3, Math.min(5, newZoom));
  setZoom(newZoom);
}

window.addEventListener('load', () => setTimeout(scaleIframes, 200));
window.addEventListener('resize', scaleIframes);
```

---

## 注意事项

- 子页面必须可单独在浏览器中打开预览（完整 HTML）
- 条件表只放主文件中，不要放进子页面
- 推导说明和业务规则只放主文件的 `.mock-box-desc` 区域
- 如果模块同时有 PC 端和移动端的 mock，主文件分开（如 `platform-admin.html` + `user-app.html`），子页面各自独立目录
