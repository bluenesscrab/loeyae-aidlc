---
name: aidlc-construction
description: "AI-DLC Construction 阶段路由：条件设计、TDD、两阶段审查、实际构建和测试。"
---

# Construction 阶段

开始时宣布：“使用 aidlc-construction 执行 Construction 阶段”。

本 Skill 只负责路由与平台执行方式选择。步骤、条件、审批和完成标准以 `steering/core-workflow.md` 为准，详细规则按需加载对应 steering。

## 路由映射

| 路由 | 加载文件 |
|------|----------|
| C1 功能设计 | `construction-functional-design.md` |
| C2 NFR 需求 | `construction-nfr-requirements.md` |
| C3 NFR 设计 | `construction-nfr-design.md` |
| C4 基础设施设计 | `construction-infrastructure-design.md` |
| C5 TDD 与审查 | `construction-code-generation.md` + `construction-tdd.md` + `construction-code-review.md` |
| C6 调试 | `common-systematic-debugging.md` |
| C7 全局审查 | `construction-code-review.md` |
| C8 实际构建测试与报告 | `construction-build-and-test.md` + `construction-implementation-report.md` |

条件阈值加载 `common-complexity-assessment.md`，测试范围加载 `common-test-execution-strategy.md`。分布式项目按 state.md 的实际影响加载运行时依赖、契约、配置和一致性规则；检测到 Spring Cloud/Nacos 证据时才加载对应技术适配。Loeyae Boot 项目按 `construction-loeyae-compliance.md` 渐进加载 MCP 规范；其他技术栈沿用项目已有规范与通用 steering。

## 平台适配

加载 `construction-subagent-execution.md` 检测平台能力。支持子 Agent 时按单元派发，不支持时在当前上下文串行执行；两种方式都必须完成 TDD、规格审查、质量审查和实际验证。

每个单元完成后执行 `common-step-completion-protocol.md`，只更新 `docs/aidlc/state.md` 作为恢复状态源。C8 未取得实际命令证据时不得完成 Construction。

**NEXT SKILL:** 需要部署准备时使用 `aidlc-operations`；否则按 state.md 交接完成。
