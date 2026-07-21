# 产品模块与服务映射（AI-DLC 侧）

## 基线状态

- **变更来源**：`CR-I5-SCOPE-001`，CR4 B1
- **存量基线**：npm 1.20.0；当前无 build/test script
- **边界原则**：共享核心定义流程语义，三平台只做薄适配；SSOT Provider 事实先于 Consumer 实现

## 模块清单

| 模块 ID | 名称 | 业务职责 | 服务 ID | 数据 Owner | Owner | 优先级 |
|---------|------|----------|---------|------------|-------|--------|
| ADLC-STATE | 状态与会话恢复 | state v2、阶段/步骤/模块/CR 恢复和本地影响域门禁 | loeyae-aidlc | 项目工作区 `docs/aidlc/state.md` | AI-DLC 核心团队 | P0 |
| ADLC-INTENT | 角色与目标文档意图 | 识别角色、目标文档、提示词和所需资料类型 | loeyae-aidlc | 本次会话意图与项目内产物配置 | AI-DLC 核心团队 | P0 |
| ADLC-SSOT | SSOT 项目与资料消费 | 项目解析、资料/版本/片段读取、检索、索引状态和降级 | loeyae-aidlc | 本地最小缓存/引用；资料事实仍归 SSOT | AI-DLC 集成团队 | P0 |
| ADLC-SELECTION | 资料选择与上下文 | 自动检索、包含/排除、旧版指定、上下文预算和来源清单 | loeyae-aidlc | 会话选择与 ContextBundle | AI-DLC 核心团队 + 集成团队 | P0 |
| ADLC-DOCUMENT | 正式文档产出 | 按角色生成正式文档草案到项目工作区，保持 Git 权威 | loeyae-aidlc | 项目工作区正式文档 | AI-DLC 核心团队 | P0 |
| ADLC-LINEAGE | 引用与章节血缘 | 版本/片段引用、DocumentSection 和 LineageRecord 写回 | loeyae-aidlc | 项目文档中的引用；远端血缘索引归 SSOT | AI-DLC 集成团队 | P0 |
| ADLC-REVERSE | 逆向说明上传 | 上传逆向说明及仓库路径、commit、内容哈希关联 | loeyae-aidlc | 本地说明正文；SSOT 保存远端资料修订 | AI-DLC 集成团队 | P0 |
| ADLC-KIRO | Kiro 薄适配 | Kiro 调用、呈现、凭据和会话桥接 | kiro-power | 不拥有产品事实 | Kiro 适配 Owner 待 I14 确认 | P0 |
| ADLC-CLAUDE | Claude Code 薄适配 | Claude Code 调用、呈现、凭据和会话桥接 | claude-plugin | 不拥有产品事实 | Claude 适配 Owner 待 I14 确认 | P0 |
| ADLC-OPENCODE | OpenCode 薄适配 | OpenCode 调用、呈现、凭据和会话桥接 | opencode-plugin | 不拥有产品事实 | OpenCode 适配 Owner 待 I14 确认 | P0 |
| ADLC-TEST | 消费者与平台验证 | 契约、Legacy、上下文、血缘、权限、三平台和 E2E 验证 | test-suite | 测试夹具与执行报告 | AI-DLC 集成团队 | P0 |

## 服务映射

| 服务 ID | 部署边界证据 | 所含模块 | 数据存储 | 状态 |
|---------|--------------|----------|----------|------|
| loeyae-aidlc | npm 1.20.0；共享 `steering/`、`agents/` 和流程入口 | ADLC-STATE、INTENT、SSOT、SELECTION、DOCUMENT、LINEAGE、REVERSE | 当前业务工作区 `docs/aidlc/` 与正式文档 | 存量产品，待 B2—B5 规划后改造 |
| kiro-power | `POWER.md` 与 Kiro Power 入口 | ADLC-KIRO | Kiro 会话、凭据适配和工作区文件 | 存量，待 I14 冻结工作单元 |
| claude-plugin | `.claude-plugin/` 与 `CLAUDE.md` | ADLC-CLAUDE | Claude Code 会话、凭据适配和工作区文件 | 存量，待 I14 冻结工作单元 |
| opencode-plugin | `.opencode/plugins/loeyae-aidlc.js` | ADLC-OPENCODE | OpenCode 会话、凭据适配和工作区文件 | 存量，待 I14 冻结工作单元 |
| test-suite | I13/I14 计划建立的验证入口 | ADLC-TEST | 黄金样本、上下文夹具、版本组合和报告 | 尚未建立 |
| ssot-api | 对端仓库 `../loeyae-ssot-server` | 外部 Provider，不属于本仓模块 | SSOT 沟通/过程资料、索引状态和血缘 | 尚未实现；文档契约待 B3 |

## 数据与权威边界

- `ADLC-STATE` 唯一维护本地流程恢复位置，状态模式保持 v2；远端信息不得反向覆盖本地步骤。
- `ADLC-INTENT` 和 `ADLC-SELECTION` 管理本次角色/目标文档意图与资料选择，不创建 SSOT 资料事实。
- `ADLC-SSOT` 只消费 Provider 返回的项目、资料、版本、片段、权限、索引和降级状态，不复制 Provider 业务规则。
- `ADLC-DOCUMENT` 把正式文档写入项目工作区；正式正文和批准版本由 Git或既有文档库权威管理。
- `ADLC-LINEAGE` 写入具体资料版本/片段引用及章节血缘，不用摘要替代稳定定位。
- `ADLC-REVERSE` 上传派生说明，但不反向覆盖源代码或 Git 事实。
- 平台适配模块不拥有角色、资料选择、权限、版本、引用或血缘规则。

## 依赖关系

| 来源 | 目标 | 类型 | 说明 |
|------|------|------|------|
| ADLC-STATE | ADLC-INTENT | 进程内 | 从当前项目和步骤恢复后识别角色与目标文档 |
| ADLC-INTENT | ADLC-SSOT | 进程内/API | 形成项目解析与资料检索请求 |
| ADLC-SSOT | ssot-api | API/MCP | 消费项目、资料、版本、片段、上下文、索引状态和降级 |
| ADLC-SELECTION | ADLC-SSOT | 进程内 | 应用自动选择、包含/排除、最新/旧版和预算 |
| ADLC-DOCUMENT | ADLC-SELECTION | 进程内 | 使用已确定且可追溯的 ContextBundle 生成文档 |
| ADLC-LINEAGE | ssot-api | API/MCP | 写回 FragmentCitation、DocumentSection 和 LineageRecord |
| ADLC-REVERSE | ssot-api | API/MCP | 上传 ReverseDocUpload 和 Git 关联 |
| ADLC-KIRO/CLAUDE/OPENCODE | loeyae-aidlc | 平台适配 | 调用共享语义，不复制业务规则 |
| ADLC-TEST | Provider 与全部 Consumer | contract/integration | 验证契约、Legacy、权限、平台一致性、E2E 和回滚 |

AI-DLC 不直接依赖 `ssot-worker` 或 SSOT 数据库；解析/索引状态与降级只通过 `ssot-api` 契约观察。

## 开发与迁移顺序

1. 冻结 B1 产品定位、模块 Owner、state v2、平台无关和外部权威边界。
2. 在 B2 回写双仓 I5，并在 SSOT Provider 需求稳定后重新执行 AI-DLC I6。
3. 在 B3 等待 SSOT Provider 文档契约候选，再登记 Consumer 字段、错误和兼容状态。
4. 在 B4 更新通用 steering、五类角色文档目录和双仓 I7 计划。
5. 在 B5 完成 I11— I14；本仓 I9/I10 保持不适用。
6. Construction 才能按 `loeyae-aidlc` → 三平台适配 → `test-suite` 实施，并始终依赖兼容的 `ssot-api` Provider。
7. 当前不执行 state 或运行时数据迁移；若后续发现迁移需求，必须更新共同 CR3 计划并重新审批。

## 边界规则

- `state.md` 保持 v2，是业务工作区唯一流程恢复源。
- 未配置 SSOT 的 Legacy 项目保持既有流程和零额外远程调用。
- 三平台只适配调用、呈现和凭据，不得分叉角色、资料选择、引用、血缘或门禁语义。
- 本仓不维护 SSOT 机器 Schema 的第二权威副本；B3 只记录 Provider 版本与消费者状态。
- 完整 Federated Manifest/事件/远端 CR、state v3、跨项目共享、复杂恢复和重型发布门禁不属于首期模块。
- 当前没有独立角色模板、Provider Schema 或测试入口，不得标记相关能力已验证。

## 变更记录

| 时间 | 变更 | 原因 | CR |
|------|------|------|----|
| 2026-07-17T05:44:43Z | 建立首版 Federated Consumer 模块与服务映射 | 产品级 I2 | 首次 Inception |
| 2026-07-18T04:34:35Z | 重定为角色意图、资料消费/选择、正式文档、引用/血缘、逆向上传和平台薄适配模块 | 019—040 已批准，旧 Federated/state v3 主线后置或失效 | CR-I5-SCOPE-001 / CR4 B1 |
