---
name: aidlc-prd-generation
description: "AI-DLC PRD 生成：独立的产品需求文档生成流程。支持 SSOT 优先检索、规模自适应、三维需求深化和增量 Patch。触发词：PRD、产品需求文档、需求文档、写 PRD、生成 PRD、create a PRD、product requirements。"
---

# PRD 生成

开始时宣布："使用 aidlc-prd-generation 生成产品需求文档"。

本 Skill 负责独立的 PRD 生成流程路由。流程规则由 `steering/product-prd-generation.md` 定义。

## 加载文件

| 时机 | 加载文件 |
|------|----------|
| 始终 | `product-prd-generation.md` |
| SSOT 已绑定 | `common-ssot-integration.md` |
| 已有 Inception 产物 | 直接读取工作区 `docs/aidlc/inception/` 下产物 |
| 创建文件 | `common-content-validation.md` |

## 执行概要

1. **Discovery** — 收集需求上下文（SSOT 检索 + 已有产物 + 用户提问）
2. **三维深化** — 对每个功能点检查数据来源、业务规则、异常处理
3. **PRD 生成** — 按规模选择模板，输出 .md 格式 PRD
4. **自审** — 6 项检查清单全部通过后交付

## 与其他流程的关系

- 可独立执行，无需依赖 I5-I10 产物
- 已有 Inception 产物时自动作为输入参考
- 生成的 PRD 可作为后续 Inception 或 Construction 的输入
- 用户要求 PRD 审查时加载 `inception-cross-validation.md` 审查项 g

## 平台适配

- 完成后执行 `common-step-completion-protocol.md`，更新 `docs/aidlc/state.md`
- 产物路径按 `common-directory-structure.md`
- 创建文件前加载 `common-content-validation.md`
