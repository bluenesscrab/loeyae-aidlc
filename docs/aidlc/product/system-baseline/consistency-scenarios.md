# 系统基线：一致性场景（AI-DLC Consumer）

- **分析时间**：2026-07-19T13:38:21Z
- **范围**：I12 业务不变量与恢复设计；实际验证留待 I13/C8

## 场景矩阵

| 场景 ID | 业务目标/来源 | 参与方与数据 Owner | 提交点与不变量 | 幂等/并发 | 失败、重试与用户状态 | 对账/人工处置 | 证据状态 |
|---------|---------------|---------------------|----------------|-----------|----------------------|---------------|----------|
| `CONS-ADLC-DOC-001` | 正式文档本地提交；ADLC-FR-006/007 | Git 管正文；Core 管生成状态 | 本地文件/Git 成功后才可准备血缘；SSOT 不拥有正文 | generationId 固定一次生成；章节 content hash 防漂移 | 本地失败不调用血缘；用户保留原步骤 | 对比 Git commit、文档 hash 和待发布记录 | 未验证 |
| `CONS-ADLC-LINEAGE-001` | 发布固定章节血缘；ADLC-FR-007 | Core 产生引用；SSOT 保存索引 | 远端成功才标记 `published`；partial/失败保持待发布 | 请求幂等键；逻辑键 `generationId+sectionId+citationId` | 仅 retryable 失败最多 3 次、1/2/4 秒；耗尽后人工重试 | 按 generationId 查询 Provider 并补发缺项 | 未验证 |
| `CONS-ADLC-REVERSE-001` | 上传逆向说明；ADLC-FR-008 | Git 管代码；Core 校验；SSOT 管说明修订 | commit/path/content hash 一致后提交；Provider 修订成功才记录远端引用 | uploadId/幂等键；新 commit 或内容产生新上传 | 错配阻断；Provider 不可用进入 pending retry，不修改 Git | 对账本地 uploadId 与 Provider revision | 未验证 |
| `CONS-ADLC-RECOVERY-001` | Provider 故障后从同一 state v2 恢复；ADLC-FR-011 | 业务工作区 state v2 Owner 为 Core | 失败不得推进依赖远端事实的步骤；不伪造引用/同步 | correlationId 与幂等键关联重试；不无限重试 | 当前步骤可见；用户修复配置/权限或稍后重试 | 审计失败、恢复动作和最终远端状态 | 未验证 |
| `CONS-ADLC-LEGACY-001` | 未配置项目保持零远程调用；ADLC-FR-010 | Core/业务工作区 | endpoint 与 candidate 均缺失时判定 Legacy；在线失败不改变模式 | 不创建 Provider 幂等记录 | Legacy 沿既有本地流程；发现任一远程调用即验证失败 | 网络调用观测与黄金场景对账 | 未验证 |

## 统一恢复约束

1. 只有 Provider 返回 `retryable=true` 或 HTTP 429/503 才自动重试，最多 3 次，退避 1/2/4 秒。
2. 权限、项目冲突、固定修订缺失、版本冲突、需用户确认和 Git 错配不得自动降级或重试推进。
3. 平台重启后只从当前业务工作区 state v2 恢复；Secret 和完整资料正文不进入恢复记录。
4. 部署/回滚必须使用已验证的 Provider/Consumer 版本组合；三平台不能通过复制业务规则规避版本不兼容。
5. I13 必须派生超时但远端可能成功、重复提交、partial 血缘、重启恢复、Legacy 误调用和版本并存用例。
