# AI-DLC Consumer 工作单元

- **阶段**：I14 Consumer 文档生成
- **批准依据**：Provider 权威 `CR4-B5-I14-UNIT-PLAN-APPROVAL-059=A`
- **生成状态**：设计/静态生成完成；Construction 未启动
- **运行状态**：`blocked`、未验证；I13 的 12 个运行锚点仍为 `0/12`
- **来源**：[`requirements.full.md`](../requirements/requirements.full.md)、[`stories.full.md`](../user-stories/stories.full.md)、I12 应用设计与 I13 测试用例索引

工作单元是开发执行边界，不是部署边界。每个生产单元只归属一个 `service_id`；跨服务协作仅通过已批准契约、Core 端口和检查点表达。

## U-C01-CORE-PROVIDER-CLIENT / core-provider-client

| 字段 | 内容 |
|------|------|
| `unit_id` | `U-C01-CORE-PROVIDER-CLIENT` |
| `service_id` | `loeyae-aidlc` |
| 职责 | 建立 Provider 唯一客户端端口、项目解析、Online/Legacy 模式判定、配置与 Secret 注入边界、契约版本协商、稳定错误映射、有限重试和本地恢复决策；不承载文档生成语义。 |
| 需求来源 | 主归属 `ADLC-FR-003`、`ADLC-FR-010`、`ADLC-FR-011`；相关 `ADLC-NFR-002`、`003`、`005`、`007`、`008`。`source_ref`：`../requirements/requirements.full.md`。 |
| 故事来源 | 主归属 `ADLC-US-003`、`ADLC-US-010`、`ADLC-US-011`。`source_ref`：`../user-stories/stories.full.md`。 |
| UC-D 来源 | 产品：`TC-C-003-S01`—`S03`、`TC-C-010-S01`—`S02`、`TC-C-011-S01`—`S03`；技术：`TC-C-TECH-002`、`003`、`004`、`007`、`008`。 |
| 允许修改范围 | 后续获批 Construction 中仅允许 `loeyae-aidlc` 共享 Core 的 Provider 客户端、配置解析、模式选择、错误映射、重试/恢复及其同服务测试。当前 I14 不授权任何代码或配置修改。 |
| 契约依赖 | 八项 Provider 契约中的 PROJECT、MATERIAL、RETRIEVAL、CONTEXT、REVERSE-DOC、LINEAGE、INDEX-STATUS、FAILURE；字段由 Provider OpenAPI `1.0.0-candidate.1` 唯一定义。 |
| 配置依赖 | endpoint 与 project candidate 同时存在才为 Online、同时缺失才为 Legacy、部分配置为 ConfigError；Bearer/Secret 仅由受控运行时注入。 |
| 数据依赖 | state v2 中仅保存非敏感恢复位置、correlationId、固定引用和待恢复动作；不保存令牌、完整资料正文或 Provider 权威数据副本。 |
| 外部依赖 | Provider `ssot-api`；不得直连 Worker、数据库、对象存储或索引实现。 |
| 前置检查点 | Provider OpenAPI 候选版本、稳定错误类型、项目隔离与直接 Consumer 兼容策略已冻结；059=A 有效。 |
| 后置检查点 | 未配置 SSOT 时八项在线调用总数为 0；在线失败不改判 Legacy；项目冲突/越权阻断；仅 retryable 的 429/503 最多重试 3 次并按 1/2/4 秒退避；Secret 不进入 Git/state/提示词/普通日志。 |
| 完成证据 | 后续由对应 Core 单元/契约/Legacy/恢复测试的稳定命令、报告位置、版本矩阵和运行标识证明；当前仅有设计映射，`execution_status=blocked`。 |

## U-C02-CORE-CONTEXT-DOCUMENT / core-context-document

| 字段 | 内容 |
|------|------|
| `unit_id` | `U-C02-CORE-CONTEXT-DOCUMENT` |
| `service_id` | `loeyae-aidlc` |
| 职责 | 统一承载业务工作区 state v2 恢复、五角色意图、资料选择、ContextBundle 校验、事实分层文档生成、固定片段引用、章节血缘、逆向说明 Git 关联及待恢复动作。 |
| 需求来源 | 主归属 `ADLC-FR-001`、`002`、`004`、`005`、`006`、`007`、`008`、`012`；相关全部 NFR，重点为 `ADLC-NFR-001`、`003`—`006`。`source_ref`：`../requirements/requirements.full.md`。 |
| 故事来源 | 主归属 `ADLC-US-001`、`002`、`004`、`005`、`006`、`007`、`008`、`012`。`source_ref`：`../user-stories/stories.full.md`。 |
| UC-D 来源 | 产品：`TC-C-001-S01`、`TC-C-001-S02`、`TC-C-002-S01`、`TC-C-002-S02`、`TC-C-004-S01`—`S03`、`TC-C-005-S01`—`S03`、`TC-C-006-S01`—`S02`、`TC-C-007-S01`—`S03`、`TC-C-008-S01`—`S03`、`TC-C-012-S01`—`S03`，共 21 个；技术：`TC-C-TECH-001`、`TC-C-TECH-005`、`TC-C-TECH-006`。 |
| 允许修改范围 | 后续获批 Construction 中仅允许 `loeyae-aidlc` 共享 Core 的 state/session、角色意图、上下文编排、正式文档、引用/血缘和逆向说明逻辑及同服务测试；不得写平台专属分支。当前 I14 不授权实现。 |
| 契约依赖 | 经 U-C01-CORE-PROVIDER-CLIENT 间接消费八项 Provider 契约；应用层只使用生成/校验 DTO 与平台无关 Core 端口。 |
| 配置依赖 | 依赖 U-C01-CORE-PROVIDER-CLIENT 输出的 Legacy/Online/ConfigError 判定、授权项目绑定、版本结果和非敏感恢复决策。 |
| 数据依赖 | 业务工作区 state v2、RoleIntent、TargetDocument、MaterialSelection、ValidatedBundle、GenerationArtifact、FragmentCitation、LineageRecord、ReverseDocUpload；正式正文归业务工作区/Git。 |
| 外部依赖 | 业务工作区与 Git；Provider 仅经 U-C01-CORE-PROVIDER-CLIENT Gateway；任务/进度/CI/测试/制品/部署结果仍由各自权威平台提供。 |
| 前置检查点 | U-C01-CORE-PROVIDER-CLIENT Core 端口稳定；Provider 检索、ContextBundle、血缘和逆向说明契约可消费；事实分层和固定引用规则已冻结。 |
| 后置检查点 | 只读取当前业务工作区 state v2；排除项不回流；固定引用不漂移；未确认讨论/模型推断不冒充批准事实；本地文档提交与血缘发布分离；失败保持同一步骤并可恢复。 |
| 完成证据 | 后续由 Core 单元/集成、引用完整性、血缘幂等、Git 关联和外部事实边界报告证明；当前仅有设计映射，`execution_status=blocked`。 |

## U-C03-KIRO-ADAPTER / kiro-adapter

| 字段 | 内容 |
|------|------|
| `unit_id` | `U-C03-KIRO-ADAPTER` |
| `service_id` | `kiro-power` |
| 职责 | 将 Kiro Power 的输入、短时凭据、工具调用、审批呈现和会话接力映射到共享 Core 端口；不复制项目解析、资料选择、降级、引用、血缘或 state v2 业务规则。 |
| 需求来源 | 主归属 `ADLC-FR-009`；相关 `ADLC-NFR-001`、`003`、`007`。`source_ref`：`../requirements/requirements.full.md`。 |
| 故事来源 | 唯一主归属 `ADLC-US-009`。`source_ref`：`../user-stories/stories.full.md`。 |
| UC-D 来源 | 产品：`TC-C-009-S01`、`TC-C-009-S02`；无技术 UC-D 主归属。 |
| 允许修改范围 | 后续获批 Construction 中仅允许 Kiro Power 入口、Core 调用桥接、状态呈现和适配测试；当前不授权修改 Power、Hook、MCP 或配置。 |
| 契约/配置/数据/外部依赖 | 只依赖共享 Core 平台端口；短时凭据由 Kiro 运行环境注入；不直接依赖 Provider OpenAPI、ssot-api、Worker 或数据存储，不维护第二份业务状态。 |
| 前置检查点 | U-C02-CORE-CONTEXT-DOCUMENT 的平台无关命令/结果与 state v2 语义冻结。 |
| 后置检查点 | 与 Claude/OpenCode 对相同输入产生相同选择、固定引用、错误决策和下一流程状态；平台名称不进入项目事实。 |
| 完成证据 | 后续三平台 conformance 报告和 Kiro 适配报告；当前静态设计完成、运行 blocked。 |

## U-C04-CLAUDE-ADAPTER / claude-adapter

| 字段 | 内容 |
|------|------|
| `unit_id` | `U-C04-CLAUDE-ADAPTER` |
| `service_id` | `claude-plugin` |
| 职责 | 将 Claude Code Plugin 的入口、短时凭据、审批呈现和会话接力映射到共享 Core；作为 `ADLC-US-009` 协作单元，不取得该故事主归属。 |
| 需求/故事来源 | 协作引用 `ADLC-FR-009`、`ADLC-US-009` 及 `ADLC-NFR-001`、`003`、`007`；`source_ref` 分别为 `../requirements/requirements.full.md`、`../user-stories/stories.full.md`。 |
| UC-D 来源 | 无产品或技术 UC-D 主归属；协作参与 `TC-C-009-S01`、`TC-C-009-S02` 与 `TC-C-TECH-009` 的跨平台观察。 |
| 允许修改范围 | 后续获批 Construction 中仅允许 Claude Code Plugin 入口、Core 调用桥接、状态呈现和适配测试；当前不授权修改插件、Hook、MCP 或配置。 |
| 契约/配置/数据/外部依赖 | 只依赖共享 Core 平台端口；凭据由 Claude 运行环境注入；不直接消费 Provider 契约，不复制业务状态或规则。 |
| 前置检查点 | U-C02-CORE-CONTEXT-DOCUMENT Core API 冻结；U-C03-KIRO-ADAPTER 所拥有的故事验收参数可供三平台共同使用。 |
| 后置检查点 | Claude 差异只影响调用与展示；不得改变 RoleIntent、MaterialSelection、ValidatedBundle、引用、恢复或 state v2 语义。 |
| 完成证据 | 后续 Claude 适配报告及三平台 conformance 中的协作观察；当前静态设计完成、运行 blocked。 |

## U-C05-OPENCODE-ADAPTER / opencode-adapter

| 字段 | 内容 |
|------|------|
| `unit_id` | `U-C05-OPENCODE-ADAPTER` |
| `service_id` | `opencode-plugin` |
| 职责 | 将 OpenCode Plugin 的入口、短时凭据、审批呈现和会话接力映射到共享 Core；作为 `ADLC-US-009` 协作单元，不取得该故事主归属。 |
| 需求/故事来源 | 协作引用 `ADLC-FR-009`、`ADLC-US-009` 及 `ADLC-NFR-001`、`003`、`007`；`source_ref` 分别为 `../requirements/requirements.full.md`、`../user-stories/stories.full.md`。 |
| UC-D 来源 | 无产品或技术 UC-D 主归属；协作参与 `TC-C-009-S01`、`TC-C-009-S02` 与 `TC-C-TECH-009` 的跨平台观察。 |
| 允许修改范围 | 后续获批 Construction 中仅允许 OpenCode Plugin 入口、Core 调用桥接、状态呈现和适配测试；当前不授权修改插件、Hook、MCP、package 或配置。 |
| 契约/配置/数据/外部依赖 | 只依赖共享 Core 平台端口；凭据由 OpenCode 运行环境注入；不直接消费 Provider 契约，不复制业务状态或规则。 |
| 前置检查点 | U-C02-CORE-CONTEXT-DOCUMENT Core API 冻结；U-C03-KIRO-ADAPTER 所拥有的故事验收参数可供三平台共同使用。 |
| 后置检查点 | OpenCode 差异只影响调用与展示；不得改变 RoleIntent、MaterialSelection、ValidatedBundle、引用、恢复或 state v2 语义。 |
| 完成证据 | 后续 OpenCode 适配报告及三平台 conformance 中的协作观察；当前静态设计完成、运行 blocked。 |

## U-C06-CROSS-SERVICE-TESTS / cross-service-tests

| 字段 | 内容 |
|------|------|
| `unit_id` | `U-C06-CROSS-SERVICE-TESTS` |
| `service_id` | `test-suite` |
| 职责 | 建立 Provider/Consumer 契约、Core、Legacy、三平台 conformance、失败恢复、权限隔离和真实项目 E2E 的跨服务验证资产与证据聚合；不得修改生产逻辑。 |
| 需求来源 | 主归属 `ADLC-FR-013`；相关 `ADLC-NFR-001`—`008`。`source_ref`：`../requirements/requirements.full.md`。 |
| 故事来源 | 唯一主归属 `ADLC-US-013`。`source_ref`：`../user-stories/stories.full.md`。 |
| UC-D 来源 | 产品：`TC-C-013-S01`—`S03`；技术：`TC-C-TECH-009`、`TC-C-TECH-010`。 |
| 允许修改范围 | 后续获批 Construction 中仅允许 test-suite 的夹具、runner、契约/conformance/Legacy/E2E 用例与报告适配；不得修改任一生产服务逻辑。当前不授权创建或修改测试代码。 |
| 契约依赖 | Provider OpenAPI 固定版本、U-C01-CORE-PROVIDER-CLIENT Gateway、U-C02-CORE-CONTEXT-DOCUMENT Core 端口、三平台适配端口及 Provider 各生产单元的已冻结接口。 |
| 配置依赖 | 12 个运行锚点：环境、API 别名、身份、Owner、运行依赖、两个真实项目、命令、报告位置、版本矩阵、阈值、Secret 注入；当前登记 `0/12`。 |
| 数据依赖 | 至少一个包含三类资料和两个以上修订的真实脱敏项目；双项目用于隔离验证；运行证据必须有稳定标识。 |
| 外部依赖 | Provider 实现环境、Core、Kiro/Claude/OpenCode 运行环境、Git 与受控报告位置。 |
| 前置检查点 | 所有生产单元接口和版本冻结；12 个运行锚点闭合；测试执行获得独立授权。 |
| 后置检查点 | 13 故事、34 Scenario、44 UC-D 与稳定报告可追踪；缺任何 Provider、Legacy、conformance 或 E2E 证据时整体仍为未验证。 |
| 完成证据 | 后续实际命令、稳定运行 ID、报告与版本矩阵；当前仅完成设计归属，`execution_status=blocked`。 |

## 单元认领状态

| 单元 | 状态 | 认领人 | 分支 | 前置依赖 | 可认领条件 |
|------|------|--------|------|----------|------------|
| `U-C01-CORE-PROVIDER-CLIENT` | 🔓 待认领 | - | - | Provider OpenAPI 候选 | 契约已定义，可认领；运行仍 blocked |
| `U-C02-CORE-CONTEXT-DOCUMENT` | 🔓 待认领 | - | - | `U-C01-CORE-PROVIDER-CLIENT` Core 端口 | 接口已设计，可认领；实现须等 Construction 授权 |
| `U-C03-KIRO-ADAPTER` | 🔓 待认领 | - | - | `U-C02-CORE-CONTEXT-DOCUMENT` Core API | 接口已设计，可认领；仅薄适配 |
| `U-C04-CLAUDE-ADAPTER` | 🔓 待认领 | - | - | `U-C02-CORE-CONTEXT-DOCUMENT` Core API | 接口已设计，可认领；仅薄适配 |
| `U-C05-OPENCODE-ADAPTER` | 🔓 待认领 | - | - | `U-C02-CORE-CONTEXT-DOCUMENT` Core API | 接口已设计，可认领；仅薄适配 |
| `U-C06-CROSS-SERVICE-TESTS` | 🔓 待认领 | - | - | 全部生产接口 | 追踪可先认领；运行须等 12 个锚点闭合 |
