# Construction P0 Skill 化审计

## C5/C6/C7 能力接入
**时间戳**: 2026-08-06T11:59:09Z
**范围**: `aidlc-code-review`、`aidlc-systematic-debugging`、Construction 阶段路由和平台自适应审查调用。

## 职责边界
- C5/C7 的触发、模式选择、修复闭环和质量门禁仍由 `construction-code-review.md` 与编排层定义。
- C6 的三次失败停止和架构升级仍由 `common-systematic-debugging.md` 定义。
- 能力 Skill 不更新 state/audit、不代替审批、不放行门禁、不宣布单元或 Construction 完成。

## 语义复审
初审发现子 Agent 路径未显式经过 `aidlc-code-review`；补齐统一调用模板后，复审发现单 Agent 缺少 C7 收尾调用；再次修复并完成定点复审，最终结果为 APPROVED，无阻断或 P1/P2 问题。

## 流程完整性验证（Skill 化后）
**时间戳**: 2026-08-06T12:26:00Z
- 规则引用图：99 个 Markdown、87 个 steering，规则类引用断链为 0。
- 接线闭合：5 个能力 Skill 的阶段调用、core 步骤存在性、规则文件存在性和规则加载声明全部成立，无孤儿能力 Skill。
- 阶段链路闭合：`using-aidlc` → `core-workflow.md`、`aidlc-workflow` → `core-workflow.md`、`aidlc-inception` → `aidlc-construction`、`aidlc-construction` → `aidlc-operations`。
- 修复缺口：`construction-code-review.md` 原先只定义中文审查模式名，未定义传给 `aidlc-code-review` 的取值；已在模式表补 `INTEGRATED_DUAL_AXIS` / `INDEPENDENT_DUAL_AXIS` / `FINAL_GLOBAL` 调用标识列，使事实来源、能力入口和平台适配三处一致。

## 可达性缺陷修复
**时间戳**: 2026-08-06T12:41:00Z

以 `core-workflow.md` 为唯一起点做引用可达性分析，修复两处会导致规则永不加载的断链：

| 缺陷 | 影响 | 修复 |
|------|------|------|
| `construction-subagent-execution.md` 仅 Skill 路径可达 | 本次将 `aidlc-code-review` 调用契约与平台自适应写入该文件，从 core 执行 C5 时无法到达，能力 Skill 不会被调用 | `core-workflow.md` 的 C5 加载列表补入该文件 |
| `construction-compact-recovery.md` 无任何引用者 | 该文件声明归属 `common-session-continuity.md`，但为单向引用，Construction 压缩恢复规则永不加载，影响 core 的“会话连续性”完成标准 | `common-session-continuity.md` 在 Step 2 判定 Construction 时加载该文件 |

可达性结果：core 起点可达 steering 由 80 升至 82，`reachableOnlyOutsideCore` 仅剩按设计由平台入口引用的 `core-workflow-slim.md`。

## 三平台注入一致性修复
**时间戳**: 2026-08-06T12:58:00Z

`inclusion: always` / `fileMatch` 是 Kiro `.kiro/steering/` 的专有注入机制。本仓以 Power 形式分发，steering 由 `kiro_powers` 按需读取；Claude Code 与 OpenCode 均无等价机制。因此流程完整性规则不得只依赖 frontmatter。

三平台共同必达起点：

| 平台 | 注入入口 | 到达共享规则的路径 |
|------|----------|--------------------|
| Kiro | `POWER.md` | 首步读取 `core-workflow.md` |
| Claude Code | `CLAUDE.md` | 首步读取 `core-workflow.md` |
| OpenCode | 插件注入 `core-workflow-slim.md` | slim 指向 `core-workflow.md` |

据此在 `core-workflow.md` 的按需加载表补入三条横切纪律，使其在三平台均可达且仍按时机加载：

| 规则 | 加载时机 | 修复前状态 |
|------|----------|------------|
| `common-overconfidence-prevention.md` | 生成澄清问题或分析用户回答 | 无任何引用者，三平台均不加载 |
| `common-persuasion-defense.md` | 声明完成、验证结果，或出现跳步与合理化倾向 | 无任何引用者，三平台均不加载 |
| `common-module-scope-guard.md` | 多模块项目执行审计、自检、交叉验证或批量修复 | 仅靠 `inclusion: always`，非 Kiro 直装场景失效 |

验证结果：core 起点可达 steering 由 82 升至 85；OpenCode slim 起点可达 86；带 `inclusion` 且非 `manual` 的文件全部从 core 可达，`inclusionNotReachableFromCore` 为空。

## 既有遗留项（非本次引入，未修改）
- `common-process-overview.md`：无引用者，但自述“仅用于展示流程全貌，不定义规则”，不承载流程完整性约束，未接入。
- `core-workflow-slim.md`：由 OpenCode 插件注入，按设计不被 core 引用。

## 契约事实来源归位与职责分层
**时间戳**: 2026-08-06T15:05:00Z

经四轮语义复审，将能力契约收敛到 steering，并解决同一 steering 兼服务编排方与执行方导致的自指矛盾：

| 项 | 修复 |
|----|------|
| 输入契约重复 | `construction-code-review.md`、`common-systematic-debugging.md` 新增“输入要求”作为唯一事实来源；两个 SKILL 与子 Agent 适配层改为引用，不再复制清单 |
| 章节归属不清 | 两个 steering 新增“章节职责归属”表，按真实章节划分编排方与执行方，执行方明确不写 state/audit、不放行门禁、不判定完成 |
| FINAL_GLOBAL 执行主体缺位 | 明确执行方逐项执行最终全局审查清单并给出 UC-D 覆盖统计；放行、产物生成与完成判定归编排方 |
| 复审阈值不一致 | 统一为关键/重要必修复复审、建议级不阻塞，覆盖模式选择段、审查循环与子 Agent 红旗信号 |
| 平台降级缺口 | 调用模板按“平台提供 Skill 入口 / 不装载 `skills/`”分叉，与 `core-workflow.md` 降级规则和 `POWER.md` 一致 |
| 状态语义不完整 | 调用模板与两个 SKILL 统一 `DONE / NEEDS_CONTEXT / BLOCKED`，并定义编排方对后两者的处理路径 |

第四轮复审结论为 APPROVED。复审曾提出“部分被引用章节非 Markdown 标题”，经 grep 核对不成立：`## Standards Axis 审查结果`、`## 规格合规检查`、`## 规格合规审查结果`、`## 最终全局审查清单` 均为真实 `##` 标题，未据此改动。

## skills 三平台对齐与 hooks 移除
**时间戳**: 2026-08-06T15:05:00Z

- `skills/` 定位为可选平台入口，不承载规则；Kiro Power 实测不装载 `skills/`，OpenCode 实测装载，Claude Code 依赖平台约定且未实测，三处声明已按实测修正。
- 移除 `hooks/`（8 个文件）及 `POWER.md`、`CLAUDE.md`、`README.md`、`.kiro/steering/rule.md`、`package.json` 中的引用；已验证无任何 steering 依赖 hooks，流程正确性不受影响。

## 验证证据
- 10 个 Skill 的 frontmatter、目录名和名称唯一性检查通过；
- I13/C5/C6/C7 路由、子 Agent 三种审查模式和目标 steering 引用检查通过；
- `git diff --check` 与 OpenCode 插件 `node --check` 通过；
- `npm pack --dry-run --json` 共 113 项，三个新增 P0 Skill 均进入发布包；
- 未执行 Kiro、Claude Code、OpenCode 实际发现烟测。
