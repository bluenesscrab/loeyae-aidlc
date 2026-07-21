# U-C02-CORE-CONTEXT-DOCUMENT core-context-document 需求切片

- **unit_id / service_id**：`U-C02-CORE-CONTEXT-DOCUMENT` / `loeyae-aidlc`
- **source_ref**：[`requirements.full.md`](requirements.full.md)
- **主归属 FR**：`ADLC-FR-001`、`002`、`004`、`005`、`006`、`007`、`008`、`012`
- **状态**：设计/静态生成；实现与运行 blocked/未验证

## ADLC-FR-001 state v2 与业务工作区唯一恢复源（主归属，Must）

AI-DLC 必须只从当前业务工作区恢复 state v2；插件源码仓或安装根目录中的 `docs/aidlc/` 不得成为业务状态来源，state 缺失/无效时必须阻断而不是借用插件状态继续，也不得执行 state v3 迁移。

```gherkin
Given 插件源码仓和业务项目都存在 docs/aidlc/state.md
When 任一受支持客户端恢复业务项目
Then 只使用业务项目 state v2，流程位置不因客户端或插件自举状态改变
```

## ADLC-FR-002 五角色意图与目标文档（主归属，Must）

Consumer 必须从产品经理、架构师、项目经理、开发人员、测试人员五类角色、目标文档和提示词形成 `RoleIntent` 与 `TargetDocument`。意图限定当前项目和所需资料类型；角色或目标无法唯一确定时先请求确认，不猜测目录，也不调用 Provider 扩大检索范围。

```gherkin
Given 用户声明当前角色为测试人员且目标为测试计划
When AI-DLC 形成资料意图
Then 意图包含测试计划类型、当前项目和相关需求/设计资料条件，不加载项目管理执行数据作为权威事实
```

## ADLC-FR-004 自动检索与显式资料选择（主归属，Must）

`MaterialSelection` 必须按角色、目标文档和提示词检索当前项目，默认选择最新修订；用户可显式包含、排除或指定旧版。exclude 优先且排除项不得重新进入；范围过大、低置信、来源冲突或预算不足时必须展示原因并等待确认，未确认不得构建 ContextBundle。

```gherkin
Given 自动检索选中 M1/R2 和 M2/R1，用户排除 M2 并指定 M3/R4
When AI-DLC 确认资料选择
Then 最终选择只包含 M1/R2 与 M3/R4，并记录每项选择、排除和旧版理由
```

## ADLC-FR-005 上下文包固定与降级透明（主归属，Must）

Consumer 必须校验并消费 Provider 固定的 `ContextBundle`，保留项目、资料 ID、修订、片段、来源、讨论/结论状态、索引状态、实际检索路径、降级和预算。跨项目、固定引用缺失、修订漂移或排除项命中必须阻断；GraphRAG 失败不能被解释为资料不存在。

```gherkin
Given GraphRAG 不可用而 Provider 降级到向量与全文
When AI-DLC 接收上下文包
Then 记录实际降级路径并只引用返回的具体修订/片段，不把图推断缺失解释为资料不存在
```

## ADLC-FR-006 正式文档生成与事实分层（主归属，Must）

AI-DLC 必须在业务项目既有阶段目录生成正式研发文档，并明确区分已确认资料、未确认讨论、显式结论和模型推断。正文与批准版本归业务工作区/Git或既有文档库；未确认评论和推断不得表述为已批准事实，内容校验失败的草稿不能进入待审批基线。

```gherkin
Given 上下文包含一项已确认结论、一条未确认评论和一项模型推断
When 生成正式文档
Then 三者在输出中具有不同来源状态，未确认评论和推断均不得写成已批准事实
```

## ADLC-FR-007 片段引用与章节血缘（主归属，Must）

每个由资料支撑的章节必须形成固定 `FragmentCitation`，并把 `DocumentSection` 与 `LineageRecord` 经 Provider 回写。引用必须包含实际使用的具体修订和片段，源资料更新后历史章节仍解析到原修订；血缘 partial/失败时保留 Pending 和恢复动作，不标记 synced，也不删除本地正文。

```gherkin
Given 生成文档后源资料从 R1 更新为 R2
When 用户检查原文档章节来源
Then 章节引用仍解析到 R1 的原片段，默认新生成任务才使用 R2
```

## ADLC-FR-008 逆向工程说明上传（主归属，Must）

Consumer 可选生成并上传 `ReverseDocUpload`，至少携带说明内容、仓库路径、Git commit 和内容哈希。上传前必须校验选定说明与 commit/hash 对应，重试保持逻辑幂等；Provider 返回固定说明修订引用。说明至少覆盖底层目录、技术栈、模块功能与核心流程、数据库规范/设计及代码规范，但不得修改或替代源代码/Git事实。

```gherkin
Given 当前仓库 commit 为 C1 且逆向说明内容哈希为 H1
When AI-DLC 上传说明
Then Provider 返回固定修订引用 C1/H1，源代码和 Git 历史不被修改
```

## ADLC-FR-012 外部事实边界（主归属，Must）

AI-DLC 可用沟通资料辅助生成项目管理、测试和交付文档，但任务、人力、工时、实际进度、CI/测试执行、制品和部署结果必须来自对应权威平台。只有稳定运行标识、范围、结果位置和时间可作为执行证据；口头或资料中的通过声明无稳定证据时必须标记未验证，不能生成“实际通过”结论。

```gherkin
Given 沟通资料声称测试已通过但没有测试平台运行标识
When AI-DLC 生成测试报告框架
Then 将该声明标为未验证资料，不生成“测试实际通过”的结论
```

## 相关 NFR 与约束

U-C02-CORE-CONTEXT-DOCUMENT 直接承担 `ADLC-NFR-004`、`005`、`006`，并与 U-C01-CORE-PROVIDER-CLIENT/平台单元共同满足 `ADLC-NFR-001`、`003`、`007`；性能、预算和质量阈值属于 `ADLC-NFR-008`，当前无运行证据。所有 Provider 调用必须经 U-C01-CORE-PROVIDER-CLIENT，正式正文不转移到 Provider。
