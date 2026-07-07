# aidlc 测试用例贯通改造 — 应用提示词

> 本文件是独立的提示词文档。对照项目中的 aidlc steering 文件，手动应用下列改动即可。每处改动标明：**目标文件**、**改在哪里**、**怎么改**。
>
> 改完后，aidlc 的测试链路从"产品故事 → 派生用例 → TDD 标记 → 对账门禁 → 测试执行"贯通，测试全绿 = 交付了产品要的东西，而不是"代码跑了遍流程"。
>
> **范围说明**：本提示词只覆盖 aidlc 工作流（Inception/Construction/CR）的改动。测试执行 skill 为独立产物——loeyae-boot-framework 项目使用 `loeyae-service-testing`（loeyae-mcp 提供），其他技术栈项目使用自定义 skill——不在本文件范围内。

---

## 一、设计原则（贯穿所有改动）

1. **产品只产需求/故事/UI mock，不增加额外负担**——故事验收标准以 Gherkin 场景表达（产品可由 AI 辅助转化），其余用例细化都是开发/测试的活
2. **产品版故事是唯一真相**——开发不得产出独立"开发版故事"，任何偏离走 CR 回写产品版
3. **正向映射，不做代码逆向**——对账靠 `@TestCaseId` 标记的用例点→测试映射，不靠 LLM 从代码反推规格（不可靠）
4. **门禁分两层**——纪律层（提示词约束 LLM 遵从）+ 机器层（最小校验脚本做硬检查），两层互补

---

## 二、test-cases 格式规范（三方契约）

这是 Inception 步骤 6.5 产出端、Construction 对账端、Operations 消费端三方的契约。**格式不定，下游全悬空。**

**产物路径**：`docs/aidlc/inception/application-design/test-cases/`

### 文件组织方式（二选一）

| 方式 | 文件命名 | 适用场景 |
|---|---|---|
| **按场景拆分**（推荐，场景 ≤20） | `UC-D-{编号}-{场景名}.md` | 场景数量较少，逐个管理清晰 |
| **按故事聚合**（场景 >20 或同故事场景强耦合） | `US-{故事编号}-test-cases.md` | 大型项目，减少文件数量 |

两种方式的内部结构相同，聚合方式用 `## UC-D-xxx` 二级标题分隔各用例点。`_index.md` 始终为扁平索引。

### 单用例点结构

```markdown
---
id: UC-D-{编号}
title: {用例标题，描述行为}
story_ref: US-{故事编号}               # 步骤 4 的用户故事编号
scenario_ref: "{Gherkin 场景名}"        # 故事内的 Gherkin 场景名
type: api                              # api | e2e | unit
priority: P0                           # P0 阻塞 | P1 重要 | P2 可选
status: ready                          # ready | blocked | deprecated
---

# UC-D-{编号} {用例标题}

## 产品故事溯源（不可修改，从步骤 4 原样复制）

```gherkin
Scenario: {场景名}
  Given {前置条件}
  When {用户动作}
  Then {可验证的业务结果}
```

## 执行锚点（步骤 6.5 派生，开发填写）
- **type**: {api | e2e | unit}
- **endpoint/page**: {API 路径或页面路由}
- **auth**: {认证要求}
- **前置数据**: {测试执行前需准备的数据}

## 执行步骤与断言
| # | 步骤 | 断言 |
|---|------|------|
| 1 | {操作描述} | {期望结果} |
| 2 | {操作描述} | {期望结果} |

## Given/When/Then 覆盖映射（必填，自检用）
- Given {条件} → 步骤 {N} ✓
- When {动作} → 步骤 {N} ✓
- Then {结果} → 步骤 {N} ✓

## 派生日志
- 派生自: US-{编号} / 场景"{场景名}"
- 派生时间: {ISO 时间戳}
- 派生者: 开发（步骤 6.5）
- 变更记录: （走 CR 时追加，注明 CR 编号、原因、产品批准）
```

### 强制字段

`id / story_ref / scenario_ref / type / Given-When-Then 覆盖映射`。缺任一 = 派生自检 🔴。

### type 语义

| type | 含义 | Construction 消费 | Operations 消费 |
|---|---|---|---|
| `api` | 后端接口级 | @TestCaseId 单测/集成测试 | 测试执行 skill 走接口测试框架 |
| `e2e` | 前端页面级 | 可选（视项目决定） | 测试执行 skill 走 E2E 框架 |
| `unit` | 纯逻辑级 | @TestCaseId 单测 | 不重复跑（Construction 已覆盖） |

**Operations 消费方选择**（按项目技术栈）：

| 条件 | 测试执行 skill | 说明 |
|---|---|---|
| 项目使用 loeyae-boot-framework | `loeyae-service-testing`（loeyae-mcp 提供） | api 走 pytest，e2e 走 Playwright MCP |
| 其他技术栈 | 项目自定义测试执行 skill | 按项目测试框架配置，消费相同的 UC-D 格式 |

---

## 三、改动清单

### 改动 1：`skills/aidlc-inception/SKILL.md` — 路由表加步骤 6.5

**意图**：在应用设计（步骤 6）之后、单元生成（步骤 7）之前，插入测试用例派生步骤。

**找到**：步骤路由表里这两行：
```
| 6 | 应用设计 | 条件 | `inception-application-design.md` | `inception/application-design/` |
| 7 | 单元生成 | 条件 | `inception-units-generation.md` | `inception/application-design/unit-of-work*.md` |
```

**在两行之间插入一行**，变成：
```
| 6 | 应用设计 | 条件 | `inception-application-design.md` | `inception/application-design/` |
| 6.5 | 测试用例派生 | 条件（步骤 6 已执行） | `test-case-derivation.md` | `inception/application-design/test-cases/` |
| 7 | 单元生成 | 条件 | `inception-units-generation.md` | `inception/application-design/unit-of-work*.md` |
```

**为什么**：6.5 必须在应用设计（产出 api-contracts.md）之后、单元生成之前——用例点需要 API 契约作为执行锚点，而单元生成要消费用例点编号做 @TestCaseId 关联。

**步骤 6.5 是独立路由步骤**，由 `test-case-derivation.md` 承载全部执行细节。`inception-application-design.md` 不内嵌用例派生逻辑，仅在步骤 10 产出完成后加一句过渡提示。

---

### 改动 2：`steering/inception-user-stories.md` — 加 Gherkin 验收标准格式要求

**意图**：确保步骤 4 产出的用户故事以结构化 Gherkin 表达验收标准，为步骤 6.5 提供可机械映射的锚点。

**找到**：`# 第一部分：规划` 这一章，在它下面、`## 步骤 1：确定用户故事深度` 之前。

**插入以下章节**（仅 Gherkin 格式要求，不含基线纪律——基线纪律由 `test-case-derivation.md` 在派生时校验）：

```markdown
## 验收标准格式要求（强制）

用户故事的验收标准**必须**以 Gherkin 场景表达。这是后续步骤 6.5 测试用例派生的锚点——自由文字无法被机械映射为可执行用例。

### Gherkin 格式规范

每个用户故事至少包含：
- 1 个 happy path 场景
- 关键的 alternate 场景（如可选路径）
- 关键的 error 场景（错误输入、边界、权限不足等）

**Gherkin 模板**：
```gherkin
Scenario: [场景名，描述行为而非实现]
  Given [前置条件，可观测的业务状态]
  When [用户动作或系统事件]
  Then [可验证的业务结果，不是技术实现]
```

**要求**：
- Given/When/Then 三段缺一不可
- Then 必须是**业务可验证**的（"返回成功"不行，"订单状态变为已支付"才行）
- 一个 Scenario 验证一个行为，不合并多个 Then

### AI 辅助转化机制

当产品以自由文字描述验收标准时，开发/AI 应辅助转化为 Gherkin 格式：

1. 将自由文字中的条件提取为 Given
2. 将触发动作提取为 When
3. 将期望结果提取为 Then
4. 转化后**必须由产品确认**语义无偏差

转化后的 Gherkin 场景即成为产品基线，后续步骤以此为准。
```

> **注意**：改动 2 只包含格式要求和辅助转化。"产品故事是不可变基线"和"拒绝烂基线"自检规则已移入 `test-case-derivation.md`（改动 6）的前置校验段，避免 user-stories 文件职责膨胀。

---

### 改动 3：`steering/inception-application-design.md` — 步骤 10 后加过渡提示

**意图**：应用设计完成后，提示执行者进入步骤 6.5（独立路由步骤）。

**找到**：步骤 10 生成应用设计产物的末尾（前端平台规范部分之后），`### 11. 记录审批` 之前。

**在两者之间插入**（仅过渡提示，不含执行逻辑）：

```markdown
### 10.5 过渡：测试用例派生

> 应用设计产物就绪后，进入步骤 6.5（测试用例派生）。该步骤由独立 steering 文件 `test-case-derivation.md` 驱动，按路由表顺序执行。
>
> 本步骤不在 `inception-application-design.md` 内部执行——完成应用设计审批后，路由表自动跳转步骤 6.5。
```

**为什么不在此文件内嵌执行逻辑**：
- 避免步骤 6.5 出现"双重入口"（路由表 + application-design 内部）导致执行者困惑
- 符合 AIDLC 渐进式披露原则：路由表负责调度，steering 文件负责单一步骤详情

---

### 改动 4：`steering/construction-tdd.md` — 加 @TestCaseId 铁律

**意图**：让每个测试可溯源到用例点，这是末尾对账能机器校验的前提。

**找到**："铁律"章节，结尾是这句：
```
从测试出发重新实现。句号。
```

**在它后面插入新章节**：

```markdown
---

## 用例点溯源铁律

```
每个测试必须标注它对应哪个测试用例点。
没有 @TestCaseId 的测试 = 不知所云的测试。
```

**规则**：
- 每个新增/修改的公共方法，其测试**必须**关联到 `docs/aidlc/inception/application-design/test-cases/` 中的某个 UC-D-xxx
- 关联方式：测试方法名或注解/标签携带用例点编号

**后端示例**（Java/Kotlin）：
```java
@Tag("UC-D-003")  // JUnit 5 原生标签，或自定义 @TestCaseId 注解
@Test
void shouldRejectRequestWhenQuotaExceeded() {
    // ...
}
```

**前端示例**（TypeScript/JavaScript）：
```typescript
describe('UC-D-003 超出配额拒绝请求', () => {
  it('超过限额时返回拒绝', () => { ... })
})
```

**为什么强制**：
- Construction 末尾对账（见 `construction-code-review.md` 全局审查）要校验"每个 UC-D 都有对应测试且通过"，没有标记就无法校验
- 没有溯源的测试回答"代码做了什么"，有溯源的测试回答"产品要的有没有被验证"——这是本质区别

**豁免**（需用户明确许可）：纯重构不新增行为、纯配置文件。豁免时必须在审计文件记录"本测试无 UC-D 关联，理由：XXX"。

**违反处理**：测试没有用例点标记 = 红旗信号，按"跳过 TDD"同等处理——补标记或删除测试重写。
```

---

### 改动 5：`steering/construction-code-review.md` — 加对账①②（两处）

**意图**：Spec 轴加用例覆盖审查，全局审查加末尾对账门禁。

#### 5A. Spec Axis 审查清单

**找到**：`### 完整性（缺失检查）` 块里这一行：
```
- [ ] 错误处理覆盖了规格中定义的所有异常场景
```

**在它后面追加两行**：
```
- [ ] **测试用例点覆盖**：本单元涉及的每个 UC-D-xxx（来自 `inception/application-design/test-cases/`）都有对应的 @TestCaseId 测试
- [ ] **用例点状态**：所有涉及的 UC-D 的 `status` 非 `blocked`（blocked 的须已在步骤 6.5 列入待产品决策清单）
```

#### 5B. 最终全局审查清单

**找到**：`### 测试完整性` 块，结尾是：
```
- [ ] 单元测试覆盖率达标
- [ ] 集成测试覆盖关键路径
- [ ] 边界情况已测试
```

**在它后面追加整个对账门禁章节**：

```markdown
### 用例点对账（强制门禁，未通过 = Construction 未完成）

#### 对账① 设计覆盖（每个单元功能设计阶段执行，此处全局复核）
- [ ] 步骤 6.5 产出的每个 UC-D-xxx，都能在功能设计文档中找到对应的实现设计
- [ ] 无 UC-D 处于 `blocked` 状态未裁决（blocked 须有产品决策记录）

#### 对账② 测试映射（末尾强制）
- [ ] 每个 UC-D-xxx 都有至少一个带用例点标记的测试
- [ ] 所有标记测试全部通过（0 失败）
- [ ] 用例点覆盖统计：`已覆盖 UC-D 数 / 总 UC-D 数 = X/Y`，X=Y 才通过

**对账未通过处理**：
- 缺测试：回 TDD 补 RED 测试（带 @TestCaseId）
- 测试失败：修复实现，不是改测试期望
- 用例点 blocked：回步骤 6.5 待产品决策清单，不得绕过

**对账产物**：生成 `docs/aidlc/construction/audit/test-case-reconciliation.md`，列出每个 UC-D 的覆盖状态（已覆盖/缺测试/测试失败/blocked），作为 Construction 完成证据。

**机器校验辅助**（推荐实施，降低纯纪律门禁风险）：

项目中可添加如下最小校验脚本，在对账②时执行：

```bash
#!/bin/bash
# test-case-reconciliation-check.sh
# 用途：对比 _index.md 中的 UC-D 清单与测试文件中的标记，输出差集

# 1. 从 _index.md 提取所有 UC-D 编号
INDEX_FILE="docs/aidlc/inception/application-design/test-cases/_index.md"
EXPECTED=$(grep -oP 'UC-D-\d+' "$INDEX_FILE" | sort -u)

# 2. 从测试文件中提取所有已标记的 UC-D 编号
# 后端（Java/Kotlin）
BACKEND=$(grep -rhoP 'UC-D-\d+' src/test/ | sort -u)
# 前端（TypeScript/JavaScript）
FRONTEND=$(grep -rhoP 'UC-D-\d+' tests/ src/**/*.spec.* | sort -u)

COVERED=$(echo -e "${BACKEND}\n${FRONTEND}" | sort -u)

# 3. 输出差集
echo "=== 未覆盖的 UC-D ==="
comm -23 <(echo "$EXPECTED") <(echo "$COVERED")

echo "=== 覆盖统计 ==="
TOTAL=$(echo "$EXPECTED" | wc -l)
HIT=$(comm -12 <(echo "$EXPECTED") <(echo "$COVERED") | wc -l)
echo "已覆盖: $HIT / $TOTAL"
[ "$HIT" -eq "$TOTAL" ] && echo "✅ 对账通过" || echo "🔴 对账未通过"
```

> 此脚本为参考实现，项目可根据技术栈调整路径和正则。后续可升级为 MCP skill 提供更精确的 AST 级校验。

**对账纪律**：
- ❌ 不得为通过对账而删除/跳过 UC-D
- ❌ 不得为通过对账而改写 UC-D 的期望结果（改期望 = 改产品意图，走 CR）
- ❌ 不得用"代码逆向回规格"代替正向映射对账（逆向不可靠）
```

---

### 改动 6：新增 `steering/test-case-derivation.md`

**意图**：步骤 6.5 的详细执行规范，被路由表直接引用。这是全新文件。

**完整文件内容**：

```markdown
# 测试用例派生规范（步骤 6.5）

## 目的

**将产品用户故事（Gherkin）翻译为可执行测试用例点 UC-D**

这是"产品要什么"到"怎么验证"的翻译点。产品在步骤 4 用 Gherkin 写场景（用户语义），本步骤在应用设计产出 API 契约后，把场景锚定到具体的 endpoint/page/steps，产出 Construction 和 Operations 都能消费的可执行用例。

## 前置条件

- 步骤 4 用户故事已完成（Gherkin 场景就绪）
- 步骤 6 应用设计已完成（`api-contracts.md` 或前端路由/页面结构就绪）

## 产品故事基线规则（派生前校验）

### 产品故事是不可变基线

步骤 4 产出的用户故事（含 Gherkin 场景）是**产品基线**，本步骤及后续阶段不得擅自修改其语义。

- 派生测试用例时，**原样复制** Gherkin 到用例文件的"产品故事溯源"段，不得改写
- Construction 阶段若发现实现与产品故事不一致，**不得**自产"开发版故事"替代，必须走 CR 流程（见 `change-request-process.md`）
- 产品故事的任何语义变更，只能由产品通过 CR 流程回写，产品版始终是唯一真相

### 烂基线自检（派生时暴露）

派生过程中对每个 Gherkin 场景自检以下三类问题，不通过则**回退步骤 4 找产品补场景**，不得带着模糊基线继续：

| 问题类型 | 判定 | 处理 |
|---|---|---|
| 宽泛 | Given/When/Then 写不出具体可验证结果（如"用户能管理数据"） | 带具体问题回退产品，拆成多个原子场景 |
| 矛盾 | 同一故事内多个 Scenario 的前置/结果冲突 | 回退产品修正冲突 |
| 无源 | 故事 trace 不到需求文档任何条目 | 标记并问产品确认是否保留 |

## 产物路径

`docs/aidlc/inception/application-design/test-cases/`

## 文件组织

| 方式 | 规则 | 适用 |
|---|---|---|
| 按场景拆分（推荐） | 一个 Gherkin 场景 = 一个 `UC-D-{编号}-{场景名}.md` 文件 | 场景 ≤20 |
| 按故事聚合 | 一个用户故事 = 一个 `US-{编号}-test-cases.md` 文件，内部用 `## UC-D-xxx` 分隔 | 场景 >20 或同故事场景强耦合 |

项目可在首次派生时选定组织方式，后续保持一致。

## 单用例点格式

（见本提示词第二章"test-cases 格式规范"的完整模板）

## type 语义

| type | 含义 | Construction 消费 | Operations 消费 |
|---|---|---|---|
| `api` | 后端接口级 | @TestCaseId 单测/集成测试 | 测试执行 skill 走接口测试框架 |
| `e2e` | 前端页面级 | 可选 | 测试执行 skill 走 E2E 框架 |
| `unit` | 纯逻辑级 | @TestCaseId 单测 | 不重复跑 |

> **loeyae-boot-framework 项目**：Operations 消费方使用 `loeyae-service-testing` skill（loeyae-mcp 提供），api 走 pytest，e2e 走 Playwright MCP。其他技术栈项目使用自定义测试执行 skill。

## 强制字段

`id / story_ref / scenario_ref / type / Given-When-Then 覆盖映射`。缺任一 = 派生自检 🔴。

## 执行流程

1. **读取产品故事**：加载 `inception/user-stories/stories.md`，提取所有 Gherkin 场景，每个场景对应至少一个用例点 UC-D-xxx

2. **逐场景派生**：对每个 Gherkin 场景，按格式模板产出用例点：
   - 原样复制 Gherkin 到"产品故事溯源"段（不得改写）
   - 根据 `api-contracts.md`（或前端路由/页面结构）填写执行锚点
   - 填写执行步骤与断言表
   - 填写 Given/When/Then 覆盖映射（每个 G/W/T 都要有对应步骤 ✓）

3. **派生自检（强制，不通过阻塞）**：

   | 检查项 | 判定 | 不通过处理 |
   |---|---|---|
   | 覆盖性 | 每个产品 Gherkin 场景都有对应 UC-D？ | 🔴 补派生 |
   | 锚点存在 | type/endpoint/page 已填？ | 🔴 补锚点 |
   | GWT 映射完整 | Given/When/Then 覆盖映射无空缺？ | 🔴 补步骤 |
   | 宽泛暴露 | 场景拆不出单步执行步骤？ | 回退步骤 4，带具体问题找产品补场景 |
   | 技术可行 | Gherkin 期望能否按字面实现？ | 不可行→status=blocked，记回执，列待产品决策 |

4. **技术可行性回执**：派生时发现某产品场景技术上无法按 Gherkin 期望实现，**不得默默改用例期望**：
   - 该 UC-D 标 `status: blocked`
   - 在 UC-D 文件加"技术可行性回执"段：原产品期望、技术约束、建议方案
   - 汇总到 `test-cases/_index.md` 的"待产品决策清单"
   - 由产品裁决：降预期 / 换方案 / 砍掉

5. **产出汇总**：生成 `test-cases/_index.md`：

```markdown
# 测试用例点汇总

## 用例清单
| UC-D | 标题 | 故事 | type | priority | status |
|---|---|---|---|---|---|
| UC-D-001 | {标题} | US-001 | api | P0 | ready |
| UC-D-002 | {标题} | US-001 | e2e | P1 | blocked |

## 待产品决策清单
- UC-D-002: 技术不可行，原期望 {X}，约束 {Y}，建议 {Z} → [待产品裁决]
```

## 禁止行为

- ❌ 派生时改写产品故事的 Gherkin 语义（改了就是"开发盖产品"）
- ❌ 跳过 GWT 覆盖映射（缺映射的对账无法校验）
- ❌ 技术不可行时默默改用例期望结果（必须走回执）
- ❌ blocked 的 UC-D 不上报、直接当 ready
```

---

### 改动 7：`steering/change-request-process.md` — 扩触发条件

**意图**：开发实现期发现与产品故事偏离时强制走 CR，禁止开发版故事独立存在。

**找到**：CR1 章节开头这句：
```
**触发条件**：意图路由判定为"变更已有功能"
```

**替换为**：
```markdown
**触发条件**（任一即触发）：
1. 意图路由判定为"变更已有功能"
2. **实现期偏离触发**（Construction 阶段）：开发在 TDD/审查/对账过程中发现实现与产品用户故事（Gherkin）不一致

### 实现期偏离的三种情况

| 情况 | 表现 | 处理 |
|---|---|---|
| A. 实现 < 产品故事 | 开发漏了或简化了产品故事的某个 Given/Then | 不是演化，是 bug。回 Construction 补实现，不走 CR |
| B. 实现 > 产品故事 | 开发多做了产品故事未要求的功能 | ⚠️ 触发 CR。开发不得默默保留：产品确认要→CR4.1 回写产品故事；不要→删除多余实现 |
| C. 实现 ≠ 产品故事 | 开发改了产品意图（如接口语义变了、Then 的业务结果变了） | 🔴 触发 CR（按高影响处理）。开发必须说明：原产品故事说 X，实现成了 Y，原因 Z。产品决策：接受 Y→回写；改回 X→返工 |

### 实现期偏离的核心纪律

**禁止产出独立的"开发版用户故事/需求"**。任何与产品故事的偏离，唯一合法出口是走 CR 回写产品版——产品版始终是唯一真相。

回写时（CR4.1）的额外要求：
- 回写后的产品故事**必须符合 Gherkin 格式**（见 `inception-user-stories.md` 验收标准格式要求），不得回写成自由文字
- 回写后，受影响 UC-D 的"产品故事溯源"段必须同步更新（原样复制新 Gherkin）
- 回写记录追加到 UC-D 文件的"派生日志"段，注明 CR 编号、变更原因、产品批准
```

---

## 四、整条防线落点

```
步骤 4  inception-user-stories.md（改动 2）
  └─ Gherkin 格式要求 + AI 辅助转化
       ↓ 产品故事（结构化、可映射）

步骤 6.5  test-case-derivation.md（改动 6，独立路由步骤）
  └─ 基线校验 + 派生 UC-D + 自检（覆盖/锚点/GWT/宽泛/可行）+ 技术回执
       ↓ 可执行用例 UC-D（带执行锚点）

Construction  construction-tdd.md（改动 4）+ construction-code-review.md（改动 5）
  ├─ @TestCaseId 铁律（测试必须带标记）
  ├─ 对账① 设计覆盖（功能设计阶段）
  └─ 对账② 测试映射（全局审查门禁 + 校验脚本辅助）
       ↓ 未裁决差异=0 才完成

CR  change-request-process.md（改动 7）
  └─ 实现期偏离触发 CR，禁止开发版故事，回写产品版
       ↓ 偏离显式留痕，产品版保真

Operations  测试执行 skill（按项目技术栈选择）
  ├─ loeyae-boot-framework 项目：loeyae-service-testing（loeyae-mcp 提供）
  ├─ 其他项目：自定义测试执行 skill
  └─ 消费 UC-D 执行，用例 fail = 真实交付缺口
```

## 五、改动文件总览

| 文件 | 改动类型 | 作用 |
|---|---|---|
| `skills/aidlc-inception/SKILL.md` | 改路由表 | 加步骤 6.5 独立路由（改动 1） |
| `steering/inception-user-stories.md` | 加章节 | Gherkin 格式要求 + AI 辅助转化（改动 2） |
| `steering/inception-application-design.md` | 加过渡提示 | 步骤 10 后提示进入 6.5（改动 3） |
| `steering/construction-tdd.md` | 加铁律 | @TestCaseId 标记（改动 4） |
| `steering/construction-code-review.md` | 加审查项 | Spec 轴加用例覆盖 + 全局审查加对账①② + 校验脚本（改动 5） |
| `steering/test-case-derivation.md` | 新增文件 | 步骤 6.5 完整规范：基线规则 + 派生流程 + 格式 + 自检（改动 6） |
| `steering/change-request-process.md` | 扩触发条件 | 实现期偏离触发 CR + 三种情况分类（改动 7） |

## 六、与 AIDLC 自身规范的合规说明

| AIDLC 规范 | 本提案合规方式 |
|---|---|
| **渐进式披露** | 步骤 6.5 详情在独立文件 `test-case-derivation.md`，路由表仅一行引用；`inception-application-design.md` 只有 3 行过渡提示 |
| **简洁高效** | 每个文件只加与自身职责相关的内容：user-stories 加格式要求，tdd 加溯源铁律，code-review 加对账项 |
| **防幻觉** | 对账②配备机器校验脚本参考实现，不纯依赖 LLM 自检；烂基线自检时明确要求"回退步骤 4 问产品"而非假设 |
| **上下文即代码** | 所有规则落入 .md 文件，无口头约定 |
| **自适应流程** | 步骤 6.5 条件为"步骤 6 已执行"，未执行应用设计的轻量任务自动跳过；文件组织方式可按项目规模选择 |
| **会话延续** | 步骤 6.5 产出写入固定路径 `test-cases/`，state.md 可记录派生进度，支持跨会话恢复 |

## 七、后续（不在本轮范围）

- **MCP 对账校验 skill**：提供 test-cases 格式校验、@TestCaseId 覆盖率统计等机器校验能力，将改动 5 的参考脚本升级为精确的 AST 级校验
- **测试执行 skill 集成**：测试执行 skill 消费 `_index.md` 自动编排测试执行，失败自动关联 UC-D 产出缺口报告。loeyae-boot-framework 项目使用 `loeyae-service-testing`（loeyae-mcp 提供），其他项目按技术栈配置自定义 skill
