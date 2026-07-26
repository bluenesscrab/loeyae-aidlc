# U-C01-CORE-PROVIDER-CLIENT core-provider-client 用户故事切片

- **unit_id / service_id**：`U-C01-CORE-PROVIDER-CLIENT` / `loeyae-aidlc`
- **source_ref**：[`stories.full.md`](stories.full.md)
- **主归属故事**：`ADLC-US-003`、`ADLC-US-010`、`ADLC-US-011`
- **状态**：设计/静态生成；实现与运行 blocked/未验证

## ADLC-US-003 Provider-first 项目解析（主归属）

- **作为**：已配置 SSOT 的业务项目用户
- **我希望**：通过 Provider 解析唯一项目和访问上下文，并为未来 Provider 新主版本保留 Core 适配意图
- **以便**：资料消费建立在正确的目标项目读取隔离边界上，三类写入例外不会扩散为读取权
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

Scenario: Provider 写入例外不得削弱读取隔离
  Given Provider 允许已认证主体向无读取权限的有效目标项目导入、归档或恢复
  When AI-DLC Core 处理后续项目解析或资料读取
  Then U-C01 仍要求目标项目读取授权，且不把写入成功解释为可读取、可检索或可派生

Scenario: 权限拒绝不得降级绕过
  Given Provider 拒绝当前用户访问目标项目
  When AI-DLC 处理项目解析结果
  Then AI-DLC 保持当前 state v2 步骤，不通过缓存或较低层接口继续读取资料
```

## ADLC-US-010 Legacy 项目零远程调用（主归属）

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

## ADLC-US-011 Provider 或索引失败时本地恢复（主归属）

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

## CR-U-P01-CROSS-PROJECT-IMPORT-001 B1 边界说明

U-C01 本轮不新增跨项目写入故事，也不实现导入、归档、恢复或状态转换业务规则。这里只记录未来 Provider 新主版本适配意图，并冻结读取、列表、检索、Context、血缘、逆向、解析与索引隔离不得退化；机器契约和兼容治理细节留待 B2。Kiro、Claude Code、OpenCode 只能经 Core 调用 U-C01，不得直连 Provider。
