# federated-integration 用户故事

- **基线**：`CR-I5-SCOPE-001 / CR4 B4 / CR4-B4-I7-PLAN-APPROVAL-044=A`
- **形成时间**：2026-07-18T07:11:16Z
- **状态**：`approved`
- **审批证据**：SSOT 权威 `CR4-B4-I7-STORY-APPROVAL-045=A`
- **深度与拆分**：全面深度；以资料闭环旅程为主、角色目标文档为辅，每个故事对应一个可观察 Consumer 业务结果。
- **实现状态**：未实施、未运行验证；本文只建立 AI-DLC Consumer 用户故事、Gherkin 和追踪基线。

## 1. 故事边界

1. 本文只描述 AI-DLC Core 的 state v2 恢复、角色/目标文档意图、Provider 项目解析、资料选择、ContextBundle 消费、正式文档生成、引用/血缘、逆向说明上传和平台无关恢复。
2. SSOT Provider 的资料治理、解析/索引内部实现和 Portal 旅程由 Provider 仓维护；本文只引用八项批准契约 ID，不复制字段 Schema。
3. Kiro、Claude Code、OpenCode 是同一 Core 语义的薄适配，不形成独立业务项目属性、故事主线或审批门禁。
4. 未配置 SSOT 的 Legacy 项目保持 state v2 和零远程调用；失败不得伪造远端读取、引用、血缘或同步成功。
5. Manifest、事件、远端 CR/impact、完整 Trace 和 state v3 不属于现行故事。

## 2. 用户故事

### ADLC-US-001 从业务工作区 state v2 唯一恢复

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

### ADLC-US-002 五角色意图与目标文档

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

### ADLC-US-003 Provider-first 项目解析

- **作为**：已配置 SSOT 的业务项目用户
- **我希望**：通过 Provider 解析唯一项目和访问上下文
- **以便**：资料消费建立在正确的项目隔离边界上
- **追踪**：`ADLC-FR-003`；`ADLC-NFR-003`、`ADLC-NFR-005`
- **契约**：`SSOT-PROJECT-001`、`SSOT-FAILURE-001`
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: Provider 返回唯一授权项目
  Given 业务工作区已配置项目候选和有效访问上下文
  When AI-DLC 请求 Provider 解析项目
  Then AI-DLC 使用 Provider 返回的唯一项目身份和访问范围进入资料选择

Scenario: 本地配置与 Provider 项目冲突时阻断
  Given 本地配置与 Provider 返回的项目身份冲突
  When AI-DLC 解析项目
  Then 流程停止资料读取并要求修复或显式选择，不按仓库名或目录名静默猜测项目

Scenario: 权限拒绝不得降级绕过
  Given Provider 拒绝当前用户访问目标项目
  When AI-DLC 处理项目解析结果
  Then AI-DLC 保持当前 state v2 步骤，不通过缓存或较低层接口继续读取资料
```

### ADLC-US-004 自动检索与显式资料选择

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

### ADLC-US-005 固定 ContextBundle 与降级透明

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

### ADLC-US-006 正式文档生成与事实分层

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

### ADLC-US-007 片段引用与章节血缘回写

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

### ADLC-US-008 逆向工程说明上传与 Git 事实关联

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

### ADLC-US-009 三平台共享 Core 语义

- **作为**：在 Kiro、Claude Code 或 OpenCode 使用同一项目的角色
- **我希望**：三个客户端共享相同的角色、选择、引用和流程状态语义
- **以便**：切换客户端不会改变业务项目事实或产物
- **追踪**：`ADLC-FR-009`；`ADLC-NFR-001`、`ADLC-NFR-003`、`ADLC-NFR-007`
- **契约**：八项现行契约均由 AI-DLC Core 间接消费
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: 三个平台对相同输入产生一致业务语义
  Given 三个平台读取同一 state v2、角色、目标文档和 Provider 响应
  When 执行资料选择、上下文使用和引用生成
  Then 选择的修订、片段引用和下一流程状态语义一致，平台名称不进入项目事实

Scenario: 适配层差异不得改写 Core 决策
  Given 某个平台的凭据、Hook 或呈现方式与其他平台不同
  When 适配层调用 AI-DLC Core
  Then 差异只影响调用和展示；若改变资料选择或状态语义，则一致性验证失败且流程不继续
```

### ADLC-US-010 Legacy 项目零远程调用

- **作为**：未配置 SSOT 的现有业务项目用户
- **我希望**：升级后继续使用原有本地 AI-DLC 流程且不产生 SSOT 调用
- **以便**：新集成不会给 Legacy 项目增加依赖、门禁或回归
- **追踪**：`ADLC-FR-010`；`ADLC-NFR-002`、`ADLC-NFR-005`、`ADLC-NFR-007`
- **契约**：负向边界；八项在线契约调用数均为 0
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: 未配置项目保持本地流程
  Given 业务项目未配置 SSOT
  When 使用升级后的 AI-DLC 恢复并执行既有流程
  Then SSOT 远程调用数为 0，state v2 和本地流程行为不因本模块受阻

Scenario: 意外远程调用阻断兼容结论
  Given 未配置 SSOT 的 Legacy 黄金场景被执行
  When 观察到任一 SSOT 在线契约调用
  Then Legacy 兼容验证判定失败，不得声明零影响或继续发布该行为
```

### ADLC-US-011 Provider 或索引失败时本地恢复

- **作为**：正在生成文档的业务项目用户
- **我希望**：Provider、权限、解析或索引失败时保留本地流程位置并获得恢复动作
- **以便**：可以从同一 state v2 重试，不会生成虚假远端事实
- **追踪**：`ADLC-FR-011`；`ADLC-NFR-003`、`ADLC-NFR-005`
- **契约**：`SSOT-PROJECT-001`、`SSOT-INDEX-STATUS-001`、`SSOT-FAILURE-001` 及受影响业务契约
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: Provider 不可用时保持当前步骤
  Given Provider 在上下文构建时不可用
  When AI-DLC 处理失败
  Then state v2 当前步骤保持不变，用户看到未取得远端资料、影响范围和恢复动作

Scenario: 部分索引失败时只使用明确降级路径
  Given Provider 返回图索引失败但向量和全文可用
  When AI-DLC 继续资料消费
  Then AI-DLC 只使用 Provider 明确返回的可定位降级结果并记录实际路径

Scenario: 权限或固定修订失败不得静默降级
  Given Provider 返回权限拒绝或固定修订不存在
  When AI-DLC 处理该失败
  Then AI-DLC 阻止生成和血缘写回，不使用缓存伪造读取、引用或同步成功
```

### ADLC-US-012 外部执行事实保持权威边界

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

### ADLC-US-013 真实项目跨平台资料闭环验收

- **作为**：五类角色和产品验收负责人
- **我希望**：在一个真实项目中复现资料选择、正式文档和血缘闭环
- **以便**：只在 Provider 和三平台都有稳定证据时确认首期 Consumer 能力
- **追踪**：`ADLC-FR-013`；`ADLC-NFR-001`—`ADLC-NFR-008`
- **契约**：八项现行契约
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: 真实项目闭环在三平台保持业务语义一致
  Given 一个真实项目包含至少三类资料、两个以上修订并已配置 SSOT
  When 分别通过受支持客户端执行资料选择、上下文、正式文档生成和血缘回写
  Then 实际选择和固定引用可复现，平台差异不改变角色、资料、引用或流程状态语义

Scenario: 显式选择和降级在闭环中可复现
  Given 验收包含资料排除、指定旧版及一次图索引降级
  When 三个平台执行相同业务输入
  Then 每个平台得到相同的最终选择和固定引用，并记录相同的业务降级含义

Scenario: 缺少 Provider 或运行证据时整体保持未验证
  Given 闭环缺少稳定运行标识、Provider 证据、Legacy 零调用或三平台一致性证据中的任一项
  When 汇总端到端结果
  Then 整体状态保持未验证，并列出缺失证据和阻断范围
```

## 3. 追踪矩阵

| 故事 | FR | 画像 | 主要 NFR | 现行契约 |
|------|----|------|----------|----------|
| ADLC-US-001 | ADLC-FR-001 | 001—005 | 001、005、007 | 无在线契约 |
| ADLC-US-002 | ADLC-FR-002 | 001—005 | 001、006 | RETRIEVAL、CONTEXT |
| ADLC-US-003 | ADLC-FR-003 | 001—005 | 003、005 | PROJECT、FAILURE |
| ADLC-US-004 | ADLC-FR-004 | 001—005 | 003、004、006 | MATERIAL、RETRIEVAL、CONTEXT、INDEX-STATUS、FAILURE |
| ADLC-US-005 | ADLC-FR-005 | 001—005 | 003—006 | MATERIAL、RETRIEVAL、CONTEXT、INDEX-STATUS、FAILURE |
| ADLC-US-006 | ADLC-FR-006 | 001—005 | 003、004、006 | MATERIAL、CONTEXT、LINEAGE、FAILURE |
| ADLC-US-007 | ADLC-FR-007 | 001—005 | 003—005 | MATERIAL、LINEAGE、FAILURE |
| ADLC-US-008 | ADLC-FR-008 | 002、004 | 003—005 | REVERSE-DOC、FAILURE |
| ADLC-US-009 | ADLC-FR-009 | 001—005 | 001、003、007 | 全部八项，经 Core 间接消费 |
| ADLC-US-010 | ADLC-FR-010 | 001—005 | 002、005、007 | 全部八项调用数为 0 |
| ADLC-US-011 | ADLC-FR-011 | 001—005 | 003、005 | PROJECT、INDEX-STATUS、FAILURE及受影响契约 |
| ADLC-US-012 | ADLC-FR-012 | 003、005 | 003、004 | MATERIAL、CONTEXT、FAILURE |
| ADLC-US-013 | ADLC-FR-013 | 001—005 | 001—008 | 全部八项 |

### 3.1 契约覆盖

| 契约 ID | 主要故事 |
|---------|----------|
| SSOT-PROJECT-001 | ADLC-US-003、009、011、013 |
| SSOT-MATERIAL-001 | ADLC-US-004—007、009、012、013 |
| SSOT-RETRIEVAL-001 | ADLC-US-002、004、005、009、013 |
| SSOT-CONTEXT-001 | ADLC-US-002、004—006、009、012、013 |
| SSOT-REVERSE-DOC-001 | ADLC-US-008、009、013 |
| SSOT-LINEAGE-001 | ADLC-US-006、007、009、013 |
| SSOT-INDEX-STATUS-001 | ADLC-US-004、005、009、011、013 |
| SSOT-FAILURE-001 | ADLC-US-003—013（ADLC-US-010 为零调用负向边界） |

### 3.2 FR、NFR、角色与血缘结论

- `ADLC-FR-001`—`ADLC-FR-013`：13/13 均有唯一主故事和 Gherkin。
- `ADLC-NFR-001`—`ADLC-NFR-008`：8/8 均映射；性能、质量、超时和重试阈值仍待 I12/I13 冻结。
- 五类画像：5/5 均至少映射一个故事，角色目录保持通用阶段目录，不声称独立模板存在。
- 引用/血缘：`ADLC-US-005` 固定上下文，`ADLC-US-006` 保持事实分层，`ADLC-US-007` 回写章节血缘，`ADLC-US-013` 验证闭环。
- 八项契约：8/8 均有 Consumer 故事映射；当前只是 `candidate-v0` 文档契约，未建立机器 Schema、适配或运行证据。

## 4. INVEST 检查

| 故事范围 | 独立 | 可协商 | 有价值 | 可估计 | 小型 | 可测试 | 结论 |
|----------|------|--------|--------|--------|------|--------|------|
| ADLC-US-001—012 | 是 | 是 | 是 | 是 | 是 | 是 | 通过；每个故事围绕单一 Consumer 业务结果 |
| ADLC-US-013 | 是 | 是 | 是 | 是 | 是 | 是 | 通过；限定一个真实项目、三类资料和明确证据门禁 |

“可估计”只表示范围和依赖可识别，不代表已有工期；实际拆分和工作量由 I11/I14 基于证据确定。

## 5. 负向范围检查

- 未引入 SSOT Provider 内部资料治理、解析/索引实现、Portal 页面或字段级 Schema。
- 未把 Kiro、Claude Code 或 OpenCode 写成业务项目属性或独立故事主线。
- 未引入 state v3、Manifest、事件、远端 CR/impact、完整 Trace 或跨项目共享。
- 未声称独立角色模板、机器 Schema、Provider/Consumer 适配、Legacy 零调用、三平台一致性、契约测试或 E2E 已验证。

## 6. 审批状态

本故事集已按 `CR4-B4-I7-PLAN-APPROVAL-044=A` 生成，并由 SSOT 权威 `CR4-B4-I7-STORY-APPROVAL-045=A` 批准。I7 已完成，下一步仅进入 I8 用户故事交叉验证；不得进入 B5 或实施代码。
