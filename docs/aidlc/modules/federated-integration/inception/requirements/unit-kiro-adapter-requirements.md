# U-C03-KIRO-ADAPTER kiro-adapter 需求切片

- **unit_id / service_id**：`U-C03-KIRO-ADAPTER` / `kiro-power`
- **source_ref**：[`requirements.full.md`](requirements.full.md)
- **主归属 FR**：`ADLC-FR-009`
- **状态**：设计/静态生成；适配与运行 blocked/未验证

## ADLC-FR-009 三平台共享语义与薄适配（主归属，Must）

Kiro、Claude Code、OpenCode 必须共享 Core 的 RoleIntent、TargetDocument、MaterialSelection、ContextBundle、固定引用、血缘、错误恢复与 state v2 语义。U-C03-KIRO-ADAPTER 作为故事/需求主适配单元，只把 Kiro Power 输入、短时凭据、工具调用、审批呈现和会话接力映射到共享 Core 端口；平台差异只能影响调用与展示，不能改变资料选择、引用、错误决策或下一流程状态。平台名称不得写入项目事实、资料身份、契约字段或流程门禁。

```gherkin
Given 三个平台读取同一 state v2、角色、目标文档和 Provider 响应
When 执行资料选择与引用生成
Then 选择的资料修订、片段引用和下一流程状态语义一致，平台名称不写入项目事实
```

## 相关 NFR 与约束

- `ADLC-NFR-001`：三平台业务语义差异数必须为 0。
- `ADLC-NFR-003`：Kiro 仅注入短时凭据，Secret 不进入业务状态或普通日志。
- `ADLC-NFR-007`：Kiro 发布/安装结果不得包含本仓自举 `docs/aidlc/`，不得维护第二份 state。
- Kiro 不直接消费 Provider OpenAPI、ssot-api、Worker 或存储，不复制 U-C01-CORE-PROVIDER-CLIENT/U-C02-CORE-CONTEXT-DOCUMENT 的任何业务规则。
