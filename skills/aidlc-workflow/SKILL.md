---
name: aidlc-workflow
description: "核心 AIDLC 工作流编排 - 协调 Inception、Construction、Operations 三阶段。内部 skill，由 using-aidlc 调用。"
---

# AIDLC Core Workflow

**开始时宣布：** "使用 aidlc-workflow 协调开发工作流"

> **薄入口说明**：本 skill 是编排路由。**唯一事实标准是 `steering/core-workflow.md`**——三阶段定义、审批模式、复杂度分级/快速通道、手术式变更、目录结构、审计规则全部以该文件为准。本 skill 不复制这些细节，仅指明路由顺序与加载哪个文件。

## 三阶段工作流

```
INCEPTION（规划）→ CONSTRUCTION（实现）→ OPERATIONS（部署，条件）
```

- **INCEPTION**：做什么、为什么做 → 路由到 `aidlc-inception`
- **CONSTRUCTION**：怎么做 → 路由到 `aidlc-construction`
- **OPERATIONS**：如何运行和维护 → 路由到 `aidlc-operations`

## 启动序列

1. **加载事实标准**：读取 `steering/core-workflow.md`（完整工作流定义）。
   - OpenCode 入口：通过 `aidlc_load_steering("core-workflow.md")` 加载。
   - Kiro 入口：Power 已自动加载。
   - Claude Code 入口：读取仓库内 `steering/core-workflow.md`。
2. **工作区检测**：按 `steering/inception-workspace-detection.md` 执行，创建/恢复 `docs/aidlc/state.md`。
3. **复杂度评估**：按 `core-workflow.md` 的"复杂度评估与快速通道"判定执行路径（简单→快速通道；中等→精简流程；复杂→完整流程），记录到 state.md。
4. **审批模式**：按 `core-workflow.md` 的"审批模式"确定（严格/标准/自主），团队协作自动升级为严格。
5. **按路径进入阶段**。

## 阶段路由表

| 阶段 | 必经步骤 | 加载文件 |
|------|----------|----------|
| INCEPTION | 工作区检测 → 需求分析 → 工作流规划 | `core-workflow.md` INCEPTION 章节 + 各步骤 steering |
| CONSTRUCTION | 代码生成（含 TDD + 两阶段审查）→ 最终全局审查 → 构建和测试 | `core-workflow.md` CONSTRUCTION 章节 + `construction-*.md` |
| OPERATIONS（条件） | 部署需求分析 → 规划问答 → CI/CD 配置生成 → 部署文档 | `operations-operations.md` |

> 各阶段的条件步骤、跳过条件、审批分级、完成消息格式均见 `core-workflow.md` 和对应 steering 文件，本表只列必经骨架。

## 状态与审计

- **状态跟踪**：`docs/aidlc/state.md`。格式与字段见 `core-workflow.md`。
- **审计**：分段审计（`audit-summary.md` 极简时间线 + 各阶段分段文件），规则见 `core-workflow.md` 的"提示日志要求"与 `common-token-management.md`。

## 核心原则（速记，完整版见 core-workflow.md）

- 自适应执行 + 复杂度驱动：流程复杂度匹配任务复杂度
- 手术式变更：每一行改动追溯到用户请求
- 审批分级：🔴 必等 / 🟡 按模式 / 🟢 不等待
- TDD 纪律：没有失败测试就没有生产代码
- 两阶段审查：规格合规 → 代码质量，顺序不可颠倒
- 系统化调试：先找根因再修复，3+ 次失败质疑架构
- 质量门禁：每阶段必须通过才能继续
- 完整闭环：三阶段在本套 skill + steering 内完成，不依赖外部 skill
