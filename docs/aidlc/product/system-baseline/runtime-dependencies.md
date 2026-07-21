# 系统基线：运行时依赖（AI-DLC Consumer）

- **分析时间**：2026-07-19T13:38:21Z
- **代码基线**：`fac8fcff89e42f9ba09ee7f2bc08a45340b1c85e`
- **Provider 契约**：SSOT `contracts/ssot-api-v1.openapi.json`，`1.0.0-candidate.1`
- **证据状态**：设计已建立；调用和 Consumer 适配未实现、未运行验证

## 关系清单

| source | target | type | contract_ref | criticality | failure_behavior | owners | 状态 |
|--------|--------|------|--------------|-------------|------------------|--------|------|
| `loeyae-aidlc-core` | `ssot-api` | `sync-api` | Provider OpenAPI 八项契约 | 关键 | 稳定错误驱动阻断/有限重试/显式降级；不推进依赖远端事实的 state v2 | Core / SSOT API Owner | 待实现 |
| Kiro Power | `loeyae-aidlc-core` | `other` | Core 进程内/工具入口设计 | 重要 | 呈现 Core 结果，不另行解释业务错误 | Kiro / Core Owner | 待适配 |
| Claude Code Plugin | `loeyae-aidlc-core` | `other` | Core 进程内/工具入口设计 | 重要 | 同上 | Claude / Core Owner | 待适配 |
| OpenCode Plugin | `loeyae-aidlc-core` | `other` | Core 进程内/工具入口设计 | 重要 | 同上 | OpenCode / Core Owner | 待适配 |
| `loeyae-aidlc-core` | 业务工作区/Git | `file-transfer` | state v2 与正式文档边界 | 关键 | 本地写失败不调用血缘发布；远端失败不删除已提交本地正文 | Core / 项目 Owner | 既有边界，新增行为未验证 |

## Consumer 反向索引

| 变更目标 | 直接消费者 | 间接消费者 | 必须修改 | 必须验证 |
|----------|------------|------------|----------|----------|
| Provider OpenAPI | Core | 三平台 | Core 类型/客户端/错误映射 | Schema、版本协商、八项契约、故障 |
| Core 资料选择语义 | 三平台 | 业务用户 | Core；平台仅接入稳定入口 | 三平台相同输入产生相同选择与状态 |
| state v2 恢复 | Core、三平台 | 业务项目 | 仅在批准工作单元内修改 | 唯一业务工作区、平台切换、失败不推进 |
| 血缘待发布状态 | Core | 三平台 | Core | 本地提交、远端部分失败、重试去重与对账 |
| SSOT 配置存在性 | Core | 三平台 | Core | 未配置时八项契约调用数为 0；在线失败不回退 Legacy |

## 关键链路

1. 在线：`平台 → Core → ssot-api → Core → 业务工作区/Git → Core → ssot-api 血缘`。
2. Legacy：`平台 → Core → 业务工作区/Git`，不得出现任何 SSOT 网络调用。
3. 恢复：`平台 → 当前业务工作区 state v2 → Core`；不读取插件源码仓 state。
4. 逆向说明：`业务工作区/Git → Core 校验 commit/hash → ssot-api`。

## 影响域

- Provider 契约变化：Core 必须修改；三平台必须做 conformance 验证但不得复制 Schema。
- Core 业务语义变化：三平台均须验证；SSOT Provider 只在契约变化时受影响。
- 任何未知直接 Provider Consumer、平台直连或共享状态出现时立即停止并提交 CR3 增量审批。
