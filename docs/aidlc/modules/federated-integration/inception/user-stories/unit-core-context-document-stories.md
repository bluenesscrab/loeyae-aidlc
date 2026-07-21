# U-C02-CORE-CONTEXT-DOCUMENT core-context-document 用户故事切片

- **unit_id / service_id**：`U-C02-CORE-CONTEXT-DOCUMENT` / `loeyae-aidlc`
- **source_ref**：[`stories.full.md`](stories.full.md)
- **主归属故事**：`ADLC-US-001`、`002`、`004`、`005`、`006`、`007`、`008`、`012`
- **状态**：设计/静态生成；实现与运行 blocked/未验证

## ADLC-US-001 从业务工作区 state v2 唯一恢复（主归属）

- **作为**：任一受支持客户端中的业务项目用户
- **我希望**：只从当前业务工作区恢复 state v2
- **以便**：客户端或插件源码仓状态不会改变业务项目流程位置
- **追踪**：`ADLC-FR-001`；`ADLC-NFR-001`、`ADLC-NFR-005`、`ADLC-NFR-007`
- **契约**：无在线契约；本地恢复边界
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: 业务工作区 state v2 是唯一恢复源
  Given 插件源码仓和业务项目都存在 docs/aidlc/state.md
  When 任一受支持客户端恢复业务项目
  Then 只使用业务项目 state v2，恢复的步骤和产物位置不因客户端或插件状态改变

Scenario: 业务 state 缺失或无效时不借用插件状态
  Given 当前业务工作区 state v2 缺失或无法有效解析
  When 客户端尝试恢复流程
  Then AI-DLC 停止恢复并报告业务状态问题，不读取插件安装根目录的 state 继续执行
```

## ADLC-US-002 五角色意图与目标文档（主归属）

- **作为**：产品经理、架构师、项目经理、开发人员或测试人员
- **我希望**：由角色、目标文档和提示词形成明确资料意图
- **以便**：只检索当前任务需要的资料并写入正确的通用阶段目录
- **追踪**：`ADLC-FR-002`；`ADLC-NFR-001`、`ADLC-NFR-006`
- **契约**：`SSOT-RETRIEVAL-001`、`SSOT-CONTEXT-001`
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: 测试人员形成测试计划资料意图
  Given 用户声明角色为测试人员且目标文档为测试计划
  When AI-DLC 形成 RoleIntent 和 TargetDocument
  Then 意图包含当前项目、测试计划类型及相关需求和设计资料条件，不把项目执行数据当作权威事实

Scenario: 角色或目标文档不明确时请求确认
  Given 当前上下文无法唯一确定角色或目标文档
  When AI-DLC 准备检索资料
  Then AI-DLC 请求用户确认角色和目标文档，不猜测目录、不调用 Provider 扩大检索范围
```

## ADLC-US-004 自动检索与显式资料选择（主归属）

- **作为**：需要生成目标文档的角色
- **我希望**：按角色和目标自动检索，并能包含、排除或指定旧版
- **以便**：最终资料范围符合我的意图且每项选择理由可追踪
- **追踪**：`ADLC-FR-004`；`ADLC-NFR-003`、`ADLC-NFR-004`、`ADLC-NFR-006`
- **契约**：`SSOT-MATERIAL-001`、`SSOT-RETRIEVAL-001`、`SSOT-CONTEXT-001`、`SSOT-INDEX-STATUS-001`、`SSOT-FAILURE-001`
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: 自动选择叠加排除和指定旧版
  Given 自动检索选中 M1/R2 和 M2/R1，用户排除 M2 并指定 M3/R4
  When AI-DLC 确认 MaterialSelection
  Then 最终选择只包含 M1/R2 与 M3/R4，并记录每项自动选择、排除和旧版理由

Scenario: 低置信冲突或范围过大时请求确认
  Given Provider 返回低置信、来源冲突或超出目标文档预算的候选资料
  When AI-DLC 评估候选范围
  Then AI-DLC 展示需要确认的资料和原因，不静默扩展、合并或删除冲突来源

Scenario: 排除资料重新出现时阻止生成
  Given 用户已显式排除资料 M2
  When Provider 响应或后续选择结果再次包含 M2
  Then AI-DLC 阻止进入上下文生成并报告排除约束冲突
```

## ADLC-US-005 固定 ContextBundle 与降级透明（主归属）

- **作为**：使用资料生成正式文档的角色
- **我希望**：消费固定到具体修订和片段的 ContextBundle，并看到检索降级
- **以便**：生成内容只依赖可定位来源，不把派生能力失败解释为资料不存在
- **追踪**：`ADLC-FR-005`；`ADLC-NFR-003`—`ADLC-NFR-006`
- **契约**：`SSOT-MATERIAL-001`、`SSOT-RETRIEVAL-001`、`SSOT-CONTEXT-001`、`SSOT-INDEX-STATUS-001`、`SSOT-FAILURE-001`
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: Consumer 保持上下文中的固定来源状态
  Given Provider 返回固定资料、修订、片段、讨论状态、检索路径和预算的 ContextBundle
  When AI-DLC 接收该上下文包
  Then AI-DLC 原样保留来源与状态并仅将包内片段用于当前目标文档

Scenario: GraphRAG 不可用时展示实际降级
  Given Provider 标明 GraphRAG 不可用并降级到向量和全文
  When AI-DLC 使用 ContextBundle
  Then AI-DLC 记录并展示实际降级路径，只引用返回的具体修订和片段

Scenario: 固定修订缺失或跨项目内容时拒绝生成
  Given ContextBundle 包含无法解析的固定修订或不属于当前项目的内容
  When AI-DLC 校验上下文
  Then AI-DLC 阻止正式文档生成，保留当前流程步骤并报告来源完整性问题
```

## ADLC-US-006 正式文档生成与事实分层（主归属）

- **作为**：五类角色中的文档负责人
- **我希望**：在业务项目工作区生成区分资料状态的正式研发文档
- **以便**：已确认资料、未确认讨论、显式结论和模型推断不会相互冒充
- **追踪**：`ADLC-FR-006`；`ADLC-NFR-003`、`ADLC-NFR-004`、`ADLC-NFR-006`
- **契约**：`SSOT-MATERIAL-001`、`SSOT-CONTEXT-001`、`SSOT-LINEAGE-001`、`SSOT-FAILURE-001`
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: 生成文档明确区分四类事实状态
  Given 上下文包含已确认资料、未确认评论、显式结论和模型推断
  When AI-DLC 在目标阶段目录生成正式文档
  Then 四类内容具有可辨识的来源状态，正文保存在业务项目工作区并可由 Git 管理

Scenario: 未确认内容不得写成批准事实
  Given 生成草稿把未确认评论或模型推断表达为已批准结论
  When AI-DLC 执行内容校验
  Then 校验阻止该草稿进入待审批正式基线，并指出需要纠正的来源状态
```

## ADLC-US-007 片段引用与章节血缘回写（主归属）

- **作为**：需要审查文档依据的角色
- **我希望**：每个有资料支撑的章节都有固定片段引用并回写章节血缘
- **以便**：文档来源长期可解析，源资料更新不会改变历史依据
- **追踪**：`ADLC-FR-007`；`ADLC-NFR-003`—`ADLC-NFR-005`
- **契约**：`SSOT-MATERIAL-001`、`SSOT-LINEAGE-001`、`SSOT-FAILURE-001`
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: 有来源章节形成固定引用和血缘
  Given 正式文档包含若干由 ContextBundle 资料支撑的章节
  When AI-DLC 保存文档并回写 FragmentCitation、DocumentSection 和 LineageRecord
  Then 每个有来源章节都能定位到实际使用的资料修订和片段，正文仍留在项目工作区

Scenario: 源资料更新后历史引用保持原修订
  Given 文档章节引用 R1/F1 且源资料随后形成 R2
  When 用户检查原章节来源
  Then 章节引用仍解析到 R1/F1，只有新的生成任务默认使用 R2

Scenario: 血缘写回失败时不标记同步完成
  Given 正式文档已保存但 Provider 血缘写回失败
  When AI-DLC 更新流程状态
  Then 文档保留待回写状态和恢复动作，state v2 不记录虚假的已同步结果
```

## ADLC-US-008 逆向工程说明上传与 Git 事实关联（主归属）

- **作为**：开发人员或架构师
- **我希望**：可选上传带仓库路径、Git commit 和内容哈希的逆向说明
- **以便**：说明版本可追踪，同时源代码和 Git 历史继续作为代码事实权威
- **追踪**：`ADLC-FR-008`；`ADLC-NFR-003`—`ADLC-NFR-005`
- **契约**：`SSOT-REVERSE-DOC-001`、`SSOT-FAILURE-001`
- **画像**：`ADLC-PER-002`、`ADLC-PER-004`
- **优先级**：Must

```gherkin
Scenario: 上传说明形成固定 Provider 修订引用
  Given 当前仓库 commit 为 C1 且逆向说明内容哈希为 H1
  When AI-DLC 上传说明及仓库路径、C1 和 H1
  Then AI-DLC 保存 Provider 返回的固定说明修订引用，源代码和 Git 历史不被修改

Scenario: 说明变化后上传新修订
  Given 已上传 D1/C1 且当前仓库和说明已更新为 D2/C2
  When AI-DLC 再次上传
  Then 新说明形成独立修订并成为当前说明，D1/C1 仍可按固定引用读取

Scenario: commit 或内容哈希错配时不得完成
  Given 上传参数中的 commit 或内容哈希与当前选定说明不一致
  When AI-DLC 校验并提交上传
  Then AI-DLC 阻止完成或保留冲突状态，不记录虚假的上传成功或修改代码事实
```

## ADLC-US-012 外部执行事实保持权威边界（主归属）

- **作为**：项目经理或测试人员
- **我希望**：生成计划和测试文档时区分沟通资料与外部执行证据
- **以便**：没有稳定平台证据的任务、进度或测试声明不会成为已验证事实
- **追踪**：`ADLC-FR-012`；`ADLC-NFR-003`、`ADLC-NFR-004`
- **契约**：`SSOT-MATERIAL-001`、`SSOT-CONTEXT-001`、`SSOT-FAILURE-001`
- **画像**：`ADLC-PER-003`、`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: 稳定外部运行标识作为证据引用
  Given 测试平台提供稳定运行标识、适用范围、结果位置和时间
  When AI-DLC 生成测试报告框架
  Then 文档引用该证据并注明测试平台为执行事实权威

Scenario: 口头通过声明保持未验证
  Given 沟通资料声称测试已通过但没有测试平台运行标识
  When AI-DLC 生成测试报告框架
  Then 该声明被标记为未验证资料，不生成测试实际通过的结论

Scenario: 事实分层校验阻止虚假通过
  Given 草稿把无稳定证据的外部声明写成已完成或已通过
  When AI-DLC 校验正式文档
  Then 草稿不能进入待审批基线，并指出缺失的外部权威证据
```
