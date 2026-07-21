# 用户故事生成计划：federated-integration

## 计划状态

- **阶段**：I7 用户故事规划（历史输入）。
- **状态**：`historical_superseded`；未获批准，不得继续生成故事。
- **superseded_by**：`CR-I5-SCOPE-001` 的 B4；待 B2/I6 复审通过后重新规划。
- **输入基线**：历史 I5 需求、I6 交叉验证报告、产品契约和本目录 `user-stories-assessment.md`；不再作为现行生成基线。
- **生成边界**：仅生成 AI-DLC 产品的画像、用户故事、Gherkin 验收标准和需求追踪，不包含技术设计、开发任务或时间线。

## 研发拓扑与使用拓扑边界

1. 当前双仓只服务于 `loeyae-ssot-server` 与 `loeyae-aidlc` 两个产品的联合研发、独立代码所有权和严格审批。
2. 本仓故事只描述 AI-DLC Core、SSOT Consumer、state/session、门禁、三平台适配、契约消费测试和证据发布职责。
3. SSOT Provider 的产品故事由 `loeyae-ssot-server` 仓维护；两产品通过 SSOT 权威机器契约和集成测试衔接，不镜像或互相复制故事正文。
4. 后续业务项目使用 AI-DLC 时，只在自身业务工作区维护一套 `docs/aidlc/state.md` 和过程产物；不会维护 SSOT 仓与 AI-DLC 仓的双份状态、故事或流程。
5. AI-DLC 在该单一业务工作区中编排本地流程并访问远端 SSOT，客户端切换不改变项目状态或产物位置。

## 推荐方法

采用全面深度，以用户旅程为主、业务领域为辅：

1. 按“启动恢复 → 项目解析与基线校验 → 最小上下文 → Federated 变更与审批交接 → 事件恢复 → Construction 证据回链”组织 AI-DLC 产品旅程。
2. 在旅程内按 state 与 Legacy、共享核心与平台中立、Manifest 与上下文、变更与门禁、事件与离线、证据与发布分组。
3. 故事保持 Consumer 职责边界，不把 SSOT 服务端、Portal、企业身份实现或第二套业务项目流程引入 AI-DLC 故事。
4. 每个故事映射需求 ID、画像、MoSCoW 优先级和消费的机器契约；验收标准全部使用 Gherkin。

## 关键问题评估

- 需求中的角色、旅程、优先级和验收边界已足以生成故事。
- Boss 已明确纠正研发双仓与业务项目使用拓扑的混淆，原“共享故事基线如何双仓落地”问题无效，已撤销。
- 当前不存在需要在故事生成前继续澄清的产品问题。

## 规划清单

- [x] 读取并核对已批准需求、角色、旅程、优先级和 I6 修正结果。
- [x] 完成全面深度评估并确定强制产物。
- [x] 固化“研发双仓不等于业务项目双重流程”的边界。
- [x] 撤销跨仓共享/镜像故事问题，确定两产品按职责独立维护故事。
- [ ] 获得 Boss 对本计划及 SSOT 侧计划的明确批准。

## 生成清单

计划批准后按顺序执行，并在每项完成时立即将复选框更新为 `[x]`：

- [ ] 生成 `../user-stories/personas.md`，覆盖五类需求角色、目标、痛点、权限边界和核心场景。
- [ ] 按 AI-DLC 产品职责建立故事 ID 与领域分组。
- [ ] 生成 `../user-stories/stories.md`，覆盖 `ADLC-FR-001`—`ADLC-FR-016`，不得引入未批准功能或 SSOT Provider 内部实现职责。
- [ ] 为每个故事添加至少一个 happy path 和一个关键 error path；存在可选路径时添加 alternate path。
- [ ] 将每个 Gherkin 场景的 Then 写为可观察业务结果，并与需求 GWT 语义对齐。
- [ ] 建立画像、故事、FR/NFR 和消费契约追踪矩阵；跨产品依赖只引用契约，不复制对端故事。
- [ ] 按 INVEST 检查独立性、可协商性、价值、可估计性、小型性和可测试性，并修正未通过项。
- [ ] 验证 16/16 FR 覆盖、MoSCoW 优先级传递、角色映射、Legacy 边界、平台无关性和业务项目单工作区原则。
- [ ] 更新本计划复选框、双仓 `state.md` 和 Inception 审计，提交 I7 严格审批。

## 计划批准条件

1. Boss 明确批准双仓 I7 用户故事生成计划。
2. 两仓计划均保持“产品研发双仓、业务项目单工作区”边界。
3. 在计划获批前，不生成 `personas.md` 或 `stories.md`。
---

## CR4 B4 当前用户故事生成计划

### 计划状态

- **状态**：`completed`
- **授权证据**：SSOT 权威 `CR4-B4-I7-PLAN-APPROVAL-044=A`。
- **故事产物批准**：SSOT 权威 `CR4-B4-I7-STORY-APPROVAL-045=A`。
- **审批入口**：SSOT 权威计划中的 `CR4-B4-I7-PLAN-APPROVAL-044=A` 和 `CR4-B4-I7-STORY-APPROVAL-045=A`。
- **生成边界**：仅生成 AI-DLC 产品画像、故事、Gherkin 与追踪；不生成技术设计、工作单元或代码，不声明运行验证通过。

### 现行旅程与职责

1. 以“资料采集 → 解析 → 修订/讨论 → 项目内检索 → 上下文/引用 → 角色化正式文档 → 血缘”为跨产品主旅程。
2. 本仓故事从 state v2 恢复、RoleIntent/TargetDocument 和 Provider 项目解析开始，覆盖自动检索、包含/排除/旧版、ContextBundle、正式文档生成、FragmentCitation、DocumentSection/LineageRecord 和可选逆向说明上传。
3. SSOT Provider 内部资料治理、解析/索引实现和 Portal 旅程由对端故事维护；本仓只引用八项批准契约 ID，不复制对端故事或字段 Schema。
4. Kiro、Claude Code、OpenCode 只作为同一 Core 语义的薄适配，不形成业务项目属性、独立故事主线或审批门禁。
5. Legacy 未配置 SSOT 时保持 state v2 与零远程调用；Provider 失败必须显式反馈且不得推进错误状态。

### 规划清单

- [x] 核对 B2 已批准的 `ADLC-FR-001`—`ADLC-FR-013`、五类角色和 I6 新复审结论。
- [x] 核对 B3 八项契约、Consumer 状态、I12 冻结项和运行未验证边界。
- [x] 采用资料闭环主旅程并保持 Provider/Consumer 分仓职责。
- [x] 固定业务项目单工作区、平台无关和 Legacy 零调用边界。
- [x] 获得 Boss 对双仓现行 I7 计划的严格批准（`CR4-B4-I7-PLAN-APPROVAL-044=A`）。

### 批准后的生成清单

- [x] 生成 `../user-stories/personas.md`，覆盖产品经理、架构师、项目经理、开发人员、测试人员。
- [x] 生成 `../user-stories/stories.md`，覆盖 `ADLC-FR-001`—`ADLC-FR-013`，按 Consumer 职责和资料闭环旅程分组。
- [x] 每个故事至少包含一个 happy path 和一个关键 error path；适用时补 alternate path。
- [x] 将 Then 写为可观察业务结果，并区分已确认资料、未确认讨论、显式结论和模型推断。
- [x] 建立画像、FR/NFR、八项契约、资料引用/章节血缘和故事追踪矩阵。
- [x] 按 INVEST 验证故事，并负向检查 Provider 内部职责、平台绑定、state v3、Manifest、事件和远端 CR 主线残留。
- [x] 更新双仓 state、审计和计划，提交 I7 故事产物严格审批。

### 计划批准条件

1. SSOT 权威 `CR4-B4-I7-PLAN-APPROVAL-044=A`。
2. 双仓计划共享旅程但不复制职责，角色目录引用 `common-directory-structure.md`，不声称存在独立角色模板。
3. 批准前不创建或改写 `personas.md`、`stories.md`，不进入 B5，不实施代码。