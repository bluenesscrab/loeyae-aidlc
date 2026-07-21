# U-C04-CLAUDE-ADAPTER claude-adapter 需求切片

- **unit_id / service_id**：`U-C04-CLAUDE-ADAPTER` / `claude-plugin`
- **source_ref**：[`requirements.full.md`](requirements.full.md)
- **主归属 FR**：无
- **协作来源**：`ADLC-FR-009`
- **状态**：设计/静态生成；适配与运行 blocked/未验证

## ADLC-FR-009 协作语义（非主归属）

Claude Code Plugin 必须把平台入口、短时凭据、调用结果、审批呈现和会话接力映射到共享 Core。其输入与 Kiro/OpenCode 相同时，RoleIntent、TargetDocument、MaterialSelection、ContextBundle、固定引用、血缘、错误决策和下一 state v2 位置必须一致。Claude 特有的插件入口与交互只能改变调用和呈现，不得复制或改写 Core 的项目解析、资料选择、降级、引用、血缘和恢复规则，也不得把平台名称写入业务事实。

完整协作验收边界：

```gherkin
Given 三个平台读取同一 state v2、角色、目标文档和 Provider 响应
When 执行资料选择与引用生成
Then 选择的资料修订、片段引用和下一流程状态语义一致，平台名称不写入项目事实

Given Claude 的凭据、Plugin 入口或呈现方式与其他平台不同
When Claude 适配层调用共享 Core
Then 差异只影响调用和展示；若改变资料选择或状态语义，则一致性验证失败且流程不继续
```

## 相关 NFR 与约束

协作满足 `ADLC-NFR-001`、`003`、`007`；不拥有 `ADLC-FR-009` 主归属，不直接消费 Provider 契约，不维护第二份业务状态。运行结论由 U-C06-CROSS-SERVICE-TESTS 在三平台 conformance 中统一证明，当前未验证。
