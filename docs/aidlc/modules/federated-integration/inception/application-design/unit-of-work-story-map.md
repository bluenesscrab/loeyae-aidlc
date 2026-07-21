# AI-DLC Consumer 工作单元故事与 UC-D 映射

- **状态**：设计/静态生成；运行 blocked/未验证
- **故事源**：[`stories.full.md`](../user-stories/stories.full.md)
- **测试索引源**：[`test-cases/_index.md`](test-cases/_index.md)（只读，未修改）
- **唯一性规则**：主故事、产品 Scenario 与 UC-D 只在下表出现一个主归属；U-C04-CLAUDE-ADAPTER/U-C05-OPENCODE-ADAPTER 仅协作 ADLC-US-009，不取得主归属。

## 主故事与产品 Scenario/UC-D 唯一归属

| 主单元 | 主故事 | Scenario | 产品 UC-D |
|--------|--------|----------|-----------|
| `U-C02-CORE-CONTEXT-DOCUMENT` | `ADLC-US-001` | `S01`、`S02` | `TC-C-001-S01`、`TC-C-001-S02` |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `ADLC-US-002` | `S01`、`S02` | `TC-C-002-S01`、`TC-C-002-S02` |
| `U-C01-CORE-PROVIDER-CLIENT` | `ADLC-US-003` | `S01`、`S02`、`S03` | `TC-C-003-S01`、`TC-C-003-S02`、`TC-C-003-S03` |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `ADLC-US-004` | `S01`、`S02`、`S03` | `TC-C-004-S01`、`TC-C-004-S02`、`TC-C-004-S03` |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `ADLC-US-005` | `S01`、`S02`、`S03` | `TC-C-005-S01`、`TC-C-005-S02`、`TC-C-005-S03` |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `ADLC-US-006` | `S01`、`S02` | `TC-C-006-S01`、`TC-C-006-S02` |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `ADLC-US-007` | `S01`、`S02`、`S03` | `TC-C-007-S01`、`TC-C-007-S02`、`TC-C-007-S03` |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `ADLC-US-008` | `S01`、`S02`、`S03` | `TC-C-008-S01`、`TC-C-008-S02`、`TC-C-008-S03` |
| `U-C03-KIRO-ADAPTER` | `ADLC-US-009` | `S01`、`S02` | `TC-C-009-S01`、`TC-C-009-S02` |
| `U-C01-CORE-PROVIDER-CLIENT` | `ADLC-US-010` | `S01`、`S02` | `TC-C-010-S01`、`TC-C-010-S02` |
| `U-C01-CORE-PROVIDER-CLIENT` | `ADLC-US-011` | `S01`、`S02`、`S03` | `TC-C-011-S01`、`TC-C-011-S02`、`TC-C-011-S03` |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `ADLC-US-012` | `S01`、`S02`、`S03` | `TC-C-012-S01`、`TC-C-012-S02`、`TC-C-012-S03` |
| `U-C06-CROSS-SERVICE-TESTS` | `ADLC-US-013` | `S01`、`S02`、`S03` | `TC-C-013-S01`、`TC-C-013-S02`、`TC-C-013-S03` |

统计：主故事 `13/13`，产品 Scenario `34/34`，产品 UC-D `34/34`。每个 Scenario 与对应产品 UC-D 跟随同一主单元。

## 技术 UC-D 唯一主归属

| 主单元 | 技术 UC-D | 风险主题 |
|--------|-----------|----------|
| `U-C02-CORE-CONTEXT-DOCUMENT` | `TC-C-TECH-001` | 正式文档一致性与事实分层 |
| `U-C01-CORE-PROVIDER-CLIENT` | `TC-C-TECH-002` | PROJECT 契约与项目隔离 |
| `U-C01-CORE-PROVIDER-CLIENT` | `TC-C-TECH-003` | RETRIEVAL/MATERIAL 契约与固定修订 |
| `U-C01-CORE-PROVIDER-CLIENT` | `TC-C-TECH-004` | CONTEXT/INDEX-STATUS 契约与降级 |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `TC-C-TECH-005` | LINEAGE partial、幂等与恢复 |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `TC-C-TECH-006` | REVERSE-DOC Git 关联 |
| `U-C01-CORE-PROVIDER-CLIENT` | `TC-C-TECH-007` | FAILURE 稳定错误与重试 |
| `U-C01-CORE-PROVIDER-CLIENT` | `TC-C-TECH-008` | Legacy 零调用与统一恢复 |
| `U-C06-CROSS-SERVICE-TESTS` | `TC-C-TECH-009` | Kiro/Claude/OpenCode Core conformance |
| `U-C06-CROSS-SERVICE-TESTS` | `TC-C-TECH-010` | 双项目真实 E2E 证据完整性 |

统计：技术 UC-D `10/10`；与产品 UC-D 合计 `44/44`，主归属完整且唯一。

## 次要协作关系

| 协作单元 | 主归属所在单元 | 协作来源 | 协作边界 |
|----------|----------------|----------|----------|
| `U-C04-CLAUDE-ADAPTER` | `U-C03-KIRO-ADAPTER` | `ADLC-US-009`、`TC-C-009-S01`、`TC-C-009-S02`、`TC-C-TECH-009` | 提供 Claude Code 输入/输出与呈现观察，不拥有故事、Scenario 或 UC-D 主归属 |
| `U-C05-OPENCODE-ADAPTER` | `U-C03-KIRO-ADAPTER` | `ADLC-US-009`、`TC-C-009-S01`、`TC-C-009-S02`、`TC-C-TECH-009` | 提供 OpenCode 输入/输出与呈现观察，不拥有故事、Scenario 或 UC-D 主归属 |
| `U-C01-CORE-PROVIDER-CLIENT` | `U-C02-CORE-CONTEXT-DOCUMENT` | U-C02-CORE-CONTEXT-DOCUMENT 的所有在线故事 | 提供统一 Provider 传输、版本、错误和恢复端口，不取得这些故事主归属 |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `U-C06-CROSS-SERVICE-TESTS` | `ADLC-US-013` | 提供 Core 被测能力和固定语义，不取得 E2E 主故事归属 |
| `U-C03-KIRO-ADAPTER`—`U-C05-OPENCODE-ADAPTER` | `U-C06-CROSS-SERVICE-TESTS` | `TC-C-TECH-009` | 提供三平台被测适配，不取得技术 UC-D 主归属 |

## 追踪状态边界

- 本映射只建立 I14 主归属，不修改 I13 `test-cases/_index.md` 的权威 `source_ref`。
- 所有 44 个 UC-D 仍为 `design_status=ready`、`execution_status=blocked`、`status=blocked`。
- 12 个运行锚点仍为 `0/12`；静态映射不能替代实际命令、报告或稳定运行标识。
