---
name: aidlc-ui-mock-design
description: "基于已批准 UI 页面计划生成 AI-DLC HTML Mock 骨架或完整内容；不负责 I9 路由和审批。"
---

# HTML UI Mock 设计能力

开始时宣布：“使用 aidlc-ui-mock-design 生成 HTML UI Mock”。

## 输入

调用方必须提供：

- 已批准页面计划路径；
- `stage=skeleton` 或 `stage=content`；
- 存量页面证据；
- 已选视觉来源或默认样式。

缺少任一输入时返回 `NEEDS_CONTEXT`，不推断流程状态。

## 加载

1. `steering/inception-ui-mock-generation.md`；
2. 按该文件要求加载 HTML 设计、推导和样式细则。

## 输出

返回生成或修改的文件路径、页面计划对账结果、内容自检结果和未解决问题。不得更新 state/audit、等待或代替用户审批、执行 I10，或宣布 I9/I10 完成。
