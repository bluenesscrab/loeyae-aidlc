# Consumer 应用设计切片索引

- **I12 源**：[components.md](components.md)、[component-methods.md](component-methods.md)、[application-services.md](application-services.md)、[component-dependency.md](component-dependency.md)
- **状态**：I14 设计/静态生成；实现与运行 blocked/未验证

| 单元 | service_id | 设计切片 | 核心边界 |
|------|------------|----------|----------|
| `U-C01-CORE-PROVIDER-CLIENT` | `loeyae-aidlc` | [core-provider-client](unit-core-provider-client-design.md) | Provider Gateway、模式、项目、错误/重试 |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `loeyae-aidlc` | [core-context-document](unit-core-context-document-design.md) | state v2、意图、选择、文档、引用/血缘、逆向说明 |
| `U-C03-KIRO-ADAPTER` | `kiro-power` | [kiro-adapter](unit-kiro-adapter-design.md) | Kiro 薄适配 |
| `U-C04-CLAUDE-ADAPTER` | `claude-plugin` | [claude-adapter](unit-claude-adapter-design.md) | Claude 薄适配 |
| `U-C05-OPENCODE-ADAPTER` | `opencode-plugin` | [opencode-adapter](unit-opencode-adapter-design.md) | OpenCode 薄适配 |
| `U-C06-CROSS-SERVICE-TESTS` | `test-suite` | [cross-service-tests](unit-cross-service-tests-design.md) | 契约/conformance/Legacy/E2E 验证资产 |

跨单元契约、Core 端口、Online/Legacy、配置/Secret、版本、失败/重试、state v2 与血缘边界见 [shared-interfaces.md](shared-interfaces.md)。
