# 系统基线：配置清单（AI-DLC Consumer）

- **分析时间**：2026-07-19T13:38:21Z
- **范围**：I12 逻辑配置 ID；本次不修改配置文件、Hook、MCP 或发布包
- **安全规则**：仅记录键与引用，不读取或保存 Secret 值

| config_id | 权威来源 | 作用域 | 消费者 | 类别 | 缺失/非法行为 | 生效方式 | Owner | 状态 |
|-----------|----------|--------|--------|------|---------------|----------|-------|------|
| `aidlc.ssot.endpoint` | 业务项目非敏感配置 | 业务项目 | Core | 普通 | 与 project candidate 同时缺失时进入 Legacy且零调用；部分配置时阻断并报告配置错误 | 新流程请求时读取；动态刷新未批准 | 项目 Owner | 待实现 |
| `aidlc.ssot.project_candidate` | 业务项目非敏感配置 | 业务项目 | Core | 普通 | 不得按仓库名猜测；在线模式阻断或保持未配置 Legacy | 新流程请求时 | 项目 Owner | 待实现 |
| `aidlc.ssot.contract_version` | 产品默认 + 项目可见固定值 | 产品/业务项目 | Core | 普通 | 固定 `1.0.0-candidate.1`；缺失或不支持时阻断在线调用 | 启动/请求时 | Core Owner | 设计候选 |
| `aidlc.ssot.auth_token_ref` | 平台 Secret 存储引用 | 用户/会话 | 三平台凭据适配、Core 只接收短时值 | 敏感引用 | 已配置在线模式下阻断；不得回退 Legacy | 每次调用注入 | 平台/身份 Owner | 具体提供方未确认 |
| `aidlc.ssot.timeout_seconds` | 产品非敏感配置 | 产品/业务项目 | Core | 动态规则 | 缺失使用 10 秒；非法值阻断配置；I13 需校准 | 启动/请求时 | Core Owner | 设计候选，未验证 |
| `aidlc.ssot.max_attempts` | 产品非敏感配置 | 产品 | Core | 动态规则 | 缺失使用 3，配置不得超过 3；仅 retryable 失败适用 | 启动时 | Core Owner | 设计候选 |

## 生效与回滚组合

| 配置状态 | Core 模式 | Provider 调用 | 结论 |
|----------|-----------|---------------|------|
| endpoint 与 project candidate 均缺失 | Legacy | 0 | 允许；需 I13/C8 证明零调用 |
| endpoint/project candidate 仅一项存在 | 配置错误 | 0 | 阻断并要求修复，不猜测 |
| 两项存在且版本/凭据有效 | Online | 按业务步骤调用 | 设计允许，运行未验证 |
| Online 运行中 Provider 失败 | Online 失败待恢复 | 有失败调用，随后按有限重试 | 不切换 Legacy，不推进依赖远端事实的 state |
| 回滚到不支持候选版本的 Core | 阻断 | 0 | 先恢复已验证 Provider/Consumer 组合，禁止单侧回滚 |
