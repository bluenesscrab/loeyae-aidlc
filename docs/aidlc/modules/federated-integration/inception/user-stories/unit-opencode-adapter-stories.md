# U-C05-OPENCODE-ADAPTER opencode-adapter 用户故事切片

- **unit_id / service_id**：`U-C05-OPENCODE-ADAPTER` / `opencode-plugin`
- **source_ref**：[`stories.full.md`](stories.full.md)
- **主归属故事**：无
- **协作来源**：`ADLC-US-009`（主归属为 U-C03-KIRO-ADAPTER）
- **状态**：设计/静态生成；适配与运行 blocked/未验证

## 完整协作职责

- **作为**：通过 OpenCode 使用同一业务项目的角色
- **我希望**：OpenCode Plugin 将平台入口、短时凭据、调用和呈现映射到共享 Core
- **以便**：使用 OpenCode 不会改变由 U-C03-KIRO-ADAPTER 主归属故事定义的角色、资料选择、引用和 state v2 语义
- **追踪**：协作 `ADLC-US-009`、`ADLC-FR-009`；`ADLC-NFR-001`、`003`、`007`
- **契约**：八项 Provider 契约只由 Core 间接消费；OpenCode 不直接消费
- **优先级**：Must 协作边界

## 完整协作验收边界

```gherkin
Scenario: OpenCode 对相同输入保持共享业务语义
  Given OpenCode、Kiro 和 Claude 读取同一 state v2、角色、目标文档和 Provider 响应
  When OpenCode 通过共享 Core 执行资料选择、上下文使用和引用生成
  Then OpenCode 观察到的修订、片段引用和下一流程状态语义与其他平台一致，平台名称不进入项目事实

Scenario: OpenCode 适配差异不得改写 Core 决策
  Given OpenCode 的凭据、Plugin 入口或呈现方式与其他平台不同
  When OpenCode 适配层调用 AI-DLC Core
  Then 差异只影响调用和展示；若改变资料选择或状态语义，则一致性验证失败且流程不继续
```

以上是对源故事两项验收含义的完整协作重述，不新建主故事、Scenario 主归属或 UC-D 主归属。
