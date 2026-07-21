# U-C06-CROSS-SERVICE-TESTS cross-service-tests 应用设计切片

- **unit_id / service_id**：`U-C06-CROSS-SERVICE-TESTS` / `test-suite`
- **设计源**：[test-cases/_index.md](test-cases/_index.md)、[component-dependency.md](component-dependency.md)、[application-services.md](application-services.md)
- **状态**：设计/静态生成；测试执行 blocked/未验证

## 验证资产职责

U-C06-CROSS-SERVICE-TESTS 只设计和后续承载跨服务测试夹具、runner、契约/conformance/Legacy/E2E 用例及报告适配，不修改任何生产服务逻辑。其被测边界为 Provider OpenAPI、U-C01-CORE-PROVIDER-CLIENT Gateway、U-C02-CORE-CONTEXT-DOCUMENT Core 端口和 U-C03-KIRO-ADAPTER—U-C05-OPENCODE-ADAPTER 平台适配端口。

## 验证域

| 验证域 | 主要 UC-D | 观察结果 |
|--------|-----------|----------|
| Provider Consumer 契约 | 产品 003—008、011；`TECH-002`—`007` | 固定版本、项目隔离、修订/片段、降级、幂等、稳定错误 |
| Core/state v2/事实分层 | 产品 001、002、004—008、012；`TECH-001`、`005`、`006` | 唯一恢复源、选择、文档、引用/血缘、Git 关联、外部事实边界 |
| Legacy/Secret | 产品 010；`TECH-008` | 八项调用为 0、部分配置错误、Online 不回退、敏感信息不持久化 |
| 三平台 conformance | 产品 009；`TECH-009` | 相同参数集下业务语义差异为 0，适配层不复制规则 |
| 真实项目 E2E | 产品 013；`TECH-010` | 三类资料、多个修订、显式选择/降级、双项目隔离、稳定证据完整性 |

## 运行锚点与证据

执行前必须登记 environment、API 别名、测试身份、Owner、运行依赖、两个真实项目、实际命令、报告位置、版本矩阵、批准阈值和 Secret 注入共 12 个锚点。证据必须包含真实命令、稳定运行 ID、适用范围、固定版本和受控报告位置。

## 失败边界

- 任一生产接口或版本未冻结时，不形成端到端兼容结论。
- 任一 SSOT 在线调用出现在 Legacy 场景时，兼容验证失败。
- 三平台任一选择、引用、错误决策或 state v2 语义差异导致 conformance 失败。
- 缺 Provider、Legacy、conformance、权限隔离或 E2E 任一证据时，整体状态保持未验证。

当前 12 个运行锚点为 `0/12`，44 个 UC-D 均保持 blocked；本文不运行测试，也不修改 `application-design/test-cases/`。
