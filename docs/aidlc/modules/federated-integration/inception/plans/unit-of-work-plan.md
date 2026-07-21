# I14 工作单元规划（AI-DLC Consumer）

## 计划状态

- **CR ID**：`CR-I5-SCOPE-001`
- **阶段**：CR4 B5 / I14 单元生成（第二部分：产物严格审批）
- **风险级别**：L4
- **状态**：`completed`
- **启动时间**：2026-07-20T08:30:01Z
- **059 批准时间**：2026-07-20T10:48:50Z
- **060 批准时间**：2026-07-21T01:04:16Z
- **状态模式版本**：2
- **授权前提**：SSOT 权威 `CR4-B5-I13-TEST-CASE-APPROVAL-058=A`、`CR4-B5-I14-UNIT-PLAN-APPROVAL-059=A`
- **当前门禁**：SSOT Provider 权威 `CR4-B5-I14-UNIT-ARTIFACT-APPROVAL-060=A`，已通过
- **Provider 权威计划**：`../../../../../../../loeyae-ssot-server/docs/aidlc/modules/federated-ssot/inception/plans/unit-of-work-plan.md`；实际跨仓位置以双仓 `state.md` 为准
- **当前授权边界**：Provider 权威 060 已批准双仓工作单元产物与切片，I14 已关闭。下一边界仅为 Construction 入场与团队单元自主认领；本轮未自动认领任何单元，未修改 `src/`、平台插件、Hook、MCP、package/config，未执行 C8 或声明运行能力已验证。

## Consumer 固定原则

1. 本仓只消费 Provider OpenAPI 3.1 `1.0.0-candidate.1`，不复制 Provider Schema、权限、资料事实、Worker 状态机或数据库逻辑。
2. Core 统一承载角色意图、资料选择、上下文、正式文档、引用/血缘、Online/Legacy 和 state v2 语义；Kiro、Claude Code、OpenCode 单元只做薄适配。
3. 057 的 12 个运行锚点仍为 0/12，Consumer 44 个 UC-D 继续为 `execution_status=blocked`、`status=blocked`；I14 生成不得将静态证据表述为运行通过。
4. 每个生产工作单元只归属一个 `service_id`；跨仓依赖只通过 Provider 契约、版本矩阵和验证检查点表达。

## Consumer 候选工作单元

| 顺序 | unit_id | service_id | 职责与来源切片 | 允许修改范围 | 主要依赖与检查点 |
|------|---------|------------|----------------|--------------|------------------|
| 1 | `U-C01-CORE-PROVIDER-CLIENT` | `loeyae-aidlc` | Provider 客户端、配置/Secret 引用、版本协商、稳定错误、退避重试、Online/Legacy 边界；来源 Consumer 契约/故障/Legacy 故事及用例簇 A/B/G/H | `loeyae-aidlc` 共享 Core 的 Provider 客户端、配置解析、模式选择、错误映射、重试与同服务测试；不修改平台专属入口 | 前置：Provider 候选契约稳定；后置：未配置时零远程调用、在线失败不静默回退、Secret 不持久化 |
| 2 | `U-C02-CORE-CONTEXT-DOCUMENT` | `loeyae-aidlc` | 五类角色意图、资料自动/显式选择、ContextBundle、正式文档、固定引用、章节血缘、逆向说明上传和 state v2 恢复；来源 Consumer 上下文/文档/血缘/恢复故事及用例簇 E/F/G/I | `loeyae-aidlc` 共享 Core 的角色目录、上下文编排、正式文档生成、引用/血缘、逆向说明和 state/session 逻辑及同服务测试；不复制平台适配 | 前置：`U-C01-CORE-PROVIDER-CLIENT` 与 Provider 检索/上下文/血缘契约；后置：同一业务工作区单 state、引用不漂移、平台无关语义冻结 |
| 3 | `U-C03-KIRO-ADAPTER` | `kiro-power` | Kiro 调用、审批呈现和会话接力；来源三平台 conformance 场景与用例簇 I | Kiro Power 的入口、调用桥接、呈现和适配测试；不得复制 `U-C01-CORE-PROVIDER-CLIENT`/`U-C02-CORE-CONTEXT-DOCUMENT` 业务规则 | 前置：`U-C02-CORE-CONTEXT-DOCUMENT` Core API 冻结；后置：与共享 Core 输入/输出和 state v2 一致 |
| 4 | `U-C04-CLAUDE-ADAPTER` | `claude-plugin` | Claude Code 调用、审批呈现和会话接力；来源三平台 conformance 场景与用例簇 I | Claude Code 插件入口、调用桥接、呈现和适配测试；不得复制 `U-C01-CORE-PROVIDER-CLIENT`/`U-C02-CORE-CONTEXT-DOCUMENT` 业务规则 | 前置：`U-C02-CORE-CONTEXT-DOCUMENT` Core API 冻结；后置：与 Kiro/OpenCode 语义一致 |
| 5 | `U-C05-OPENCODE-ADAPTER` | `opencode-plugin` | OpenCode 调用、审批呈现和会话接力；来源三平台 conformance 场景与用例簇 I | OpenCode 插件入口、调用桥接、呈现和适配测试；不得复制 `U-C01-CORE-PROVIDER-CLIENT`/`U-C02-CORE-CONTEXT-DOCUMENT` 业务规则 | 前置：`U-C02-CORE-CONTEXT-DOCUMENT` Core API 冻结；后置：与 Kiro/Claude Code 语义一致 |
| 6 | `U-C06-CROSS-SERVICE-TESTS` | `test-suite` | Provider/Consumer 契约、三平台 conformance、Legacy、故障、权限和双项目 E2E 验证资产；来源 Consumer 44 个及 Provider 41 个 UC-D、用例簇 A—J | 测试夹具、runner、契约/conformance/E2E 用例和报告适配；不得修改任何生产服务逻辑 | 前置：全部生产单元接口与版本冻结；后置：UC-D 到执行范围和证据位置可追踪。057 闭合前只生成/静态审查资产，不声明运行通过 |

## 跨仓依赖摘要

| Consumer 单元 | Provider 前置 | 可并行条件 |
|---------------|---------------|------------|
| `U-C01-CORE-PROVIDER-CLIENT` | `U-P01-API-PROJECT-MATERIAL`、`U-P02-API-RETRIEVAL-CONTEXT`、`U-P03-API-LINEAGE-REVERSE` 的 OpenAPI 候选 | 契约字段和稳定错误已冻结，可在 Provider 内部实现前基于契约开发 |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `U-C01-CORE-PROVIDER-CLIENT` 及 Provider 检索、上下文、血缘接口 | Provider 客户端边界稳定后可与 Provider Portal 并行 |
| `U-C03-KIRO-ADAPTER`、`U-C04-CLAUDE-ADAPTER`、`U-C05-OPENCODE-ADAPTER` | `U-C02-CORE-CONTEXT-DOCUMENT` Core API | 三个平台可相互并行，但不得复制业务规则 |
| `U-C06-CROSS-SERVICE-TESTS` | 全部 Provider/Consumer 单元 | 可提前准备追踪和静态夹具；057 闭合且实现可运行前不得形成运行通过结论 |

## 生成阶段强制步骤

- [x] 加载双仓已批准的 `unit-of-work-plan.md`，核验 Provider 权威 059=A。
- [x] 生成 `inception/application-design/unit-of-work.md`，逐单元记录 `unit_id`、`service_id`、需求/故事/UC-D 来源、允许修改范围、契约/配置/数据/外部依赖、前后检查点和完成证据。
- [x] 生成 `inception/application-design/unit-of-work-dependency.md`，记录 Provider-first 跨仓矩阵、并行条件、版本门禁和阻断条件。
- [x] 生成 `inception/application-design/unit-of-work-story-map.md`，确保 Consumer 13 个故事、34 个产品场景及 44 个 UC-D 具有唯一主归属。
- [x] 在 `unit-of-work.md` 末尾添加团队认领状态表；6 个单元均保持 `🔓 待认领`，未标记已认领或已完成。
- [x] 对需求、用户故事和应用设计执行多单元文档切片，生成单元文件、`shared-*` 与索引；原始需求与故事已归档为 `.full.md`，三份工作单元产物保留。
- [x] 验证平台单元只适配交互、Core 规则不重复、`docs/aidlc/` 不进入运行时分发物、13 个故事/34 个 Scenario/44 个 UC-D 主归属完整唯一。
- [x] 同步 state、CR 计划和追加式审计，保持 057 的 0/12 运行阻断；已发起 SSOT Provider 唯一 060 严格产物审批，获批前不进入 Construction。

## 规划检查清单

- [x] 引用 Provider 权威 058=A 并确认双仓 I13 可关闭。
- [x] 对齐 CR3 的 `loeyae-aidlc`、`kiro-power`、`claude-plugin`、`opencode-plugin`、`test-suite` 服务包。
- [x] 按 Core 与三平台薄适配边界建立 6 个 Consumer 候选单元。
- [x] 包含三份强制产物、团队认领、多单元文档切片、追踪和服务所有权验证。
- [x] 明确 057、I14 规划/生成、Construction 和实现边界。
- [x] 已取得 SSOT Provider 权威 `CR4-B5-I14-UNIT-PLAN-APPROVAL-059=A`；本仓不复制 `[回答]:`。

## 060 审批结果

SSOT Provider 权威计划已确认 `CR4-B5-I14-UNIT-ARTIFACT-APPROVAL-060=A`；本仓不复制答案标签。双仓 I14 工作单元产物与切片获批，I14 于 2026-07-21T01:04:16Z 关闭；12 个单元继续全部保持 `🔓 待认领`。该批准不补齐 057，不代表任何单元已认领、实施或完成，也不代表构建、测试、C8 或运行能力通过。

## 完成后的继续提示词

`使用 AI-DLC，进入团队单元认领流程`
