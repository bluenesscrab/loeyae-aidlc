# U-C01-CORE-PROVIDER-CLIENT core-provider-client 应用设计切片

- **unit_id / service_id**：`U-C01-CORE-PROVIDER-CLIENT` / `loeyae-aidlc`
- **变更**：`CR-U-P01-IDENTITY-001 / CR4 B4 / Consumer 同步`（前一轮为 `CR-U-P01-CROSS-PROJECT-IMPORT-001 / CR4 B3 / Consumer I12`）
- **Provider v3 字段权威**：SSOT `contracts/ssot-api-v3.openapi.json` / `3.1.0-candidate.1`
- **状态**：Provider/Portal 已稳定；U-C01 Core v3 设计候选，未实现或运行验证。令牌签发方已由外部 OIDC 改为 Provider 自签，U-C01 标记为**待适配**

## 组件职责

| 组件 | 本单元职责 | 禁止边界 |
|------|------------|----------|
| `IntegrationModeResolver` | 根据 endpoint/project candidate 完整性返回 Legacy/Online/ConfigError | Online 失败不得改判 Legacy；保持 state v2 |
| `ProviderContractGateway` | v3 既有读取、Context、血缘、逆向写的唯一传输端口；生成/校验 DTO，传播精确版本、correlationId、幂等和条件写头 | 不让平台直连；不暴露任何资料生命周期写入口 |
| `ProjectBindingService` | 解析工作区项目，并对每个读取、列表、检索、Context、血缘、逆向、解析/索引目标项目取得独立授权 | 不猜项目，不保存 token，不跨项目继承或合并权限 |
| `RecoveryCoordinator` | 按稳定 `SsotError` code/retryable/impact 映射 Block/Retry/Confirm/Degrade | 权限/隔离失败不可降级；不以 message 决策 |

## Gateway 方法切片

| 方法 | operationId | v3 规则 |
|------|-------------|---------|
| `resolveProject(request)` | `resolveProject` | 返回项目隔离结果 |
| `search(projectId, request)` | `searchProjectMaterials` | 目标项目先授权；默认只 active，archived 自动命中 0 |
| `createBundle(projectId, request, idempotencyKey)` | `createContextBundle` | 目标项目先授权；固定 project/revision/fragment |
| `getRevision(projectId, materialId, revisionId)` | `getMaterialRevision` | 显式旧 revision 在读取授权仍有效时不漂移 |
| `getIndexStatus(projectId, materialId, revisionId)` | `getRevisionIndexStatus` | 目标项目授权失败不可降级 |
| `publishLineage(projectId, request, idempotencyKey)` | `publishLineageRecords` | 仅既有血缘写；固定 project/revision/fragment |
| `queryLineage(projectId, request)` | `queryLineageRecords` | 按固定引用对账，不漂移到恢复后新 revision |
| `uploadReverseRevision(projectId, reverseDocumentId, request, idempotencyKey, ifMatch?)` | `createReverseDocumentRevision` | 仅既有逆向写；不等同资料 revision 创建 |
| `decide(error: Provider:SsotError, operation)` | — | retryable 429/503 最多 3 次，1/2/4 秒 |

所有在线请求固定发送 `X-SSOT-Contract-Version: 3.1.0-candidate.1`。Provider DTO 从 v3 OpenAPI 生成或自动校验，不手写第二套 Schema。

## 令牌获取与携带（`CR-U-P01-IDENTITY-001` CR4 B4 同步）

Provider 侧已由 `CR4-U-P01-IDENTITY-MECHANISM-APPROVAL-093=A` 与 `CR4-U-P01-IDENTITY-REWRITE-APPROVAL-094=A` 冻结以下事实，Consumer 必须按此适配：

| 事实 | 对 Consumer 的含义 |
|------|---------------------|
| 本环境不存在 OIDC 设施；令牌由 `ssot-api` 自签，经 `POST /v3/auth/tokens`（`issueAccessToken`）以目录凭据换取 | Consumer 不能再假设存在外部 IdP 的授权码/PKCE 流程或 discovery 文档 |
| 令牌为分钟级、上限 1 小时的无状态令牌，**不提供刷新令牌** | 到期必须重新走 `issueAccessToken`，不得实现刷新流程或延长本地缓存 |
| 令牌获取失败语义：`401`（凭据失败且不区分原因）、`429`（双维限流）、`503`（目录或签名材料不可用，零签发） | Consumer 必须按稳定错误阻断；`401` 不得据此推断主体是否存在；`503` 不得降级为匿名或本地伪造令牌 |
| 目录不可用期间已签发未过期令牌继续可用 | 令牌获取失败不得使正在进行的读取/写入流程整体失败，若手持有效令牌应继续按原语义调用 |
| 不提供令牌级即时吊销 | Consumer 不得声称支持即时登出或即时权限回收 |
| 业务请求继续以 `Authorization: Bearer` 携带令牌，`bearerAuth` 结构未变 | 既有 19 个 operation 的调用结构不变，属条件兼容而非破坏性变更 |

**未闭合并阻断的职责归属**：`issueAccessToken` 的调用方尚未确定。既有冻结约束中，「三平台零直连 Provider」与「原始凭据只由平台凭据适配器保存、Core 只接收短时值、不保存 token」两条同时成立时，无法在不违反其一的前提下确定由谁提交目录凭据换取令牌。因此本切片**暂不新增** `issueToken` 类方法，也不修改 `ProviderContractGateway` 方法表；该归属由 `CR4-U-P01-IDENTITY-CONSUMER-TOKEN-Q001` 决定，未闭合前 U-C01 的令牌获取路径保持「待适配、未设计」。

## B1 权威边界

Provider/Portal 的 `createMaterial`、`archiveMaterial`、`restoreMaterialStatus`、`restoreMaterialRevision` 四个写入例外仅为直接能力。U-C01 不提供这些方法，不开放 `createMaterialRevision`，也不新增其他跨项目生命周期写入口。U-C01 只适配 v3 现有读取、Context、血缘、逆向写、DTO、稳定错误、版本头和隔离语义。

## 应用服务切片

- `ResumeWorkflowService`：校验模式配置并保持当前业务工作区 state v2；Legacy 不创建 Gateway。
- `PrepareMaterialIntentService`：RoleIntent 明确后解析工作区项目和全部目标项目授权；未授权保持当前步骤。
- `SelectMaterialService`：按目标项目隔离检索和 Context；默认只 active，archived 自动命中 0。
- `RecoverRemoteActionService`：复核目标项目授权、凭据和 v3 版本，复用原 idempotency key；固定旧 revision/血缘不因 archive/restore 漂移。

## 数据与依赖

- 输入：非敏感 `SsotBindingConfig`、RoleIntent、短时 credentials（其来源与获取方式因令牌签发方改变而待重新确定，见上一节）、目标 projectId、Provider 请求。
- 输出：模式、逐目标项目 AuthorizedBinding、v3 DTO 结果、稳定 RecoveryAction。
- 只向 U-C02 交付非敏感 correlationId、目标 projectId、固定引用和待恢复动作；不拥有正文、资料库或平台状态。
- 资料恢复产生的新 revision 只影响后续默认读取，不改变已交付的固定 revision/citation/lineage。
- Kiro、Claude Code、OpenCode 仅依赖 Core 平台无关端口，不协商 v3、不依赖 Provider DTO、零直连 Provider。
- Legacy 保持全部 v3 在线调用为 0，state 保持 v2 与当前恢复语义。

## 设计完成边界

本切片仅完成 U-C01 的 Core v3 候选边界：目标项目授权、隔离、既有读取/Context/血缘/逆向写、DTO、版本头和稳定错误。Provider/Portal 稳定不代表 Consumer 已实现；类型生成、网络行为、Legacy 零调用和故障恢复均未运行验证。

2026-07-26（`CR-U-P01-IDENTITY-001` CR4 B4）补充边界：本次只同步版本头与令牌获取/携带的既有事实，未新增方法、未修改组件职责表、未实现任何令牌获取逻辑。令牌获取的调用方归属未闭合，Consumer 侧 UC-D 因此未派生，`V-IDENT-08` 的 Consumer 部分仍为已登记缺口。
