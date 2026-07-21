# 产品级决策摘要（AI-DLC 侧）

## 基线状态

- **活跃变更请求**：`CR-I5-SCOPE-001`
- **风险级别**：L4
- **当前环节**：CR4 B2 双仓 I5/I6 严格确认
- **状态模式**：v2；不执行原计划中的 v3 迁移

## 现行已批准决策

| 决策/问题 | 对 AI-DLC 的现行结论 | 批准来源 | 状态 |
|-----------|----------------------|----------|------|
| 产品目标 | AI-DLC 是五类角色使用 SSOT 沟通/过程资料产出正式研发文档的出口 | SSOT 权威 `PM-PRODUCT-BOUNDARY-019=X` | 生效 |
| 正式文档权威 | 正式文档生成到项目工作区，由 Git或既有文档库管理；输出保留具体资料版本/片段引用和章节血缘 | `PM-FORMAL-AUTHORITY-020=A` | 生效 |
| 角色与文档目录 | 覆盖产品经理、架构师、项目经理、开发人员、测试人员；有限目录及角色模板在 B4 冻结 | 021、`PM-MVP-DOCUMENT-CATALOG-032=A`、037 | 生效；模板未验证 |
| 外部执行边界 | 项目计划可由资料辅助生成，但任务、人力、工时、CI/测试执行、制品和部署事实仍归外部平台 | `PM-PROJECT-MANAGEMENT-022=A` | 生效 |
| 版本语义 | 默认使用最新不可变修订；用户可指定旧版，固定版本/片段引用不得漂移 | `EU-DISCUSSION-LIFECYCLE-023=A`、`DEV-UPDATE-SEMANTICS-035=A` | 生效 |
| 资料选择 | 按项目、角色、目标文档和提示词自动检索；用户可显式包含、排除或指定旧版 | `EU-AIDLC-ENTRY-024=X`、`EU-CONTEXT-SELECTION-033` | 生效 |
| RAG/GraphRAG | 消费当前项目的元数据、全文、向量 RAG 和单项目 GraphRAG；不支持跨项目检索 | `EU-SOURCE-CHANNELS-025=X`、`ARCH-RETRIEVAL-026=X`、`ARCH-MVP-RETRIEVAL-034` | 生效；运行时未验证 |
| 失败与降级 | 显示索引失败和低置信，按 Provider 语义降级；不得把缺失索引表述为事实不存在 | 032—034 统一校验结论 | 生效 |
| 来源与项目隔离 | 只消费当前已配置项目和有权资料；项目扩大必须显式，凭据不得进入 state/Git/提示词 | `ARCH-GOVERNANCE-SCOPE-027=A`、`ARCH-CANONICAL-MODEL-028=A` | 生效；字段待 I12 |
| 逆向说明 | 上传逆向说明及仓库路径、Git commit、内容哈希；SSOT 保存说明，源代码事实仍以 Git 为准 | `DEV-INTEGRATION-CONTRACT-029=A`、`DEV-REVERSE-DOC-AUTHORITY-036`、`DEV-REVERSE-DOC-CLASSIFICATION-038` | 生效 |
| MVP 闭环 | 验证资料检索、上下文、角色化正式文档、引用/血缘和逆向上传，并与 SSOT 六类解析闭环对接 | 030、`TEST-MVP-ACCEPTANCE-031=A` 及 019—038 总结 | 生效；运行时未验证 |
| CR2 影响范围 | 019—038 和 L4 影响范围获批，只授权进入 CR3 | `CR2-SCOPE-APPROVAL-039=A` | 已完成 |
| CR3 执行计划 | 批准双仓 B0—B6、Provider-first、service_id、验证矩阵和成对回滚；允许进入 CR4，不直接实施代码 | SSOT 权威 `CR3-PLAN-APPROVAL-040=A` | CR4 进行中 |
| CR4 B1 产品基线 | 双仓六份产品权威基线获批，允许进入 B2 回写 I5 并重新执行 I6 | SSOT 权威 `CR4-B1-PRODUCT-BASELINE-APPROVAL-041=A` | 已完成 |
| state 权威 | 本地 `state.md` 保持 v2，是业务工作区唯一流程恢复源 | 015 历史证据与 019—040 统一结论 | 生效 |
| 业务项目拓扑 | 业务项目只维护自身工作区的一套 AI-DLC 状态和过程产物，不维护 SSOT/AI-DLC 双仓或双流程 | I7 Boss 边界纠正、019—040 | 生效 |
| 平台边界 | Kiro、Claude Code、OpenCode 只做薄适配，共享流程语义；平台不是业务项目属性 | I5/I6 历史批准及 019—040 重验 | 生效 |
| 自举文档隔离 | 本仓 `docs/aidlc/` 仅用于开发 AI-DLC，自运行时分发物排除 | I2 Boss 批准 | 生效 |

## 历史、后置或失效决策

| 历史结论 | 当前处理 | 原因 |
|----------|----------|------|
| AI-DLC 消费批准产品事实、发布基线和远端 CR | 失效为首期主定位；保留审计 | 019 将 AI-DLC 重定为资料消费和正式文档产出出口 |
| state v2→v3 无损迁移 | 后置；继续 v2 | 当前目标不需要迁移且无实测证据 |
| Manifest、统一事件、checkpoint、远端 CR 和完整 Trace 发布为 P0 | 后置，非首期强制依赖 | B3 只规划最小在线资料消费契约 |
| 跨项目共享/检索和企业授权纪元 | 后置 | 首期只消费单项目资料与单项目 GraphRAG |
| 完整恢复预算与重型发布门禁 | 后置 | 不属于当前 MVP，且无运行时证据 |
| 云 Mall 固定为产品逻辑或默认配置 | 失效 | 产品必须项目通用；验收项目外部配置 |
| 旧 I7 Federated 变更/审批/事件主旅程 | `historical_superseded` | 待 B2/I6 通过后在 B4 重规划 |

## 模块与服务映射摘要

- `loeyae-aidlc`：state v2、角色/目标文档意图、SSOT 资料消费、资料选择/上下文、正式文档、引用/血缘和逆向上传共享语义。
- `kiro-power`、`claude-plugin`、`opencode-plugin`：调用、呈现与凭据薄适配，不拥有业务规则。
- `ssot-api`：外部 Provider；AI-DLC 不直接依赖 `ssot-worker` 或数据库。
- `test-suite`：待 I13/I14 建立的契约、Legacy、上下文、血缘、权限、三平台、E2E 和回滚验证入口。

## 数据所有权与关键依赖

- 本地 AI-DLC 权威：state v2、会话恢复位置、资料选择记录、正式文档正文、本地引用和审计。
- SSOT 权威：沟通/过程资料、不可变修订、讨论结论、解析/索引状态、逆向说明和远端血缘索引。
- Git/既有文档库权威：正式研发文档批准版本、源代码、仓库路径、commit 与内容事实。
- 外部平台权威：任务、人力、工时、CI/测试执行、制品和部署结果。
- 依赖顺序：`ssot-api` Provider → `loeyae-aidlc` 共享 Consumer → 三平台薄适配 → `test-suite`。

## CR4 执行顺序

1. B0：双仓状态、历史保护和回滚起点，已完成。
2. B1：双仓产品概览、模块映射和决策摘要，已由 SSOT 权威 041=A 批准。
3. B2：SSOT Provider I5 先行并完成双仓 I5 回写，I6 文档复审通过，等待 SSOT 权威 042 严格批准。
4. B3：先冻结 SSOT 文档契约候选，再登记本仓 Consumer 版本、错误和兼容状态。
5. B4：更新通用 steering、五类角色正式文档目录和双仓 I7 计划。
6. B5：本仓 I9/I10 保持不适用；完成 I11— I14 并生成实际工作单元。
7. B6：双仓追踪、范围负向扫描、证据缺口与回滚一致性验收。

## 未决设计与证据缺口

1. I12 冻结 RoleIntent、TargetDocument、MaterialSelection、ContextBundle、FragmentCitation、DocumentSection、LineageRecord、ReverseDocUpload 的字段和错误/降级语义。
2. B4 冻结五类角色有限正式文档目录；当前不存在独立角色模板和模板验收证据。
3. I12/I13 冻结缓存、上下文预算、权限、Provider 版本组合、Legacy、三平台 conformance 和回滚用例。
4. 当前 npm 1.20.0 无 build/test script；尚无 Provider Schema、契约测试、真实项目 E2E 或三平台运行报告，所有新能力保持“未验证”。
5. 若 I12/I14 发现 state/数据迁移、新消费者或计划外平台分叉，必须更新共同 CR3 计划并重新审批。

## 当前审批状态

SSOT 权威 `CR3-PLAN-APPROVAL-040=A` 已批准双仓 CR3/L4 计划，`CR4-B1-PRODUCT-BASELINE-APPROVAL-041=A` 已批准 B1。CR4 B2 六份 I5 已回写且 I6 文档复审通过，当前等待 SSOT 权威 `CR4-B2-I5-I6-APPROVAL-042`；I5/I6 保持 `pending_approval`，I7 保持 `suspended`，未进入 B3 或代码实施。
