# I14 Consumer 单元生成决策摘要

- **阶段**：CR4 B5 / I14 单元生成
- **批准依据**：Provider 权威计划 `CR4-B5-I14-UNIT-PLAN-APPROVAL-059=A`
- **生成状态**：设计/静态文档已生成
- **实现与运行状态**：Construction 未启动；Provider/Consumer 运行、Legacy、三平台 conformance、契约测试和 E2E 均 blocked/未验证

## 关键决策

1. 固定生成 6 个工作单元：`U-C01-CORE-PROVIDER-CLIENT/core-provider-client`、`U-C02-CORE-CONTEXT-DOCUMENT/core-context-document`、`U-C03-KIRO-ADAPTER/kiro-adapter`、`U-C04-CLAUDE-ADAPTER/claude-adapter`、`U-C05-OPENCODE-ADAPTER/opencode-adapter`、`U-C06-CROSS-SERVICE-TESTS/cross-service-tests`。
2. U-C01-CORE-PROVIDER-CLIENT 与 U-C02-CORE-CONTEXT-DOCUMENT 同属 `loeyae-aidlc` 但职责分离：前者拥有 Provider 传输、模式、版本、错误和重试；后者拥有 state v2、角色意图、资料/上下文、文档、引用/血缘和逆向说明业务语义。
3. `ADLC-US-009` 唯一主归属 U-C03-KIRO-ADAPTER；U-C04-CLAUDE-ADAPTER/U-C05-OPENCODE-ADAPTER 是完整协作单元，只处理平台入口、凭据和呈现，不复制 Core 规则，也不重复标记主归属。
4. `ADLC-US-013` 与跨服务技术验证主归属 U-C06-CROSS-SERVICE-TESTS；测试单元不得修改生产逻辑。
5. 13 个故事、34 个产品 Scenario、34 个产品 UC-D 和 10 个技术 UC-D 均建立唯一主归属；协作关系单独登记。
6. Provider 的八项契约与 OpenAPI `1.0.0-candidate.1` 保持唯一字段事实；Consumer 只建立消费映射，不复制 Schema。
7. 原需求和故事正文归档为 `requirements.full.md` 与 `stories.full.md`；新切片的 `source_ref` 明确指向归档源。

## 固定约束

- 业务项目只从当前工作区恢复 state v2；不迁移 v3，不读取插件源码仓自举 state。
- endpoint/project candidate 同时缺失为 Legacy，八项在线调用数必须为 0；Online 失败不得回退 Legacy。
- Secret、Bearer 与敏感原文不进入 Git、state、提示词正文或普通日志。
- 固定资料/修订/片段引用不漂移；讨论、结论、已确认资料和模型推断必须分层。
- 正式文档正文归业务工作区/Git，Provider 只保存引用、章节摘要和血缘索引。
- 12 个运行锚点仍为 `0/12`；所有 UC-D 继续 blocked，静态检查不构成运行证据。

## 产物与可逆性

- 归档移动：`requirements/requirements.md` → `requirements/requirements.full.md`；`user-stories/stories.md` → `user-stories/stories.full.md`。
- 新增：工作单元、依赖、故事映射、决策摘要，以及需求/故事/应用设计的索引、共享文档和 6 个单元切片。
- 未修改：I12 原设计文件、`application-design/test-cases/`、plans、state、CR、audit、代码、配置、契约、Hook/MCP/package。

## 后续门禁

本次只完成 I14 Consumer 设计文档生成与静态验证。后续必须先独立审批 I14 产物；未获审批且 12 个运行锚点未闭合前，不得启动 Construction、运行测试或声称任何运行能力通过。
