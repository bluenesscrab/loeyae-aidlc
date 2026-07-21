# Consumer 用户故事切片索引

- **归档源**：[`stories.full.md`](stories.full.md)
- **状态**：I14 设计/静态生成；实现与运行 blocked/未验证

| 单元 | service_id | 故事切片 | 主故事 |
|------|------------|----------|--------|
| `U-C01-CORE-PROVIDER-CLIENT` | `loeyae-aidlc` | [core-provider-client](unit-core-provider-client-stories.md) | 003、010、011 |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `loeyae-aidlc` | [core-context-document](unit-core-context-document-stories.md) | 001、002、004、005、006、007、008、012 |
| `U-C03-KIRO-ADAPTER` | `kiro-power` | [kiro-adapter](unit-kiro-adapter-stories.md) | 009 |
| `U-C04-CLAUDE-ADAPTER` | `claude-plugin` | [claude-adapter](unit-claude-adapter-stories.md) | 无；协作 009 |
| `U-C05-OPENCODE-ADAPTER` | `opencode-plugin` | [opencode-adapter](unit-opencode-adapter-stories.md) | 无；协作 009 |
| `U-C06-CROSS-SERVICE-TESTS` | `test-suite` | [cross-service-tests](unit-cross-service-tests-stories.md) | 013 |

跨单元协作和统一验收边界见 [shared-stories.md](shared-stories.md)。13 个主故事与 34 个源 Scenario 完整覆盖；U-C04-CLAUDE-ADAPTER/U-C05-OPENCODE-ADAPTER 的协作重述不构成重复主归属。
