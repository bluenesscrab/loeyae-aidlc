# UI Mock 标准体系 — AIDLC 集成交付包

> 交付人：王琳 | 日期：2026-07-07
> 用途：将本目录作为 AIDLC 标准流程的「Inception → UI Mock」阶段标准模板和规则集成

---

## 一、本包结构总览

```
docs/templates/
├── README.md                          ← 本文件（集成说明）
├── aidlc-integration/                 ← 【核心交付】AIDLC 集成所需的全部文件
│   ├── 00-integration-guide.md        ← 集成指南（负责人必读）
│   ├── steering/                      ← Steering 规则文件（4个）
│   │   ├── ui-mock-design-spec.md     ← 设计规范
│   │   ├── ui-mock-reasoning-principles.md  ← 分层推导原则
│   │   ├── ui-mock-workflow.md        ← 两阶段工作流
│   │   └── requirement-no-override.md ← 需求禁止反转规则
│   └── hooks/                         ← Hook 文件（3个）
│       ├── ui-mock-one-page.kiro.hook           ← 逐页生成确认
│       ├── ui-mock-principles-check.kiro.hook   ← 分层推导自检（创建触发）
│       └── ui-mock-principles-edit-check.kiro.hook ← 分层推导自检（编辑触发）
├── app-mock-template.html             ← APP端主文件模板
├── app-mock-template-guide.md         ← APP端模板使用指南
├── pc-mock-template.html              ← PC端主文件模板
├── pc-mock-template-guide.md          ← PC端模板使用指南
├── app-demo/                          ← APP端子页面示例
│   ├── 01-example-form.html
│   ├── 02-example-list.html
│   └── 03-example-detail.html
└── pc-demo/                           ← PC端子页面示例
    ├── 01-example-list.html
    └── 02-example-form.html
```

---

## 二、核心理念

UI Mock 标准体系解决三个问题：

| 问题 | 解决方案 | 对应文件 |
|------|---------|---------|
| AI 生成的 Mock 质量不稳定 | 分层推导原则 + 自检 Hook | reasoning-principles.md + 2个hook |
| 一次性生成太多内容，错误放大 | 两阶段工作流（骨架→填充）+ 逐页确认 Hook | workflow.md + one-page.hook |
| 模板格式不统一、产出物难维护 | 标准 HTML 模板 + 设计规范 | template.html + design-spec.md |

---

## 三、三个 Hook 的协同关系

```
用户下达 UI Mock 任务
       │
       ▼
【Steering: workflow】两阶段编排
  阶段1: 骨架批量生成 → 用户审流程
  阶段2: 内容逐页填充
       │
       ▼ (阶段2写入子页面时)
【Hook: one-page】preToolUse/write 拦截
  → 一次只写一个页面，写完等用户确认再继续
       │
       ▼ (子页面 HTML 创建/编辑后)
【Hook: principles-check / edit-check】fileCreated/fileEdited 触发
  → 按三层分离原则逐层自检
  → 不合规项自动修正
       │
       ▼
【Steering: reasoning-principles】提供自检标准
  第一层：UI本体面向用户
  第二层：条件表面向开发
  第三层：底部说明面向验证
```

---

## 四、快速集成步骤

详见 `aidlc-integration/00-integration-guide.md`。

简要流程：
1. 将 `aidlc-integration/steering/` 下 4 个文件放入目标工作区 `.kiro/steering/`
2. 将 `aidlc-integration/hooks/` 下 3 个文件放入目标工作区 `.kiro/hooks/`
3. 将模板文件（`*-template.html` + `*-template-guide.md` + demo 目录）放入 AIDLC 产出物标准目录
4. 在 AIDLC 流程文档中注册 UI Mock 阶段的进入/退出条件

---

## 五、工具适配矩阵

本体系支持三个 AI 编码工具，适配文件已就绪：

| 能力 | Kiro IDE | Claude Code | OpenCode |
|------|----------|-------------|----------|
| Steering 规则 | ✅ `.kiro/steering/`（auto/manual） | ⚠️ CLAUDE.md + steering/ 目录 | ⚠️ 封装为 skill 加载 |
| 逐页生成拦截 | ✅ PreToolUse Hook（硬拦截） | ✅ PreToolUse Hook（硬拦截） | ❌ skill 内 prompt 软约束 |
| 创建/编辑后自检 | ✅ PostFileCreate/PostFileSave | ✅ PostToolUse Hook | ❌ skill 内 prompt 软约束 |
| MCP 设计风格 | ✅ Power 集成 | ✅ MCP 配置 | ✅ MCP 配置 |

**适配文件位置**：

```
aidlc-integration/hooks/
├── kiro/                    ← 3 个 .json（直接复制到 .kiro/hooks/）
├── claude-code/             ← 2 个 .sh + settings-hooks.jsonc
└── *.kiro.hook              ← 原始设计意图（参考用）

aidlc-integration/skills/
└── aidlc-ui-mock/SKILL.md   ← OpenCode 专用 skill 封装
```

详细安装步骤见 `aidlc-integration/00-integration-guide.md` 的「多工具适配指南」章节。

---

## 六、适配说明

本体系已在以下模块验证通过：
- combo-ticket（联票与时效卡）— 4端24个mock-box
- aftermarket（售后）— 3端18个mock-box
- food-delivery（外卖）— 3端22个mock-box
- platform-core/sub-account（子账号）— 1端

适用条件：
- AI 辅助的产品设计阶段（Inception → UI Mock）
- 多端产品（PC管理后台 + PC商户后台 + 移动APP）
- 中大型功能模块（≥3个页面）
