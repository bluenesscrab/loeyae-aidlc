# AI-DLC Consumer 应用服务与编排器

- **Provider 契约**：SSOT `contracts/ssot-api-v3.openapi.json` / `3.0.0-candidate.1`
- **变更状态**：`CR-U-P01-CROSS-PROJECT-IMPORT-001 / CR4 B3` Consumer I12 候选；Provider/Portal 已稳定
- **验证状态**：不宣称 Consumer 已实现或运行验证

## 编排器

| 应用服务 | 触发 | 编排步骤 | 成功条件 | 失败/恢复 |
|----------|------|----------|----------|-----------|
| ResumeWorkflowService | 任一平台继续业务流程 | 定位业务工作区 → load state v2 → 校验模式 → 建立平台无关会话 | state v2 有效且模式明确 | 不读插件 state，不迁移 state v3 |
| PrepareMaterialIntentService | 需要资料支持的正式文档步骤 | 识别角色/目标 → Online 解析工作区项目及每个目标项目授权；Legacy 结束远端分支 | 所有将访问的目标项目均有明确授权，或 Legacy 零调用 | 未授权/项目隔离/版本失败保持当前步骤；不回退 Legacy |
| SelectMaterialService | Online 且目标项目已授权 | 按项目检索 → 默认过滤为 active → 应用 include/exclude/固定旧 revision → 确认 → 创建并校验 bundle | bundle 每项固定到已授权 project/revision/fragment | archived 自动命中 0；未授权、串项目、漂移或排除命中 Block |
| GenerateFormalDocumentService | bundle 已验证或 Legacy 使用既有本地输入 | 生成草稿 → 本地提交 → 形成固定 citations → 保存 Pending 血缘 | 本地 artifact 已提交且引用完整 | 历史内容恢复的新 revision 不改写已有引用；本地失败不远端发布 |
| PublishLineageService | artifact 与 citations 已提交 | enqueue → v3 publish → 逐项处理 → 按固定目标项目/revision query/reconcile | 全部 published 且可查询 | partial/失败保持 Pending；不得漂移到新 revision |
| UploadReverseDocumentService | 用户选择上传逆向说明 | 校验目标项目授权及 Git path/commit/hash → 幂等上传 → 保存固定 reverse-document revision ref | 远端引用与目标项目及本地 hash 对应 | 未授权/错配阻断；该能力不开放 `createMaterialRevision` |
| RecoverRemoteActionService | state v2 存在待恢复动作 | 重载 state → 复核模式/目标授权/凭据/版本 → 按原 idempotency key 重试或对账 | 远端状态与固定引用一致 | 恢复资料产生的新 revision 仅影响后续默认读取，不改变既有引用 |

## B1 生命周期写边界

Provider/Portal 的 `createMaterial`、`archiveMaterial`、`restoreMaterialStatus`、`restoreMaterialRevision` 四个写入例外仅为直接能力。Core 当前不暴露这些能力，也不新增其他跨项目生命周期写入口；`createMaterialRevision` 不开放。Consumer 只适配 v3 既有读取、Context、血缘和逆向写能力。

## Online 主流程

1. 平台把业务请求、workspace 与短时凭据交给 Core；三平台不接触 Provider。
2. Core 从 workspace state v2 恢复 RoleIntent/TargetDocument，保持当前恢复语义。
3. Core v3 通过唯一 Gateway 解析工作区项目，并逐个校验读取、列表、检索、Context、血缘、逆向、解析/索引的目标项目授权。
4. 按目标项目隔离检索；默认自动检索/Context 只接受 active，archived 自动命中 0。
5. 显式选择固定 project/revision/fragment；已有读取授权时，固定旧 revision 与血缘不随 archive/restore 漂移。
6. Provider 创建 ContextBundle；Core 校验授权、隔离、固定引用和降级状态。
7. Core 在业务工作区提交正文，再发布或对账固定血缘；逆向写也只面向已授权目标项目。
8. 资料恢复产生的新 revision 只影响后续默认读取；已有 citation、lineage 和固定读取保持原 revision。

唯一前向顺序为 Provider v3 → Portal v3 → Core v3。三平台仅经 Core，不协商 v3、零直连 Provider。

## Legacy 分支

- endpoint 与 project candidate 均缺失时进入 Legacy；不创建 Gateway、不探测 Provider，全部 v3 在线调用数为 0。
- Legacy 继续既有本地流程和 state v2 恢复语义；Online 超时、503、权限或契约失败不得触发 Legacy。
- Legacy 零调用及兼容性在本文中仅为设计约束，不宣称已运行验证。

## 失败决策

| 类别 | 决策 |
|------|------|
| 项目歧义/不存在、目标项目未授权、隔离冲突 | Block；不使用其他项目结果或缓存替代 |
| 固定 revision/fragment 缺失或版本冲突 | Block；不替换为最新 revision |
| 低置信/来源冲突/预算不足 | Confirm |
| 非权限类索引部分不可用且 Provider 返回可定位结果 | Degrade；保留实际路径和失败状态 |
| 429/503 且 retryable | Retry；最多 3 次，1/2/4 秒 |
| 血缘 partial | Pending；按固定目标项目/revision query/reconcile |

## 平台一致性

Kiro、Claude Code、OpenCode 必须调用同一 Core 编排器和端口。相同 state v2、角色、目标项目授权、显式选择与 Provider 响应应得到相同固定修订、引用、稳定错误决策和下一流程状态；平台名称不进入项目事实。
