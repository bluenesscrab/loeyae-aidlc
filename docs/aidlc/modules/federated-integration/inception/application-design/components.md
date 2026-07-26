# AI-DLC Consumer 组件设计

- **变更**：`CR-U-P01-CROSS-PROJECT-IMPORT-001 / CR4 B3 / Consumer I12`
- **Provider 机器契约**：SSOT `contracts/ssot-api-v3.openapi.json`，`3.0.0-candidate.1`
- **状态**：Provider/Portal 已稳定；本文仅为 Core v3 设计候选，未实现或运行验证

## Core 组件

| 组件 | 高层职责 | 拥有的数据/状态 | Provider v3 依赖 | 禁止边界 |
|------|----------|----------------|------------------|----------|
| WorkspaceStateRepository | 只从当前业务工作区读取/更新 state v2 与非敏感恢复记录 | state v2 流程位置、待恢复动作 | 无 | 不读插件源码仓 state，不迁移 state v3 |
| IntegrationModeResolver | 依据 endpoint 与 project candidate 的完整配置判定 Legacy/Online/ConfigError | 模式判定 | 无 | 在线失败不得改判 Legacy |
| RoleIntentBuilder | 从角色、目标文档、提示词形成资料意图 | RoleIntent、TargetDocument | 无 | 不猜测不明确角色/目标 |
| ProviderContractGateway | Provider v3 的唯一传输端口，适配既有读取、Context、血缘、逆向写、DTO、稳定错误、版本头和隔离语义 | correlationId、目标 projectId、版本、非敏感调用结果 | v3 前向契约 | 不暴露 `createMaterial`、`archiveMaterial`、`restoreMaterialStatus`、`restoreMaterialRevision`、`createMaterialRevision` 或其他跨项目生命周期写入口 |
| ProjectBindingService | 解析调用方工作区项目及每个目标项目授权，保持项目隔离 | 非敏感 AuthorizedProjectBinding | PROJECT/FAILURE | 不按仓库名猜项目，不把源项目授权推导为目标项目授权 |
| MaterialSelectionService | 合并授权目标项目的自动结果与显式 include/exclude/旧 revision，形成固定选择 | MaterialSelection/SelectedMaterial | MATERIAL/RETRIEVAL/FAILURE | 默认自动检索只接受 active；archived 自动命中 0；不得提升旧 revision |
| ContextBundleValidator | 校验每个目标项目授权、修订、片段、来源状态、实际路径、降级和预算 | ContextBundleReference/IndexDegradation | CONTEXT/INDEX-STATUS/FAILURE | 不接受未授权项目、漂移或排除命中；不补造来源状态 |
| FormalDocumentGenerator | 在业务工作区生成事实分层正式文档 | GenerationArtifact/DocumentSection；正文归 Git | 间接使用 bundle | 不伪装 Provider 事实；不因资料恢复改写已有引用 |
| CitationAssembler | 从实际使用片段形成固定 citation 和章节 hash | FragmentCitation、DocumentSection | MATERIAL/LINEAGE | 不伪造 fragment，不漂移 revision |
| LineagePublicationQueue | 保存 Pending 并幂等发布/查询/对账授权目标项目血缘 | generationId、固定引用、状态、correlationId | LINEAGE/FAILURE | 失败不标记 synced，不复制正文，不跨项目越权 |
| ReverseDocumentUploader | 校验 repository/path/commit/content hash 后向授权目标项目上传逆向说明 | ReverseDocUpload 与远端 revision ref | REVERSE-DOC/FAILURE | 不修改代码/Git，不上传错配说明，不开放资料 revision 创建 |
| RecoveryCoordinator | 将稳定错误映射为阻断、有限重试、确认或显式降级 | 非敏感恢复动作 | FAILURE/INDEX-STATUS | 权限/项目隔离失败不可降级，不以 message 驱动逻辑 |

## B1 权威边界

Provider/Portal 的 `createMaterial`、`archiveMaterial`、`restoreMaterialStatus`、`restoreMaterialRevision` 四个写入例外仅是其直接能力，Core 当前不暴露；`createMaterialRevision` 不开放。U-C01/U-C02 不新增、不实现任何跨项目生命周期写入口。资料恢复产生的新 revision 只影响后续默认读取，不改变已有固定 revision、citation 或 lineage。

## 平台端口

Kiro、Claude Code、OpenCode 只调用同一 Core 平台无关端口；可变差异仅限平台交互和凭据注入。三平台不协商 v3、不依赖 Provider DTO、不直连 Provider，RoleIntent、目标项目授权、选择、bundle、引用、稳定错误决策和 state v2 语义一致。

## 契约映射

| Provider v3 契约 | Consumer 主组件 | 本地结果 |
|------------------|-----------------|----------|
| PROJECT | ProjectBindingService | 调用方及目标项目 AuthorizedProjectBinding |
| MATERIAL / RETRIEVAL | MaterialSelectionService | 按目标项目隔离的固定 SelectedMaterial |
| CONTEXT / INDEX-STATUS | ContextBundleValidator | ContextBundleReference + IndexDegradation |
| LINEAGE | CitationAssembler + LineagePublicationQueue | 待发布/已发布固定 LineageRecord |
| REVERSE-DOC | ReverseDocumentUploader | Provider reverse-document revision ref |
| FAILURE | RecoveryCoordinator | 阻断/重试/确认/降级决定 |
