# U-C06-CROSS-SERVICE-TESTS cross-service-tests 用户故事切片

- **unit_id / service_id**：`U-C06-CROSS-SERVICE-TESTS` / `test-suite`
- **source_ref**：[`stories.full.md`](stories.full.md)
- **主归属故事**：`ADLC-US-013`
- **状态**：设计/静态生成；测试执行 blocked/未验证

## ADLC-US-013 双项目跨平台资料闭环验收（主归属）

- **作为**：五类角色和产品验收负责人
- **我希望**：在两个真实项目中复现目标项目读取、固定引用、零泄露、滥用治理和三平台 Core 闭环
- **以便**：只在 Provider/Consumer 组合和全部治理证据稳定时确认首期 Consumer 能力
- **追踪**：`ADLC-FR-013`；`ADLC-NFR-001`—`ADLC-NFR-008`
- **契约**：八项现行契约
- **画像**：`ADLC-PER-001`—`ADLC-PER-005`
- **优先级**：Must

```gherkin
Scenario: 双项目闭环在三平台保持业务语义一致
  Given 两个真实项目包含代表性资料和多个不可变修订，且已准备批准的 Provider/Consumer 组合
  When Kiro、Claude Code、OpenCode 分别只经 Core 执行目标项目读取、上下文、正式文档和血缘回写
  Then 读取与派生结果保持目标项目隔离，固定修订和片段可复现，且不存在平台直连 Provider

Scenario: 显式选择和降级在闭环中可复现
  Given 验收包含资料排除、指定旧版及一次图索引降级
  When 三个平台执行相同业务输入
  Then 每个平台得到相同的最终选择和固定引用，并记录相同的业务降级含义

Scenario: 滥用治理与写入结果零泄露
  Given 写入主体无目标项目读取权限，且验收覆盖配额、成本、风险提示、通知、申诉、隔离处置和审计
  When 汇总成功、失败、冲突、重复、状态转换与历史内容恢复结果
  Then 可见结果不泄露目标项目既有资料、成员、内容或派生事实，恢复产生的新修订不改变旧引用

Scenario: Provider 与 Consumer 组合逐一验证
  Given 存在待验证的 Provider 与 Consumer 支持组合
  When 分别执行目标项目读取隔离、固定引用和三平台 Core 调用闭环
  Then 每个组合都有独立结果，任一组合或平台直连边界缺证据时整体保持未验证

Scenario: 缺少 Provider 或运行证据时整体保持未验证
  Given 闭环缺少稳定运行标识、Provider 证据、Legacy 零调用或三平台一致性证据中的任一项
  When 汇总端到端结果
  Then 整体状态保持未验证，并列出缺失证据和阻断范围
```

执行前 12 个运行锚点必须全部闭合；当前为 `0/12`，因此该故事只有设计追踪，不构成端到端通过。U-C06 不得修改生产逻辑或新增 Consumer 独立业务项目写入逻辑。
