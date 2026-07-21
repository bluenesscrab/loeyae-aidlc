# federated-integration I5 决策摘要

- **现行基线**：CR-I5-SCOPE-001 / CR4 B2 候选
- **形成时间**：2026-07-18T05:27:44Z
- **状态**：I5 已回写，等待 I6 复审严格批准
- **风险**：L4

## 1. 现行产品与消费决策

| 主题 | 现行决定 | 权威来源 | 状态 |
|------|----------|----------|------|
| 产品目标 | AI-DLC 是五类角色的资料消费和正式研发文档产出出口，不是 SSOT 事实副本 | `PM-PRODUCT-BOUNDARY-019=X` | 生效 |
| 正式文档 | 正文和批准版本生成到项目工作区，由 Git或既有文档库权威管理 | `PM-FORMAL-AUTHORITY-020=A` | 生效 |
| 首期角色 | 产品经理、架构师、项目经理、开发人员、测试人员核心文档全部进入首期 | `PM-MVP-SCOPE-021=B`、`PM-MVP-DOCUMENT-CATALOG-032` | 生效 |
| 项目管理 | 只辅助生成计划/排期/风险建议；执行事实归外部系统 | `PM-PROJECT-MANAGEMENT-022=A` | 生效 |
| 讨论使用 | 未确认讨论不得成为定稿，显式结论可追踪到资料修订和参与人 | `EU-DISCUSSION-LIFECYCLE-023=A` | 生效 |
| 使用入口 | 业务项目配置 SSOT 项目，提示词声明角色和目标文档 | `EU-AIDLC-ENTRY-024=X` | 生效 |
| 来源与解析 | Consumer 使用 Provider 的六类资料、解析片段和可选逆向说明能力 | `EU-SOURCE-CHANNELS-025=X` | 生效 |
| 单项目检索 | 自动检索限当前项目，不做跨项目共享 | `ARCH-RETRIEVAL-026=X`、`ARCH-GOVERNANCE-SCOPE-027=A` | 生效 |
| 数据模型 | Consumer 只保留意图、选择、上下文引用、文档、引用/血缘和逆向上传对象 | `ARCH-CANONICAL-MODEL-028=A` | 生效 |
| Provider-first | 项目解析、资料/版本读取、上下文和血缘均通过 Provider，不直连 Worker/数据库 | `DEV-INTEGRATION-CONTRACT-029=A` | 生效，字段待 B3/I12 |
| 版本选择 | 默认最新，允许显式包含、排除和指定旧版；固定引用不漂移 | `DEV-INGESTION-VERSION-030`、`EU-CONTEXT-SELECTION-033`、`DEV-UPDATE-SEMANTICS-035=A` | 生效 |
| RAG 消费 | 消费元数据/全文、向量 RAG、单项目 GraphRAG 的具体修订/片段及降级状态 | `ARCH-MVP-RETRIEVAL-034` | 生效，运行未验证 |
| 逆向说明 | 可选上传说明、仓库路径、commit 和哈希；代码事实始终归 Git | `DEV-REVERSE-DOC-AUTHORITY-036`、`DEV-REVERSE-DOC-CLASSIFICATION-038` | 生效 |
| 蓝图角色 | 产品/业务蓝图由产品经理负责、架构师条件参与；技术架构蓝图归架构师 | `PM-BLUEPRINT-OWNERSHIP-037` | 生效 |
| 状态模式 | state 保持 v2，是业务工作区唯一流程恢复源；不执行 v3 迁移 | 019—041 统一结论、B1 | 生效 |
| 业务项目拓扑 | 业务项目只维护自身工作区的一套 AI-DLC 状态和过程产物 | B1 产品基线 | 生效 |
| 平台边界 | Kiro、Claude Code、OpenCode 共享业务语义，仅做调用/凭据/交互薄适配 | B1 产品基线 | 生效 |
| CR2/CR3/B1 | L4 范围、B0—B6 计划和六份产品基线均已批准 | `CR2-SCOPE-APPROVAL-039=A`、`CR3-PLAN-APPROVAL-040=A`、`CR4-B1-PRODUCT-BASELINE-APPROVAL-041=A` | 已完成 |

## 2. 现行 Must

1. 从当前业务工作区 state v2 恢复；插件自举状态不参与业务项目。
2. 五类 `RoleIntent` 和有限 `TargetDocument` 目录。
3. 通过 Provider 解析已配置项目，不猜测项目，不直连 Worker/数据库。
4. 自动检索当前项目，默认最新，支持包含、排除和指定旧版。
5. 固定 ContextBundle 的资料修订、片段、讨论/结论、索引和降级状态。
6. 在项目工作区生成正式文档并区分确认资料、未确认讨论和模型推断。
7. 输出 FragmentCitation 并回写 DocumentSection/LineageRecord。
8. 上传携带 repository/commit/content hash 的逆向说明。
9. 三平台业务语义一致，平台不成为项目属性。
10. Legacy 未配置项目远程调用数为 0；Provider 失败不伪造成功。
11. 外部任务、CI、测试、制品和部署事实不由 AI-DLC 伪造。

## 3. 后置、失效或仅保留历史

| 旧项 | 处置 | 原因 |
|------|------|------|
| AidlcStateV3 与 v2→v3 迁移 | 失效 | 明确保持 state v2 |
| ManifestSnapshot、baseline.verify、新鲜度四态 | 仅保留历史 | 不属于已批准资料消费最小闭环 |
| 事件、project_cursor、PendingSync 主链 | 仅保留历史 | B2 主线采用请求式资料/上下文消费，字段待 B3/I12 |
| 远端 CR、impact.analyze、Portal 审批交接 | 仅保留历史 | 不属于本次沟通资料到正式文档主线 |
| checkpoint/完整 Trace/Evidence 首期强制链 | 后置或失效 | 正式文档引用/血缘替代本次首期追踪重点 |
| 跨项目共享、复杂恢复和重型门禁 | 后置 | 超出首期单项目闭环 |
| AI-DLC 直连 Worker/数据库 | 禁止 | 破坏 Provider/Consumer 权威边界 |
| 旧 200ms 等阈值 | 失效待重验 | 未按新上下文和平台负载验证 |

## 4. Provider/Consumer 边界

| 能力 | Provider Owner | AI-DLC Consumer 责任 | 运行证据 |
|------|----------------|-----------------------|----------|
| 项目解析/权限 | SSOT | 提交候选、消费结果，冲突时停止 | 未验证 |
| 资料/版本/片段 | SSOT | 固定版本选择，不复制权威资料 | 未验证 |
| 检索与降级 | SSOT | 传递角色/目标/选择条件并展示实际路径 | 未验证 |
| ContextBundle | SSOT 构建 | 消费固定 bundle，不篡改来源状态 | 未验证 |
| 正式文档 | 项目工作区/Git | AI-DLC 生成、人工修订，Git 管版本 | 文档边界已确认 |
| 引用/血缘 | AI-DLC 产生，SSOT 保存索引 | 固定片段并关联章节 | 未验证 |
| 逆向说明 | AI-DLC 上传，SSOT 管说明修订 | 校验 repository/commit/hash | 未验证 |
| 外部执行事实 | 对应外部平台 | 只引用真实稳定证据 | 未验证 |

## 5. 数据来源与证据缺口

- **已确认来源**：业务工作区 state v2、用户角色/目标/提示词、Git 正式文档与代码事实、外部平台权威边界。
- **需实现来源**：Provider 项目解析、资料/版本/片段、检索/降级、ContextBundle、引用/血缘和逆向上传结果。
- **运行证据缺口**：Legacy 零调用、资料选择、旧版、上下文预算、引用完整性、血缘、Provider 失败恢复、逆向 Git 关联和三平台 conformance。
- **契约缺口**：操作名、字段、错误、鉴权、幂等、版本并存和 Consumer 状态待 B3/I12。
- **测试入口缺口**：当前 package.json 无 build/test script，Construction 前必须建立。

## 6. B2 验证结论

- I5 内容已按 019—041/B1 回写，旧 state v3/Federated 范围不再作为 active Must。
- 每个现行 FR 均有 GWT，Consumer 对象、Provider Owner 和数据来源可追踪。
- 文档级一致性可进入 I6 复审；运行时能力、契约和平台一致性仍为未验证。
- SSOT Provider I5 必须先完成内容门禁，AI-DLC I6 才能形成当前轮次结论。
- I6 严格审批前 I7 保持 suspended；B3 仍需后续门禁。

## 7. 历史声明

2026-07-17 原 I5/I6 的 state v3、Manifest、事件、远端 CR、影响分析、checkpoint/Trace 等结论及 I6-FIX-001—007 完整保留在旧 I6、审计和 Git 历史中。现行效力由本摘要和 `CR-I5-SCOPE-001` 取代，不删除历史、不把旧 I6“可进入 I7”结论用于当前门禁。
