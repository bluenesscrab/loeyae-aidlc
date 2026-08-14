---
name: aidlc-diagram-design
description: "独立图表设计能力：根据给定语义设计并生成高质量 Mermaid 图表。支持架构图（C4Context/C4Container/C4Component/C4Deployment/architecture-beta/flowchart+subgraph）、流程图、时序图、状态图、ER 图、部署图、类图和 Pipeline 图。可独立调用，也可被 AIDLC 按需调用。触发词：画图、架构图、流程图、时序图、状态图、ER 图、部署图、diagram、architecture diagram、flowchart、sequence diagram、mermaid、C4。"
---

# 图表设计能力

Independent Capability — not an AIDLC phase.

## 输入

调用方提供以下信息（独立调用时由用户直接提供）：

- **source/context**：语义来源——用户描述、代码路径、文档路径或已有设计产物；
- **diagram intent**：图的目的——这张图帮助读者理解什么；
- **diagram_type**（可选）：偏好图类型，默认 `auto`（由本能力根据目的选择）；
- **target**（可选）：目标渲染环境，默认 `Kiro Markdown Mermaid Preview`；
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
2. **判断语义类型**：区分"系统结构"（Architecture）和"处理流程"（Pipeline/Flowchart）——二者选用不同图类型；
3. 按 design standards 选择图类型——Architecture 语义优先考虑 C4 图类型或 architecture-beta，而非默认 flowchart + subgraph；
4. **环境验证**：使用 C4 或 architecture-beta 等高级图类型前，判断目标环境是否支持（参见 `common-mermaid-diagram-standards.md` 的 Mermaid 能力验证章节）；
5. 确定信息边界和粒度；
6. 评估是否需要拆图——Architecture + Pipeline 同时存在时优先 Overview + Detail 拆分；
7. 设计布局方向和层级结构；
8. 生成 Mermaid 代码（Markdown 内嵌格式）；
9. 执行 Diagram QA 自检（含语义混合检查和 Architecture 视觉质量检查）。

## Architecture 图类型决策

当 intent 为 Architecture 语义时：

| 表达目的 | 优先图类型 | 降级方案 |
|----------|-----------|----------|
| 系统上下文 | `C4Context` | `flowchart TD` + subgraph |
| 系统内部容器/服务 | `C4Container` | `flowchart TD` + subgraph |
| 容器内部组件 | `C4Component` | `flowchart TD` + subgraph |
| 部署拓扑 | `C4Deployment` | `flowchart TD` + subgraph |
| 云/基础设施资源 | `architecture-beta` | `flowchart TD` + subgraph |
| 简单模块关系 | `flowchart` + subgraph | — |

决策规则：

- 不因节点多就把 Architecture 画成 Pipeline——节点多应拆图；
- 同时存在 Architecture 和 Pipeline 语义时，拆为 Overview（Architecture）+ Detail（Pipeline）；
- 使用高级图类型前确认目标环境支持；验证失败则降级为 flowchart + subgraph；
- 不因 Mermaid 官方 experimental/beta 标记或第三方平台不支持而直接拒绝使用。

## 输出

返回以下结构：

- **Diagram Type**：选择的图类型及选择理由；
- **Purpose**：图的单一目的（一句话）；
- **Mermaid Markdown**：Markdown 中的 Mermaid 代码块；
- **Design Notes**：布局决策、拆分理由、图类型选择理由等设计说明（简短）；
- **Validation Result**：自检结果（PASS / FAIL + 原因）；
- **Validation Level**：实际达到的验证层级（静态检查通过 / CLI 语法解析通过 / CLI 渲染通过 / Preview 渲染通过 / 未执行真实渲染验证）；
- **Assumptions**：如有假设，列出并标记。

## 不负责

不得更新 state.md 或 audit.md、等待或代替用户审批、执行 AIDLC 阶段路由、发起变更请求、修改代码、提交 Git，或宣布任何 AIDLC 阶段完成。
