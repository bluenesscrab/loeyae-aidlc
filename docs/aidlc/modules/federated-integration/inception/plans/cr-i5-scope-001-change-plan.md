# CR-I5-SCOPE-001 CR3 变更计划（AI-DLC 消费侧）

## 计划状态

- **CR ID**：`CR-I5-SCOPE-001`
- **阶段**：CR4 执行变更与基准回写
- **风险级别**：L4
- **状态**：`in_progress`
- **形成时间**：2026-07-18T04:04:11Z
- **CR3 批准时间**：2026-07-18T04:34:35Z
- **CR3 批准证据**：SSOT 权威 `CR3-PLAN-APPROVAL-040=A`
- **CR2 批准证据**：SSOT 权威文件 `../loeyae-ssot-server/docs/aidlc/modules/federated-ssot/inception/requirements/active-requirement-clarification-020-031.md` 中 `CR2-SCOPE-APPROVAL-039=A`
- **共同权威计划**：`../loeyae-ssot-server/docs/aidlc/modules/federated-ssot/inception/plans/cr-i5-scope-001-change-plan.md`
- **本地基线**：`fac8fcff89e42f9ba09ee7f2bc08a45340b1c85e`，npm 1.20.0；当前没有 build/test script。

## 本计划职责

本文件是共同 CR3 计划在 AI-DLC 仓的消费侧执行切片。共同批次、风险、验证 ID 和回滚边界以 SSOT 权威计划为准；本文件补充 AI-DLC 本地文件、平台适配和流程模板的执行顺序。两份计划必须同时批准，语义不一致时停止 CR4 并先修正计划。

## 执行授权边界

计划获批后只允许进入 CR4 文档基线回写，不直接授权修改 `src/`、平台插件、Hook、MCP 配置或发布包。I6— I14 仍须逐步审批，实际代码工作单元必须由 I14 生成并满足 Construction 入场门禁。

## AI-DLC 目标边界

1. AI-DLC 是角色化资料消费和正式研发文档产出出口，不是 SSOT 事实副本或项目管理执行系统。
2. 本地 `docs/aidlc/state.md` 保持 v2，并继续作为业务工作区唯一流程恢复源。
3. AI-DLC 根据角色、目标文档和提示词自动检索已配置 SSOT 项目，默认最新资料，支持显式包含、排除和指定旧版。
4. 输出列出资料、版本和片段引用，并回写资料版本到正式文档章节血缘。
5. 逆向说明上传 SSOT 后作为派生过程资料；源代码/Git 仍是代码事实权威。
6. Kiro、Claude Code 和 OpenCode 仅做薄适配，共享流程语义，不成为业务项目属性。

## 本地 CR4 批次

### B0：状态与历史保护

- [x] 将本仓 CR 状态切换为 `CR4 in_progress`，引用 SSOT 权威批准答案和共同计划。
- [x] 记录当前提交、npm 版本和无 build/test script 的事实。
- [x] 保留旧产品/I5/I6/I7 和审计为历史，不删除旧 Federated/state v3 结论。

### B1：产品基线

- [x] 更新 `docs/aidlc/product/product-overview.md`：角色化资料消费、正式文档产出、Git 权威、state v2 和平台无关性。
- [x] 更新 `docs/aidlc/product/modules.md`：项目解析、资料自动检索、上下文包、角色/目标文档、引用/血缘和逆向说明上传。
- [x] 更新 `docs/aidlc/product/decision-summary.md`：019—039、后置项、Provider-first 和证据缺口。
- [x] 与 SSOT B1 成对验证；任一仓未通过不得进入 B2。
- [x] 已获得 SSOT 权威计划中的 `CR4-B1-PRODUCT-BASELINE-APPROVAL-041=A`；本仓不单独填写答案。

**B1 状态**：`completed`；041=A 已授权进入 B2，但不授权修改契约或代码。

### B2：I5 和 I6

- [x] 更新 `docs/aidlc/modules/federated-integration/inception/requirements/requirements.md`。
- [x] 更新 `docs/aidlc/modules/federated-integration/inception/requirements/data-model.md`。
- [x] 更新 `docs/aidlc/modules/federated-integration/inception/requirements/decision-summary.md`。
- [x] 模型至少覆盖 RoleIntent、TargetDocument、MaterialSelection、ContextBundle、FragmentCitation、DocumentSection、LineageRecord 和 ReverseDocUpload。
- [x] 在 `cross-validation-report.md` 保留历史并新增 I6 复审轮次；SSOT Provider I5 先完成内容门禁后形成消费侧 I6 结论。
- [x] 已获得 SSOT 权威计划中的 `CR4-B2-I5-I6-APPROVAL-042=A`；本仓不单独填写答案。

**B2 状态**：`completed`；042=A 已批准双仓 I5/I6 文档基线并仅授权进入 B3，不授权实施代码，I7 保持 suspended。

### B3：消费契约

- [x] 在 SSOT Provider `docs/aidlc/product/contracts.md` 完成候选后，更新本仓 `docs/aidlc/product/contracts.md`。
- [x] 删除 state v3、Manifest、事件和远端 CR 作为首期强制消费依赖的现行语义，但保留历史记录。
- [x] 登记项目解析、资料/版本/片段读取、上下文包、逆向说明上传、引用/血缘写回、索引状态和降级的消费者状态。
- [x] I12 冻结版本、字段、错误、鉴权和兼容窗口；机器 Schema 未建立前全部标记未验证。
- [x] 已获得 SSOT 权威计划中的 `CR4-B3-CONTRACT-APPROVAL-043=A`；本仓不单独填写答案。

**B3 状态**：`completed`；Provider-first 双仓文档契约已批准，运行时仍未验证，043 仅授权进入 B4。

### B4：通用流程、角色目录与 I7 故事产物

- [x] 更新 `steering/product-inception.md`。
- [x] 更新 `steering/product-contracts.md`。
- [x] 更新 `steering/inception-requirements-analysis.md`。
- [x] 更新 `steering/inception-user-stories.md`。
- [x] 更新 `steering/inception-application-design.md`。
- [x] 更新 `steering/test-case-derivation.md`。
- [x] 更新 `steering/inception-units-generation.md`。
- [x] 更新 `steering/change-request-process.md`。
- [x] 更新 `steering/common-directory-structure.md`，冻结五类角色核心正式文档目录及引用/血缘要求；当前无独立角色模板，不标记模板验证通过。
- [x] 更新双仓 I7 assessment/plan，保留旧轮次并追加现行资料闭环重规划。
- [x] SSOT 权威 `CR4-B4-I7-PLAN-APPROVAL-044=A` 已批准双仓现行 I7 计划；本仓不单独填写答案。
- [x] 生成本仓五类画像及 13 个 Consumer 故事，覆盖 `ADLC-FR-001`—`ADLC-FR-013`、八项契约、引用/章节血缘和 Gherkin。
- [x] 成对验证 SSOT 12 个 Provider 故事与本仓 13 个 Consumer 故事，不复制 Provider 内部职责、不绑定客户端平台。
- [x] SSOT 权威 `CR4-B4-I7-STORY-APPROVAL-045=A` 已批准双仓 I7 故事产物；本仓不单独填写答案。

**B4 状态**：`completed`；SSOT 权威 045=A 已批准双仓 I7 画像与故事，并仅授权进入 I8。I8 通过前不进入 B5 或代码实施。

### B4.1：I8 用户故事交叉验证与严格审批

- [x] 按 `inception-cross-validation.md` 执行双仓审查项 c/d：本仓 13/13 FR、SSOT 12/12 FR、五类画像、角色、优先级、Gherkin、前置条件、异常路径和跨故事数据流均闭合。
- [x] 验证八项契约、Provider/Consumer 分仓、业务项目单工作区、state v2、Legacy 零调用要求、平台中立、引用/章节血缘及未验证边界。
- [x] 修正双仓 requirements/contracts 状态头滞后问题；不改变已批准 FR、GWT、契约语义或运行状态。
- [x] 在双仓现有 `requirements/cross-validation-report.md` 末尾保留历史并追加第 8 节 I8 轮次。
- [x] SSOT 权威 `CR4-B4-I8-CROSS-VALIDATION-APPROVAL-046=A` 已批准双仓 I8 报告；本仓不单独填写答案。

**B4.1 状态**：`completed`；046=A 仅授权进入 B5 的 I9— I14 逐步规划。机器 Schema、Consumer 适配、Legacy 零调用、E2E 和三平台运行仍未验证；不授权跳过后续审批或实施代码。

### B5：I9— I14 与工作单元

- [x] AI-DLC I9/I10 保持 `not_applicable`；不创建产品 UI 产物。
- [x] I11 规划从角色意图到正式文档和血缘回写的流程；双仓 `execution-plan.md` 已由 SSOT 权威 `CR4-B5-I11-WORKFLOW-PLAN-APPROVAL-053=A` 批准并关闭 I11。
- [x] I12 已冻结共享核心、Provider 契约、缓存/上下文、错误/降级和平台适配边界；SSOT 权威 `CR4-B5-I12-APPLICATION-DESIGN-APPROVAL-055=A` 已批准并关闭双仓 I12。
- [x] I13 已建立派生计划并对齐 Provider A—J 参数化用例簇，生成 Consumer 44 个 UC-D 与索引；双仓 68/68 个产品 Gherkin 场景逐字且唯一覆盖。SSOT 权威 057 当前 0/12，仅阻断 `execution_ready` 与运行验证。
- [x] 取得 SSOT 权威 `CR4-B5-I13-TEST-CASE-APPROVAL-058=A` 严格审批；双仓 I13 已于 2026-07-20T08:30:01Z 关闭。
- [x] 建立双仓 I14 `unit-of-work-plan.md`，按 Core、三平台薄适配和 test-suite 边界形成 6 个 Consumer 候选单元；SSOT 权威 `CR4-B5-I14-UNIT-PLAN-APPROVAL-059=A` 已批准生成计划。
- [x] I14 已为 `loeyae-aidlc`、`kiro-power`、`claude-plugin`、`opencode-plugin` 和 `test-suite` 生成实际工作单元、依赖、检查点、团队认领表及需求/故事/设计切片。
- [x] 生成过程中未修改代码；工作单元与共同计划一致，无需提交 CR3 计划增量。
- [x] Construction 入场前已核验 SSOT Provider 唯一 `CR4-B5-I14-UNIT-ARTIFACT-APPROVAL-060=A`，I14 已关闭。

**B5 当前状态**：SSOT Provider 权威 `CR4-B5-I14-UNIT-ARTIFACT-APPROVAL-060=A` 已批准，双仓 I14 于 2026-07-21T01:04:16Z 关闭。本仓 6 个 Consumer 单元、三份强制产物、团队认领表，以及 13 个故事、34 个 Scenario、44 个 UC-D 的唯一主归属获批。057 仍为 0/12；6 个 Consumer 单元均未认领，Construction 实现、代码、平台适配、构建、测试和 C8 均未启动。

### B6：消费侧一致性验收

- [x] 验证五类角色、正式文档目录、默认最新/指定旧版、显式包含/排除和人工修订语义。
- [x] 验证每个输出要求具体资料版本/片段引用和章节血缘。
- [x] 验证三平台只适配交互，不复制业务规则、不绑定业务项目。
- [x] 验证 state v2 与业务工作区单状态原则；state v3/完整 Federated 同 Must/P0 的命中均为历史、非范围或后置说明。
- [x] 记录所有未验证运行时能力、后续证据 Owner、报告入口和阻断条件。

**B6 状态**：`completed`（2026-07-21T01:04:16Z）。详细证据见双仓 `requirements/cross-validation-report.md` 第 10 节。

**CR5 初步结论**：Consumer 文档语义与 Provider 权威基线一致；Consumer/Core/三平台实现、契约测试、Legacy、E2E、C8 和 057 运行锚点均未验证，故 CR 保持活跃并返回 CR4 Construction 入场/团队单元认领。当前 12/12 单元均为 `🔓 待认领`，本轮不自动认领。

## 消费者依赖矩阵

| 顺序 | service_id | 本地职责 | 上游 | 当前状态 |
|------|------------|----------|------|----------|
| 1 | `loeyae-aidlc` | 共享角色意图、自动检索、上下文、引用、血缘、逆向说明上传语义 | `ssot-api` | I14 已冻结，待认领 |
| 2 | `kiro-power` | Kiro 调用和呈现薄适配 | `loeyae-aidlc` | I14 已冻结，待认领 |
| 2 | `claude-plugin` | Claude Code 调用和呈现薄适配 | `loeyae-aidlc` | I14 已冻结，待认领 |
| 2 | `opencode-plugin` | OpenCode 调用和呈现薄适配 | `loeyae-aidlc` | I14 已冻结，待认领 |
| 3 | `test-suite` | 三平台 conformance、契约、集成和 E2E | Provider 与全部 Consumer | I14 已冻结，待认领 |

AI-DLC 不直接依赖 `ssot-worker` 或 SSOT 数据库；索引失败和降级只能通过 Provider 契约观察。

## 本地验证矩阵

| ID | 验证目标 | 计划证据 | 当前状态 |
|----|----------|----------|----------|
| V-DOC-01 | Markdown、链接、追踪和双仓术语 | 文档检查命令、退出码 | 文档批次可执行 |
| V-SCOPE-02 | state v3/完整 Federated 等不再为 Must/P0 | 负向扫描和语义复核 | 文档批次可执行 |
| V-CONTRACT-03 | 最小契约消费和错误/降级 | Provider Schema、消费者契约测试 | 未验证 |
| V-ROLE-04 | 五类角色核心正式文档目录 | 模板夹具和角色验收矩阵 | 未验证 |
| V-CONTEXT-05 | 自动检索、包含/排除、最新/旧版 | 上下文包夹具和引用报告 | 未验证 |
| V-LINEAGE-06 | 资料版本/片段到文档章节血缘 | 生成样本和追踪报告 | 未验证 |
| V-REVERSE-07 | 逆向说明上传与 Git commit 关联 | commit/hash 夹具 | 未验证 |
| V-PLATFORM-08 | Kiro/Claude/OpenCode 语义一致 | conformance 命令和报告 | 未验证 |
| V-E2E-09 | 真实项目资料到正式文档闭环 | 稳定运行 ID 和报告 | 未验证 |
| V-LEGACY-10 | 未配置 SSOT 的存量流程不受破坏 | Legacy 回归 | 未验证 |
| V-SEC-11 | 项目隔离和敏感信息边界 | 权限负向测试 | 未验证 |
| V-ROLLBACK-12 | Consumer 与 Provider 版本组合回滚 | 版本矩阵和演练记录 | 未验证 |

当前 npm 1.20.0 和现有文件只证明存量基线存在，不证明新范围通过。任何运行时结论必须有可复现命令、工作目录、退出码、不可变提交、报告位置和时间。

## 回滚边界

1. 本仓 B1 与 SSOT B1 是成对回滚单位。
2. B2 可回滚到已批准 B1；旧/新 I5 不得混用。
3. B3 只消费 Provider 已声明兼容的版本；Consumer 不得提前发布。
4. B4/B5 的未批准计划可撤回，不影响已批准产品/契约基线。
5. state 保持 v2，不执行 state 文件迁移；若后续发现迁移需求，必须更新共同计划并重新审批。
6. 审计、澄清和历史报告只追加，不删除。

## 计划编制清单

- [x] 校验 SSOT 权威 `CR2-SCOPE-APPROVAL-039=A`。
- [x] 盘点本仓产品、I5/I6/I7、契约、steering 和平台消费者。
- [x] 对齐共同 B0—B6 批次、service_id、验证 ID 和回滚边界。
- [x] 明确当前 build/test、模板、Schema 和运行证据缺口。
- [x] 获得 Boss 对双仓 CR3 计划的严格批准；SSOT 权威 `CR3-PLAN-APPROVAL-040=A`。

## 当前流程边界

SSOT Provider 权威 `CR4-B5-I14-UNIT-ARTIFACT-APPROVAL-060=A` 已批准并关闭双仓 I14；本仓不复制答案标签。B6 文档一致性验收已通过，CR5 仅完成初步文档检查。057 继续控制后续运行解除且当前为 0/12；CR 保持 `in_progress`，下一边界是团队单元自主认领，不自动认领、不实施代码或修改平台适配。

## B6 完成后的继续提示词

`使用 AI-DLC，进入团队单元认领流程`
