# 产品级契约索引（AI-DLC Consumer 侧）

- **当前评估候选**：`CR-U-P01-IDENTITY-001 / CR4 B4 Consumer 同步`（前一轮为 `CR-U-P01-CROSS-PROJECT-IMPORT-001 / CR4 B2 Consumer`）
- **形成时间**：2026-07-26
- **Provider 唯一机器事实**：SSOT Provider 仓 `contracts/ssot-api-v3.openapi.json` / `3.1.0-candidate.1`
- **当前状态**：v3 Consumer 已评估/待适配，运行未验证；本次仅同步契约版本与令牌获取/携带描述，不修改 Core 实现、三平台、需求、故事、state、配置值或任何 Schema
- **事实边界**：本仓只保存 Provider 契约的索引、Consumer 状态、适配约束和证据入口，不复制 Schema；当前无 GA、Provider/Consumer 实现、生成客户端、数据库、运行数据或运行窗口。身份设施已确定为 OpenLDAP、令牌由 Provider 自签，但目录、密钥与运行行为均未验证

## CR-U-P01-IDENTITY-001 CR4 B4：认证机制变更的 Consumer 同步

> Provider 侧已由 `CR4-U-P01-IDENTITY-MECHANISM-APPROVAL-093=A` 与 `CR4-U-P01-IDENTITY-REWRITE-APPROVAL-094=A` 冻结机制并生成 `3.1.0-candidate.1`。本节只登记 Consumer 侧受影响事实与待适配状态，不修改 Core 实现或设计方法表。

| 项 | 结论 |
|----|------|
| Provider 契约版本 | `3.0.0-candidate.1` → `3.1.0-candidate.1`；19 paths、20 个唯一 operationId、64 个 schemas；新增 `issueAccessToken`（`POST /v3/auth/tokens`） |
| 兼容性分类 | 结构兼容新增（既有 19 个 operationId 与 `bearerAuth` 结构不变）；**消费者条件兼容**——令牌签发方由外部 OIDC 改为 Provider 自签，令牌获取路径必须改写 |
| 版本头 | 在线请求的 `X-SSOT-Contract-Version` 必须改为 `3.1.0-candidate.1` |
| 令牌语义 | 分钟级、上限 1 小时的无状态令牌；**无刷新令牌**，到期重新获取；无令牌级即时吊销 |
| 令牌获取失败映射 | `401` 凭据失败且不区分原因（不得据此推断主体是否存在）、`429` 双维限流、`503` 目录或签名材料不可用且零签发（不得降级为匿名或本地伪造令牌） |
| 目录不可用期间 | 已签发未过期令牌继续可用；令牌获取失败不得使持有有效令牌的进行中流程整体失败 |
| 错误码 | `SSOT-FAILURE-001` 未新增错误码，复用 `AUTHENTICATION_REQUIRED`/`RATE_LIMITED`/`PROVIDER_UNAVAILABLE` |
| 逐 Consumer 状态 | `U-C01`、`U-C02` 标记为待适配；Kiro/Claude Code/OpenCode 仍只经 Core，零直连边界不变 |
| **未闭合阻断项** | `issueAccessToken` 的调用方归属未确定。「三平台零直连 Provider」与「原始凭据只由平台凭据适配器保存、Core 只接收短时值且不保存 token」两条既有约束同时成立时，无一方可在不违反其一的前提下提交目录凭据。归属由 `CR4-U-P01-IDENTITY-CONSUMER-TOKEN-Q001` 决定；闭合前不新增 Core 方法、不实现令牌获取、Consumer 侧令牌获取 UC-D 不派生 |
| Consumer UC-D | 本次未新增。`V-IDENT-08` 的 Provider 部分已由 `TC-T-IDENTITY-001`、`TC-T-IDENTITY-002` 关闭，Consumer 部分仍为已登记缺口 |

## CR-U-P01-CROSS-PROJECT-IMPORT-001 CR4 B2：v3 Consumer 评估候选

### CR-B2.1 权威来源与静态事实

- 字段级唯一机器事实为 SSOT Provider 仓 `contracts/ssot-api-v3.openapi.json` / `3.0.0-candidate.1`；本文件不得形成第二套字段定义。v1/v2 仅作只读历史，不是当前前向 Consumer 契约。
- v3 由 v2 完整派生，包含 18 paths、19 个唯一 operationId、62 个 schemas，并新增 `archiveMaterial`、`restoreMaterial`、`restoreMaterialRevision`。
- 恰好 `createMaterial`、`archiveMaterial`、`restoreMaterial`、`restoreMaterialRevision` 四个 operation 仍要求 Bearer，但免目标项目成员资格和项目 scope；`createMaterialRevision` 不在例外内，仍要求目标项目 `material:write`。
- `MaterialUploadRequest.status` 必填；archive、状态恢复、历史修订恢复使用独立 DTO，并按机器契约分别执行 If-Match、幂等和 ETag 约束。成功响应必须保持裁剪，错误必须保持目标项目事实零泄露。
- 默认读取和自动选择仅包含 `active`；只有具备目标项目读取资格的显式请求可读取 `archived`。历史修订恢复为 append-only，不覆盖来源修订或既有历史。

### CR-B2.2 Consumer 拓扑与状态

| Consumer | Provider 调用边界 | v3 B2 状态 | 约束 |
|----------|-------------------|------------|------|
| loeyae-aidlc Core | 唯一直接 Consumer | 已评估/待适配，运行未验证 | 后续从 Provider v3 权威源适配；当前不修改 Core 设计或实现 |
| Kiro Power | 仅经 Core，零直连 | 已评估/待适配，运行未验证 | 不协商 Provider 版本，不复制 Provider DTO |
| Claude Code Plugin | 仅经 Core，零直连 | 已评估/待适配，运行未验证 | 不协商 Provider 版本，不复制 Provider DTO |
| OpenCode Plugin | 仅经 Core，零直连 | 已评估/待适配，运行未验证 | 不协商 Provider 版本，不复制 Provider DTO |

Core 是本仓唯一直接 Consumer；不得将 Kiro、Claude Code 或 OpenCode 记为 Provider 直接消费者，也不得声称 Core 或三平台已适配。

### CR-B2.3 Consumer 未来适配约束

1. 四个公开写适配必须覆盖显式目标项目确认、`MaterialUploadRequest.status` 必填、archive、状态恢复、历史修订恢复及零泄露错误映射；Bearer 仍为必需条件，不得把授权例外扩大到读取或其他写操作。
2. `createMaterialRevision` 必须继续走目标项目授权并要求 `material:write`，不得复用四个公开写的成员资格/scope 例外。
3. archive 与状态恢复不得改写修订历史；历史修订恢复必须 append-only 创建新修订，并保持 If-Match、幂等和 ETag 语义。
4. 既有读取、检索、Context、固定 revision 引用、引用/章节血缘和项目硬隔离不得退化；默认/自动路径仅消费 `active`，授权后的显式读取才可消费 `archived`。
5. Consumer 不得把裁剪成功响应补全为推测事实，也不得借错误、重试、日志或平台呈现泄露目标项目是否存在、成员关系、scope 或资源状态。

### CR-B2.4 兼容、顺序与验证边界

- 顺序固定为 Provider-first，Portal 后适配，Core 再适配；三平台只在 Core 稳定入口上验证，不执行 Provider 版本协商。
- 若未来 v3 GA，兼容窗口结束时间取“v3 GA 后 90 个自然日”和“全部直接消费者完成 v3 验证后 30 个自然日观察期”两者较晚者。当前不存在 GA 或运行窗口，不得虚构起止日期。
- 回滚必须非破坏：先停止 v3 新写入，保留脱敏审计、权威资料、状态、修订、固定引用和血缘，隔离受影响派生并仅重建派生；Consumer 仅可切回届时已验证的旧版本组合。当前 v1/v2 仅为只读历史，不构成已验证运行回滚目标。
- 057 保持 `0/12`，运行未验证；本次不构建、不测试，不产生运行适配证据。

> 以下第 1—11 节为既有 v1/B3 Consumer 历史正文，原文保留；其中“现行”“当前”“待适配”等表述只在历史上下文内成立，不覆盖上述 v3 B2 Consumer 评估候选。

## 1. 消费拓扑

```text
Kiro ----------+
Claude Code ----+--> loeyae-aidlc Core --> SSOT ssot-api
OpenCode -------+          |                    |
                           |                    +--> project / material / revision / fragment
                           |                    +--> retrieval / ContextBundle / status
                           |                    +<-- reverse doc / citation / lineage
                           v
                  Business workspace / Git
                  state v2 / formal documents
```

三平台只适配调用、凭据、Hook 和呈现，不直接消费 SSOT Provider 契约。AI-DLC Core 不直连 `ssot-worker`、数据库、对象存储或索引实现。

## 2. 权威与消费边界

1. SSOT Provider 仓 `docs/aidlc/product/contracts.md` 是语义索引权威；字段级唯一机器事实为 SSOT 仓 `contracts/ssot-api-v1.openapi.json`。
2. 本文件只保存固定策略、消费者状态、失败行为和证据入口，不复制 Provider 字段定义。
3. AI-DLC 从当前业务项目工作区 state v2 恢复；不执行 state v3 迁移，也不读取插件源码仓的自举状态作为业务状态。
4. 正式研发文档正文和批准版本写入项目工作区，由 Git或既有文档库权威管理。
5. 未配置 SSOT 的 Legacy 项目不进入任何现行在线契约，SSOT 远程调用数必须为 0。
6. Provider 不可用或返回冲突时保留本地流程位置，不伪造远端读取、引用、血缘、上传或同步成功。

## 3. 现行契约候选

| 契约 ID | 提供方 | Provider 权威来源 | Consumer 固定策略 | 消费状态 | Consumer Owner |
|---------|--------|-------------------|------------------|----------|----------------|
| SSOT-PROJECT-001 | ssot-api | SSOT `contracts/ssot-api-v1.openapi.json` / `resolveProject` | 不猜测项目；冲突/无权时阻断 | 待适配 | AI-DLC 集成 Owner |
| SSOT-MATERIAL-001 | ssot-api | 同一 OpenAPI / Material、Discussion 操作 | 默认最新；显式旧版；固定引用不漂移 | 待适配 | AI-DLC 资料消费 Owner |
| SSOT-RETRIEVAL-001 | ssot-api | 同一 OpenAPI / `searchProjectMaterials` | 限当前项目；记录实际路径和显式降级 | 待适配 | AI-DLC 资料消费 Owner |
| SSOT-CONTEXT-001 | ssot-api | 同一 OpenAPI / ContextBundle 操作 | 固定 bundle；保持来源/讨论/结论/降级状态 | 待适配 | AI-DLC 上下文 Owner |
| SSOT-REVERSE-DOC-001 | ssot-api | 同一 OpenAPI / ReverseDocument 操作 | 上传 repository/commit/hash；不覆盖代码事实 | 待适配 | AI-DLC 逆向工程 Owner |
| SSOT-LINEAGE-001 | ssot-api | 同一 OpenAPI / Lineage 操作 | 回写固定片段引用和章节血缘；正文留在 Git | 待适配 | AI-DLC 文档生成 Owner |
| SSOT-INDEX-STATUS-001 | ssot-api | 同一 OpenAPI / IndexStatus 操作 | 只观察 Provider 状态；失败不推进本地流程 | 待适配 | AI-DLC 集成 Owner |
| SSOT-FAILURE-001 | ssot-api | 同一 OpenAPI / `SsotError` 与公共错误响应 | 稳定 code 驱动阻断/重试/降级，消息不驱动逻辑 | 待适配 | AI-DLC 集成 Owner |

所有条目已映射到 `1.0.0-candidate.1` 设计候选；Consumer 代码尚未生成或适配，状态仍为“待适配”。

## 4. 逐契约消费语义

### 4.1 SSOT-PROJECT-001

- AI-DLC 只提交用户已配置的项目候选和短时访问上下文，接受 Provider 返回的唯一项目身份与访问范围。
- 配置与 Provider 冲突、项目歧义/不存在或权限拒绝时停止资料读取并要求修复或显式选择。
- 项目身份不得按仓库名或目录名推断，Secret/令牌不得进入 state、Git、提示词正文或普通日志。

### 4.2 SSOT-MATERIAL-001

- 默认读取当前修订，只有用户显式选择时读取旧修订；AI-DLC 不复制 SSOT 权威资料库。
- MaterialSelection、ContextBundle 和 FragmentCitation 必须固定资料、修订和片段。
- 源资料更新后，既有正式文档引用仍指向生成时使用的旧修订/片段。

### 4.3 SSOT-RETRIEVAL-001

- AI-DLC 按角色、目标文档和提示词请求当前项目内元数据/全文、向量 RAG 和单项目 GraphRAG。
- 显式包含、排除、指定旧版、低置信和来源冲突必须保持可见；排除资料不得重新进入选择结果。
- Consumer 展示 Provider 返回的实际检索路径、索引状态和降级原因，不把 GraphRAG 推断或索引失败解释为事实。

### 4.4 SSOT-CONTEXT-001

- AI-DLC 消费 Provider 固定的 ContextBundle，不重写其中资料身份、修订、片段、讨论/结论或降级状态。
- ContextBundle 只用于当前目标文档，并受预算和数据最小化约束。
- 低置信、冲突、范围过大或预算不足时请求用户确认，不静默扩展资料范围。

### 4.5 SSOT-REVERSE-DOC-001

- 逆向说明上传至少关联仓库路径、Git commit 和内容哈希；AI-DLC 在上传前以当前 Git 事实形成关联。
- Provider 返回的说明修订引用必须被保存为可追踪结果；重试不得产生逻辑重复修订。
- 逆向说明不能修改或替代源代码/Git事实，commit/hash 错配时不得标记上传闭环完成。

### 4.6 SSOT-LINEAGE-001

- 每个有资料支撑的生成章节都应形成 FragmentCitation、DocumentSection 和 LineageRecord。
- AI-DLC 只回写引用、章节定位、摘要、状态和血缘，不把正式文档正文转移到 SSOT。
- 重试不得产生逻辑重复血缘；固定片段解析失败时必须保留未完成状态并提示恢复动作。

### 4.7 SSOT-INDEX-STATUS-001

- AI-DLC 观察解析、全文、向量和单项目图索引的独立状态及恢复动作，不直接读取 Worker 或存储实现。
- 部分索引不可用时只使用 Provider 明确返回的可用路径；项目/权限失败不允许降级。
- Provider 或索引失败不得推进 state v2 当前步骤，也不得生成虚假引用或“已同步”标记。

### 4.8 SSOT-FAILURE-001

- Consumer 至少需要区分项目冲突/不存在、权限拒绝、资料/修订不存在、版本冲突、解析失败、索引不可用、请求不合法、限流和 Provider 不可用。
- 稳定错误类别决定阻断、重试或降级；展示消息只用于用户反馈。
- 具体错误码、重试预算、超时、传输状态和恢复映射留待 I12/I13 冻结并验证。

## 5. Consumer 状态矩阵

| 契约 ID | 直接 Consumer | 影响 | 状态 | 适配动作 | 验证证据 |
|---------|---------------|------|------|----------|----------|
| SSOT-PROJECT-001 | loeyae-aidlc Core | Provider-first 项目解析和权限阻断 | 待适配 | I12 后生成/验证类型并接入 state v2 流程 | I13 项目冲突、越权和隔离用例 |
| SSOT-MATERIAL-001 | loeyae-aidlc Core | 最新/旧版选择与固定片段 | 待适配 | 接入 MaterialSelection 与引用解析 | I13 版本链和引用不漂移用例 |
| SSOT-RETRIEVAL-001 | loeyae-aidlc Core | 自动检索、包含/排除、低置信、降级 | 待适配 | 接入角色/目标/提示词选择语义 | I13 检索评测和降级用例 |
| SSOT-CONTEXT-001 | loeyae-aidlc Core | ContextBundle、预算和来源状态 | 待适配 | 固定 bundle 并传递到文档生成 | I13 上下文最小化和冲突用例 |
| SSOT-REVERSE-DOC-001 | loeyae-aidlc Core | 逆向说明上传及 Git 关联 | 待适配 | 接入 repository/commit/hash 和幂等重试 | I13 Git 关联与重试用例 |
| SSOT-LINEAGE-001 | loeyae-aidlc Core | 引用与章节血缘回写 | 待适配 | 从生成章节形成并回写稳定关系 | I13 引用完整性和重复写入用例 |
| SSOT-INDEX-STATUS-001 | loeyae-aidlc Core | 解析/索引状态和本地恢复 | 待适配 | 映射状态且失败不推进流程 | I13 部分失败与恢复用例 |
| SSOT-FAILURE-001 | loeyae-aidlc Core | 阻断、重试、降级和用户反馈 | 待适配 | I12 后建立稳定错误映射 | I13 错误映射负向用例 |

### 5.1 间接平台适配状态

| 平台 Consumer | Provider 调用边界 | 业务语义责任 | 当前状态 | 验证证据 |
|---------------|-------------------|--------------|----------|----------|
| Kiro Power | 仅调用 loeyae-aidlc Core | 不复制项目解析、资料选择、降级或血缘规则 | 待适配 | I13 三平台 conformance |
| Claude Code Plugin | 仅调用 loeyae-aidlc Core | 不复制项目解析、资料选择、降级或血缘规则 | 待适配 | I13 三平台 conformance |
| OpenCode Plugin | 仅调用 loeyae-aidlc Core | 不复制项目解析、资料选择、降级或血缘规则 | 待适配 | I13 三平台 conformance |

平台名称不得写入业务项目事实、资料身份、契约字段或流程门禁。三平台对相同 state v2、角色、目标和 Provider 响应必须产生一致业务语义。

## 6. Legacy、失败与恢复

1. 未配置 SSOT 时，AI-DLC 使用现有本地流程，不解析远端项目，不调用任何现行在线契约，不增加远端门禁。
2. Provider 不可用、权限拒绝、资料/修订缺失、解析/索引失败或冲突时，保留 state v2 当前步骤并展示影响与恢复动作。
3. 当前 B3 不建立 Manifest、事件游标、离线事实快照、远端 CR、impact.analyze 或 Portal 审批交接。
4. 不得用本地缓存伪造远端资料、引用、血缘、上传或权限验证成功。
5. 恢复后从同一 state v2 步骤重试；写入幂等和并发细节由 I12 冻结。

## 7. I12 冻结与验证边界

| 主题 | B3 Consumer 约束 | I12/I13 待完成 | 当前状态 |
|------|-------------------|----------------|----------|
| 机器 Schema | 只消费 Provider 权威源，不手写第二套字段 | OpenAPI 3.1 JSON 路径、版本和静态检查证据已建立；后续从该源生成/校验类型 | 设计建立，待适配 |
| 鉴权/隔离 | 项目硬隔离，Secret 不持久化 | HTTP Bearer、scope、路径 projectId 与解析结果校验；越权用例留待 I13 | 已设计，未验证 |
| 错误/降级 | 稳定类别驱动，失败不伪造成功 | `SsotError` code/retryable/impact；仅 retryable/429/503 最多 3 次 | 已设计，未验证 |
| 幂等/并发 | 写入重试不得产生逻辑重复 | Idempotency-Key 至少 24h；同键异体 409；条件写入使用 If-Match | 已设计，未验证 |
| 版本并存 | Provider-first，Consumer 不超前 | 固定 `1.0.0-candidate.1`；新主版本兼容窗口至少 90 日且等待直接 Consumer 验证 | 已设计，未验证 |
| 三平台 | 薄适配，共享 Core 语义 | conformance 夹具、命令和报告 | 未验证 |
| Legacy | 未配置项目远程调用数为 0 | Legacy 回归与网络调用证据 | 未验证 |

机器来源和静态设计已建立；在 Consumer 代码与执行证据建立前，Consumer 状态不得标记为“已适配”或“已验证”。

## 8. 发布、兼容与回滚

1. 当前没有可消费的已实现 SSOT Provider 版本，B3 不修改代码、不执行运行时迁移或发布。
2. I12 已由 Provider 建立机器契约设计候选与兼容窗口；AI-DLC 后续只能从该 OpenAPI 生成/校验类型并执行消费者契约测试。
3. Kiro、Claude Code、OpenCode 只在 Core 适配通过后执行平台 conformance，不得各自提前复制 Provider 字段或业务规则。
4. 只有 Provider 与全部直接 Consumer 有版本组合证据，且三平台观察窗口完成后，旧版本才可弃用。
5. 双仓 `contracts.md` 是 B3 成对回滚单位；任一仓失败则回到已批准 B2 指针，Consumer 不得保留超前契约。
6. 发现未知 Consumer、破坏性字段、state 迁移、无法回滚的缓存或缺失 Owner 时，停止 CR4 并提交计划增量审批。

## 9. 历史契约处置

| 历史契约/语义 | 处置 | Consumer 当前行为 |
|---------------|------|-------------------|
| SSOT-MCP-001 聚合式 Federated 工具契约 | 历史候选 | 由八项最小语义契约替代，不保留旧聚合调用假设 |
| SSOT-MANIFEST-001 / ManifestSnapshot | 历史候选 | state 保持 v2，不加载或校验 Manifest |
| SSOT-EVENT-001 / project_cursor / PendingSync | 历史候选 | 不建立事件同步主链 |
| 远端 CR / impact.analyze / Portal 审批交接 | 历史候选 | 不进入资料到正式文档首期闭环 |
| SSOT-TRACE-001 / checkpoint / 完整 Trace/Evidence | 历史候选或后置 | 首期只要求具体片段引用和章节血缘 |
| SSOT-ERROR-001 旧 Federated 错误集合 | 历史候选 | 按 SSOT-FAILURE-001 重新建立 Consumer 映射 |
| AidlcStateV3 与 v2→v3 迁移 | 失效 | 业务项目继续使用 state v2 |

历史审批、I6-FIX-001—007 和旧变更日志保留，不作为现行适配或验证证据。

## 10. 验证状态

| 验证项 | 结果 | 证据/阻断 |
|--------|------|-----------|
| Provider/Consumer 契约 ID、Owner 与边界 | 文档评估通过 | 双仓 B3 `contracts.md` |
| Provider 机器 Schema | 设计建立，静态检查通过 | SSOT `contracts/ssot-api-v1.openapi.json`；`1.0.0-candidate.1` |
| Consumer 代码适配 | 未验证 | I12 不授权代码实施；状态保持待适配 |
| 契约与集成测试 | 未验证 | 当前 package.json 无 test script，Provider 也未实现 |
| Legacy 零远程调用 | 未验证 | 待 I13/C8 |
| 三平台 conformance | 未验证 | 待 I13/C8 |
| 真实项目 E2E | 未验证 | 待稳定运行 ID 和报告 |
| 版本组合与回滚 | 未验证 | 待 I12 机器契约和实现版本 |

## 11. 变更日志

| 时间 | 契约 ID | 变更摘要 | 兼容性 | 影响消费者 | 状态 | CR/证据 |
|------|---------|----------|--------|------------|------|---------|
| 2026-07-17T05:44:43Z | 全部 | 建立消费者索引并确认 SSOT 仓为唯一机器契约权威源 | 未验证 | AI-DLC Core 与三平台 | 历史记录 | 首次 Inception |
| 2026-07-17T09:40:34Z | SSOT-MCP-001 / SSOT-MANIFEST-001 / SSOT-EVENT-001 / SSOT-ERROR-001 | I6 闭合权威影响分析消费、Manifest 投影、基线四态、项目分区和失效游标恢复语义 | 文档级兼容补充 | AI-DLC Core | 历史记录 | `federated-integration/inception/requirements/cross-validation-report.md` |
| 2026-07-18T05:45:03Z | SSOT-PROJECT-001 / SSOT-MATERIAL-001 / SSOT-RETRIEVAL-001 / SSOT-CONTEXT-001 / SSOT-REVERSE-DOC-001 / SSOT-LINEAGE-001 / SSOT-INDEX-STATUS-001 / SSOT-FAILURE-001 | 按 042=A 消费 Provider-first 最小在线文档契约，移除旧 Federated/state v3 强制依赖 | 新契约，兼容性未知 | AI-DLC Core 与三平台薄适配 | B3 候选，运行未验证 | `CR-I5-SCOPE-001` / SSOT 权威 `CR4-B2-I5-I6-APPROVAL-042=A` |
| 2026-07-19T13:38:21Z | 全部八项 | 按 SSOT 权威 `054=A` 映射 OpenAPI 3.1 单一机器事实、系统基线和 Core 应用设计；不复制 Schema | 设计候选；运行兼容性未验证 | AI-DLC Core；三平台间接 | I12 待严格审批 | SSOT OpenAPI / 本仓 I12 应用设计 |
| 2026-07-26 | SSOT-FAILURE-001（复用）+ 新增 `issueAccessToken` | 按 SSOT 权威 `093=A`/`094=A` 同步：令牌签发方由外部 OIDC 改为 Provider 自签，Provider 契约前推至 `3.1.0-candidate.1` 并新增 `POST /v3/auth/tokens`；既有 19 个 operationId 与 `bearerAuth` 结构不变 | 结构兼容新增；消费者条件兼容 | AI-DLC Core `U-C01`/`U-C02` 待适配；三平台仍只经 Core | 索引已同步；令牌获取调用方归属未闭合，Consumer UC-D 未派生，运行未验证 | SSOT `093=A`、`094=A` / 本文件 CR4 B4 章节 |
