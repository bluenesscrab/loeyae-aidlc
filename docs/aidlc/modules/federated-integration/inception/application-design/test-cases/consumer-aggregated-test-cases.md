# Consumer 聚合测试用例

- 生成时间：`2026-07-20T01:37:03Z`
- 范围：Consumer I13，风险簇 B、E-J
- 产品基线：`docs/aidlc/modules/federated-integration/inception/user-stories/stories.md`
- 技术基线：`docs/aidlc/product/system-baseline/consistency-scenarios.md`
- Provider 契约引用：`../loeyae-ssot-server/contracts/ssot-api-v1.openapi.json`，版本 `1.0.0-candidate.1`
- 执行状态说明：Consumer 当前无 test script、SSOT 适配或运行证据，Provider 当前无实现环境；因此所有用例均为 `status: blocked`、`design_status: ready`、`execution_status: blocked`。静态设计追踪不等于运行验证。

## 通用证据边界

所有用例的未来运行证据必须包含稳定运行标识、不可变提交或制品摘要、适用范围、结果、受控位置、Owner 和 UTC 时间。当前这些运行锚点未登记，本文不提供示例别名、命令、URL、身份、Secret 或报告位置。I14 已生成并由 060=A 批准工作单元，但 12/12 均未认领，C8 尚未执行；本文只建立 I13 设计与追踪基线。

<a id="tc-c-001-s01"></a>
## UC-D TC-C-001-S01 — 业务工作区 state v2 是唯一恢复源

- id: `TC-C-001-S01`
- title: `业务工作区 state v2 是唯一恢复源`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-001/S01`
- story_ref: `ADLC-US-001`
- scenario_ref: `ADLC-US-001/S01`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `I`
- blocked_by: `[runtime_dependencies_ref, test_command_ref, report_location_ref, owner_ref]`

### 来源溯源

```gherkin
Scenario: 业务工作区 state v2 是唯一恢复源
  Given 插件源码仓和业务项目都存在 docs/aidlc/state.md
  When 任一受支持客户端恢复业务项目
  Then 只使用业务项目 state v2，恢复的步骤和产物位置不因客户端或插件状态改变

```

### 执行锚点

- 设计锚点：`component-methods.md#WorkspaceStateRepository--IntegrationModeResolver` 的 `load(workspaceRoot): AidlcStateV2`。
- 运行锚点：Core 运行依赖、测试命令、报告位置与 Owner 未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 在两个位置均存在 state v2 的条件下从业务工作区恢复 | 只读取业务工作区 state v2，恢复步骤与产物位置保持平台无关 |

### 覆盖映射

- 唯一恢复源 → 步骤 1 → 不借用插件源码仓状态。

### 证据要求

- C8 应提供三平台 Core 调用观测、状态来源记录和稳定报告；当前均未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-001-s02"></a>
## UC-D TC-C-001-S02 — 业务 state 缺失或无效时不借用插件状态

- id: `TC-C-001-S02`
- title: `业务 state 缺失或无效时不借用插件状态`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-001/S02`
- story_ref: `ADLC-US-001`
- scenario_ref: `ADLC-US-001/S02`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `I`
- blocked_by: `[runtime_dependencies_ref, test_command_ref, report_location_ref, owner_ref]`

### 来源溯源

```gherkin
Scenario: 业务 state 缺失或无效时不借用插件状态
  Given 当前业务工作区 state v2 缺失或无法有效解析
  When 客户端尝试恢复流程
  Then AI-DLC 停止恢复并报告业务状态问题，不读取插件安装根目录的 state 继续执行
```

### 执行锚点

- 设计锚点：`application-services.md#编排器` 的 `ResumeWorkflowService`。
- 运行锚点：Core 运行依赖、测试命令、报告位置与 Owner 未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 使用缺失和无效 state v2 分别恢复 | 均停止恢复、报告业务状态问题且不读取插件 state |

### 覆盖映射

- 无效恢复边界 → 步骤 1 → 不借用其他状态继续。

### 证据要求

- C8 应保留两类失败输入、状态读取观测与稳定报告；当前均未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-002-s01"></a>
## UC-D TC-C-002-S01 — 测试人员形成测试计划资料意图

- id: `TC-C-002-S01`
- title: `测试人员形成测试计划资料意图`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-002/S01`
- story_ref: `ADLC-US-002`
- scenario_ref: `ADLC-US-002/S01`
- type: `unit`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `E`
- blocked_by: `[runtime_dependencies_ref, test_command_ref, report_location_ref, owner_ref]`

### 来源溯源

```gherkin
Scenario: 测试人员形成测试计划资料意图
  Given 用户声明角色为测试人员且目标文档为测试计划
  When AI-DLC 形成 RoleIntent 和 TargetDocument
  Then 意图包含当前项目、测试计划类型及相关需求和设计资料条件，不把项目执行数据当作权威事实

```

### 执行锚点

- 设计锚点：`component-methods.md#RoleIntentBuilder--ProjectBindingService` 的 `build(...)`。
- 运行锚点：Core 运行依赖、测试命令、报告位置与 Owner 未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 输入测试人员、测试计划和当前项目上下文 | RoleIntent/TargetDocument 含所需资料条件，执行数据不成为权威事实 |

### 覆盖映射

- 角色化资料意图 → 步骤 1 → 意图字段和事实边界同时满足。

### 证据要求

- C8 应提供 Core 输出快照与事实分层断言报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-002-s02"></a>
## UC-D TC-C-002-S02 — 角色或目标文档不明确时请求确认

- id: `TC-C-002-S02`
- title: `角色或目标文档不明确时请求确认`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-002/S02`
- story_ref: `ADLC-US-002`
- scenario_ref: `ADLC-US-002/S02`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `E`
- blocked_by: `[runtime_dependencies_ref, test_command_ref, report_location_ref, owner_ref]`

### 来源溯源

```gherkin
Scenario: 角色或目标文档不明确时请求确认
  Given 当前上下文无法唯一确定角色或目标文档
  When AI-DLC 准备检索资料
  Then AI-DLC 请求用户确认角色和目标文档，不猜测目录、不调用 Provider 扩大检索范围
```

### 执行锚点

- 设计锚点：`application-services.md#编排器` 的 `PrepareMaterialIntentService`。
- 运行锚点：Core 测试命令、报告位置与 Owner 未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 输入无法唯一判定的角色/目标 | 返回用户确认状态，不猜目录且 Gateway 调用数为 0 |

### 覆盖映射

- 意图歧义 → 步骤 1 → 确认请求与零 Provider 调用。

### 证据要求

- C8 应提供 Core 决策及 Gateway 调用观测；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-003-s01"></a>
## UC-D TC-C-003-S01 — Provider 返回唯一授权项目

- id: `TC-C-003-S01`
- title: `Provider 返回唯一授权项目`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-003/S01`
- story_ref: `ADLC-US-003`
- scenario_ref: `ADLC-US-003/S01`
- type: `contract`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `B`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: Provider 返回唯一授权项目
  Given 业务工作区已配置项目候选和有效访问上下文
  When AI-DLC 请求 Provider 解析项目
  Then AI-DLC 使用 Provider 返回的唯一项目身份和访问范围进入资料选择

```

### 执行锚点

- 设计锚点：`ProviderContractGateway.resolveProject` / operationId `resolveProject`。
- 运行锚点：环境、身份、项目、依赖、命令、报告、版本与 Secret 注入引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 以已授权候选调用项目解析 | Consumer 仅采用 Provider 返回的唯一身份和访问范围进入选择 |

### 覆盖映射

- PROJECT Consumer 映射 → 步骤 1 → 唯一授权 binding。

### 证据要求

- C8 应关联 Consumer 契约报告、Provider correlationId 与受控项目证据；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-003-s02"></a>
## UC-D TC-C-003-S02 — 本地配置与 Provider 项目冲突时阻断

- id: `TC-C-003-S02`
- title: `本地配置与 Provider 项目冲突时阻断`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-003/S02`
- story_ref: `ADLC-US-003`
- scenario_ref: `ADLC-US-003/S02`
- type: `contract`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `B`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 本地配置与 Provider 项目冲突时阻断
  Given 本地配置与 Provider 返回的项目身份冲突
  When AI-DLC 解析项目
  Then 流程停止资料读取并要求修复或显式选择，不按仓库名或目录名静默猜测项目

```

### 执行锚点

- 设计锚点：`ProjectBindingService.assertBinding(...)`。
- 运行锚点：在线契约执行所需引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 让本地 binding 与 Provider 身份冲突 | 停止读取并要求修复/选择，不从仓库或目录名猜测 |

### 覆盖映射

- 项目冲突 → 步骤 1 → 阻断且零后续资料读取。

### 证据要求

- C8 应提供项目 binding、后续调用观测和阻断报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-003-s03"></a>
## UC-D TC-C-003-S03 — 权限拒绝不得降级绕过

- id: `TC-C-003-S03`
- title: `权限拒绝不得降级绕过`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-003/S03`
- story_ref: `ADLC-US-003`
- scenario_ref: `ADLC-US-003/S03`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `B`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 权限拒绝不得降级绕过
  Given Provider 拒绝当前用户访问目标项目
  When AI-DLC 处理项目解析结果
  Then AI-DLC 保持当前 state v2 步骤，不通过缓存或较低层接口继续读取资料
```

### 执行锚点

- 设计锚点：`RecoveryCoordinator.decide(...)` 的权限拒绝 `Block` 边界。
- 运行锚点：Provider 环境、拒绝身份及 Consumer 执行证据未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | Provider 返回权限拒绝 | state v2 步骤不变，缓存/低层读取调用数为 0 |

### 覆盖映射

- 越权零泄露 → 步骤 1 → 不降级、不推进、不读取。

### 证据要求

- C8 应提供拒绝响应、state 差异和网络调用观测；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-004-s01"></a>
## UC-D TC-C-004-S01 — 自动选择叠加排除和指定旧版

- id: `TC-C-004-S01`
- title: `自动选择叠加排除和指定旧版`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-004/S01`
- story_ref: `ADLC-US-004`
- scenario_ref: `ADLC-US-004/S01`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `E`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 自动选择叠加排除和指定旧版
  Given 自动检索选中 M1/R2 和 M2/R1，用户排除 M2 并指定 M3/R4
  When AI-DLC 确认 MaterialSelection
  Then 最终选择只包含 M1/R2 与 M3/R4，并记录每项自动选择、排除和旧版理由

```

### 执行锚点

- 设计锚点：`MaterialSelectionService.select(...)`，exclude 优先且旧版固定。
- 运行锚点：Provider/Consumer 集成环境与证据引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 对自动结果应用排除和旧版指定 | 结果仅含 M1/R2、M3/R4，三类理由完整 |

### 覆盖映射

- include/exclude/old revision → 步骤 1 → 固定选择且理由可追踪。

### 证据要求

- C8 应提供检索响应、选择结果和理由快照；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-004-s02"></a>
## UC-D TC-C-004-S02 — 低置信冲突或范围过大时请求确认

- id: `TC-C-004-S02`
- title: `低置信冲突或范围过大时请求确认`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-004/S02`
- story_ref: `ADLC-US-004`
- scenario_ref: `ADLC-US-004/S02`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `E`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 低置信冲突或范围过大时请求确认
  Given Provider 返回低置信、来源冲突或超出目标文档预算的候选资料
  When AI-DLC 评估候选范围
  Then AI-DLC 展示需要确认的资料和原因，不静默扩展、合并或删除冲突来源

```

### 执行锚点

- 设计锚点：`MaterialSelectionService.select(...)` 的 `NeedsConfirmation`。
- 运行锚点：量化阈值及在线执行引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 分别触发低置信、冲突和预算超限 | 均请求确认并展示原因，不静默改写范围 |

### 覆盖映射

- 低置信/冲突/预算 → 步骤 1 → 三类确认边界。

### 证据要求

- C8 应关联批准阈值、三类输入与决策报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-004-s03"></a>
## UC-D TC-C-004-S03 — 排除资料重新出现时阻止生成

- id: `TC-C-004-S03`
- title: `排除资料重新出现时阻止生成`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-004/S03`
- story_ref: `ADLC-US-004`
- scenario_ref: `ADLC-US-004/S03`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `E`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 排除资料重新出现时阻止生成
  Given 用户已显式排除资料 M2
  When Provider 响应或后续选择结果再次包含 M2
  Then AI-DLC 阻止进入上下文生成并报告排除约束冲突
```

### 执行锚点

- 设计锚点：`ContextBundleValidator.validate(...)` 的排除命中阻断。
- 运行锚点：在线执行和报告引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 在响应或后续选择中重新注入 M2 | 上下文生成调用数为 0并报告排除冲突 |

### 覆盖映射

- exclude 不变量 → 步骤 1 → 排除项不得重新进入。

### 证据要求

- C8 应提供选择、bundle 调用观测和阻断报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-005-s01"></a>
## UC-D TC-C-005-S01 — Consumer 保持上下文中的固定来源状态

- id: `TC-C-005-S01`
- title: `Consumer 保持上下文中的固定来源状态`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-005/S01`
- story_ref: `ADLC-US-005`
- scenario_ref: `ADLC-US-005/S01`
- type: `contract`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `E`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: Consumer 保持上下文中的固定来源状态
  Given Provider 返回固定资料、修订、片段、讨论状态、检索路径和预算的 ContextBundle
  When AI-DLC 接收该上下文包
  Then AI-DLC 原样保留来源与状态并仅将包内片段用于当前目标文档

```

### 执行锚点

- 设计锚点：`ContextBundleValidator.validate(...)` 和 operationId `createContextBundle`。
- 运行锚点：Provider 环境、项目、阈值和 Consumer 报告引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 校验固定 ContextBundle | 固定字段与状态原样保留，生成输入不包含包外片段 |

### 覆盖映射

- 固定 bundle 与数据最小化 → 步骤 1 → 不漂移、不扩展。

### 证据要求

- C8 应提供契约响应、校验结果和生成输入观测；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-005-s02"></a>
## UC-D TC-C-005-S02 — GraphRAG 不可用时展示实际降级

- id: `TC-C-005-S02`
- title: `GraphRAG 不可用时展示实际降级`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-005/S02`
- story_ref: `ADLC-US-005`
- scenario_ref: `ADLC-US-005/S02`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `E`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: GraphRAG 不可用时展示实际降级
  Given Provider 标明 GraphRAG 不可用并降级到向量和全文
  When AI-DLC 使用 ContextBundle
  Then AI-DLC 记录并展示实际降级路径，只引用返回的具体修订和片段

```

### 执行锚点

- 设计锚点：`ContextBundleValidator` 的 `IndexDegradation` 与 `getRevisionIndexStatus`。
- 运行锚点：故障注入、Provider 环境和报告引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | Provider 返回图不可用及向量/全文降级 | Consumer 展示同一路径且引用仅来自返回固定条目 |

### 覆盖映射

- 显式降级 → 步骤 1 → 保留实际路径和固定引用。

### 证据要求

- C8 应提供索引状态、bundle 降级字段与引用结果；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-005-s03"></a>
## UC-D TC-C-005-S03 — 固定修订缺失或跨项目内容时拒绝生成

- id: `TC-C-005-S03`
- title: `固定修订缺失或跨项目内容时拒绝生成`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-005/S03`
- story_ref: `ADLC-US-005`
- scenario_ref: `ADLC-US-005/S03`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `E`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, project_ref_02, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 固定修订缺失或跨项目内容时拒绝生成
  Given ContextBundle 包含无法解析的固定修订或不属于当前项目的内容
  When AI-DLC 校验上下文
  Then AI-DLC 阻止正式文档生成，保留当前流程步骤并报告来源完整性问题
```

### 执行锚点

- 设计锚点：`ContextBundleValidator.validate(...)` 的固定引用和项目隔离阻断。
- 运行锚点：两个受控项目、在线环境及报告引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 分别提供缺失修订和跨项目条目 | 均阻止生成、保持 state v2 步骤并报告完整性问题 |

### 覆盖映射

- 固定修订/项目隔离 → 步骤 1 → 两类输入均不可生成。

### 证据要求

- C8 应提供双项目隔离数据、state 差异和生成调用观测；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-006-s01"></a>
## UC-D TC-C-006-S01 — 生成文档明确区分四类事实状态

- id: `TC-C-006-S01`
- title: `生成文档明确区分四类事实状态`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-006/S01`
- story_ref: `ADLC-US-006`
- scenario_ref: `ADLC-US-006/S01`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `F`
- blocked_by: `[runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, owner_ref]`

### 来源溯源

```gherkin
Scenario: 生成文档明确区分四类事实状态
  Given 上下文包含已确认资料、未确认评论、显式结论和模型推断
  When AI-DLC 在目标阶段目录生成正式文档
  Then 四类内容具有可辨识的来源状态，正文保存在业务项目工作区并可由 Git 管理

```

### 执行锚点

- 设计锚点：`FormalDocumentGenerator.generate(...)` 与 `commit(...)`。
- 运行锚点：Core 依赖、受控项目、命令、报告与 Owner 未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 用四类事实生成并提交文档 | 四类状态可辨识，正文仅落业务工作区/Git |

### 覆盖映射

- 事实分层/正文 Owner → 步骤 1 → 状态清晰且本地权威。

### 证据要求

- C8 应提供生成物 hash、Git 引用和事实分层检查报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-006-s02"></a>
## UC-D TC-C-006-S02 — 未确认内容不得写成批准事实

- id: `TC-C-006-S02`
- title: `未确认内容不得写成批准事实`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-006/S02`
- story_ref: `ADLC-US-006`
- scenario_ref: `ADLC-US-006/S02`
- type: `unit`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `F`
- blocked_by: `[runtime_dependencies_ref, test_command_ref, report_location_ref, owner_ref]`

### 来源溯源

```gherkin
Scenario: 未确认内容不得写成批准事实
  Given 生成草稿把未确认评论或模型推断表达为已批准结论
  When AI-DLC 执行内容校验
  Then 校验阻止该草稿进入待审批正式基线，并指出需要纠正的来源状态
```

### 执行锚点

- 设计锚点：`GenerateFormalDocumentService` 的内容校验边界。
- 运行锚点：Core 测试命令、报告和 Owner 未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 分别把评论和推断伪装为批准事实 | 两者均被阻止进入正式基线并定位来源状态错误 |

### 覆盖映射

- 事实分层校验 → 步骤 1 → 未确认内容不得升级。

### 证据要求

- C8 应提供两类违规草稿和校验报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-007-s01"></a>
## UC-D TC-C-007-S01 — 有来源章节形成固定引用和血缘

- id: `TC-C-007-S01`
- title: `有来源章节形成固定引用和血缘`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-007/S01`
- story_ref: `ADLC-US-007`
- scenario_ref: `ADLC-US-007/S01`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `F`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 有来源章节形成固定引用和血缘
  Given 正式文档包含若干由 ContextBundle 资料支撑的章节
  When AI-DLC 保存文档并回写 FragmentCitation、DocumentSection 和 LineageRecord
  Then 每个有来源章节都能定位到实际使用的资料修订和片段，正文仍留在项目工作区

```

### 执行锚点

- 设计锚点：`CitationAssembler`、`LineagePublicationQueue` 与 `publishLineageRecords`。
- 运行锚点：在线环境、项目、版本、命令和报告引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 保存文档并发布章节血缘 | 每个有来源章节解析到实际 revision/fragment，正文未发送为远端权威 |

### 覆盖映射

- 固定 citation/lineage → 步骤 1 → 章节可解析且正文 Owner 不变。

### 证据要求

- C8 应提供本地 artifact、发布/查询结果与固定引用解析证据；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-007-s02"></a>
## UC-D TC-C-007-S02 — 源资料更新后历史引用保持原修订

- id: `TC-C-007-S02`
- title: `源资料更新后历史引用保持原修订`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-007/S02`
- story_ref: `ADLC-US-007`
- scenario_ref: `ADLC-US-007/S02`
- type: `contract`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `F`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 源资料更新后历史引用保持原修订
  Given 文档章节引用 R1/F1 且源资料随后形成 R2
  When 用户检查原章节来源
  Then 章节引用仍解析到 R1/F1，只有新的生成任务默认使用 R2

```

### 执行锚点

- 设计锚点：`CitationAssembler.assemble(...)` 与 `getMaterialRevision`。
- 运行锚点：版本化项目数据和在线执行引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 在 R2 形成后解析历史章节并启动新任务 | 历史仍为 R1/F1，新任务才默认 R2 |

### 覆盖映射

- 固定历史引用/最新默认 → 步骤 1 → 两类任务互不漂移。

### 证据要求

- C8 应提供修订链、历史解析和新任务选择报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-007-s03"></a>
## UC-D TC-C-007-S03 — 血缘写回失败时不标记同步完成

- id: `TC-C-007-S03`
- title: `血缘写回失败时不标记同步完成`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-007/S03`
- story_ref: `ADLC-US-007`
- scenario_ref: `ADLC-US-007/S03`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `G`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 血缘写回失败时不标记同步完成
  Given 正式文档已保存但 Provider 血缘写回失败
  When AI-DLC 更新流程状态
  Then 文档保留待回写状态和恢复动作，state v2 不记录虚假的已同步结果
```

### 执行锚点

- 设计锚点：`LineagePublicationQueue.publish(...)` 的 `PendingRetry` 边界。
- 运行锚点：故障注入、在线环境和执行证据引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 在本地提交后注入血缘发布失败 | 文档保留、待恢复动作存在、state v2 无 synced 假值 |

### 覆盖映射

- 写回失败恢复 → 步骤 1 → 不删除正文、不伪造同步。

### 证据要求

- C8 应提供失败响应、state 差异和待恢复记录；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-008-s01"></a>
## UC-D TC-C-008-S01 — 上传说明形成固定 Provider 修订引用

- id: `TC-C-008-S01`
- title: `上传说明形成固定 Provider 修订引用`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-008/S01`
- story_ref: `ADLC-US-008`
- scenario_ref: `ADLC-US-008/S01`
- type: `contract`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `F`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 上传说明形成固定 Provider 修订引用
  Given 当前仓库 commit 为 C1 且逆向说明内容哈希为 H1
  When AI-DLC 上传说明及仓库路径、C1 和 H1
  Then AI-DLC 保存 Provider 返回的固定说明修订引用，源代码和 Git 历史不被修改

```

### 执行锚点

- 设计锚点：`ReverseDocumentUploader.uploadReverse(...)` / `createReverseDocumentRevision`。
- 运行锚点：Provider 环境、项目和 Consumer 执行证据引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 校验 path/commit/hash 后上传 | 保存固定远端 revision ref，代码与 Git 历史无修改 |

### 覆盖映射

- Git 事实关联 → 步骤 1 → 固定修订且 Git 只读。

### 证据要求

- C8 应提供上传请求/响应、Git 前后状态与远端修订解析；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-008-s02"></a>
## UC-D TC-C-008-S02 — 说明变化后上传新修订

- id: `TC-C-008-S02`
- title: `说明变化后上传新修订`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-008/S02`
- story_ref: `ADLC-US-008`
- scenario_ref: `ADLC-US-008/S02`
- type: `contract`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `F`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 说明变化后上传新修订
  Given 已上传 D1/C1 且当前仓库和说明已更新为 D2/C2
  When AI-DLC 再次上传
  Then 新说明形成独立修订并成为当前说明，D1/C1 仍可按固定引用读取

```

### 执行锚点

- 设计锚点：`ReverseDocumentUploader` 的新 commit/content 新上传边界。
- 运行锚点：版本化项目数据和执行证据引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 在 D1/C1 后上传 D2/C2 | 新修订成为当前，旧 D1/C1 固定引用仍可读 |

### 覆盖映射

- 修订并存 → 步骤 1 → 新旧引用均正确。

### 证据要求

- C8 应提供两次上传、当前指针和旧修订读取证据；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-008-s03"></a>
## UC-D TC-C-008-S03 — commit 或内容哈希错配时不得完成

- id: `TC-C-008-S03`
- title: `commit 或内容哈希错配时不得完成`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-008/S03`
- story_ref: `ADLC-US-008`
- scenario_ref: `ADLC-US-008/S03`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `F`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: commit 或内容哈希错配时不得完成
  Given 上传参数中的 commit 或内容哈希与当前选定说明不一致
  When AI-DLC 校验并提交上传
  Then AI-DLC 阻止完成或保留冲突状态，不记录虚假的上传成功或修改代码事实
```

### 执行锚点

- 设计锚点：`ReverseDocumentUploader.prepareReverse(...)` 的错配 `Rejected`。
- 运行锚点：Core/Provider 执行证据引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 分别制造 commit 与 hash 错配 | 均不完成上传、不记录成功且不修改代码事实 |

### 覆盖映射

- Git 错配 → 步骤 1 → 两类错配都安全阻断。

### 证据要求

- C8 应提供错配输入、Gateway 调用观测和 Git 前后状态；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-009-s01"></a>
## UC-D TC-C-009-S01 — 三个平台对相同输入产生一致业务语义

- id: `TC-C-009-S01`
- title: `三个平台对相同输入产生一致业务语义`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-009/S01`
- story_ref: `ADLC-US-009`
- scenario_ref: `ADLC-US-009/S01`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, kiro-power, claude-plugin, opencode-plugin]`
- risk_cluster: `I`
- blocked_by: `[owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref]`

### 来源溯源

```gherkin
Scenario: 三个平台对相同输入产生一致业务语义
  Given 三个平台读取同一 state v2、角色、目标文档和 Provider 响应
  When 执行资料选择、上下文使用和引用生成
  Then 选择的修订、片段引用和下一流程状态语义一致，平台名称不进入项目事实

```

### 执行锚点

- 设计锚点：`components.md#平台端口` 的 KiroAdapter、ClaudeAdapter、OpenCodeAdapter。
- 运行锚点：三平台依赖、conformance 命令、报告、Owner 和版本矩阵未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 三适配器向同一 Core 提交相同输入 | 修订、片段、下一状态等价且项目事实无平台名 |

### 覆盖映射

- 共享 Core conformance → 步骤 1 → 只比较语义，不复制业务场景。

### 证据要求

- C8 应提供单一参数集、三适配器输出和语义差异报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-009-s02"></a>
## UC-D TC-C-009-S02 — 适配层差异不得改写 Core 决策

- id: `TC-C-009-S02`
- title: `适配层差异不得改写 Core 决策`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-009/S02`
- story_ref: `ADLC-US-009`
- scenario_ref: `ADLC-US-009/S02`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, kiro-power, claude-plugin, opencode-plugin]`
- risk_cluster: `I`
- blocked_by: `[owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 适配层差异不得改写 Core 决策
  Given 某个平台的凭据、Hook 或呈现方式与其他平台不同
  When 适配层调用 AI-DLC Core
  Then 差异只影响调用和展示；若改变资料选择或状态语义，则一致性验证失败且流程不继续
```

### 执行锚点

- 设计锚点：`component-dependency.md#依赖禁止项` 的平台→Core 单向边界。
- 运行锚点：三平台依赖、凭据注入、命令、报告和版本矩阵未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 改变适配层凭据/Hook/呈现而保持 Core 输入语义 | Core 决策不变；任何语义差异均使 conformance 失败并停止 |

### 覆盖映射

- 薄适配边界 → 步骤 1 → 差异只限调用与展示。

### 证据要求

- C8 应提供三适配器差异配置和 Core 决策对比；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-010-s01"></a>
## UC-D TC-C-010-S01 — 未配置项目保持本地流程

- id: `TC-C-010-S01`
- title: `未配置项目保持本地流程`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-010/S01`
- story_ref: `ADLC-US-010`
- scenario_ref: `ADLC-US-010/S01`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `H`
- blocked_by: `[owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref]`

### 来源溯源

```gherkin
Scenario: 未配置项目保持本地流程
  Given 业务项目未配置 SSOT
  When 使用升级后的 AI-DLC 恢复并执行既有流程
  Then SSOT 远程调用数为 0，state v2 和本地流程行为不因本模块受阻

```

### 执行锚点

- 设计锚点：`application-services.md#Legacy 分支`，Gateway 不构建且八项调用为 0。
- 运行锚点：Legacy 黄金运行依赖、命令、报告、Owner 和版本矩阵未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 在 endpoint 与 project candidate 均缺失时运行既有流程 | 八项在线契约调用总数为 0，state v2 与本地流程继续 |

### 覆盖映射

- Legacy 零调用 → 步骤 1 → 未配置不产生远程依赖。

### 证据要求

- C8 应提供网络调用观测、state 差异和黄金场景报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-010-s02"></a>
## UC-D TC-C-010-S02 — 意外远程调用阻断兼容结论

- id: `TC-C-010-S02`
- title: `意外远程调用阻断兼容结论`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-010/S02`
- story_ref: `ADLC-US-010`
- scenario_ref: `ADLC-US-010/S02`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `H`
- blocked_by: `[owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref]`

### 来源溯源

```gherkin
Scenario: 意外远程调用阻断兼容结论
  Given 未配置 SSOT 的 Legacy 黄金场景被执行
  When 观察到任一 SSOT 在线契约调用
  Then Legacy 兼容验证判定失败，不得声明零影响或继续发布该行为
```

### 执行锚点

- 设计锚点：`component-dependency.md#Legacy 数据流` 的任一调用即失败。
- 运行锚点：Legacy 黄金环境、调用观测命令和报告位置未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 向 Legacy 观测中注入任一在线契约调用 | 兼容验证失败且不能形成零影响/发布结论 |

### 覆盖映射

- Legacy 负向门禁 → 步骤 1 → 任一远程调用均失败。

### 证据要求

- C8 应提供故障注入、调用观测和发布门禁结果；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-011-s01"></a>
## UC-D TC-C-011-S01 — Provider 不可用时保持当前步骤

- id: `TC-C-011-S01`
- title: `Provider 不可用时保持当前步骤`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-011/S01`
- story_ref: `ADLC-US-011`
- scenario_ref: `ADLC-US-011/S01`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `G`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: Provider 不可用时保持当前步骤
  Given Provider 在上下文构建时不可用
  When AI-DLC 处理失败
  Then state v2 当前步骤保持不变，用户看到未取得远端资料、影响范围和恢复动作

```

### 执行锚点

- 设计锚点：`RecoverRemoteActionService` 与 `CONS-ADLC-RECOVERY-001`。
- 运行锚点：故障注入、恢复阈值和完整在线证据引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 上下文构建期间使 Provider 不可用 | state 步骤不变，明确未取得资料、影响和恢复动作 |

### 覆盖映射

- Provider 故障恢复 → 步骤 1 → 不推进且恢复信息完整。

### 证据要求

- C8 应提供故障窗口、state 前后值和恢复动作报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-011-s02"></a>
## UC-D TC-C-011-S02 — 部分索引失败时只使用明确降级路径

- id: `TC-C-011-S02`
- title: `部分索引失败时只使用明确降级路径`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-011/S02`
- story_ref: `ADLC-US-011`
- scenario_ref: `ADLC-US-011/S02`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `G`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 部分索引失败时只使用明确降级路径
  Given Provider 返回图索引失败但向量和全文可用
  When AI-DLC 继续资料消费
  Then AI-DLC 只使用 Provider 明确返回的可定位降级结果并记录实际路径

```

### 执行锚点

- 设计锚点：`RecoveryCoordinator` 的 `Degrade` 与 `getRevisionIndexStatus`。
- 运行锚点：Provider 故障状态、在线环境和报告引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 返回图失败及可定位向量/全文结果 | 只消费返回结果并记录实际降级路径 |

### 覆盖映射

- 部分索引失败 → 步骤 1 → 显式降级而非伪造完整能力。

### 证据要求

- C8 应提供索引状态、消费输入与降级记录；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-011-s03"></a>
## UC-D TC-C-011-S03 — 权限或固定修订失败不得静默降级

- id: `TC-C-011-S03`
- title: `权限或固定修订失败不得静默降级`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-011/S03`
- story_ref: `ADLC-US-011`
- scenario_ref: `ADLC-US-011/S03`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `G`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 权限或固定修订失败不得静默降级
  Given Provider 返回权限拒绝或固定修订不存在
  When AI-DLC 处理该失败
  Then AI-DLC 阻止生成和血缘写回，不使用缓存伪造读取、引用或同步成功
```

### 执行锚点

- 设计锚点：`RecoveryCoordinator.decide(...)` 的不可重试 `Block`。
- 运行锚点：拒绝/缺失故障数据和在线证据引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 分别返回权限拒绝和固定修订缺失 | 生成/血缘调用为 0，缓存不产生读取、引用或同步成功 |

### 覆盖映射

- 不可重试失败 → 步骤 1 → 不静默降级或伪造事实。

### 证据要求

- C8 应提供两类错误、后续调用观测和 state 结果；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-012-s01"></a>
## UC-D TC-C-012-S01 — 稳定外部运行标识作为证据引用

- id: `TC-C-012-S01`
- title: `稳定外部运行标识作为证据引用`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-012/S01`
- story_ref: `ADLC-US-012`
- scenario_ref: `ADLC-US-012/S01`
- type: `e2e`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `J`
- blocked_by: `[owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref]`

### 来源溯源

```gherkin
Scenario: 稳定外部运行标识作为证据引用
  Given 测试平台提供稳定运行标识、适用范围、结果位置和时间
  When AI-DLC 生成测试报告框架
  Then 文档引用该证据并注明测试平台为执行事实权威

```

### 执行锚点

- 设计锚点：`execution-plan.md#风险评估` 的外部证据要求。
- 运行锚点：测试命令、稳定报告位置和 Owner 未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 输入完整稳定外部证据元数据 | 报告框架引用证据并标注外部平台为执行事实权威 |

### 覆盖映射

- 外部执行权威 → 步骤 1 → 证据可追踪且权威边界明确。

### 证据要求

- C8 应提供真实稳定运行标识及受控结果位置；当前未登记，不能执行本用例。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-012-s02"></a>
## UC-D TC-C-012-S02 — 口头通过声明保持未验证

- id: `TC-C-012-S02`
- title: `口头通过声明保持未验证`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-012/S02`
- story_ref: `ADLC-US-012`
- scenario_ref: `ADLC-US-012/S02`
- type: `unit`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `J`
- blocked_by: `[owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref]`

### 来源溯源

```gherkin
Scenario: 口头通过声明保持未验证
  Given 沟通资料声称测试已通过但没有测试平台运行标识
  When AI-DLC 生成测试报告框架
  Then 该声明被标记为未验证资料，不生成测试实际通过的结论

```

### 执行锚点

- 设计锚点：`GenerateFormalDocumentService` 的事实分层校验。
- 运行锚点：Core 测试命令、报告与 Owner 未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 输入无稳定运行标识的口头通过资料 | 输出保持未验证且无实际通过结论 |

### 覆盖映射

- 无权威证据 → 步骤 1 → 不提升为执行事实。

### 证据要求

- C8 应提供输入资料与生成结果差异；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-012-s03"></a>
## UC-D TC-C-012-S03 — 事实分层校验阻止虚假通过

- id: `TC-C-012-S03`
- title: `事实分层校验阻止虚假通过`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-012/S03`
- story_ref: `ADLC-US-012`
- scenario_ref: `ADLC-US-012/S03`
- type: `unit`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `J`
- blocked_by: `[owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref]`

### 来源溯源

```gherkin
Scenario: 事实分层校验阻止虚假通过
  Given 草稿把无稳定证据的外部声明写成已完成或已通过
  When AI-DLC 校验正式文档
  Then 草稿不能进入待审批基线，并指出缺失的外部权威证据
```

### 执行锚点

- 设计锚点：`FormalDocumentGenerator` 的事实状态边界。
- 运行锚点：Core 测试命令、报告与 Owner 未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 校验包含无证据完成/通过结论的草稿 | 阻止进入待审批基线并指出缺失证据 |

### 覆盖映射

- 虚假通过防护 → 步骤 1 → 基线门禁失败且原因明确。

### 证据要求

- C8 应提供违规草稿、校验结果和门禁状态；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-013-s01"></a>
## UC-D TC-C-013-S01 — 真实项目闭环在三平台保持业务语义一致

- id: `TC-C-013-S01`
- title: `真实项目闭环在三平台保持业务语义一致`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-013/S01`
- story_ref: `ADLC-US-013`
- scenario_ref: `ADLC-US-013/S01`
- type: `e2e`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, kiro-power, claude-plugin, opencode-plugin, ssot-api]`
- risk_cluster: `J`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 真实项目闭环在三平台保持业务语义一致
  Given 一个真实项目包含至少三类资料、两个以上修订并已配置 SSOT
  When 分别通过受支持客户端执行资料选择、上下文、正式文档生成和血缘回写
  Then 实际选择和固定引用可复现，平台差异不改变角色、资料、引用或流程状态语义

```

### 执行锚点

- 设计锚点：`application-services.md#Online 主流程` 与 `components.md#平台端口`。
- 运行锚点：真实脱敏项目、Provider 环境、三平台命令、报告和版本矩阵未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 三平台经 Core 执行同一真实项目闭环 | 选择/固定引用可复现且角色、资料、引用、state 语义一致 |

### 覆盖映射

- 真实闭环/三平台 → 步骤 1 → 单一业务语义而非三份业务复制。

### 证据要求

- C8 应提供稳定项目引用、三平台运行 ID、Provider 证据和语义对比；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-013-s02"></a>
## UC-D TC-C-013-S02 — 显式选择和降级在闭环中可复现

- id: `TC-C-013-S02`
- title: `显式选择和降级在闭环中可复现`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-013/S02`
- story_ref: `ADLC-US-013`
- scenario_ref: `ADLC-US-013/S02`
- type: `e2e`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, kiro-power, claude-plugin, opencode-plugin, ssot-api]`
- risk_cluster: `J`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 显式选择和降级在闭环中可复现
  Given 验收包含资料排除、指定旧版及一次图索引降级
  When 三个平台执行相同业务输入
  Then 每个平台得到相同的最终选择和固定引用，并记录相同的业务降级含义

```

### 执行锚点

- 设计锚点：`SelectMaterialService`、`ContextBundleValidator` 与三平台端口。
- 运行锚点：阈值、故障注入、真实项目及三平台证据引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 三平台执行排除、旧版、图降级的同一输入 | 最终选择、固定引用和业务降级含义相同 |

### 覆盖映射

- 显式选择/降级 conformance → 步骤 1 → 三端语义等价。

### 证据要求

- C8 应提供同一参数集、故障记录和三平台结果对比；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

---

<a id="tc-c-013-s03"></a>
## UC-D TC-C-013-S03 — 缺少 Provider 或运行证据时整体保持未验证

- id: `TC-C-013-S03`
- title: `缺少 Provider 或运行证据时整体保持未验证`
- source_ref: `docs/aidlc/modules/federated-integration/inception/user-stories/stories.md#ADLC-US-013/S03`
- story_ref: `ADLC-US-013`
- scenario_ref: `ADLC-US-013/S03`
- type: `e2e`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, kiro-power, claude-plugin, opencode-plugin, ssot-api]`
- risk_cluster: `J`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, project_ref_02, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref]`

### 来源溯源

```gherkin
Scenario: 缺少 Provider 或运行证据时整体保持未验证
  Given 闭环缺少稳定运行标识、Provider 证据、Legacy 零调用或三平台一致性证据中的任一项
  When 汇总端到端结果
  Then 整体状态保持未验证，并列出缺失证据和阻断范围
```

### 执行锚点

- 设计锚点：`execution-plan.md#发布、回滚与停止条件` 第 7 项。
- 运行锚点：12 项登记键当前均未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 逐项移除四类必需证据并汇总 | 每种缺失都使整体未验证，并列出缺项与阻断范围 |

### 覆盖映射

- C8 证据完整性 → 步骤 1 → 缺一不可声明完成。

### 证据要求

- C8 应提供四类证据清单及完整性门禁输出；当前全部未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从批准故事原样派生；无运行执行。

# 技术风险用例

<a id="tc-c-tech-001"></a>
## UC-D TC-C-TECH-001 — 本地文档提交与血缘准备原子边界

- id: `TC-C-TECH-001`
- title: `本地文档提交与血缘准备原子边界`
- source_ref: `docs/aidlc/product/system-baseline/consistency-scenarios.md#CONS-ADLC-DOC-001`
- story_ref: `不适用`
- scenario_ref: `CONS-ADLC-DOC-001`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `F`
- blocked_by: `[owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref]`

### 来源溯源

- 不可变预期：本地文件/Git 成功后才准备血缘；本地失败不得调用血缘；`generationId` 与章节 content hash 可对账。

### 执行锚点

- 设计锚点：`FormalDocumentGenerator.commit(...)`、`CitationAssembler.assemble(...)`、`CONS-ADLC-DOC-001`。
- 运行锚点：项目、依赖、命令、报告与 Owner 未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 分别模拟本地提交成功与失败 | 成功后才形成待发布血缘；失败时远端发布调用为 0 |
| 2 | 对账 generationId、Git commit、文档 hash | 三者稳定关联且章节 hash 无漂移 |

### 覆盖映射

- `CONS-ADLC-DOC-001` → 步骤 1-2 → 提交点、Owner 和对账不变量。

### 证据要求

- C8 应保留 Git/文档 hash、队列状态和 Gateway 调用观测；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从系统基线派生；无运行执行。

---

<a id="tc-c-tech-002"></a>
## UC-D TC-C-TECH-002 — PROJECT 契约解析与越权零泄露

- id: `TC-C-TECH-002`
- title: `PROJECT 契约解析与越权零泄露`
- source_ref: `../loeyae-ssot-server/contracts/ssot-api-v1.openapi.json#/paths/~1v1~1projects:resolve/post`
- story_ref: `不适用`
- scenario_ref: `SSOT-PROJECT-001/resolveProject`
- type: `contract`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `B`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, project_ref_02, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

- 不可变预期：Consumer 通过 operationId `resolveProject` 消费唯一授权 binding；歧义、不存在、冲突或越权均阻断，且不得泄露另一项目事实。

### 执行锚点

- 设计锚点：`ProviderContractGateway.resolveProject`、`ProjectBindingService.assertBinding(...)`。
- 运行锚点：Provider 实现环境、身份、双项目、版本和执行证据引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 覆盖唯一、歧义、不存在、冲突和越权响应 | 仅唯一授权结果继续；其他结果阻断且跨项目资料泄露为 0 |

### 覆盖映射

- `SSOT-PROJECT-001` → 步骤 1 → PROJECT Consumer 映射与 B 簇隔离风险。

### 证据要求

- C8 应关联契约版本 header、correlationId、双项目隔离观测和 Consumer 决策；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 引用 Provider OpenAPI 派生；不复制 Schema，无运行执行。

---

<a id="tc-c-tech-003"></a>
## UC-D TC-C-TECH-003 — MATERIAL 与 RETRIEVAL 固定选择映射

- id: `TC-C-TECH-003`
- title: `MATERIAL 与 RETRIEVAL 固定选择映射`
- source_ref: `../loeyae-ssot-server/contracts/ssot-api-v1.openapi.json#/paths/~1v1~1projects~1{projectId}~1retrieval:search/post;../loeyae-ssot-server/contracts/ssot-api-v1.openapi.json#/paths/~1v1~1projects~1{projectId}~1materials~1{materialId}~1revisions~1{revisionId}/get`
- story_ref: `不适用`
- scenario_ref: `SSOT-RETRIEVAL-001/searchProjectMaterials+SSOT-MATERIAL-001/getMaterialRevision`
- type: `contract`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `E`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref]`

### 来源溯源

- 不可变预期：`searchProjectMaterials` 的实际路径、置信和降级可见；`getMaterialRevision` 固定旧版可读且不漂移；exclude 优先。

### 执行锚点

- 设计锚点：`MaterialSelectionService.select(...)` 与两个 Provider operationId。
- 运行锚点：Provider 环境、项目、阈值、版本和执行证据引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 检索后叠加 include/exclude/old revision | 排除命中为 0，旧版固定，实际检索路径和理由保留 |
| 2 | 源资料形成新修订后重读固定旧版 | 固定 revision/fragment 不漂移 |

### 覆盖映射

- `SSOT-RETRIEVAL-001` → 步骤 1 → 检索路径与选择；`SSOT-MATERIAL-001` → 步骤 2 → 固定版本。

### 证据要求

- C8 应提供两个 operationId 的契约报告、选择结果和修订链；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 引用 Provider OpenAPI 派生；不复制 Schema，无运行执行。

---

<a id="tc-c-tech-004"></a>
## UC-D TC-C-TECH-004 — CONTEXT 与 INDEX-STATUS 预算和显式降级映射

- id: `TC-C-TECH-004`
- title: `CONTEXT 与 INDEX-STATUS 预算和显式降级映射`
- source_ref: `../loeyae-ssot-server/contracts/ssot-api-v1.openapi.json#/paths/~1v1~1projects~1{projectId}~1context-bundles/post;../loeyae-ssot-server/contracts/ssot-api-v1.openapi.json#/paths/~1v1~1projects~1{projectId}~1materials~1{materialId}~1revisions~1{revisionId}~1index-status/get`
- story_ref: `不适用`
- scenario_ref: `SSOT-CONTEXT-001/createContextBundle+SSOT-INDEX-STATUS-001/getRevisionIndexStatus`
- type: `contract`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `E`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, project_ref_02, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref]`

### 来源溯源

- 不可变预期：`createContextBundle` 仅接受固定项目/修订/片段和批准预算；`getRevisionIndexStatus` 的部分失败只按 Provider 明确路径降级，跨项目或漂移条目阻断。

### 执行锚点

- 设计锚点：`ContextBundleValidator.validate(...)` 与两个 Provider operationId。
- 运行锚点：双项目、故障注入、阈值和完整在线证据引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 校验正常、预算超限、排除命中和跨项目 bundle | 正常固定；其余确认或阻断且不生成 |
| 2 | 注入图索引失败、向量/全文可用 | 仅消费可定位降级结果并记录实际路径 |

### 覆盖映射

- `SSOT-CONTEXT-001` → 步骤 1；`SSOT-INDEX-STATUS-001` → 步骤 2。

### 证据要求

- C8 应提供两个 operationId 契约报告、阈值版本、故障状态和 Consumer 决策；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 引用 Provider OpenAPI 派生；不复制 Schema，无运行执行。

---

<a id="tc-c-tech-005"></a>
## UC-D TC-C-TECH-005 — LINEAGE 幂等、超时未知与 partial 对账

- id: `TC-C-TECH-005`
- title: `LINEAGE 幂等、超时未知与 partial 对账`
- source_ref: `docs/aidlc/product/system-baseline/consistency-scenarios.md#CONS-ADLC-LINEAGE-001;../loeyae-ssot-server/contracts/ssot-api-v1.openapi.json#/paths/~1v1~1projects~1{projectId}~1lineage-records:publish/post;../loeyae-ssot-server/contracts/ssot-api-v1.openapi.json#/paths/~1v1~1projects~1{projectId}~1lineage-records:query/post`
- story_ref: `不适用`
- scenario_ref: `CONS-ADLC-LINEAGE-001+SSOT-LINEAGE-001/publishLineageRecords+queryLineageRecords`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `G`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref]`

### 来源溯源

- 不可变预期：`publishLineageRecords` 使用稳定 Idempotency-Key；超时结果未知先查询；重复提交不创建重复逻辑血缘；partial 保持 Pending，`queryLineageRecords` 对账并只补发缺项。

### 执行锚点

- 设计锚点：`LineagePublicationQueue.publish/reconcile`、`CONS-ADLC-LINEAGE-001` 及两个 LINEAGE operationId。
- 运行锚点：Provider 环境、故障注入、阈值与报告引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 对同一逻辑键执行正常、重复和超时未知提交 | 逻辑血缘唯一；未知结果先查询而非盲目创建 |
| 2 | 返回 partial 并执行 query/reconcile | 状态保持 Pending，只补发缺项，成功后才 published |

### 覆盖映射

- `CONS-ADLC-LINEAGE-001` → 步骤 1-2；`SSOT-LINEAGE-001` → 两个 operationId 的发布/查询闭环。

### 证据要求

- C8 应提供 Idempotency-Key、correlationId、发布/查询响应、逻辑键唯一性和重试时间线；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从一致性基线和 Provider OpenAPI 派生；无运行执行。

---

<a id="tc-c-tech-006"></a>
## UC-D TC-C-TECH-006 — REVERSE-DOC Git 关联、幂等与修订并存

- id: `TC-C-TECH-006`
- title: `REVERSE-DOC Git 关联、幂等与修订并存`
- source_ref: `docs/aidlc/product/system-baseline/consistency-scenarios.md#CONS-ADLC-REVERSE-001;../loeyae-ssot-server/contracts/ssot-api-v1.openapi.json#/paths/~1v1~1projects~1{projectId}~1reverse-documents~1{reverseDocumentId}~1revisions/post`
- story_ref: `不适用`
- scenario_ref: `CONS-ADLC-REVERSE-001+SSOT-REVERSE-DOC-001/createReverseDocumentRevision`
- type: `contract`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `F`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

- 不可变预期：path/commit/content hash 一致后才调用 `createReverseDocumentRevision`；同一 uploadId 幂等，新内容形成新修订；错配阻断且 Git 只读。

### 执行锚点

- 设计锚点：`ReverseDocumentUploader.prepareReverse/uploadReverse`、`CONS-ADLC-REVERSE-001`。
- 运行锚点：Provider 环境、项目版本链、命令和报告引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 覆盖匹配、重复、内容变化和错配 | 匹配成功；重复幂等；变化新建修订；错配零上传 |
| 2 | 对账本地 uploadId 与 Provider revision | 引用稳定且 Git 前后无修改 |

### 覆盖映射

- `CONS-ADLC-REVERSE-001` → 步骤 1-2；`SSOT-REVERSE-DOC-001` → operationId 消费边界。

### 证据要求

- C8 应提供 Git 状态、uploadId、幂等键、修订链和契约报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从一致性基线和 Provider OpenAPI 派生；无运行执行。

---

<a id="tc-c-tech-007"></a>
## UC-D TC-C-TECH-007 — FAILURE 有限重试、重启恢复与版本边界

- id: `TC-C-TECH-007`
- title: `FAILURE 有限重试、重启恢复与版本边界`
- source_ref: `docs/aidlc/product/system-baseline/consistency-scenarios.md#CONS-ADLC-RECOVERY-001;../loeyae-ssot-server/contracts/ssot-api-v1.openapi.json#/components/schemas/SsotError`
- story_ref: `不适用`
- scenario_ref: `CONS-ADLC-RECOVERY-001+SSOT-FAILURE-001`
- type: `resilience`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, ssot-api]`
- risk_cluster: `G`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref]`

### 来源溯源

- 不可变预期：只有 `retryable=true` 或 HTTP 429/503 自动重试，最多 3 次、退避 1/2/4 秒；权限、冲突、固定修订缺失和版本冲突不自动推进；重启只从业务 state v2 恢复；仅使用已验证版本组合。

### 执行锚点

- 设计锚点：`RecoveryCoordinator.decide(...)`、`RecoverRemoteActionService`、`CONS-ADLC-RECOVERY-001`。
- 运行锚点：完整阈值、版本矩阵、故障环境、Secret 注入和报告引用未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 参数化 retryable、429、503 与不可重试错误 | 前三类按批准阈值有限重试；不可重试错误立即阻断 |
| 2 | 在待恢复动作后重启并测试兼容/不兼容版本组合 | 从同一 state v2 和幂等键恢复；未验证或冲突组合不执行/不推进 |

### 覆盖映射

- `SSOT-FAILURE-001` → 步骤 1；`CONS-ADLC-RECOVERY-001` 与版本/恢复边界 → 步骤 2。

### 证据要求

- C8 应提供错误类别、尝试次数/时间线、重启前后 state、幂等键和版本组合报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从一致性基线派生；FAILURE 仅作跨 operation 错误契约映射，无运行执行。

---

<a id="tc-c-tech-008"></a>
## UC-D TC-C-TECH-008 — Legacy 模式判定与八项契约零调用

- id: `TC-C-TECH-008`
- title: `Legacy 模式判定与八项契约零调用`
- source_ref: `docs/aidlc/product/system-baseline/consistency-scenarios.md#CONS-ADLC-LEGACY-001;docs/aidlc/product/system-baseline/consistency-scenarios.md#统一恢复约束`
- story_ref: `不适用`
- scenario_ref: `CONS-ADLC-LEGACY-001`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc]`
- risk_cluster: `H`
- blocked_by: `[owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

- 不可变预期：endpoint 与 project candidate 均缺失才为 Legacy；Gateway 不创建，八项在线契约调用数为 0；在线失败不改变 Online 模式；Secret、令牌和完整资料正文不进入 state v2 或普通日志，三平台仅通过适配边界注入凭据。

### 执行锚点

- 设计锚点：`IntegrationModeResolver.resolve(...)`、`WorkspaceStateRepository.saveRecovery(...)`、`application-services.md#Legacy 分支`、`CONS-ADLC-LEGACY-001`。
- 运行锚点：Legacy 黄金依赖、命令、网络观测、Secret 注入、报告、Owner 和版本矩阵未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 参数化无配置、完整配置、部分配置和在线失败 | 仅无配置为 Legacy 且八项调用为 0；部分配置报错；在线失败仍为 Online |
| 2 | 经三平台适配边界注入凭据并检查恢复记录与普通日志 | Secret、令牌和完整资料正文不落 state v2 或普通日志，平台差异不进入项目事实 |

### 覆盖映射

- `CONS-ADLC-LEGACY-001` → 步骤 1 → 模式不可漂移与零调用；H 簇 Secret 隔离 → 步骤 2 → 敏感数据不进入恢复状态或普通日志。

### 证据要求

- C8 应提供模式决策、Gateway 构建/网络观测、非敏感 state/log 扫描和黄金场景报告；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从一致性基线派生；无运行执行。

---

<a id="tc-c-tech-009"></a>
## UC-D TC-C-TECH-009 — 三平台共享 Core conformance 与接力恢复

- id: `TC-C-TECH-009`
- title: `三平台共享 Core conformance 与接力恢复`
- source_ref: `docs/aidlc/modules/federated-integration/inception/application-design/component-dependency.md#依赖禁止项`
- story_ref: `不适用`
- scenario_ref: `CORE-CONFORMANCE-KIRO-CLAUDE-OPENCODE`
- type: `integration`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, kiro-power, claude-plugin, opencode-plugin]`
- risk_cluster: `I`
- blocked_by: `[owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref]`

### 来源溯源

- 不可变预期：三平台只调用同一 Core 端口；同一 state v2 和输入得到等价选择、引用、错误决策与下一状态；平台接力不创建第二份 state，不按平台复制业务语义。

### 执行锚点

- 设计锚点：`components.md#平台端口`、`application-services.md#平台一致性`。
- 运行锚点：三平台依赖、conformance 命令、版本矩阵、Secret 注入和报告未登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 单一参数集驱动三适配器调用同一 Core | 规范化业务输出等价且无平台特有业务分支 |
| 2 | 在平台间接力恢复同一工作区 | 仅一份 state v2，恢复步骤与固定引用不变 |

### 覆盖映射

- 三平台 Core conformance → 步骤 1；平台无关恢复 → 步骤 2。

### 证据要求

- C8 应提供单一参数集、三端运行 ID、规范化差异和 state 来源观测；当前未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从 Consumer I12 设计派生；无运行执行。

---

<a id="tc-c-tech-010"></a>
## UC-D TC-C-TECH-010 — 双项目真实闭环隔离与 C8 证据门禁

- id: `TC-C-TECH-010`
- title: `双项目真实闭环隔离与 C8 证据门禁`
- source_ref: `docs/aidlc/modules/federated-integration/inception/plans/test-case-derivation-plan.md#执行锚点缺口`
- story_ref: `不适用`
- scenario_ref: `I13-J-TWO-PROJECT-E2E-EVIDENCE`
- type: `e2e`
- priority: `P0`
- status: `blocked`
- design_status: `ready`
- execution_status: `blocked`
- service_ids: `[loeyae-aidlc, kiro-power, claude-plugin, opencode-plugin, ssot-api]`
- risk_cluster: `J`
- blocked_by: `[environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, project_ref_02, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref]`

### 来源溯源

- 不可变预期：两个真实脱敏项目分别完成可复现闭环且项目事实零串扰；缺少 Provider、Legacy、三平台或稳定运行证据中的任一项，C8 结论保持未验证。

### 执行锚点

- 设计锚点：`execution-plan.md#模块更新策略` 的测试检查点与 I13 `J` 风险簇。
- 运行锚点：12 项非敏感证据键当前 0/12 登记，执行阻断。

### 执行步骤与断言

| # | 步骤 | 断言 |
|---|------|------|
| 1 | 对两个脱敏项目执行 Provider-first/Core/三平台闭环 | 各自引用可复现且跨项目资料、引用、state 串扰为 0 |
| 2 | 汇总 Provider、Legacy、conformance、E2E 和版本证据 | 缺任一证据均保持未验证并列出阻断范围 |

### 覆盖映射

- J 簇真实闭环 → 步骤 1；C8 证据完整性边界 → 步骤 2。

### 证据要求

- C8 应提供 12 项受控登记引用、双项目运行 ID、版本/制品摘要、结果位置和 UTC 时间；当前全部未登记。

### 派生日志

- `2026-07-20T01:37:03Z`：Kiro 从 I13 计划派生；无运行执行，未关闭 057/I13。
