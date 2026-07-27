# AI-DLC 状态跟踪

> 本状态以 SSOT 重定位基线 `../../../loeyae-ssot-server/docs/aidlc/product/realignment-plan.md` 为准。
> 旧的 federated-integration 双仓消费侧规划、Provider/Consumer 契约治理、LDAP/OIDC、跨项目导入、`CR-U-P01-*` / `CR-I5-SCOPE-001` 及相关审批轨迹已随重定位废弃并删除(git 分支 `chore/ssot-realignment` 可查),不再具有任何现行效力。
> 本仓(loeyae-aidlc)是 AI-DLC Power 本体,同时作为 SSOT 文档平台的 **MCP 消费方**按新基线对接;对接改造规划见 `docs/SSOT-AI-DLC/`。

- **状态模式版本**：2

## 下一步交接
| 范围 | 更新时间 | 提示词 |
|------|----------|--------|
| SSOT 对接改造 | 2026-07-28T00:30:00Z | `使用 AI-DLC，继续 loeyae-aidlc SSOT 对接。AU-01~05 完成;AU-06 三平台 MCP 配置完成(mcp.json/plugin.json/setup.mjs,${SSOT_API_KEY})。待:AU-06 三平台回归 + 实际对接验证(设 SSOT_API_KEY 测试 search/write);SessionStart 探测 hook 可选。` |

## 项目信息
- **项目类型**：存量项目(AI-DLC Power,npm 1.20.0)
- **协作模式**：单人开发(loeyae)
- **架构模式**：单仓、单模块(AI-DLC Power + Kiro/Claude/OpenCode 平台适配)
- **审批模式**：标准(SSOT 侧轻量变更记录)
- **复杂度**：中等
- **执行路径**：完整流程
- **开始时间**：2026-07-17T05:44:43Z
- **当前阶段**：Construction(AU-01~05 完成,AU-06 MCP 配置完成,回归待执行)
- **当前步骤**：AU-02/04/05 steering 集成 + AU-06 三平台 MCP 配置完成;待 AU-06 回归 + 实际对接验证
- **当前层级**：模块级
- **活跃模块**：ai-dlc(Power 本体)
- **活跃服务**：loeyae-aidlc(含 kiro / claude / opencode 平台适配)
- **活跃单元**：AU-06(三平台回归,待执行)

## SSOT 对接决策(对齐 realignment)
- **SSOT 定位**：项目文档统一管理平台;对 AI-DLC 是文档来源(检索上下文)与文档去处(写回正式/逆向文档),不是需求/CR 审批控制平面。
- **集成方式**：单一 **MCP 直连消费**(无 Legacy/Mirror/Federated 多模式);凭据经 `Authorization: Bearer` 头,不作工具入参。
- **契约**：以 SSOT `../../../loeyae-ssot-server/docs/aidlc/modules/ssot/inception/mcp-contract.md` 的 14 工具为唯一来源;单仓,不做双仓契约版本治理。
- **本地权威**：AI-DLC 的需求、CR1–CR5、单元认领仍以本仓 `state.md` 与 Git 产物本地权威;SSOT 只存文档正文与版本。
- **state**：保持 v2,不升级 v3,不引入 Manifest/事件游标。
- **对端仓库**：`../loeyae-ssot-server`(Provider 侧现行基线在 `docs/aidlc/modules/ssot/`)。

## 工作区状态
- **工作区根目录**：`/Users/andy/work/src/loeyae-framework/loeyae-aidlc`
- **现有代码**：是(`POWER.md`、`CLAUDE.md`、`skills/`、`steering/`、`agents/`、`hooks/`、`src/`、`.opencode/`;npm 1.20.0)
- **需要逆向工程**：否
- **后端语言/框架**：Node.js ≥20 / JavaScript、TypeScript;Kiro Power + 多平台插件
- **Loeyae Boot 版本与 Starter**：不适用
- **前端技术栈/UI 框架**：无产品 UI;通过 IDE/CLI 入口交互
- **构建入口**：包入口 `.opencode/plugins/loeyae-aidlc.js`;未定义独立 build script
- **测试入口**：package.json 未定义 test script;须在改造实现阶段规划验证入口
- **分布式系统**：否(经 MCP 调用外部 SSOT 为可选集成,非本仓分布式职责)
- **技术适配**：Kiro、Claude Code、OpenCode
- **检测证据**：`package.json`、`POWER.md`、`CLAUDE.md`、`docs/SSOT-AI-DLC/01-改造需求.md`、`02-改造设计.md`、`03-改造计划.md`

## 系统基线
- **基线路径**：不适用(单仓;旧双仓 `docs/aidlc/product/system-baseline/` 已随重定位删除)
- **代码版本标识**：分支 `chore/ssot-realignment`(HEAD `14cd47d`);main 停在 `9bafda1`(旧基线,待推进)
- **制品标识/摘要**：npm 1.20.0;本次未构建
- **基线新鲜度**：改造规划已对齐 realignment;实现未开始,运行未验证
- **契约索引**：SSOT `../../../loeyae-ssot-server/docs/aidlc/modules/ssot/inception/mcp-contract.md`(14 工具,单一契约版本)
- **本次受影响节点**：AI-DLC 共享 steering、workspace-detection/state、Inception 检索与写回、平台 MCP 客户端适配

## 阶段进度
| 路由 | 步骤 | 状态 | 完成时间 | 产物/证据 |
|------|------|------|----------|-----------|
| I1 | 工作区检测 | completed | 2026-07-17 | 存量 AI-DLC Power 基线已识别 |
| 改造规划 | SSOT 对接需求/设计/计划 | completed | 2026-07-27 | `docs/SSOT-AI-DLC/01-改造需求.md`/`02-改造设计.md`/`03-改造计划.md`(已按 realignment 重定位) |
| C(AU) | 改造实现 | pending | - | AU-01–AU-06 未开始 |

## 单元与批次进度
| 模块 | 服务 | 批次 | 单元 | 状态 | 完成时间 | 验证证据 | 执行者 |
|------|------|------|------|------|----------|----------|--------|
| ai-dlc | loeyae-aidlc | Construction | AU-01 SSOT 共享规则 | completed | 2026-07-27 | `common-ssot-integration.md`(连接/鉴权/SsotDocClient 语义/检索写回/降级) | loeyae |
| ai-dlc | loeyae-aidlc | Construction | AU-02 连接与绑定 | completed | 2026-07-27 | inception-workspace-detection.md + common-session-continuity.md(连接检测/项目绑定/恢复探测可达性) | loeyae |
| ai-dlc | loeyae-aidlc | Construction | AU-03 MCP 客户端封装 | completed | 2026-07-27 | SsotDocClient 语义在 common-ssot-integration.md;mcp.json/plugin.json 配置 SSOT MCP | loeyae |
| ai-dlc | loeyae-aidlc | Construction | AU-04 检索消费 | completed | 2026-07-27 | inception-requirements-analysis.md + inception-application-design.md(search_documents 取上下文+来源标注) | loeyae |
| ai-dlc | loeyae-aidlc | Construction | AU-05 文档写回 | completed | 2026-07-27 | inception-reverse-engineering.md + change-request-process.md(write_reverse/write_formal 写回+待写回) | loeyae |
| ai-dlc | loeyae-aidlc | Construction | AU-06 平台适配与回归 | partial | 2026-07-27 | 三平台 MCP 配置完成(mcp.json/plugin.json/setup.mjs);SessionStart 探测可选未做;三平台回归待执行 | loeyae |

## 技术用例执行映射
| UC-D | 来源 | 执行范围 | 服务 | C8 证据 | 状态 |
|------|------|----------|------|---------|------|
| 改造用例待派生 | `docs/SSOT-AI-DLC/01-改造需求.md` FR + 验收标准 | project | loeyae-aidlc | 未执行 | pending |

## 外部证据
| 证据 ID | 类型 | 运行标识 | 代码提交 | 制品标识/摘要 | 范围 | 结果 | 位置 | 时间 |
|---------|------|----------|----------|---------------|------|------|------|------|
| EVD-REALIGN-001 | 重定位盘点 | local-20260727 | `14cd47d` | npm 1.20.0 | docs/SSOT-AI-DLC + docs/aidlc/state.md | 消费侧 federated 产物已删除;改造规划与 state 已按 realignment 重定位;实现未开始 | 本状态文件 | 2026-07-27 |

## 质量门禁状态
| 阶段/步骤 | 时间 | 结果 | 证据/阻断原因 |
|-----------|------|------|---------------|
| 消费侧重定位清理 | 2026-07-27 | 通过 | 删除 federated-integration 需求/故事/计划/契约/system-baseline(~7400 行) |
| 改造文档重定位 | 2026-07-27 | 通过(静态) | 01/02/03 重写为 SSOT=文档平台 + 单仓 MCP 直连消费 + 保持 state v2;过时引用改指 realignment-plan/modules/ssot |
| 通用 steering 去污染 | 2026-07-27 | 通过(静态) | `096321d` 曾向 9 个通用 steering 注入旧 SSOT 愿景(正式文档不进 SSOT/双仓 Provider-first/ContextBundle/章节血缘/Legacy 多模式),与 realignment 相反;已 `git checkout fac8fcf --` 将 9 文件回退到 v1.20.0,旧愿景关键词清零,制表符 0、git diff --check 通过 |
| 改造实现(AU-01–AU-06) | - | 未执行 | 待进入 Construction |

## 活跃变更请求
无。旧 `CR-U-P01-CROSS-PROJECT-IMPORT-001`(跨项目导入)、`CR-I5-SCOPE-001`(双仓 federated 范围)已随重定位废弃删除。后续需求/契约语义变更走本地 CR1–CR5(轻量模式)。

## 待优化项
- `chore/ssot-realignment` 分支的重定位改动待推进/合并到 `main`(main 仍停在旧基线 `9bafda1`)。
- 未决产品决策以 SSOT 侧 `../../../loeyae-ssot-server/docs/aidlc/modules/ssot/inception/decision-summary.md` 为准。
