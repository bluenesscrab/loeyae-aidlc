# UI Mock 标准体系 — AIDLC 集成指南

> 本文件是给负责人的操作指南。负责人拿到本包后，按照本文档步骤操作即可将 UI Mock 标准体系集成到公司 AIDLC 流程中。

---

## 前提条件

- 使用 Kiro IDE（支持 steering 和 hooks 机制）
- AIDLC 流程已有「Inception」阶段（需求分析 → 用户故事 → UI Mock → 交叉验证）
- 项目为多端产品（PC + APP / 小程序）

---

## 集成步骤

### 步骤 1：安装 Steering 规则

将 `steering/` 目录下的 4 个文件复制到目标工作区的 `.kiro/steering/` 目录。

```
.kiro/steering/
├── ui-mock-design-spec.md              ← [auto] 始终生效：HTML结构、CSS变量、布局规范
├── ui-mock-reasoning-principles.md     ← [auto] 始终生效：三层推导原则 + 自检清单
├── ui-mock-workflow.md                 ← [manual] 手动引用：两阶段工作流详细流程
└── requirement-no-override.md          ← [auto] 始终生效：禁止AI反转产品已确认的决策
```

**inclusion 模式说明**：
- `auto`（默认）：每次对话都会加载，确保 AI 始终遵循规范
- `manual`：需要用户在对话中用 `#` 引用时才加载，避免非 UI Mock 任务时占用上下文

> ⚠️ `ui-mock-workflow.md` 设为 manual 是因为它只在真正执行 UI Mock 任务时才需要。如果你希望每次都加载，把 front-matter 中 `inclusion: manual` 改为删除整个 front-matter 即可。

### 步骤 2：安装 Hooks

将 `hooks/` 目录下的 3 个文件复制到目标工作区的 `.kiro/hooks/` 目录。

```
.kiro/hooks/
├── ui-mock-one-page.kiro.hook              ← 逐页生成确认（preToolUse/write）
├── ui-mock-principles-check.kiro.hook      ← 分层推导自检-创建（fileCreated/*.html）
└── ui-mock-principles-edit-check.kiro.hook ← 分层推导自检-编辑（fileEdited/*.html）
```

Hook 安装后立即生效，无需重启 Kiro。

### 步骤 3：放置模板文件

将以下文件放到 AIDLC 文档结构中的标准位置：

```
docs/templates/                        ← 或你们 AIDLC 约定的模板存放路径
├── app-mock-template.html             ← APP端主文件模板
├── app-mock-template-guide.md         ← APP端使用指南
├── pc-mock-template.html              ← PC端主文件模板
├── pc-mock-template-guide.md          ← PC端使用指南
├── app-demo/                          ← APP端示例子页面
│   ├── 01-example-form.html
│   ├── 02-example-list.html
│   └── 03-example-detail.html
└── pc-demo/                           ← PC端示例子页面
    ├── 01-example-list.html
    └── 02-example-form.html
```

### 步骤 4：在 AIDLC 流程中注册 UI Mock 阶段

在 AIDLC 的 Inception 阶段文档中增加以下内容：

```markdown
### UI Mock 阶段（Inception 步骤 4）

**进入条件**：用户故事审查（步骤 4.1）通过
**退出条件**：交叉验证（步骤 5.1）通过

**执行规范**：
- 引用 steering：`ui-mock-workflow.md`（手动加载）
- 自动生效 steering：`ui-mock-design-spec.md` + `ui-mock-reasoning-principles.md`
- Hook 自动拦截：逐页确认 + 分层推导自检

**标准产出物**（每个功能模块 × 每个端）：
- `{端}-page-specs.md` — 页面编排清单
- `{端}.html` — 主文件（iframe 汇总 + 条件表 + 说明）
- `{端}/` — 子页面目录（独立 HTML 文件）

**模板来源**：`docs/templates/` 下的标准模板
```

---

## 各组件职责详解

### Steering 规则（4个文件）

| 文件 | 职责 | 解决什么问题 |
|------|------|-------------|
| `ui-mock-design-spec.md` | HTML 结构规范、CSS 样式规范、iframe 拆分架构、布局模式（A/B）、缩放脚本 | 确保所有 Mock 产出物格式统一、可预览、可维护 |
| `ui-mock-reasoning-principles.md` | 三层分离推导原则：第一层 UI 本体面向用户、第二层条件表面向开发、第三层说明面向验证。含「局部改动还原」前置规则 | 确保 Mock 内容质量——用户看得懂、开发能实现、验证可追溯 |
| `ui-mock-workflow.md` | 两阶段工作流：阶段1骨架确认流程 → 阶段2逐页填充内容。含文件命名规则、page-specs 格式、审核目标 | 降低返工代价——先确认「做什么页面」再填充「页面里有什么」 |
| `requirement-no-override.md` | 禁止 AI 推翻产品已明确回答的决策 | 防止 AI 在 Mock 中自行添加/删减功能（需求漂移） |

### Hook 规则（3个文件）

| 文件 | 触发时机 | 作用 |
|------|---------|------|
| `ui-mock-one-page.kiro.hook` | `preToolUse` → write 操作 | 阶段2填充时，一次只允许写一个子页面，写完等用户确认后再继续。防止批量生成导致错误放大 |
| `ui-mock-principles-check.kiro.hook` | `fileCreated` → *.html | 创建 HTML 后自动触发三层推导自检，逐层标注合规/违规 |
| `ui-mock-principles-edit-check.kiro.hook` | `fileEdited` → *.html | 编辑 HTML 后自动触发三层推导自检（同上） |

### 三者协同机制

```
Steering 定义「应该怎么做」（标准）
    ↕
Hook 确保「实际做到了」（执行保障）
    ↕
Template 提供「照着做的模板」（起手式）
```

---

## 注意事项

1. **Hook 的 HTML 触发范围**：两个自检 hook 的 pattern 是 `**/*.html`，意味着所有 HTML 文件编辑都会触发。如果项目中有大量非 Mock 的 HTML 文件，可以把 pattern 改为更精确的路径（如 `**/ui-mock/**/*.html`）。

2. **逐页确认 hook 的豁免条件**：骨架文件（内容 <50 行）、page-specs.md、主文件条件表更新不受逐页限制。这些已在 hook prompt 中声明。

3. **requirement-no-override 是通用规则**：它不仅适用于 UI Mock 阶段，对整个 AIDLC 的需求分析、用户故事阶段都有效。建议始终保持 auto 加载。

4. **模板是起手式而非强制**：模板提供标准结构，实际使用时可根据模块特点调整细节。核心约束在 steering 规则中，模板只是降低使用门槛。

---

## 效果预期

集成本体系后的 UI Mock 产出物质量保障：

| 维度 | 无标准体系 | 有标准体系 |
|------|-----------|-----------|
| 内容质量 | AI 随机发挥，混淆用户/开发视角 | 三层分离，各层面向正确受众 |
| 生成节奏 | 一次性批量生成，错误放大 | 逐页确认，每页自检 |
| 工作流 | 直接画完整页面，返工代价大 | 先骨架确认流程，再填充内容 |
| 模板统一性 | 每次结构不同 | iframe 拆分 + 标准 CSS + 缩放 |
| 需求忠实度 | AI 可能自行添加/删减功能 | 禁止反转规则 + 局部改动还原 |
| 可维护性 | 单文件数千行 | 主文件+子页面拆分，每文件独立可预览 |

---

## 多工具适配指南

本标准体系支持三个 AI 编码工具。各工具的 Steering/Hook 机制不同，适配方式如下：

### 工具能力矩阵

| 能力 | Kiro IDE | Claude Code | OpenCode |
|------|----------|-------------|----------|
| Steering 加载 | ✅ 原生 auto/manual | ⚠️ 合并到 CLAUDE.md + steering/ | ⚠️ 封装为 skill |
| 逐页生成拦截 | ✅ PreToolUse Hook | ✅ PreToolUse Hook | ❌ 仅 prompt 软约束 |
| 创建/编辑后自检 | ✅ PostFileCreate/PostFileSave | ✅ PostToolUse Hook | ❌ 仅 prompt 软约束 |
| MCP 设计风格 | ✅ Power 集成 | ✅ MCP 配置 | ✅ MCP 配置 |
| 子 Agent 并行 | ❌ | ✅ 额外优势 | ❌ |

---

### 适配方案 A：Kiro IDE

**Steering 安装**（同主流程步骤 1）：
```
.kiro/steering/
├── ui-mock-design-spec.md              ← [auto]
├── ui-mock-reasoning-principles.md     ← [auto]
├── ui-mock-workflow.md                 ← [manual]
└── requirement-no-override.md          ← [auto]
```

**Hooks 安装**：将 `hooks/kiro/` 下 3 个 JSON 文件复制到 `.kiro/hooks/`：
```
.kiro/hooks/
├── ui-mock-one-page.json               ← PreToolUse: 逐页确认
├── ui-mock-principles-check.json       ← PostFileCreate: 创建后自检
└── ui-mock-principles-edit-check.json  ← PostFileSave: 编辑后自检
```

---

### 适配方案 B：Claude Code

**Steering 安装**：
- `requirement-no-override.md` 内容追加到项目 `CLAUDE.md` 顶层规则中
- 其余 3 个 steering 文件放入 `steering/` 目录，通过 skill 或直接读取加载

**Hooks 安装**：
1. 将 `hooks/claude-code/*.sh` 复制到项目 `.claude/hooks/` 目录
2. 确保脚本有执行权限：`chmod +x .claude/hooks/*.sh`
3. 将 `hooks/claude-code/settings-hooks.jsonc` 的内容合并到 `.claude/settings.local.json`

**配置示例**（`.claude/settings.local.json`）：
```jsonc
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Create|Edit",
        "hooks": [{ "type": "command", "command": ".claude/hooks/ui-mock-one-page.sh" }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Create|Edit",
        "hooks": [{ "type": "command", "command": ".claude/hooks/ui-mock-principles-check.sh" }]
      }
    ]
  }
}
```

**额外优势**：Claude Code 支持子 Agent，可以为每个子页面派发独立 Agent 生成，天然实现逐页隔离。

---

### 适配方案 C：OpenCode

**无 Hook 机制**，采用 skill 封装软约束：

1. 将 `skills/aidlc-ui-mock/` 目录复制到项目的 skills 路径（由 plugin 配置的 `skills.paths` 决定）
2. 将 4 个 steering 文件放入 `steering/` 目录供按需读取
3. 在 OpenCode plugin 的 `config` hook 中注册 skill 路径

**使用方式**：执行 UI Mock 时加载 `aidlc-ui-mock` skill，其中包含逐页确认和自检的强制规则描述。

**局限性**：OpenCode 无硬拦截能力，规则靠 prompt 约束实现。长对话中 AI 可能遗忘规则，建议在关键节点手动提醒。

---

### 适配文件目录结构

```
aidlc-integration/
├── 00-integration-guide.md         ← 本文件
├── steering/                       ← 4 个 Steering 规则文件（三平台共享）
├── hooks/
│   ├── kiro/                       ← Kiro 标准格式 Hook（3 个 .json）
│   ├── claude-code/                ← Claude Code Hook 脚本（2 个 .sh + 配置示例）
│   └── *.kiro.hook                 ← 原始设计意图文件（参考用）
└── skills/
    └── aidlc-ui-mock/SKILL.md      ← OpenCode skill 封装
```
