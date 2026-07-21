# AI-DLC Consumer 工作单元依赖

- **批准依据**：Provider 权威 `CR4-B5-I14-UNIT-PLAN-APPROVAL-059=A`
- **状态**：设计/静态生成；Construction 未启动，运行 blocked/未验证
- **版本边界**：Provider OpenAPI `1.0.0-candidate.1`

## 单元依赖矩阵

| 来源单元 | 目标/前置 | 依赖内容 | 允许并行条件 | 阻断条件 | 后置验证 |
|----------|-----------|----------|--------------|----------|----------|
| `U-C01-CORE-PROVIDER-CLIENT` | Provider `U-P01-API-PROJECT-MATERIAL`/`U-P02-API-RETRIEVAL-CONTEXT`/`U-P03-API-LINEAGE-REVERSE` | 八项契约、稳定错误、项目隔离、版本与幂等头 | OpenAPI 字段与错误语义冻结后可在 Provider 实现前基于契约推进 | 未决字段、未知 Consumer、版本不兼容、Secret 注入无受控引用 | Provider Consumer 契约、Legacy 零调用、在线失败不回退 |
| `U-C02-CORE-CONTEXT-DOCUMENT` | `U-C01-CORE-PROVIDER-CLIENT` + Provider 检索/上下文/血缘/逆向接口 | 平台无关 Gateway、固定修订/片段、失败决策 | U-C01-CORE-PROVIDER-CLIENT 端口和 Provider 候选契约稳定后可与 Provider Portal 并行 | Gateway 语义未冻结、固定引用不可解析、事实分层规则冲突 | Core 文档、引用、血缘、逆向说明与 state v2 恢复 |
| `U-C03-KIRO-ADAPTER` | `U-C02-CORE-CONTEXT-DOCUMENT` | 共享 Core 命令/结果、凭据注入端口、状态呈现模型 | Core API 冻结后与 U-C04-CLAUDE-ADAPTER/U-C05-OPENCODE-ADAPTER 并行 | 需要平台专属业务分支或第二份 state | Kiro 适配与跨平台一致性 |
| `U-C04-CLAUDE-ADAPTER` | `U-C02-CORE-CONTEXT-DOCUMENT` | 同一共享 Core 端口 | Core API 冻结后与 U-C03-KIRO-ADAPTER/U-C05-OPENCODE-ADAPTER 并行 | 复制资料选择、错误、引用或血缘规则 | Claude 协作观察与跨平台一致性 |
| `U-C05-OPENCODE-ADAPTER` | `U-C02-CORE-CONTEXT-DOCUMENT` | 同一共享 Core 端口 | Core API 冻结后与 U-C03-KIRO-ADAPTER/U-C04-CLAUDE-ADAPTER 并行 | 复制资料选择、错误、引用或血缘规则 | OpenCode 协作观察与跨平台一致性 |
| `U-C06-CROSS-SERVICE-TESTS` | Provider/Consumer 全部生产单元 | 固定版本、真实环境、Core/平台端口、报告位置 | 可先准备追踪设计；不得提前形成运行通过结论 | 12 个运行锚点未闭合、接口/版本未冻结、无执行授权 | 契约、Legacy、conformance、双项目 E2E 稳定证据 |

## Provider-first 波次

| 波次 | Consumer 单元 | Provider 条件 | 完成门禁 |
|------|---------------|---------------|----------|
| W2 | `U-C01-CORE-PROVIDER-CLIENT` | Provider `U-P01-API-PROJECT-MATERIAL`—`U-P03-API-LINEAGE-REVERSE` 的候选契约稳定 | 可生成/校验 Consumer 类型和端口；不得手写第二套 Schema |
| W3 | `U-C02-CORE-CONTEXT-DOCUMENT` | 检索、ContextBundle、血缘、逆向说明接口有兼容结论 | 固定来源、事实分层、本地提交/远端发布边界冻结 |
| W4 | `U-C03-KIRO-ADAPTER`、`U-C04-CLAUDE-ADAPTER`、`U-C05-OPENCODE-ADAPTER` | Core 业务语义冻结 | 三平台只做调用、凭据和呈现适配 |
| W5 | `U-C06-CROSS-SERVICE-TESTS` | 全部生产单元达到后置检查点 | 12 个运行锚点闭合并取得执行授权后才可运行 |

## 接口与所有权边界

| 边界 | Owner | Consumer 允许行为 | 禁止行为 |
|------|-------|-------------------|----------|
| Provider 字段与错误 Schema | SSOT Provider | U-C01-CORE-PROVIDER-CLIENT 从 OpenAPI 生成或自动校验 DTO | Consumer 手写、复制或扩展 Provider Schema |
| Core 业务语义 | U-C01-CORE-PROVIDER-CLIENT/U-C02-CORE-CONTEXT-DOCUMENT | 三平台通过同一端口调用 | 平台复制项目解析、选择、降级、引用、血缘、恢复规则 |
| 正式文档正文 | 业务工作区/Git | U-C02-CORE-CONTEXT-DOCUMENT 写入并形成章节 hash | 把正文权威转移到 Provider |
| Provider 资料与血缘索引 | SSOT Provider | U-C02-CORE-CONTEXT-DOCUMENT 经 U-C01-CORE-PROVIDER-CLIENT 发布固定引用/章节摘要 | 保存 SSOT 原件、完整片段库、向量或图关系副本 |
| state v2 | 当前业务工作区 | U-C02-CORE-CONTEXT-DOCUMENT 唯一读写，U-C01-CORE-PROVIDER-CLIENT 保存非敏感恢复动作 | 读取插件自举 state、创建平台独立 state、迁移 v3 |
| 运行证据 | U-C06-CROSS-SERVICE-TESTS 聚合、外部平台权威 | 引用稳定运行 ID 和报告 | 用静态 Markdown、设计锚点或口头声明替代运行证据 |

## 配置、Secret、版本与恢复依赖

1. endpoint 与 project candidate 同时缺失为 Legacy、同时存在为 Online、仅一项存在为 ConfigError；Online 的超时、503、越权或版本冲突不得转为 Legacy。
2. Secret、Bearer、测试身份和敏感原文通过受控环境注入，只把非敏感引用传给 Core；不得进入 Git、state v2、提示词正文或普通日志。
3. 所有在线调用固定 `X-SSOT-Contract-Version: 1.0.0-candidate.1` 并传播 correlationId；未验证版本组合不得宣称兼容。
4. 仅 `retryable` 的 429/503 可最多重试 3 次，退避 1/2/4 秒；权限、项目冲突、固定修订缺失直接阻断；索引部分不可用仅在 Provider 返回可定位结果时显式降级。
5. 血缘发布先保存非敏感 Pending 动作；partial/超时未知通过 query/reconcile 对账，不重复创建逻辑血缘，不把失败标记为 synced。

## 循环依赖检查

- 生产依赖方向为“平台适配 → Core 应用服务 → U-C01-CORE-PROVIDER-CLIENT Gateway → Provider”，无 Provider 或 Core 反向依赖平台入口。
- U-C01-CORE-PROVIDER-CLIENT 与 U-C02-CORE-CONTEXT-DOCUMENT 同属 `loeyae-aidlc`，通过明确端口单向协作；U-C02-CORE-CONTEXT-DOCUMENT 不绕过 U-C01-CORE-PROVIDER-CLIENT 直接调用 Provider。
- U-C06-CROSS-SERVICE-TESTS 只观察和验证，不被生产单元作为运行依赖，因此不形成测试到生产的循环。
- 当前静态设计未发现跨 `service_id` 的生产修改范围重叠；运行关系仍未验证。
