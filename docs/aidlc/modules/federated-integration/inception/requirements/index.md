# Consumer 需求切片索引

- **归档源**：[`requirements.full.md`](requirements.full.md)
- **状态**：I14 设计/静态生成；实现与运行 blocked/未验证

| 单元 | service_id | 需求切片 | 主 FR |
|------|------------|----------|-------|
| `U-C01-CORE-PROVIDER-CLIENT` | `loeyae-aidlc` | [core-provider-client](unit-core-provider-client-requirements.md) | 003、010、011 |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `loeyae-aidlc` | [core-context-document](unit-core-context-document-requirements.md) | 001、002、004、005、006、007、008、012 |
| `U-C03-KIRO-ADAPTER` | `kiro-power` | [kiro-adapter](unit-kiro-adapter-requirements.md) | 009 |
| `U-C04-CLAUDE-ADAPTER` | `claude-plugin` | [claude-adapter](unit-claude-adapter-requirements.md) | 无；协作 009 |
| `U-C05-OPENCODE-ADAPTER` | `opencode-plugin` | [opencode-adapter](unit-opencode-adapter-requirements.md) | 无；协作 009 |
| `U-C06-CROSS-SERVICE-TESTS` | `test-suite` | [cross-service-tests](unit-cross-service-tests-requirements.md) | 013 |

跨单元 NFR、权威边界与通用约束见 [shared-requirements.md](shared-requirements.md)。13 个 FR 的主归属完整且唯一；协作引用不改变主归属。
