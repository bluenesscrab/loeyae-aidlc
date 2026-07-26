# Consumer 共享接口与契约边界

- **设计源**：[components.md](components.md)、[component-methods.md](component-methods.md)、[application-services.md](application-services.md)、[component-dependency.md](component-dependency.md)
- **Provider 字段权威**：SSOT `contracts/ssot-api-v3.openapi.json`，版本 `3.0.0-candidate.1`
- **状态**：`CR-U-P01-CROSS-PROJECT-IMPORT-001 / CR4 B3` Consumer I12 候选；Provider/Portal 已稳定，Core 适配与运行未验证

## Provider v3 消费契约

| 契约 | Gateway operationId | Core v3 消费语义 | 失败边界 |
|------|---------------------|------------------|----------|
| PROJECT | `resolveProject` | 解析工作区项目，并对每个目标项目取得独立授权 | 歧义、不存在、未授权、隔离冲突 Block |
| MATERIAL | `getMaterialRevision` | 读取已授权目标项目的默认或显式固定 revision | 固定 revision 缺失不得替换为最新；已有读取授权时旧 revision 不因 archive/restore 漂移 |
| RETRIEVAL | `searchProjectMaterials` | 按授权目标项目隔离检索；默认自动检索只接受 active | archived 自动命中 0；不得混合未授权项目结果 |
| CONTEXT | `createContextBundle` | 对授权目标项目构建固定 project/revision/fragment bundle；默认 Context 只接受 active | 未授权、跨项目串用、漂移、排除命中 Block |
| REVERSE-DOC | `createReverseDocumentRevision` | 向已授权目标项目执行既有逆向说明写入 | 错配/越权 Rejected；不等同资料 revision 创建 |
| LINEAGE | `publishLineageRecords`、`queryLineageRecords` | 发布/查询固定 project/revision/fragment 血缘；正文留在 Git | partial/失败保持 Pending；不得漂移到恢复后新 revision |
| INDEX-STATUS | `getRevisionIndexStatus` | 在已授权目标项目观察解析/全文/向量/图索引状态 | 权限/项目失败不可降级；显式固定旧 revision 仍按原 revision 查询 |
| FAILURE | 全部 operation 的 `SsotError` | 稳定 code/retryable/impact 驱动 Block/Retry/Confirm/Degrade | message 只展示，不驱动逻辑，不无限重试 |

读取、列表、检索、Context、血缘、逆向、解析/索引均要求目标项目授权。授权按目标 projectId 隔离，调用方项目授权不能推导、继承或合并为其他项目授权。所有 Provider DTO 必须从 v3 OpenAPI 生成或自动校验；在线调用固定 header `X-SSOT-Contract-Version: 3.0.0-candidate.1` 并传播 correlationId；既有血缘和逆向写使用稳定 idempotency key，条件写按契约使用 If-Match。

## B1 权威边界

- Provider/Portal 的 `createMaterial`、`archiveMaterial`、`restoreMaterialStatus`、`restoreMaterialRevision` 四个写入例外仅为直接能力，Core 当前不暴露。
- `createMaterialRevision` 不开放。
- U-C01/U-C02 不新增、不实现、不暴露上述能力或其他跨项目生命周期写入口。
- Consumer 只适配 v3 的现有读取、Context、血缘、逆向写、DTO、稳定错误、版本头和项目隔离语义。
- 历史内容恢复产生的新 revision 只影响后续默认读取；已有固定 revision、citation、lineage 和恢复动作保持原引用。

## Core 与三平台端口

| 端口 | 输入 | 输出 | 可变差异 | 不可变语义 |
|------|------|------|----------|------------|
| `KiroAdapter` → Core | workspace、平台无关命令、用户输入、短时凭据引用 | Core 结果、确认请求、恢复动作、呈现模型 | Kiro 交互 | RoleIntent、目标项目授权、选择、bundle、引用、稳定错误、state v2 |
| `ClaudeAdapter` → Core | 同一标准输入 | 同一标准输出 | Plugin 交互 | 同上；不得复制业务规则 |
| `OpenCodeAdapter` → Core | 同一标准输入 | 同一标准输出 | Plugin 交互 | 同上；不得复制业务规则 |

三平台仅经 Core，零直连 Provider；不协商 v3、不依赖 Provider DTO、不维护第二份业务 state。

## Online / Legacy / ConfigError

| 配置 | 模式 | Gateway 行为 | 恢复行为 |
|------|------|--------------|----------|
| endpoint、project candidate 均存在 | Online | 绑定工作区项目并逐目标项目授权后调用 Provider v3 | 远端失败保持 Online 和当前 state v2，不回退 Legacy |
| 两者均缺失 | Legacy | Gateway 不实例化或不接收调用，所有 v3 在线调用总数为 0 | 继续既有本地流程与恢复语义 |
| 仅一项存在 | ConfigError | 不调用 Provider | 阻断并要求修复配置 |

endpoint、project candidate 是非敏感绑定配置；短时 Bearer/委托令牌由平台受控运行时注入。Git、state v2、提示词、日志和生成文档不得保存 Secret。三平台分发物不得包含本仓自举 `docs/aidlc/`。

## 版本与兼容边界

1. 统一前向契约为 Provider `contracts/ssot-api-v3.openapi.json` / `3.0.0-candidate.1`，唯一顺序为 Provider v3 → Portal v3 → Core v3。
2. Provider/Portal 已稳定不等于 Core 已适配或验证；Consumer 不单独前滚。
3. U-C03—U-C05 只依赖 Core 平台无关端口，不协商 v3、不依赖 Provider DTO、不直连 Provider。
4. Legacy 保持零调用；state 保持 v2，不迁移 state v3。

| 上游 | Consumer | B3 候选状态 | 顺序 |
|------|----------|---------------|------|
| Provider `3.0.0-candidate.1` | Portal v3 | 已稳定（本候选不修改） | Provider v3 → Portal v3 |
| Provider/Portal v3 | Core/U-C01 v3 | Consumer I12 候选，未实现/未运行验证 | Portal 稳定后适配 Core |
| Core 平台无关端口 | Kiro / Claude Code / OpenCode | 间接边界不变 | 三平台只经 Core |

## 失败、重试与恢复

`RecoveryCoordinator.decide(error, operation)` 返回 `Block / Retry / Confirm / Degrade`：

| 条件 | 决策 |
|------|------|
| 项目歧义/不存在、目标项目未授权、隔离冲突、固定 revision/fragment 缺失、版本冲突 | Block；不使用缓存、其他项目或最新 revision 替代 |
| 低置信、来源冲突、范围过大、预算不足 | Confirm |
| 非权限类部分索引不可用且 Provider 返回可定位结果 | Degrade；保留实际路径、失败状态与影响 |
| `retryable` 的 429/503 | Retry；最多 3 次，退避 1/2/4 秒 |
| 血缘 partial、传输超时结果未知 | Pending；按固定目标项目/revision query/reconcile |

`WorkspaceStateRepository` 只读写当前业务工作区 state v2，保存流程位置、generationId、idempotency key、correlationId、目标 projectId、固定引用和非敏感恢复动作。平台切换复用同一 state；Provider/索引失败不得推进步骤。显式固定旧 revision 在读取授权仍有效时继续可读和可对账；资料恢复的新 revision 不修改既有恢复动作。

## 引用、正文与血缘

1. 正文先写业务工作区/Git并取得 content hash/Git ref；本地失败不得准备远端血缘。
2. 每个 citation 固定 projectId、revisionId、fragmentId、locator、quoteHash；不得伪造或漂移。
3. Pending 血缘在远端调用前保存；publish/reconcile 只发送引用、章节定位/摘要和状态，不发送正文权威。
4. 血缘失败不删除正文、不标记闭环完成；archive 或 restore 不改变历史引用，恢复的新 revision 仅参与后续默认读取。

## 运行状态

上述均为 Consumer I12 设计候选。本文不宣称 Core 实现、Legacy 零调用、三平台一致性、版本组合、故障恢复或端到端已运行验证。
