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

## 执行锚点（本步骤填写）
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
