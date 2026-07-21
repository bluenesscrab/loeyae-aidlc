# AI-DLC Consumer 组件设计

- **基线**：`CR-I5-SCOPE-001 / CR4 B5 / I12`
- **Provider 机器契约**：SSOT `contracts/ssot-api-v1.openapi.json`，`1.0.0-candidate.1`
- **状态**：应用设计候选；本次未修改 Core、平台插件、Hook、MCP 或配置

## Core 组件

| 组件 | 高层职责 | 拥有的数据/状态 | Provider 依赖 | Owner | 禁止边界 |
|------|----------|----------------|---------------|-------|----------|
| WorkspaceStateRepository | 只从当前业务工作区读取/更新 state v2 与非敏感恢复记录 | state v2 流程位置、待恢复动作 | 无 | Core Owner | 不读插件源码仓 state，不迁移 v3 |
| IntegrationModeResolver | 依据 endpoint 与 project candidate 的完整配置判定 Legacy/Online/ConfigError | 模式判定，不持久化 Secret | 无 | Core Owner | 在线失败不得改判 Legacy |
| RoleIntentBuilder | 从角色、目标文档、提示词形成资料意图 | RoleIntent、TargetDocument | 无 | 流程 Owner | 不猜测不明确角色/目标 |
| ProviderContractGateway | 唯一 Provider 传输端口；使用 OpenAPI 生成/校验类型与操作 | correlationId、版本、非敏感调用结果 | 八项契约 | 集成 Owner | 不手写第二套 Schema，不直连 Worker/存储 |
| ProjectBindingService | 提交候选并消费唯一项目结果 | 非敏感 ProviderProjectBinding | PROJECT/FAILURE | 集成 Owner | 不按仓库名猜项目，不保存 token |
| MaterialSelectionService | 合并自动结果与显式包含/排除/旧版，形成可解释固定选择 | MaterialSelection/SelectedMaterial | MATERIAL/RETRIEVAL/FAILURE | 资料消费 Owner | 排除项不得重新进入；旧版不提升 |
| ContextBundleValidator | 校验 bundle 项目、修订、片段、来源状态、实际路径、降级和预算 | ContextBundleReference/IndexDegradation | CONTEXT/INDEX-STATUS/FAILURE | 上下文 Owner | 不重写 Provider 事实，不接受跨项目条目 |
| FormalDocumentGenerator | 在业务工作区生成事实分层的正式文档 | GenerationArtifact/DocumentSection；正文归 Git | 间接使用 bundle | 文档生成 Owner | 不把讨论/推断写成已批准事实 |
| CitationAssembler | 从实际使用片段形成固定 citation 和章节 hash | FragmentCitation、DocumentSection | MATERIAL/LINEAGE | 文档生成 Owner | 不伪造 fragment，不漂移 revision |
| LineagePublicationQueue | 保存非敏感待发布动作并幂等调用 Provider，支持 partial 对账 | generationId、固定引用、状态、correlationId | LINEAGE/FAILURE | 文档生成 Owner | 失败不标记 synced，不复制正文 |
| ReverseDocumentUploader | 校验 repository/path/commit/content hash 后上传说明 | ReverseDocUpload 与远端 revision ref | REVERSE-DOC/FAILURE | 逆向工程 Owner | 不修改代码/Git，不上传错配说明 |
| RecoveryCoordinator | 将稳定错误映射为阻断、有限重试、用户确认或显式降级 | 非敏感恢复动作 | FAILURE/INDEX-STATUS | 集成 Owner | 不以展示消息驱动逻辑，不无限重试 |

## 平台端口

| 端口 | 职责 | 可变差异 | 不可变语义 |
|------|------|----------|------------|
| KiroAdapter | Kiro Power 输入输出、凭据注入、状态呈现 | 工具调用/交互 | RoleIntent、选择、bundle、引用、state v2 |
| ClaudeAdapter | Claude Code Plugin 输入输出、凭据注入、状态呈现 | 插件入口/交互 | 同上 |
| OpenCodeAdapter | OpenCode Plugin 输入输出、凭据注入、状态呈现 | 插件入口/交互 | 同上 |

## 契约映射

| Provider 契约 | Consumer 主组件 | 本地结果 |
|---------------|-----------------|----------|
| PROJECT | ProjectBindingService | ProviderProjectBinding |
| MATERIAL / RETRIEVAL | MaterialSelectionService | 固定 SelectedMaterial |
| CONTEXT / INDEX-STATUS | ContextBundleValidator | ContextBundleReference + IndexDegradation |
| LINEAGE | CitationAssembler + LineagePublicationQueue | 待发布/已发布 LineageRecord |
| REVERSE-DOC | ReverseDocumentUploader | Provider revision ref |
| FAILURE | RecoveryCoordinator | 阻断/重试/确认/降级决定 |

三平台仅间接消费这些语义；任何平台特有业务分支均视为设计越界。
