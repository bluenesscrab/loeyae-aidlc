# U-C05-OPENCODE-ADAPTER opencode-adapter 应用设计切片

- **unit_id / service_id**：`U-C05-OPENCODE-ADAPTER` / `opencode-plugin`
- **设计源**：[components.md](components.md)、[component-dependency.md](component-dependency.md)
- **协作来源**：`ADLC-US-009`，主归属为 U-C03-KIRO-ADAPTER
- **状态**：设计/静态生成；适配与运行 blocked/未验证

## 组件与端口

`OpenCodeAdapter` 负责 OpenCode Plugin 输入输出、短时凭据注入、Core 调用桥接、确认/审批呈现和会话接力。输入与输出必须使用 U-C02-CORE-CONTEXT-DOCUMENT 冻结的平台无关 Core 端口，不建立 OpenCode 专属业务模型。

## 薄适配边界

- 允许差异：OpenCode Plugin 入口、工具调用、交互呈现和凭据注入机制。
- 不可变语义：RoleIntent、TargetDocument、MaterialSelection、ValidatedBundle、固定引用、血缘、恢复决策和 state v2。
- 禁止：直接调用 Provider、复制 U-C01-CORE-PROVIDER-CLIENT/U-C02-CORE-CONTEXT-DOCUMENT 规则、维护第二份 state、把平台身份写入项目事实、以 package/入口/呈现差异改变 Core 决策。

## 协作设计

U-C05-OPENCODE-ADAPTER 对 `TC-C-009-S01`/`S02` 与 `TC-C-TECH-009` 提供 OpenCode 观察结果，但不拥有故事、Scenario 或 UC-D 主归属。后续完成证据是 OpenCode 适配报告和 U-C06-CROSS-SERVICE-TESTS conformance；当前未运行验证。
