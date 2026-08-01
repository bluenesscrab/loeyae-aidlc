# 共享契约基线实施计划

- **变更 ID**：CR-SCB-001
- **状态**：CR4 就地基线更新已完成（阶段 1—7）；CR5 合并门禁（端到端试运行验证）待完成
- **风险级别**：L3（共享流程及三平台消费路径受影响，状态结构向后兼容）
- **创建日期**：2026-08-01
- **适用仓库**：`/Users/andy/work/src/loeyae-framework/loeyae-aidlc`
- **事实来源**：`steering/` 中的共享流程规则
- **批准实施基线**：`main@4d08c99`（`v1.21.2`；完整提交 `4d08c99f984fc37bfd573ae9d8284387a600b4a2`）
- **基线审批记录**：2026-08-01T02:21:42Z，Boss 批准以上提交作为 CR-SCB-001 的新基线；本次仅同步计划与 `state.md` 的基线信息和审批记录，阶段 1 须等待后续明确确认。
- **阶段 1 实施确认**：2026-08-01T02:26:22Z，Boss 确认实施 CR-SCB-001 阶段 1；仅修改本阶段指定的两份共享规则，并在静态验证通过后等待阶段 2 的明确确认。
- **阶段 2 实施确认**：2026-08-01T02:44:45Z，Boss 确认实施 CR-SCB-001 阶段 2；仅创建共享契约基线物化规则，并在静态验证通过后等待阶段 3 的明确确认。
- **阶段 3 实施确认**：2026-08-01T02:48:51Z，Boss 确认实施 CR-SCB-001 阶段 3；仅修改 C5 路由、代码生成、TDD 与审查的五份指定文件，并在静态验证通过后等待阶段 4 的明确确认。
- **阶段 4 实施确认**：2026-08-01T02:55:42Z，Boss 确认实施 CR-SCB-001 阶段 4；仅修改状态模板、会话恢复、团队协作、CR 流程和上下文优化的五份指定共享规则，并在静态验证通过后等待阶段 5 的明确确认。
- **阶段 5 实施确认**：2026-08-01T03:01:14Z，Boss 确认实施 CR-SCB-001 阶段 5；仅修改 Agent、子 Agent 执行规则和 Claude Workflow 的四个指定入口，并在静态验证通过后等待阶段 6 的明确确认。
- **阶段 6 实施确认**：2026-08-01T03:25:29Z，Boss 确认实施 CR-SCB-001 阶段 6；仅执行一致性、发布包和场景验证，并在验证通过后等待阶段 7 的明确确认。
- **阶段 7 实施确认与完成**：2026-08-01T03:50:01Z，Boss 确认实施 CR-SCB-001 阶段 7；最终治理复核通过。Claude Workflow 已收敛为消费共享 steering 的就绪结论和下一调度动作，Agent 仅传递共享结论；未创建 Git commit、发布或构建。

## 1. 背景与目标

现行 AI-DLC 已形成以下文档链路：

```text
I12 应用设计
  → 定义组件、方法签名、输入输出与依赖
I14 单元生成
  → 拆分单元、生成 shared-interfaces.md、记录依赖
C5 单元实现
  → 要求尊重既有接口
```

缺口是：已批准的跨单元共享契约没有统一的代码物化时机、唯一 Owner、验证门禁和可恢复状态。不同单元可能分别声明同职责接口、DTO 或枚举，导致并行分支冲突和契约漂移。

本变更目标：

1. I14 明确跨单元共享契约的 ID、Owner、消费者、权威来源和代码路径；
2. Construction 在各业务单元 C5 前一次性物化共享契约基线；
3. 仅允许无业务行为的声明型代码，禁止空实现和异常占位；
4. 按契约类型执行编译、结构、序列化或兼容性验证；
5. 基线验证通过后，`contract` 类型依赖视为满足；
6. 基线后签名变化统一进入 CR1—CR5；
7. 通过 `state.md` 保存基线状态、代码版本和证据，支持跨 Session 恢复。

## 2. 非目标

本次不包含：

- 多个子 Agent 同时修改同一工作区；
- `state.md` 并发写协调或多写者合并协议；
- 自动创建 Git commit、分支或 PR；
- 任何业务项目的具体接口实现；
- 新增 MCP、Hook、外部依赖或安装方式；
- 发布、版本号升级或生产部署。

现有 Agent 继续逐单元串行执行。本变更解锁团队多分支并发开发资格，不改变自动调度的并发模型。

## 3. 核心设计决策

### 3.1 流程位置

不新增独立顶层 Construction 编号，作为 C5 条件前置门禁：

```text
C1—C4 条件设计
  ↓
C5.0 共享契约基线物化（条件）
  ↓
C5.1 各单元代码规划、TDD 与两阶段审查
```

原因：

- 代码物化属于 Construction，不进入 I14；
- DTO、枚举和错误语义可能依赖 C1 的设计结果；
- 避免扩大 `core-workflow.md` 的路由表；
- 复用 C5 的审批、审查和验证框架。

### 3.2 事实来源

| 信息 | 权威来源 |
|------|----------|
| 高层组件和方法签名 | I12 应用设计产物 |
| 单元、Owner、消费者、依赖类型 | `unit-of-work*.md` |
| 跨单元契约完整设计 | `shared-interfaces.md` |
| 跨进程机器契约 | 项目实际采用的 OpenAPI、Proto、AsyncAPI、Schema 等机器源 |
| 基线执行规则 | `steering/construction-shared-contract-baseline.md` |
| 基线运行状态与证据 | 业务项目的 `docs/aidlc/state.md` |
| 进程内实际声明 | 项目代码 |
| 基线后契约变化 | CR1—CR5 |

`unit-of-work.md` 只保存索引，不复制完整方法签名。跨进程契约不得把 Markdown 或 Java 接口错误提升为机器事实来源。

### 3.3 依赖分类

| 依赖类型 | 满足条件 | 能否提前开始消费者开发 |
|----------|----------|------------------------|
| `contract` | 相关共享契约基线为 `verified` | 可以 |
| `implementation` | 提供方单元为 `complete` | 不可以 |
| `runtime` | 真实服务、数据或环境就绪 | 仅可进入相应集成验证 |
| `none` | 无依赖 | 可以 |

### 3.4 TDD 边界

声明型物化的允许/禁止完整清单见 `steering/construction-shared-contract-baseline.md` §允许与禁止的声明型物化。

**设计决策要点**（不可从 steering 推导的部分）：

- 基线只物化声明型代码，任何可执行行为继续走正常 RED-GREEN-REFACTOR；
- 声明型边界以"是否包含可执行指令"为判断标准，而非语言关键字；
- 必要的序列化/校验元数据属于声明，但其中的业务逻辑验证属于可执行行为。

## 4. 目标产物

### 4.1 `unit-of-work.md`

多单元且存在共享契约时增加：

```markdown
## 跨单元共享契约

| 契约 ID | 类型 | 接口/类 | 边界 | 所在模块 | 权威来源 | Owner 单元 | 消费方单元 | 目标代码路径 | 状态 |
|---------|------|---------|------|----------|----------|------------|------------|--------------|------|
| CT-001 | interface | TransactionChannelAdapter | 进程内 | order-biz | shared-interfaces.md#CT-001 | BE-0 | BE-4c, APP-PAY | order-biz/src/main/java/.../TransactionChannelAdapter.java | approved |
```

规则：

- 契约 ID 稳定且唯一；
- Owner 单元唯一；
- 消费者可为多个；
- 完整签名只放在权威来源；
- 目标代码路径未确定时不得完成 I14；
- 不适用时不创建空表。

### 4.2 `unit-of-work-dependency.md`

```markdown
| 消费单元 | 依赖目标 | 依赖类型 | 所需状态 | 契约 ID | 前置验证 |
|----------|----------|----------|----------|---------|----------|
| BE-4c | BE-0 | contract | contract_ready | CT-001 | 基线编译通过 |
| BE-5a | BE-0 | implementation | complete | 不适用 | 提供方测试通过 |
| E2E-1 | payment-service | runtime | runtime_ready | API-001 | 集成环境可用 |
```

### 4.3 `shared-interfaces.md`

每项契约至少记录：

- 稳定契约 ID；
- 边界类型；
- Owner 与消费者；
- 权威来源；
- 目标模块和代码路径；
- 类型和完整签名；
- 错误语义；
- 兼容策略；
- 验证要求。

跨进程接口只索引机器契约，不复制完整 Schema。

### 4.4 `state.md`

保持状态模式版本 `2`，增加条件式区块：

```markdown
## 共享契约基线（条件）

| 基线 ID | 范围 | 契约清单 | 状态 | 代码版本 | 验证证据 | 阻断原因 |
|---------|------|----------|------|----------|----------|----------|
| SCB-order-biz | order-biz | CT-001, CT-002, CT-003 | verified | abc1234 | order-biz compile exit 0 | - |
```

允许状态：

- `pending`
- `in_progress`
- `verified`
- `blocked`
- `change_requested`

状态转换：

```text
pending → in_progress → verified
                      ↘ blocked
verified → change_requested → verified
                            ↘ blocked
```

`contract_ready` 是“相关基线状态为 `verified`”的派生判断，不在 state.md 创建第二份状态。

## 5. 门禁算法

完整执行步骤见 `steering/construction-shared-contract-baseline.md`（触发/跳过 → 输入完整性 → 存量代码检查 → 物化 → 分类型验证 → 双轴审查 → 记录基线 → 解锁）。

**本节仅保留不可从 steering 推导的设计决策：**

- 触发判断优先于输入验证；单单元或无 `contract` 依赖时跳过，不创建空产物；
- 存量代码已存在且与设计一致时复用，不重新生成；
- `contract_ready` 是"相关基线 `verified`"的派生判断，不在 state.md 创建独立字段；
- 门禁失败不删除、不覆盖、不绕过，只阻断并记录缺口。

## 6. 文件变更清单

### 6.1 新增

| 文件 | 职责 |
|------|------|
| `steering/construction-shared-contract-baseline.md` | 共享契约基线的唯一详细规则源 |

建议章节：目的、触发/跳过、术语、输入、完整性门禁、权威来源、存量代码复用、允许/禁止声明、验证矩阵、审查、Git 记录、state 更新、失败回退、完成标准。

### 6.2 必须修改的共享规则

| 文件 | 修改内容 |
|------|----------|
| `steering/core-workflow.md` | C5 加载新增 steering；增加不超过 5 行的条件前置说明 |
| `steering/inception-units-generation.md` | 增加共享契约索引、Owner、消费者、代码路径和依赖类型 |
| `steering/construction-code-generation.md` | 代码规划前检查基线；消费者不得重新声明契约 |
| `steering/construction-tdd.md` | 定义声明型物化边界；业务行为继续 RED |
| `steering/construction-code-review.md` | 增加重复契约、基线偏差和消费者私有副本检查 |
| `steering/common-contract-governance.md` | 增加进程内跨单元契约和代码权威规则 |
| `steering/change-request-process.md` | CR 期间将受影响基线置为 `change_requested` 并重新验证 |
| `steering/common-team-collaboration.md` | 认领条件从“接口已定义”改为相关基线 `verified` |
| `steering/inception-state-template.md` | 增加可选共享契约基线区块，保持版本 2 |
| `steering/common-session-continuity.md` | 恢复 Construction 时读取基线状态和代码版本 |
| `steering/common-context-optimization.md` | 定义不同依赖类型的满足条件 |
| `steering/construction-subagent-execution.md` | 向执行者传递基线状态、契约 ID 和代码路径 |

### 6.3 必须修改的 Agent 与平台适配

| 文件 | 修改内容 |
|------|----------|
| `agents/batch-executor.md` | 按依赖类型判断 readiness，不再一律要求依赖单元完成 |
| `agents/orchestrator.md` | 调度前检查基线门禁；contract 依赖以 verified 为满足条件 |
| `skills/aidlc-construction/SKILL.md` | C5 路由增加新增 steering |
| `.claude/workflows/aidlc-construction-batch.js` | 读取基线状态和 typed dependency，未验证时阻断 |

### 6.4 原则上不修改

| 文件/范围 | 原因 |
|-----------|------|
| `POWER.md` | Kiro 已按共享 steering 路由，能力入口不变 |
| `CLAUDE.md` | Claude 接入和能力声明不变 |
| `.opencode/plugins/loeyae-aidlc.js` | 已通过共享 Skill/steering 加载 |
| `README.md` | 安装、入口和平台能力矩阵不变 |
| `package.json` | 无新依赖、命令或发布动作 |
| Hooks、MCP | 与本功能无关 |

## 7. 分阶段实施任务

### 阶段 0：CR 基线确认

- [x] 将本修改登记为 `CR-SCB-001`；
- [x] 确认风险级别 L3；
- [x] 确认仅支持团队分支并发资格，不引入自动多 Agent 并发；
- [x] 确认 state 模式版本保持 2；
- [x] 确认文件范围和验证矩阵；
- [x] 已记录批准基线 `main@4d08c99`（`v1.21.2`）；
- [x] 已获得阶段 1 实施确认。

完成标准：目标、非目标、流程位置和状态模型无歧义。

回退：若要求自动多 Agent 并发，暂停本 CR，先设计工作区隔离和 state 单写者协议。

### 阶段 1：增强 I14 契约建模

修改：

- `steering/inception-units-generation.md`
- `steering/common-contract-governance.md`

任务：

- [x] 定义跨单元共享契约索引；
- [x] 定义 `contract / implementation / runtime`；
- [x] 增加 Owner 唯一性检查；
- [x] 增加目标代码路径检查；
- [x] 明确 Markdown、代码和机器契约的事实来源；
- [x] 更新 I14 完成标准。

验收：

- 多单元共享接口必须有完整索引；
- 单单元或无共享接口不创建空产物；
- 同一契约只有一个 Owner；
- 跨进程接口不以 Markdown 为机器权威来源。

### 阶段 2：新增基线物化规则

新增：`steering/construction-shared-contract-baseline.md`

任务：

- [x] 编写触发和跳过条件；
- [x] 编写声明允许/禁止清单；
- [x] 编写存量代码复用规则；
- [x] 编写分类型验证矩阵；
- [x] 编写双轴审查和证据规则；
- [x] 编写 state 状态转换；
- [x] 编写失败回退路径；
- [x] 编写团队 Git 基线记录规则。

验收：文件只负责共享契约基线，不复制 I12、I14、TDD 或 CR 的完整规则，不承诺固定耗时。

### 阶段 3：接入 C5、TDD 和审查

修改：

- `steering/core-workflow.md`
- `skills/aidlc-construction/SKILL.md`
- `steering/construction-code-generation.md`
- `steering/construction-tdd.md`
- `steering/construction-code-review.md`

任务：

- [x] C5 路由加载新增 steering；
- [x] 代码规划前检查基线；
- [x] 定义声明型物化的严格边界；
- [x] 增加“消费者不得重定义”规则；
- [x] 增加重复职责契约审查；
- [x] 增加基线与 I12/I14 的规格一致性审查；
- [x] 保证业务代码继续执行 TDD。

验收：core 只保留短路由；DTO/枚举不被错误描述为必须 `implements`；所有可执行行为仍需要失败测试。

### 阶段 4：状态、恢复和 CR 集成

修改：

- `steering/inception-state-template.md`
- `steering/common-session-continuity.md`
- `steering/common-team-collaboration.md`
- `steering/change-request-process.md`
- `steering/common-context-optimization.md`

任务：

- [x] 增加可选基线状态表；
- [x] 保持状态版本 2；
- [x] 恢复 Construction 时读取基线状态；
- [x] 团队认领条件改为 `verified`；
- [x] CR 开始时使受影响基线失效；
- [x] CR 完成后重新验证基线；
- [x] 定义各依赖类型的满足条件。

验收：旧 state.md 可以恢复；无共享契约项目不被阻断；`change_requested` 时不能继续使用旧基线。

### 阶段 5：Agent 和 Claude 适配

修改：

- `agents/batch-executor.md`
- `agents/orchestrator.md`
- `steering/construction-subagent-execution.md`
- `.claude/workflows/aidlc-construction-batch.js`

任务：

- [x] 调度器读取基线状态；
- [x] 执行者接收契约 ID、代码路径和基线版本；
- [x] contract 依赖按 verified 判断；
- [x] implementation 依赖仍要求上游完成；
- [x] runtime 依赖只允许进入相应验证阶段；
- [x] Claude Workflow 批次初始化前检查基线；
- [x] 缺失信息返回 `BLOCKED` 或 `NEEDS_CONTEXT`；
- [x] 保持逐单元串行执行。

验收：纯契约依赖不会错误等待提供方实现，真实实现依赖不会因契约存在而被绕过。

### 阶段 6：一致性与场景验证

静态验证：

- [x] 所有新增引用指向存在文件；
- [x] core 和 Skill 的 C5 加载映射一致；
- [x] 详细规则只存在于新增 steering；
- [x] 无空实现、异常占位或伪 Bean 示例；
- [x] 跨进程契约仍以机器源为权威；
- [x] 三平台入口未复制共享流程。

执行命令：

```bash
git diff --check
node --check .claude/workflows/aidlc-construction-batch.js
npm pack --dry-run
```

验证目标：

- 无 diff 格式错误；
- Claude Workflow JavaScript 语法有效；
- 新 steering、Skill 和 Agent 进入 npm 发布包；
- 不运行可能修改用户环境的 `npm run setup`。

场景走查：

1. 单单元项目：门禁跳过，正常进入 C5；
2. 多单元进程内接口：物化、编译、verified、解锁 contract 依赖；
3. 跨进程 API：机器契约为权威，执行兼容性验证；
4. 签名不完整：阻断并返回 I12；
5. 基线后改签名：进入 CR，状态 change_requested，重新验证；
6. implementation 依赖：即使契约 verified，仍等待提供方 complete。

仓库当前没有自动测试脚本。实施完成时只能报告实际执行的静态检查和场景验证，不得声称未运行的测试通过。

### 阶段 7：最终治理复核

- [x] 共享流程只维护在 `steering/`；
- [x] Skill 只负责路由；
- [x] 平台入口没有复制流程；
- [x] Claude 专属逻辑只在 Claude Workflow；
- [x] 新状态可以从 state.md 恢复；
- [x] 新门禁有触发和跳过条件；
- [x] 单单元项目未增加无意义步骤；
- [x] 声明型物化未扩张为提前实现业务；
- [x] 基线后变化走 CR；
- [x] 完成声明都有实际证据；
- [x] README 和发布清单在入口未变化时保持不动。

复核证据（2026-08-01T03:50:01Z）：独立行为级复核无必须修复项；`node --check .claude/workflows/aidlc-construction-batch.js`、CRLF 感知 `git diff --check` 与 `npm pack --dry-run` 通过。仓库未定义独立测试或构建脚本，未执行构建或测试；普通 `git diff --check` 对保留 CRLF 新增行的诊断不作为格式失败。

## 8. 实施依赖顺序

```text
阶段 0 CR 确认
  ↓
阶段 1 I14 数据模型
  ↓
阶段 2 基线规则文件
  ↓
阶段 3 C5/TDD/审查接入
  ↓
阶段 4 状态/恢复/CR
  ↓
阶段 5 Agent/Claude 适配
  ↓
阶段 6 验证
  ↓
阶段 7 治理复核
```

阶段 1 与阶段 2 不并行，新增 Construction 规则依赖 I14 最终字段定义。阶段 3—5 在规则稳定后可分工，但同一文件不得并行编辑。

## 9. 风险与控制

| 风险 | 影响 | 控制措施 |
|------|------|----------|
| 共享契约过早冻结 | C1 后频繁 CR | 先完成影响签名的必要设计 |
| 骨架夹带业务逻辑 | 破坏 TDD | 声明白名单 + 双轴审查 |
| 文档与代码双事实源 | 契约漂移 | 按边界明确唯一权威来源 |
| 所有依赖都被标为 contract | 错误并行 | 强制 typed dependency |
| state.md 扩展破坏恢复 | 跨平台会话失败 | 可选区块，保持版本 2 |
| 团队模式自动提交 | 越权和污染 Git 历史 | 只记录用户批准产生的 SHA |
| 被误解为 Agent 自动并发 | 工作区和状态冲突 | 明确保持逐单元串行 |
| 存量代码已有重复接口 | 无法安全物化 | 先扫描，一致则复用，冲突则阻断 |
| Java 接口取代机器契约 | 跨服务消费者漂移 | 跨进程机器契约优先 |

## 10. 回滚策略

1. 停止创建新的共享契约基线；
2. 将 C5 路由恢复为原有三个 steering；
3. 移除新增基线 steering；
4. 恢复 Agent 原依赖完成判定；
5. 旧项目 state.md 的可选基线区块保留但忽略；
6. 已产生的业务契约代码不自动删除，由业务项目单独评估；
7. 已有消费者基于新签名开发时，回滚流程规则前必须评估契约影响；
8. 若仅 Claude Workflow 出现问题，可单独回滚该适配器，不影响共享规则。

## 11. 完成定义

- [x] I14 能生成完整共享契约索引；
- [x] 能区分 contract、implementation、runtime；
- [x] C5 能按条件执行或跳过基线门禁；
- [x] 声明型代码不含占位实现；
- [x] 每类契约有明确验证要求；
- [x] state.md 可记录并恢复基线状态；
- [x] verified 才满足 contract 依赖；
- [x] CR 能使旧基线失效并重新验证；
- [x] Agent 按依赖类型判断 readiness；
- [x] Claude Workflow 能消费共享规则的未就绪结论；
- [x] 单单元和无共享接口项目行为不变；
- [x] 三平台继续加载同一套 steering；
- [x] 静态检查及六类场景走查通过；
- [x] 未声称未经执行的测试结果。

## 12. Session 恢复

新 Session 使用以下提示词：

```text
使用 AI-DLC，确认 loeyae-aidlc 的 CR-SCB-001 共享契约基线增强已完成。请先读取 docs/aidlc/state.md、docs/aidlc/shared-contract-baseline-implementation-plan.md 和 steering/construction-shared-contract-baseline.md，核对已记录的静态/走查证据；不要重复执行已关闭的 CR。后续涉及共享契约签名、语义、路径或门禁规则的变更，须创建新的 CR1—CR5。
```
