# U-C01-CORE-PROVIDER-CLIENT core-provider-client 应用设计切片

- **unit_id / service_id**：`U-C01-CORE-PROVIDER-CLIENT` / `loeyae-aidlc`
- **设计源**：[components.md](components.md)、[component-methods.md](component-methods.md)、[application-services.md](application-services.md)、[component-dependency.md](component-dependency.md)
- **状态**：设计/静态生成；实现与运行 blocked/未验证

## 组件职责

| 组件 | 本单元职责 | 禁止边界 |
|------|------------|----------|
| `IntegrationModeResolver` | 根据 endpoint/project candidate 完整性返回 Legacy/Online/ConfigError，不持久化 Secret | Online 运行失败不得改判 Legacy |
| `ProviderContractGateway` | 八项 Provider 契约的唯一传输端口；使用 OpenAPI 生成/校验 DTO，传播版本、correlationId、幂等和条件写头 | 不手写 Schema，不直连 Worker/数据库/存储，不让平台直接调用 |
| `ProjectBindingService` | 提交配置候选并消费唯一授权项目，校验 binding 与业务工作区一致 | 不按仓库名猜项目，不保存 token，不绕过越权 |
| `RecoveryCoordinator` | 把稳定 `SsotError` 映射为 Block/Retry/Confirm/Degrade，统一有限重试 | 不以 message 驱动逻辑，不无限重试，不伪造成功 |

## 方法切片

| 方法 | 用途 | 关键规则 |
|------|------|----------|
| `resolve(config: SsotBindingConfig): Legacy / Online / ConfigError` | 模式判定 | 双缺失 Legacy、双存在 Online、部分配置 ConfigError |
| `resolveProject(intent, config, credentials): ProviderProjectBinding` | 经 Gateway 调用 `resolveProject` | 只传候选和短时 Bearer |
| `assertBinding(binding, state): AuthorizedBinding` | 校验 Provider project 与工作区绑定 | 冲突保持当前 state v2 |
| `resolveProject(request)` | PROJECT | operationId `resolveProject` |
| `search(projectId, request)` | RETRIEVAL | operationId `searchProjectMaterials` |
| `createBundle(projectId, request, idempotencyKey)` | CONTEXT | operationId `createContextBundle` |
| `getRevision(projectId, materialId, revisionId)` | MATERIAL | operationId `getMaterialRevision` |
| `getIndexStatus(projectId, materialId, revisionId)` | INDEX-STATUS | operationId `getRevisionIndexStatus` |
| `publishLineage(projectId, request, idempotencyKey)` | LINEAGE 写入 | operationId `publishLineageRecords` |
| `queryLineage(projectId, request)` | LINEAGE 对账 | operationId `queryLineageRecords` |
| `uploadReverseRevision(projectId, reverseDocumentId, request, idempotencyKey, ifMatch?)` | REVERSE-DOC | operationId `createReverseDocumentRevision` |
| `decide(error: Provider:SsotError, operation)` | 稳定失败决策 | retryable 429/503 最多 3 次，1/2/4 秒 |

## 应用服务切片

- `ResumeWorkflowService` 中的模式配置校验：接收当前业务工作区定位结果，调用 `IntegrationModeResolver`；不负责读取平台自举 state。
- `PrepareMaterialIntentService` 中的 Online 项目解析：在 RoleIntent 已明确后调用 `ProjectBindingService`；Legacy 明确结束远端分支。
- `RecoverRemoteActionService` 中的版本、凭据和远端决策：复用原 idempotency key 重试或对账；权限/冲突/固定引用缺失交由用户处理。

## 数据与依赖

- 输入：非敏感 `SsotBindingConfig`、RoleIntent、短时 credentials、Provider 请求。
- 输出：模式、AuthorizedBinding、Provider DTO 结果、稳定 RecoveryAction。
- 只把非敏感 correlationId、固定引用、待恢复动作交给 U-C02-CORE-CONTEXT-DOCUMENT 保存；不拥有正式文档正文、资料库或平台状态。
- 外部依赖只允许 Provider `ssot-api` 与机器契约 `1.0.0-candidate.1`。

## 设计完成边界

U-C01-CORE-PROVIDER-CLIENT 的设计在项目解析、八项传输操作、Online/Legacy、Secret、版本、错误和重试方面完整；Consumer 类型生成、网络行为、零调用和故障恢复尚未实现或运行验证。
