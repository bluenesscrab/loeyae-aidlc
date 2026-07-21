# U-C06-CROSS-SERVICE-TESTS cross-service-tests 用户故事切片

- **unit_id / service_id**：`U-C06-CROSS-SERVICE-TESTS` / `test-suite`
- **source_ref**：[`stories.full.md`](stories.full.md)
- **主归属故事**：`ADLC-US-013`
- **状态**：设计/静态生成；测试执行 blocked/未验证

## ADLC-US-013 真实项目跨平台资料闭环验收（主归属）

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

执行前 12 个运行锚点必须全部闭合；当前为 `0/12`，因此该故事只有设计追踪，不构成端到端通过。
