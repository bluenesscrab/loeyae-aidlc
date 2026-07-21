# AI-DLC Consumer 组件依赖与通信

- **状态**：I12 设计候选，未实现或运行验证
- **运行时基线**：`../../../../../product/system-baseline/runtime-dependencies.md`

## 依赖矩阵

| 来源 | 目标 | 模式 | 数据/契约 | 允许方向 | 失败边界 |
|------|------|------|-----------|----------|----------|
| KiroAdapter | Core 应用服务 | 平台端口 | 平台无关命令/结果 | 平台→Core | 只呈现结果，不复制选择/错误规则 |
| ClaudeAdapter | Core 应用服务 | 平台端口 | 同上 | 平台→Core | 同上 |
| OpenCodeAdapter | Core 应用服务 | 平台端口 | 同上 | 平台→Core | 同上 |
| ResumeWorkflowService | WorkspaceStateRepository | 本地文件访问 | state v2 | Core→当前 workspace | 无效 state 阻断，不借用插件 state |
| ResumeWorkflowService | IntegrationModeResolver | 进程内 | 非敏感配置摘要 | 单向 | 部分配置为 ConfigError |
| PrepareMaterialIntentService | RoleIntentBuilder | 进程内 | role/target/prompt | 单向 | 不明确时询问，不调用 Provider |
| ProjectBindingService | ProviderContractGateway | 同步 HTTPS | PROJECT/FAILURE | Core→ssot-api | 失败不推进 state，不回退 Legacy |
| MaterialSelectionService | ProviderContractGateway | 同步 HTTPS | RETRIEVAL/MATERIAL/FAILURE | Core→ssot-api | 排除/旧版/冲突保持显式 |
| ContextBundleValidator | ProviderContractGateway | 同步 HTTPS | CONTEXT/INDEX-STATUS/FAILURE | Core→ssot-api | 不接受跨项目或漂移条目 |
| FormalDocumentGenerator | 业务工作区/Git | 本地文件/Git | 正文、章节、hash | Core→workspace | 本地失败不发布血缘 |
| CitationAssembler | ValidatedBundle/Artifact | 进程内 | 固定 citations | 单向 | 不伪造片段 |
| LineagePublicationQueue | ProviderContractGateway | 同步 HTTPS + 本地待恢复 | LINEAGE/FAILURE | Core→ssot-api | partial/失败保持 Pending |
| ReverseDocumentUploader | Git + ProviderContractGateway | 本地校验 + HTTPS | REVERSE-DOC/FAILURE | Core→Git只读、Core→ssot-api | 错配不上传，不修改 Git |
| RecoveryCoordinator | ProviderContractGateway 响应 | 进程内横切 | SsotError | 单向决策 | 不以 message 判断，不无限重试 |

## Online 数据流

1. 平台 → ResumeWorkflowService → 当前业务工作区 state v2。
2. IntegrationModeResolver 判定 Online；RoleIntentBuilder 形成明确意图。
3. Core → ProviderContractGateway → `ssot-api` 解析项目、检索并创建 ContextBundle。
4. ContextBundleValidator → FormalDocumentGenerator → 业务工作区/Git。
5. CitationAssembler → LineagePublicationQueue → `ssot-api`。
6. Provider 失败 → RecoveryCoordinator → WorkspaceStateRepository 保存非敏感待恢复动作 → 平台呈现。

## Legacy 数据流

1. 平台 → ResumeWorkflowService → state v2。
2. IntegrationModeResolver 判定 Legacy。
3. 继续既有本地流程；ProviderContractGateway 不实例化或不接收调用。
4. 任一观测到的 SSOT 网络调用都使 Legacy 兼容验证失败。

## 依赖禁止项

- 三平台不得直接依赖 `ssot-api`、OpenAPI DTO、Worker、数据库或索引。
- Core 不保存 SSOT 原件、完整片段库、向量、图关系或权限规则的第二副本。
- 在线失败不得调用 Legacy 分支；平台切换不得创建第二份 state。
- Provider DTO 只能从机器契约生成/校验；手写字段副本不是有效依赖。
- 正式文档提交与血缘发布是两个 Owner 边界；血缘失败不删除本地正文，也不标记闭环完成。
