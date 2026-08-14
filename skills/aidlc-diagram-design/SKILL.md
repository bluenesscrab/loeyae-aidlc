---
name: aidlc-diagram-design
description: "独立图表设计能力：根据给定语义设计并生成高质量 Mermaid 图表。支持架构图、流程图、时序图、状态图、ER 图、部署图、类图和 Pipeline 图。可独立调用，也可被 AIDLC 按需调用。触发词：画图、架构图、流程图、时序图、状态图、ER 图、部署图、diagram、architecture diagram、flowchart、sequence diagram、mermaid。"
---

# 图表设计能力

Independent Capability — not an AIDLC phase.

## 输入

调用方提供以下信息（独立调用时由用户直接提供）：

- **source/context**：语义来源——用户描述、代码路径、文档路径或已有设计产物；
- **diagram intent**：图的目的——这张图帮助读者理解什么；
- **diagram_type**（可选）：偏好图类型，默认 `auto`（由本能力根据目的选择）；
- **target**（可选）：目标渲染环境，默认 `Markdown Mermaid Preview`；
- **complexity**（可选）：预估复杂度提示；
- **output_location**（可选）：产物输出路径。

缺少必要信息且现有上下文不足以可靠设计图表时返回 `NEEDS_CONTEXT`，明确列出缺失信息并要求用户补充。如果现有上下文已足以确定图表目的和内容，可直接继续。不推断流程状态，不自行创造业务事实。

## 加载

1. `steering/common-diagram-design-standards.md`（始终）；
2. 选择 Mermaid 后加载 `steering/common-mermaid-diagram-standards.md`；
3. 实际编写 Mermaid 语法时加载 `steering/common-mermaid-syntax-rules.md`；
4. 选择 ASCII 降级时加载 `steering/common-ascii-diagram-standards.md`。

## 执行

1. 根据 intent 确定图的单一目的；
2. 按 design standards 选择图类型；
3. 确定信息边界和粒度；
4. 评估是否需要拆图；
5. 设计布局方向和层级结构；
6. 生成 Mermaid 代码（Markdown 内嵌格式）；
7. 执行 Diagram QA 自检。

## 输出

返回以下结构：

- **Diagram Type**：选择的图类型；
- **Purpose**：图的单一目的（一句话）；
- **Mermaid Markdown**：Markdown 中的 Mermaid 代码块；
- **Design Notes**：布局决策、拆分理由等设计说明（简短）；
- **Validation Result**：自检结果（PASS / FAIL + 原因）；
- **Assumptions**：如有假设，列出并标记。

## 不负责

不得更新 state.md 或 audit.md、等待或代替用户审批、执行 AIDLC 阶段路由、发起变更请求、修改代码、提交 Git，或宣布任何 AIDLC 阶段完成。
