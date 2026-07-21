# U-C03-KIRO-ADAPTER kiro-adapter 应用设计切片

- **unit_id / service_id**：`U-C03-KIRO-ADAPTER` / `kiro-power`
- **设计源**：[components.md](components.md)、[component-dependency.md](component-dependency.md)
- **状态**：设计/静态生成；适配与运行 blocked/未验证

## 组件与端口

`KiroAdapter` 负责 Kiro Power 输入输出、短时凭据注入、Core 工具调用、确认/审批呈现和会话接力。输入必须归一为共享 Core 的 workspace、平台无关命令、用户响应和凭据引用；输出只呈现 Core 结果、NeedsUserInput/NeedsConfirmation、错误影响和恢复动作。

## 薄适配边界

- 允许差异：Kiro 的工具调用方式、交互控件、审批呈现和凭据注入机制。
- 不可变语义：RoleIntent、TargetDocument、MaterialSelection、ValidatedBundle、FragmentCitation、LineageRecord、RecoveryAction、state v2 流程位置。
- 禁止：直接调用 Provider、依赖 OpenAPI DTO、复制项目解析/选择/降级/引用/血缘规则、读取插件自举 state、把 Kiro 名称写入项目事实。

## 依赖与检查点

- 唯一生产依赖是 U-C02-CORE-CONTEXT-DOCUMENT 冻结的平台无关 Core API；U-C01-CORE-PROVIDER-CLIENT/Provider 对 Kiro 不可见。
- U-C03-KIRO-ADAPTER 持有 `ADLC-US-009` 主归属和三平台统一验收参数，U-C04-CLAUDE-ADAPTER/U-C05-OPENCODE-ADAPTER 提供协作观察。
- 完成证据必须来自 Kiro 适配报告及 U-C06-CROSS-SERVICE-TESTS 三平台 conformance；当前无运行证据。
