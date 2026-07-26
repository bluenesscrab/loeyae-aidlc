# Consumer 应用设计切片索引

- **I12 源**：[components.md](components.md)、[component-methods.md](component-methods.md)、[application-services.md](application-services.md)、[component-dependency.md](component-dependency.md)
- **B3 状态**：`CR-U-P01-CROSS-PROJECT-IMPORT-001 / CR4 B3` Consumer I12 候选；Provider/Portal 已稳定，Consumer 仅适配 v3 既有读取、Context、血缘、逆向写、DTO、稳定错误、版本头和隔离语义
- **前向链路**：Provider `contracts/ssot-api-v3.openapi.json` / `3.0.0-candidate.1` → Portal v3 → Core v3；三平台仅经 Core，不协商 v3、零直连 Provider
- **运行状态**：仅设计候选；不宣称实现或运行验证

| 单元 | service_id | 设计切片 | 核心边界 |
|------|------------|----------|----------|
| `U-C01-CORE-PROVIDER-CLIENT` | `loeyae-aidlc` | [core-provider-client](unit-core-provider-client-design.md) | Provider v3 Gateway、目标项目授权、隔离、DTO、版本头、稳定错误；不暴露跨项目生命周期写入口 |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `loeyae-aidlc` | [core-context-document](unit-core-context-document-design.md) | state v2、跨项目读取/Context、固定 revision、引用/血缘、逆向说明与恢复语义；不拥有生命周期写能力 |
| `U-C03-KIRO-ADAPTER` | `kiro-power` | [kiro-adapter](unit-kiro-adapter-design.md) | Kiro 薄适配；本候选不修改 |
| `U-C04-CLAUDE-ADAPTER` | `claude-plugin` | [claude-adapter](unit-claude-adapter-design.md) | Claude 薄适配；本候选不修改 |
| `U-C05-OPENCODE-ADAPTER` | `opencode-plugin` | [opencode-adapter](unit-opencode-adapter-design.md) | OpenCode 薄适配；本候选不修改 |
| `U-C06-CROSS-SERVICE-TESTS` | `test-suite` | [cross-service-tests](unit-cross-service-tests-design.md) | 本候选不修改、不执行 |

跨单元契约、B1 权威边界、Online/Legacy、配置/Secret、版本、授权与隔离、state v2、固定 revision 和血缘边界见 [shared-interfaces.md](shared-interfaces.md)。
