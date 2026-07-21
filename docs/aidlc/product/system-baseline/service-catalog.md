# 系统基线：服务目录（AI-DLC Consumer）

- **基线时间**：2026-07-19T13:38:21Z
- **代码基线**：`fac8fcff89e42f9ba09ee7f2bc08a45340b1c85e`
- **变更**：`CR-I5-SCOPE-001 / CR4 B5 / I12`
- **新鲜度**：基于现有产品边界与 Provider OpenAPI 候选；本次未修改实现，运行状态未验证

## 运行与分发边界

| 单元 ID | 规划职责 | 数据 Owner | 上游/消费者 | 代码证据 | Owner | 状态 |
|---------|----------|------------|-------------|----------|-------|------|
| `loeyae-aidlc-core` | state v2 恢复、接入模式、角色/目标、资料选择、ContextBundle、正式文档、固定引用、血缘与逆向上传编排 | 本地意图、选择事实、固定引用、待恢复状态；业务工作区/Git管正式正文 | 上游 `ssot-api`；下游三平台 | 现有共享规则/入口；本次只生成设计，不修改代码 | AI-DLC Core Owner | 待适配，运行未验证 |
| `kiro-power` | Kiro 调用、凭据注入、输入输出与状态呈现薄适配 | 无业务事实 | `loeyae-aidlc-core` | 现有 Power 入口；本次未修改 | Kiro 适配 Owner | 待适配 |
| `claude-plugin` | Claude Code 调用和呈现薄适配 | 无业务事实 | `loeyae-aidlc-core` | 现有插件入口；本次未修改 | Claude 适配 Owner | 待适配 |
| `opencode-plugin` | OpenCode 调用和呈现薄适配 | 无业务事实 | `loeyae-aidlc-core` | 现有插件入口；本次未修改 | OpenCode 适配 Owner | 待适配 |
| `test-suite` | Core 契约、Legacy 零调用、故障恢复、三平台 conformance 与 E2E | 仅测试夹具/报告 | Provider 与全部 Consumer | 尚未建立；I13/I14 前不得创建 | 双仓测试 Owner | 尚未建立 |

## 外部服务

| 服务 ID | 关系 | 机器事实 | 责任边界 | 状态 |
|---------|------|----------|----------|------|
| `ssot-api` | 唯一直接外部 Provider | SSOT `contracts/ssot-api-v1.openapi.json` | Provider 管资料事实、权限、检索、上下文与血缘索引；Core 不复制 Schema | `1.0.0-candidate.1` 设计候选，运行未验证 |
| 业务工作区/Git | 本地权威环境 | state v2、正式文档、代码与 commit | Core 只在当前业务工作区恢复和写正式产物 | 既有边界；新增集成未验证 |

## 边界结论

1. 只有 Core 直接消费八项契约；三平台不能直接调用 `ssot-api`。
2. 未配置 SSOT 时不建立 Provider 调用链，远程调用数设计目标为 0。
3. 在线失败不是 Legacy 模式切换条件；Core 保持当前 state v2 步骤并报告恢复动作。
4. 本仓无产品 UI，本次不生成 frontend 设计或工程。
