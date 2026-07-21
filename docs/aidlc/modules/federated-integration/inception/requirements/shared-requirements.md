# Consumer 共享需求与约束

- **source_ref**：[`requirements.full.md`](requirements.full.md)
- **适用范围**：`U-C01-CORE-PROVIDER-CLIENT`—`U-C06-CROSS-SERVICE-TESTS`
- **状态**：设计/静态生成；运行 blocked/未验证

## 共享非功能需求

| 编号 | 完整要求 | 主要责任/验证 |
|------|----------|---------------|
| `ADLC-NFR-001` 平台中立 | Kiro、Claude Code、OpenCode 对相同 state v2、角色、目标、显式选择和 Provider 响应产生的 RoleIntent、资料选择、引用、错误决策与下一流程状态语义差异数必须为 0；平台名称不得成为项目事实。 | U-C02-CORE-CONTEXT-DOCUMENT 冻结 Core 语义，U-C03-KIRO-ADAPTER 主适配，U-C04-CLAUDE-ADAPTER/U-C05-OPENCODE-ADAPTER 协作，U-C06-CROSS-SERVICE-TESTS 汇总 conformance；未验证。 |
| `ADLC-NFR-002` Legacy 兼容 | 未配置 SSOT 的黄金场景通过率必须为 100%，八项在线契约远程调用数必须为 0，不得新增远端字段门禁。 | U-C01-CORE-PROVIDER-CLIENT 实现边界，U-C06-CROSS-SERVICE-TESTS 验证；未验证。 |
| `ADLC-NFR-003` 安全 | Secret、委托令牌和敏感原文不得进入 Git、state、提示词正文或普通日志；项目越权负向用例必须全部拒绝，平台适配只注入短时凭据。 | U-C01-CORE-PROVIDER-CLIENT/U-C02-CORE-CONTEXT-DOCUMENT/U-C03-KIRO-ADAPTER—U-C05-OPENCODE-ADAPTER，U-C06-CROSS-SERVICE-TESTS 验证；未验证。 |
| `ADLC-NFR-004` 引用完整性 | 所有由资料支撑的章节必须 100% 具有可解析的固定资料修订/片段引用；无来源推断必须 100% 明确标识，未确认讨论不得写成批准事实。 | U-C02-CORE-CONTEXT-DOCUMENT，U-C06-CROSS-SERVICE-TESTS 证据聚合；未验证。 |
| `ADLC-NFR-005` 可恢复 | Provider/索引失败不得推进错误 state v2；恢复后从同一步骤重试，不重复创建逻辑血缘，不用缓存伪造远端读取或同步成功。 | U-C01-CORE-PROVIDER-CLIENT 错误/重试，U-C02-CORE-CONTEXT-DOCUMENT Pending/对账，U-C06-CROSS-SERVICE-TESTS 验证；未验证。 |
| `ADLC-NFR-006` 数据最小化 | ContextBundle 只包含当前目标文档需要内容；显式排除资料命中数必须为 0；Consumer 不保存 SSOT 原件、完整片段库、向量或图关系副本。 | U-C02-CORE-CONTEXT-DOCUMENT，U-C06-CROSS-SERVICE-TESTS 验证；未验证。 |
| `ADLC-NFR-007` 分发隔离 | 三平台发布物和安装结果中本仓自举 `docs/aidlc/` 文件数必须为 0；平台不得维护第二份业务状态。 | U-C01-CORE-PROVIDER-CLIENT/U-C02-CORE-CONTEXT-DOCUMENT/U-C03-KIRO-ADAPTER—U-C05-OPENCODE-ADAPTER，U-C06-CROSS-SERVICE-TESTS 验证；未验证。 |
| `ADLC-NFR-008` 性能与质量 | 本地开销、上下文预算、检索质量及超时/重试阈值必须基于代表性资料集和批准阈值验证；设计固定的重试上限不等于运行达标。 | U-C01-CORE-PROVIDER-CLIENT/U-C02-CORE-CONTEXT-DOCUMENT，U-C06-CROSS-SERVICE-TESTS 运行证据；阈值锚点未登记。 |

## 共享产品约束

1. Consumer 只通过 Provider API/MCP 的批准契约访问资料，不直连 `ssot-worker`、数据库、对象存储或索引实现，也不复制 Provider 资料治理规则。
2. 业务项目只从当前工作区 `docs/aidlc/state.md` v2 恢复；不迁移 state v3，不读取插件安装根目录的自举状态作为业务状态。
3. 默认使用最新修订，只有用户显式选择时使用旧版；包含、排除、旧版、低置信、冲突、预算和实际降级路径必须可见。
4. 正式文档正文及批准版本归业务工作区/Git或既有文档库；Provider 只接收固定引用、章节定位/摘要和血缘索引。
5. 任务、人力、工时、实际进度、CI/测试执行、制品和部署结果由各自专业平台权威管理；无稳定证据时只能标记未验证。
6. state v3、Manifest、事件游标、远端 CR、impact 控制面、Portal 审批交接、完整 Trace 和跨项目共享不在首期范围。

## 共享运行门禁

- I13 的 12 个运行锚点登记仍为 `0/12`，包括环境、API 别名、身份、Owner、运行依赖、两个项目、命令、报告、版本矩阵、阈值和 Secret 注入。
- 所有 Consumer UC-D 保持 `design_status=ready`、`execution_status=blocked`、`status=blocked`。
- I14 静态生成不授权 Construction、测试执行、C8 或任何运行能力结论。
