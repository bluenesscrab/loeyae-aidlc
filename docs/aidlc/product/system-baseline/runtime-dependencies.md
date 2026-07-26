# 系统基线：运行时依赖（AI-DLC Consumer）

- **分析时间**：2026-07-26（`CR-U-P01-IDENTITY-001 / CR4 B4` Consumer 同步；前一轮为 2026-07-24 的 `CR-U-P01-CROSS-PROJECT-IMPORT-001 / CR4 B2` 静态评估）
- **Provider 契约来源**：SSOT Provider 仓 `contracts/ssot-api-v3.openapi.json` / `3.1.0-candidate.1`；19 paths、20 个唯一 operationId、64 个 schemas
- **本次变更**：Provider 令牌签发方由外部 OIDC 改为 `ssot-api` 自签（`093=A`、`094=A`），新增 `issueAccessToken`（`POST /v3/auth/tokens`）；`bearerAuth` 结构未变，属结构兼容新增、消费者条件兼容。仅更新依赖索引与待适配标记，不修改 Core 实现、三平台、需求、故事、state 或配置值
- **历史契约**：Provider v1/v2 只读保留，不作为当前前向契约或已验证运行回滚目标
- **Consumer 状态**：已评估/待适配，运行未验证；本次仅更新依赖索引，不修改 Core、三平台、应用设计、I12、I13/I14、需求、故事、state、配置或实现
- **证据边界**：当前无 GA、Provider/Consumer 实现、生成客户端、数据库、身份提供方、运行数据或运行窗口；057 保持 `0/12`，运行未验证

## 关系清单

| source | target | type | contract_ref | criticality | failure_behavior | owners | 状态 |
|--------|--------|------|--------------|-------------|------------------|--------|------|
| `loeyae-aidlc-core` | `ssot-api` | `sync-api` | Provider OpenAPI v3 八项契约；字段权威仅为 `ssot-api-v3.openapi.json` | 关键 | 四个公开写保持 Bearer、目标项目确认与零泄露错误；读取隔离和固定引用不退化 | Core / SSOT API Owner | 已评估/待适配，运行未验证 |
| Kiro Power | `loeyae-aidlc-core` | `other` | Core 稳定入口 | 重要 | 仅呈现 Core 结果；零直连、不协商 Provider 版本、不复制 Provider DTO | Kiro / Core Owner | 已评估/待适配，运行未验证 |
| Claude Code Plugin | `loeyae-aidlc-core` | `other` | Core 稳定入口 | 重要 | 仅呈现 Core 结果；零直连、不协商 Provider 版本、不复制 Provider DTO | Claude / Core Owner | 已评估/待适配，运行未验证 |
| OpenCode Plugin | `loeyae-aidlc-core` | `other` | Core 稳定入口 | 重要 | 仅呈现 Core 结果；零直连、不协商 Provider 版本、不复制 Provider DTO | OpenCode / Core Owner | 已评估/待适配，运行未验证 |
| `loeyae-aidlc-core` | 业务工作区/Git | `file-transfer` | state v2 与正式文档既有边界 | 关键 | 远端失败不删除已提交正文，不伪造资料、引用、血缘或同步成功 | Core / 项目 Owner | 既有边界；v3 运行未验证 |

Core 是本仓唯一 Provider 直接 Consumer。Kiro、Claude Code、OpenCode 只经 Core 间接消费，不得直连 Provider 或独立协商 Provider 版本。

## Consumer 反向索引

| Provider v3 变更目标 | 直接 Consumer | 间接 Consumer | Core 未来适配 | 不得退化的验证边界 | 当前状态 |
|----------------------|---------------|-----------------|-----------------|----------------------|----------|
| `MaterialUploadRequest.status` 必填 | Core | 三平台 | 显式提供并校验 status，不推测默认写入状态 | 既有项目绑定、错误阻断和本地流程位置 | 已评估/待适配，运行未验证 |
| `createMaterial`、`archiveMaterial`、`restoreMaterial`、`restoreMaterialRevision` 四个公开写 | Core | 三平台 | 目标项目确认、Bearer、独立 DTO、幂等/If-Match/ETag 和零泄露错误映射 | 例外不得扩大到读取或其他写；成功响应不得推测补全 | 已评估/待适配，运行未验证 |
| `createMaterialRevision` | Core | 三平台 | 继续执行目标项目授权和 `material:write` | 不得套用四个公开写的成员资格/scope 例外 | 已评估/待适配，运行未验证 |
| archive 与状态恢复 | Core | 三平台 | 使用独立 DTO；只改变聚合状态 | 不改写历史；默认/自动仅 `active` | 已评估/待适配，运行未验证 |
| 历史修订恢复 | Core | 三平台 | append-only 创建新修订并条件推进当前指针 | 来源修订、固定旧 revision 和既有血缘不漂移 | 已评估/待适配，运行未验证 |
| 读取、检索与 Context | Core | 三平台 | 授权显式读取 `archived`；默认/自动仅 `active` | 项目硬隔离、固定引用、检索、Context 和血缘不得退化 | 已评估/待适配，运行未验证 |
| 裁剪成功响应与零泄露错误 | Core | 三平台 | 按稳定错误映射阻断/重试/呈现 | 不泄露目标项目存在性、成员资格、scope 或资源状态 | 已评估/待适配，运行未验证 |
| 令牌签发方改为 Provider 自签，新增 `issueAccessToken` | Core（U-C01、U-C02） | 三平台 | 放弃外部 IdP 假设；改为经 `POST /v3/auth/tokens` 换取分钟级无状态令牌；无刷新令牌，到期重新获取；`401`/`429`/`503` 按稳定错误阻断且 `503` 不得降级为匿名或本地伪造令牌 | 三平台零直连 Provider 不得被打破；原始凭据不得进入 state、Git、提示词正文或普通日志；`401` 不得用于推断主体是否存在 | **待适配，且调用方归属未闭合**（见下） |
| 目录不可用期间已签发令牌继续可用 | Core | 三平台 | 令牌获取失败不使持有有效令牌的进行中流程整体失败 | 不得据此声称支持即时吊销或即时权限回收 | 待适配，运行未验证 |

## Provider → Core 版本矩阵

| Provider | Core | 三平台 | CR4 B2 结论 | 顺序/约束 |
|----------|------|--------|-------------|-----------|
| v3 `3.1.0-candidate.1` | v3 Consumer 候选，令牌获取路径待适配 | 仅经 Core | 条件兼容：既有 19 个 operation 调用结构不变，令牌获取路径必须改写 | Provider-first；Portal 后适配；Core 再适配；令牌获取调用方归属闭合前不修改 Core 设计或实现 |
| v3 `3.0.0-candidate.1` | 前一轮 v3 Consumer 候选 | 仅经 Core | 已被 `3.1.0-candidate.1` 取代，只读历史 | 不作为当前前向组合；其内容由 Provider 仓 Git 与 CR4 B0 哈希基准保留 |
| v2 `2.0.0-candidate.1` | 历史 Consumer 设计 | 仅经历史 Core 边界 | 只读历史，运行未验证 | 不作为当前前向组合或已验证回滚目标 |
| v1 `1.0.0-candidate.2` | 更早历史 Consumer 设计 | 仅经历史 Core 边界 | 只读历史，运行未验证 | 不作为当前前向组合或已验证回滚目标 |

Portal 是 Provider 仓侧直接 Consumer，不属于本仓三平台调用链；迁移顺序仍固定为 Provider-first、Portal 后、Core 再后。三平台无需也不得执行 Provider 版本切换。

## 关键链路

0. 令牌获取（**新增，调用方未确定**）：`目录凭据 → issueAccessToken（POST /v3/auth/tokens）→ 短时无状态令牌 → 后续业务请求以 Bearer 携带`。该链路当前无法确定起点组件：「三平台零直连 Provider」与「原始凭据只由平台凭据适配器保存、Core 只接收短时值」两条既有约束同时成立时，无一方可在不违反其一的前提下提交目录凭据。归属由 `CR4-U-P01-IDENTITY-CONSUMER-TOKEN-Q001` 决定，闭合前本链路为未设计，Consumer 侧 UC-D 未派生。
1. 在线读取：`平台 → Core → ssot-api v3 → Core → 业务工作区/Git`；项目硬隔离、固定 revision、检索、Context 和血缘语义保持。业务请求路径不访问目录。
2. 公开写：`平台 → Core → 目标项目显式确认 → ssot-api v3`；恰好四个 operation 免目标项目成员资格/scope，但仍强制 Bearer、治理和零泄露错误。
3. 一般修订创建：`平台 → Core → 目标项目授权/material:write → createMaterialRevision`；不进入公开写例外。
4. 状态恢复：`archive/restore → 聚合状态条件提交`；不改变修订历史。
5. 修订恢复：`restoreMaterialRevision → append-only 新修订 → 条件推进当前指针`；固定旧 revision 和血缘继续可追踪。
6. Legacy：`平台 → Core → 业务工作区/Git`；未配置 SSOT 时不得出现 Provider 调用。

## 发布顺序、兼容窗口与停止条件

- Provider 先形成并验证 v3，Portal 后适配，Core 再适配；Core 稳定后才验证三平台间接行为。本次不修改 Core 设计或实现。
- 若未来 v3 GA，兼容窗口结束时间取“v3 GA 后 90 个自然日”和“全部直接消费者完成 v3 验证后 30 个自然日观察期”两者较晚者；“全部直接消费者”按届时反向索引确认。当前没有 GA 或运行窗口，不虚构开始或结束日期。
- 当前无 Provider/Consumer 实现、生成客户端、数据库和运行数据；身份设施已确定为 OpenLDAP 且令牌由 Provider 自签，但实际目录、密钥与运行行为均未验证。任何兼容性、调用、鉴权、数据迁移或回滚运行结论均保持未验证。
- 令牌获取调用方归属未闭合属停止条件级阻断：闭合前不得实现令牌获取、不得新增 Core 方法、不得让三平台直连 Provider、不得让 Core 持久化原始凭据。
- 发现未知直接 Consumer、平台直连、生成客户端、实现、运行数据、共享数据库写入或身份边界差异时，停止适配并返回相应审批补充影响、迁移与回滚计划。
- 057 保持 `0/12`，运行未验证；本次不构建、不测试，不形成适配完成证据。

## 非破坏性回滚

1. 先停止 v3 跨项目创建、归档、状态恢复和历史修订恢复的新写入，保留读取能力和 v1/v2 只读历史文件。
2. 保留脱敏审计与关联标识，识别受影响目标项目、资料、修订和 operation；不得通过错误或日志扩大事实暴露。
3. 隔离受影响资料和派生处理，保留权威资料、状态、不可变修订、固定引用、对象内容与血缘，不硬删除或覆盖历史。
4. 派生失败只重建派生，不回滚权威资料、聚合状态或当前指针；历史修订恢复产生的新修订同样保持 append-only。
5. Portal/Core 只能切回届时已验证的旧版本组合，Provider 最后停止 v3。当前 v1/v2 仅为只读历史且不存在已验证运行组合，因此实际回滚切换仍须另行批准和验证。
