# AI-DLC Consumer 组件依赖与通信

- **状态**：`CR-U-P01-CROSS-PROJECT-IMPORT-001 / CR4 B3` Consumer I12 候选，未实现或运行验证
- **运行时基线**：`../../../../../product/system-baseline/runtime-dependencies.md`
- **Provider 契约**：`contracts/ssot-api-v3.openapi.json` / `3.0.0-candidate.1`

## 依赖矩阵

| 来源 | 目标 | 模式 | 数据/契约 | 失败边界 |
|------|------|------|-----------|----------|
| KiroAdapter / ClaudeAdapter / OpenCodeAdapter | Core 应用服务 | 平台端口 | 平台无关命令/结果 | 只呈现结果；不协商 v3、零直连 Provider |
| ResumeWorkflowService | WorkspaceStateRepository | 本地文件 | state v2 | 无效 state 阻断；不借用插件 state、不迁移 state v3 |
| ResumeWorkflowService | IntegrationModeResolver | 进程内 | 非敏感配置摘要 | 部分配置 ConfigError；Online 失败不回退 Legacy |
| PrepareMaterialIntentService | RoleIntentBuilder | 进程内 | role/target/prompt | 不明确时询问，不扩大检索 |
| ProjectBindingService | ProviderContractGateway | HTTPS | v3 PROJECT/FAILURE | 工作区项目及每个目标项目独立授权；未授权 Block |
| MaterialSelectionService | ProviderContractGateway | HTTPS | v3 RETRIEVAL/MATERIAL/FAILURE | 按目标项目隔离；默认只 active，archived 自动命中 0 |
| ContextBundleValidator | ProviderContractGateway | HTTPS | v3 CONTEXT/INDEX-STATUS/FAILURE | 读取、列表、检索、Context、解析/索引均要求目标项目授权 |
| FormalDocumentGenerator | 业务工作区/Git | 本地文件/Git | 正文、章节、hash | 本地失败不发布血缘 |
| CitationAssembler | ValidatedBundle/Artifact | 进程内 | 固定 project/revision/fragment citations | 不伪造、不漂移 |
| LineagePublicationQueue | ProviderContractGateway | HTTPS + Pending | v3 LINEAGE/FAILURE | 目标项目须授权；partial/失败保持 Pending |
| ReverseDocumentUploader | Git + ProviderContractGateway | 本地校验 + HTTPS | v3 REVERSE-DOC/FAILURE | 目标项目须授权；错配不上传；不开放资料 revision 创建 |
| RecoveryCoordinator | Gateway 响应 | 进程内横切 | v3 SsotError | 权限/隔离失败不可降级；不以 message 判断 |

## Online 数据流

1. 三平台之一 → Core → 当前业务工作区 state v2。
2. Core 判定 Online，形成明确意图，解析工作区项目，并逐个校验目标项目授权。
3. Core → 唯一 ProviderContractGateway → `ssot-api` v3；按目标项目隔离执行读取、列表、检索、Context、血缘、逆向、解析/索引。
4. 默认自动检索/Context 只接受 active，archived 自动命中 0；显式旧 revision 固定 project/revision/fragment。
5. Core 提交本地正文和固定 citations 后发布血缘；失败保存 Pending 并按固定引用恢复。
6. archive/restore 不改变已有引用；恢复的新 revision 只影响后续默认读取。

前向链路仅为 Provider v3 → Portal v3 → Core v3；三平台始终只经 Core。

## Legacy 数据流

1. 平台 → Core → state v2。
2. IntegrationModeResolver 判定 Legacy。
3. 继续既有本地流程；Gateway 不实例化或不接收调用。
4. Legacy 保持全部 v3 网络调用为 0；这是设计约束，不宣称已运行验证。

## B1 写入依赖边界

Provider/Portal 的 `createMaterial`、`archiveMaterial`、`restoreMaterialStatus`、`restoreMaterialRevision` 四个写入例外仅为直接能力，Core 不建立对应依赖；`createMaterialRevision` 不开放。U-C01/U-C02 不新增跨项目生命周期写入口。现有血缘写和逆向写不扩展为资料生命周期能力。

## 依赖禁止项

- 三平台不得直接依赖 `ssot-api`、v3 OpenAPI DTO、Worker、数据库、对象存储或索引。
- Core 不保存 SSOT 原件、完整片段库、权限规则或项目间结果的第二副本。
- 目标项目授权不得由其他项目授权推导；权限/隔离失败不得降级。
- 在线失败不得进入 Legacy；平台切换不得创建第二份 state。
- Provider DTO 只能从 v3 机器契约生成/校验。
- 正式文档提交与血缘发布是两个 Owner 边界；血缘失败不删除正文或标记闭环完成。
