# U-C03-KIRO-ADAPTER kiro-adapter 用户故事切片

- **unit_id / service_id**：`U-C03-KIRO-ADAPTER` / `kiro-power`
- **source_ref**：[`stories.full.md`](stories.full.md)
- **主归属故事**：`ADLC-US-009`
- **状态**：设计/静态生成；适配与运行 blocked/未验证

## ADLC-US-009 三平台共享 Core 语义（主归属）

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

U-C03-KIRO-ADAPTER 持有故事主归属和统一验收参数；U-C04-CLAUDE-ADAPTER/U-C05-OPENCODE-ADAPTER 以协作身份提供 Claude/OpenCode 观察，不复制故事主归属。
