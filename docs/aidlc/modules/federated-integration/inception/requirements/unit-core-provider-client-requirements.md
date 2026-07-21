# U-C01-CORE-PROVIDER-CLIENT core-provider-client 需求切片

- **unit_id / service_id**：`U-C01-CORE-PROVIDER-CLIENT` / `loeyae-aidlc`
- **source_ref**：[`requirements.full.md`](requirements.full.md)
- **主归属 FR**：`ADLC-FR-003`、`ADLC-FR-010`、`ADLC-FR-011`
- **状态**：设计/静态生成；实现与运行 blocked/未验证

## ADLC-FR-003 Provider-first 项目解析（主归属，Must）

已配置 SSOT 的项目必须经 Provider API/MCP 解析唯一项目身份与访问上下文。Consumer 只提交用户已配置的项目候选和短时访问上下文，不按仓库名或目录名猜测项目，不直连 Worker、数据库或缓存绕过 Provider。配置与 Provider 返回结果冲突、项目歧义/不存在或权限拒绝时，必须停止资料读取，保持当前 state v2 步骤，并要求修复或显式选择。

```gherkin
Given 本地配置与 Provider 返回的项目身份冲突
When AI-DLC 解析项目
Then 流程停止资料读取并要求修复或显式选择，不静默使用本地猜测
```

## ADLC-FR-010 Legacy 零远程调用（主归属，Must）

endpoint 与 project candidate 均未配置的现有业务项目必须保持原有本地 AI-DLC 行为：不建立 ProviderProjectBinding、不实例化或调用 Gateway、不探测 Provider，八项在线契约调用总数为 0，也不要求任何远端字段参与门禁。部分配置必须报 ConfigError；Online 模式下的超时、503、权限或契约失败不得静默回退 Legacy。

```gherkin
Given 业务项目未配置 SSOT
When 使用升级后的 AI-DLC 恢复并执行既有流程
Then SSOT 远程调用数为 0，state v2 和本地流程行为不因本模块受阻
```

## ADLC-FR-011 Provider/索引失败与本地恢复（主归属，Must）

Provider 不可用、权限拒绝、项目/固定修订解析失败、索引失败或响应冲突时，Consumer 必须保留本地流程位置，显示稳定原因、影响范围和恢复动作；不得伪造远端读取、引用、上传、血缘或同步成功。仅 retryable 的 429/503 可最多重试 3 次并按 1/2/4 秒退避；索引部分不可用只有在 Provider 明确返回可定位降级结果时才能继续，并保留实际路径和失败状态。

```gherkin
Given Provider 在上下文构建时不可用
When AI-DLC 处理失败
Then state v2 的当前步骤保持不变，输出明确未取得远端资料，不生成虚假引用或“已同步”状态
```

## 相关 NFR 与约束

- `ADLC-NFR-002`：Legacy 黄金场景通过率 100%，远程调用数 0。
- `ADLC-NFR-003`：Secret/令牌不持久化，越权全部拒绝。
- `ADLC-NFR-005`：失败不推进 state v2，恢复不重复逻辑血缘。
- `ADLC-NFR-007`：发布物不携带本仓自举文档。
- `ADLC-NFR-008`：超时/重试和版本组合必须有实际证据；当前未验证。
- Provider OpenAPI `1.0.0-candidate.1` 是字段级唯一事实；Consumer 不手写第二套 DTO Schema。
