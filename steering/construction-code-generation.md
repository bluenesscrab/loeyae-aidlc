# 代码生成 - 详细步骤

## 概述
此阶段通过两个集成部分为每个工作单元生成代码：
- **第一部分 - 规划**：创建详细的代码生成计划，包含明确步骤
- **第二部分 - 生成**：执行批准的计划生成代码、测试和产物

**注意**：对于存量项目，"生成"意味着在适当时修改现有文件，而非创建副本。

## 前置条件
- 该单元的单元设计生成必须完成
- NFR 实现（如已执行）必须完成
- 所有单元设计产物必须可用
- 单元已准备好进行代码生成

---

# 第一部分：规划

## 步骤 1：分析单元上下文
- [ ] 读取单元设计生成的设计产物
- [ ] 读取单元故事映射以理解分配的故事
- [ ] 识别单元依赖和接口
- [ ] 验证单元已准备好进行代码生成

## 步骤 2：MCP Skill 加载策略

> ⚠️ **强制 — 不可跳过**
>
> 无论用户选择何种执行速度（快速推进、跳过 TDD、口头确认计划等），MCP Skill 加载**绝对不可跳过**。
>
> **为什么**：Skill 定义了框架的编码规范、注解用法、模块结构和测试基类。跳过 Skill 加载意味着生成的代码"能编译但不符合团队规范"——这比编译失败更危险，因为问题会隐藏到代码审查甚至生产环境才暴露。
>
> **最低加载要求**：
> - 快速模式：使用 `get_skill_summary` 获取精简规范
> - 完整模式：使用 `get_skill_content` 获取完整规范
>
> **验证检查点**（加载完成后必须确认）：
> - [ ] 至少加载了 1 个与当前单元业务相关的 Skill（如 CRUD、认证、缓存等）
> - [ ] 已确认测试基类选择（BaseMockitoUnitTest / BaseDbUnitTest 等）
> - [ ] 已确认异常处理方式（错误码定义 + 断言工具）
>
> 如果以上任一项未满足，停止代码生成并补充加载。

### 前置条件检查

在加载任何 `loeyae-*` MCP Skill 之前，必须：
1. 从 `docs/aidlc/state.md` 读取 `后端框架` 字段
2. **仅当 `后端框架 = Loeyae Boot` 时**，才执行下方的 MCP Skill 加载
3. 如果 `后端框架 ≠ Loeyae Boot`，跳过所有 `loeyae-*` skill 调用，按项目自身规范或通用 Spring Boot 规范生成代码

### Fallback 策略

如果 MCP 服务不可达（调用超时或返回错误）：
1. 使用 steering 文件中的精简规范作为替代：
   - `common-tech-backend.md` — 核心编码规范
   - `common-tech-backend-annotations.md` — 注解与工具类速查
   - `common-tech-backend-modules.md` — 模块索引与依赖组合
   - `common-tech-backend-practices.md` — 最佳实践与快速开始
2. 在代码生成计划中标注"MCP 不可达，使用本地规范"
3. 生成代码后建议用户在 MCP 恢复后重新验证

### 后端代码（Loeyae Boot 项目）

在创建代码生成计划时，根据代码类型识别需要的 skill：

1. 加载 common-tech-backend.md（后端编码规范）
2. 根据代码类型调用 MCP skill：

#### 核心业务开发
| 代码类型 | MCP Skill | 说明 |
|---------|-----------|------|
| CRUD 模块 | `get_skill_summary("loeyae-crud")` | 完整 CRUD 代码模板 |
| 认证授权 | `get_skill_summary("loeyae-auth")` | JWT、RBAC、会话管理 |
| 参数校验 | `get_skill_summary("loeyae-validation")` | 自定义校验注解 |
| 异常处理 | `get_skill_summary("loeyae-error-handling")` | 错误码、断言工具 |
| 数据访问 | `get_skill_summary("loeyae-data-access")` | Repository、查询构建 |
| Web 基础设施 | `get_skill_summary("loeyae-web-infra")` | 统一响应、过滤器 |
| 数据安全 | `get_skill_summary("loeyae-data-security")` | 加密、脱敏、签名 |
| 数据字典 | `get_skill_summary("loeyae-dict")` | 字典注解、字典工具 |

#### 基础设施能力
| 代码类型 | MCP Skill | 说明 |
|---------|-----------|------|
| 缓存 | `get_skill_summary("loeyae-cache")` | BaseCache、二级缓存 |
| 消息队列 | `get_skill_summary("loeyae-message")` | 消息抽象、发送/消费 |
| 消息审计 | `get_skill_summary("loeyae-message-audit")` | 消息日志、状态追踪 |
| 定时任务 | `get_skill_summary("loeyae-job")` | JobHandler、动态管理 |
| 邮件 | `get_skill_summary("loeyae-mail")` | 邮件发送、模板 |
| 服务间调用 | `get_skill_summary("loeyae-feign")` | Feign、认证透传 |
| 许可证 | `get_skill_summary("loeyae-license")` | 许可证验证集成 |
| CMS | `get_skill_summary("loeyae-cms")` | 多站点、模板引擎 |
| 数据变更审计 | `get_skill_summary("loeyae-mybatis-audit")` | 变更快照、审计日志 |

#### 工具类与模式
| 代码类型 | MCP Skill | 说明 |
|---------|-----------|------|
| 通用工具类 | `get_skill_summary("loeyae-utils")` | JsonTool、CollectionUtils 等 |
| 条件判断（Decide） | `get_skill_summary("loeyae-decide")` | 链式 if-else 替代 |
| 条件执行（OptionalUtil） | `get_skill_summary("loeyae-optional-util")` | if-null 替代 |
| 测试 | `get_skill_summary("loeyae-test")` | 测试工具、Mock 配置 |
| 框架模块选型 | `get_skill_summary("loeyae-framework-modules")` | 模块索引、依赖组合 |
| 数据库设计 | `get_skill_summary("loeyae-database-design")` | 表设计、DDL 模板 |

#### 低代码开发（仅 state.md 中 `低代码模式 = 是`）
| 代码类型 | MCP Skill | 说明 |
|---------|-----------|------|
| 低代码入门 | `get_skill_summary("loeyae-lowcode-getting-started")` | 快速上手教程 |
| CRUD 模板 | `get_skill_summary("loeyae-lowcode-crud-template")` | 数据模型+流程+页面 |
| 流程编排 | `get_skill_summary("loeyae-lowcode-flow")` | LiteFlow EL 表达式 |
| Groovy 脚本 | `get_skill_summary("loeyae-lowcode-groovy")` | 脚本开发规范 |
| AMIS 页面 | `get_skill_summary("loeyae-lowcode-amis")` | 页面 JSON Schema |
| 组件开发 | `get_skill_summary("loeyae-lowcode-component-dev")` | 自定义组件 |
| API 对接 | `get_skill_summary("loeyae-lowcode-api-integration")` | 接口路径、响应格式 |
| 低代码最佳实践 | `get_skill_summary("loeyae-lowcode-best-practices")` | 集成模式、故障排查 |

#### 搜索兜底
- 不确定用哪个 skill 时 → `search_skill("关键词")`

3. 加载 common-tech-security.md（安全编码规范）
4. 加载 common-database-design.md（数据库设计规范）
5. 读取项目 `.kiro/steering/structure.md`（项目结构，如存在）
6. 读取项目 `.kiro/steering/tech.md`（技术栈版本，如存在）

### 后端代码（非 Loeyae Boot 项目）

如果 state.md 中 `后端框架 ≠ Loeyae Boot`：
1. 不调用任何 `loeyae-*` MCP Skill
2. 加载 common-tech-security.md（安全编码规范，通用部分仍适用）
3. 加载 common-database-design.md（数据库设计规范，通用部分仍适用）
4. 读取项目 `.kiro/steering/structure.md`（项目结构，如存在）
5. 读取项目 `.kiro/steering/tech.md`（技术栈版本，如存在）
6. 按项目自身代码风格和框架约定生成代码

### 前端代码
1. PC端项目，加载 common-tech-frontend-pc.md，微信小程序&APP项目，加载 common-tech-frontend-uniapp.md（前端编码规范）
2. 如有 Figma 设计稿 → 加载 common-figma-design-standards.md
3. 读取项目 `.kiro/steering/structure.md`（前端目录结构，如存在）

### 测试代码
1. 加载 common-tech-testing.md（测试规范）
2. 后端测试 → `get_skill_summary("loeyae-test")`

> ⚠️ **测试代码强制规则**（不可跳过，快速模式同样适用）
>
> 编写测试前必须加载 `loeyae-test` 的 summary，确认以下规范：
> - Mockito 单元测试**必须继承** `BaseMockitoUnitTest` — 禁止裸写 `@ExtendWith(MockitoExtension.class)`
> - 使用 `RandomUtils.randomPojo()` 生成测试数据 — 禁止手动 new 对象逐字段赋值
> - 使用 `AssertUtils.assertServiceException()` 验证业务异常 — 禁止 try-catch 手动断言
> - **禁止** `mockStatic(SecurityUtil.class)` — 使用框架提供的 `MockUtils.mockLoginUser()` 替代
>
> **为什么**：手写 mock 和断言不仅代码量大，还会在框架升级时批量失效。使用框架工具类意味着升级时只需改一处。

## 步骤 2.5：快速模式 vs 完整模式边界定义

当用户表达"快速推进"、"跳过不必要的步骤"、"简化流程"等意图时，进入快速模式。快速模式**不是**跳过所有步骤，而是对步骤进行分级处理。

### 可以简化的步骤

| 步骤 | 完整模式 | 快速模式 | 简化方式 |
|------|----------|----------|----------|
| 代码生成计划 | 写入文档并等待审批 | 口头确认即可 | 向用户展示摘要，用户说"继续"即视为批准 |
| TDD 严格度 | 严格 RED-GREEN-REFACTOR | 可先代码后测试 | 但测试必须在同一交互中完成，不可拖延 |
| 代码审查 | 两阶段独立审查 | 合并为单次审查 | 规格合规 + 代码质量一次性检查 |
| 审计日志 | 详细记录每步 | 简化为关键节点 | 仅记录开始、完成、关键决策 |

### 绝对不能跳过的步骤

| 步骤 | 原因 |
|------|------|
| MCP Skill 加载 | 跳过 = 代码不符合框架规范，后续全部返工 |
| 测试编写 | 跳过 = 无法验证正确性，bug 隐藏到生产环境 |
| 编译验证 | 跳过 = 可能交付无法运行的代码 |
| 框架规范遵循 | 跳过 = 技术债累积，团队协作成本上升 |
| 测试基类使用 | 跳过 = 框架升级时测试批量失效 |

### 判断标准

**一句话原则**：如果跳过某步骤会导致"代码能跑但不符合团队规范"，则该步骤不可跳过。

**快速模式的正确理解**：
- ✅ 减少文档仪式感（口头确认代替书面审批）
- ✅ 合并可合并的审查步骤
- ✅ 调整 TDD 顺序（先代码后测试）
- ❌ 跳过规范加载
- ❌ 省略测试
- ❌ 不验证编译
- ❌ 忽略框架工具类

**时间压力下的正确响应是缩小范围（少做几个功能），而非跳步（做了但做错）。**

## 步骤 3：创建详细单元代码生成计划
- [ ] 从 `docs/aidlc/state.md` 读取工作区根目录和项目类型
- [ ] 确定代码位置（参见关键规则的结构模式）
- [ ] **仅存量项目**：审查逆向工程 code-structure.md 了解需修改的现有文件
- [ ] 记录确切路径（绝对不在 docs/aidlc/ 中）
- [ ] 为单元生成创建明确步骤：

### 后端单元步骤模板
  - 项目结构设置（仅全新项目）
  - 业务逻辑生成
  - 业务逻辑单元测试
  - 业务逻辑摘要
  - API 层生成
  - API 层单元测试
  - API 层摘要
  - 数据访问层生成
  - 数据访问层单元测试
  - 数据访问层摘要
  - 数据库迁移脚本（如有数据模型）
  - 文档生成（API 文档、README 更新）
  - 部署产物生成

### 前端单元步骤模板
  - 类型定义（types/）— API 接口类型
  - API 接口定义（api/）— 调用后端接口
  - Store 定义（store/）— Pinia 状态管理
  - 页面组件（views/）— 页面级组件
  - 业务组件（views/components/）— 页面内子组件
  - 路由配置（router/modules/）— 路由注册
  - 国际化（locales/）— 翻译文件

- [ ] 按顺序编号每个步骤
- [ ] 包含故事映射引用
- [ ] 为每个步骤添加复选框 [ ]

## 步骤 4：包含单元生成上下文
- [ ] 对此单元，包含：
  - 此单元实现的故事
  - 对其他单元/服务的依赖
  - 预期接口和契约
  - 此单元拥有的数据库实体
  - 服务边界和职责

## 步骤 5：创建单元计划文档
- [ ] 将完整计划保存为 `docs/aidlc/construction/plans/{unit-name}-code-generation-plan.md`
- [ ] 包含步骤编号（步骤 1、步骤 2 等）
- [ ] 包含单元上下文和依赖
- [ ] 包含故事可追溯性
- [ ] 确保计划可逐步执行
- [ ] 强调此计划是代码生成的唯一真实来源

## 步骤 6：总结单元计划
- [ ] 向用户提供单元代码生成计划的摘要
- [ ] 突出单元生成方式
- [ ] 解释步骤顺序和故事覆盖
- [ ] 注明总步骤数和预估范围

## 步骤 7：记录审批提示
- [ ] 在请求审批前，在 `docs/aidlc/audit.md` 中记录提示及时间戳
- [ ] 包含对完整单元代码生成计划的引用
- [ ] 使用 ISO 8601 时间戳格式

## 步骤 8：等待明确审批
- [ ] 在用户明确审批前不得继续
- [ ] 审批必须覆盖整个计划和生成顺序
- [ ] 如用户请求修改，更新计划并重复审批流程

## 步骤 9：记录审批回复
- [ ] 在 `docs/aidlc/audit.md` 中记录用户的审批回复及时间戳
- [ ] 包含用户的确切回复文本
- [ ] 清晰标记审批状态

## 步骤 10：更新进度
- [ ] 在 `state.md` 中标记代码规划完成
- [ ] 更新"当前状态"部分
- [ ] 准备过渡到代码生成

---

# 第二部分：生成

## 步骤 11：加载单元代码生成计划
- [ ] 从 `docs/aidlc/construction/plans/{unit-name}-code-generation-plan.md` 读取完整计划
- [ ] 识别下一个未完成的步骤（第一个 [ ] 复选框）
- [ ] 加载该步骤的上下文（单元、依赖、故事）

## 步骤 12：执行当前步骤
- [ ] 验证计划中的目标目录（绝对不在 docs/aidlc/ 中）
- [ ] **仅存量项目**：检查目标文件是否存在
- [ ] 精确生成当前步骤描述的内容：
  - **如果文件存在**：就地修改（绝不创建 `ClassName_modified.java`、`ClassName_new.java` 等）
  - **如果文件不存在**：创建新文件
- [ ] 写入正确位置：
  - **应用代码**：按项目结构写入工作区根目录
  - **文档**：`docs/aidlc/construction/{unit-name}/code/`（仅 markdown）
  - **构建/配置文件**：工作区根目录
- [ ] 遵循单元故事需求
- [ ] 尊重依赖和接口

## 步骤 13：更新进度
- [ ] 在单元代码生成计划中将已完成步骤标记为 [x]
- [ ] 当故事的生成完成时，将关联的单元故事标记为 [x]
- [ ] 更新 `docs/aidlc/state.md` 当前状态
- [ ] **仅存量项目**：验证未创建重复文件（如 `ClassName_modified.java` 与 `ClassName.java` 并存）
- [ ] 保存所有生成的产物

## 步骤 14：继续或完成生成
- [ ] 如果还有步骤，返回步骤 11
- [ ] 如果所有步骤完成，进入展示完成消息

## 步骤 15：展示完成消息
- 按以下结构展示完成消息：
     1. **完成公告**（强制）：始终以此开头：

```markdown
# 💻 代码生成完成 - [unit-name]
```

     2. **AI 摘要**（可选）：提供结构化要点摘要
        - **存量项目**：区分修改 vs 创建的文件（如"• 修改：`src/services/user-service.ts`"、"• 创建：`src/services/auth-service.ts`"）
        - **全新项目**：列出创建的文件及路径（如"• 创建：`src/services/user-service.ts`"）
        - 列出测试、文档、部署产物及路径
        - 保持事实性，无工作流指令
     3. **格式化工作流消息**（强制）：始终以此格式结尾：

```markdown
> **📋 <u>**需要审查：**</u>**
> 请检查生成的代码：
> - **应用代码**：`[实际工作区路径]`
> - **文档**：`docs/aidlc/construction/[unit-name]/code/`



> **🚀 <u>**下一步？**</u>**
>
> **你可以：**
>
> 🔧 **请求修改** - 根据审查结果要求修改生成的代码
> ✅ **继续下一阶段** - 确认代码生成，进入**[下一单元/构建和测试]**
> 📋 **新 Session 继续** - 复制 `state.md` 中的交接提示词到新对话继续

---
```

## 步骤 16：等待明确审批
- 在用户明确审批前不得继续
- 审批必须清晰且无歧义
- 如用户请求修改，更新代码并重复审批流程

## 步骤 17：记录审批并更新进度
- 在 audit.md 中记录审批及时间戳
- 记录用户的审批回复及时间戳
- 在 state.md 中标记此单元的代码生成阶段完成

---

## 代码生成强制规则

- 禁止在代码中留下 TODO、FIXME 或占位符
- 所有功能必须实现到位，不得省略或跳过
- 如果某部分无法实现，必须明确告知用户原因并提出替代方案

## 关键规则

### 代码位置规则
- **应用代码**：仅在工作区根目录（绝不在 docs/aidlc/ 中）
- **文档**：仅在 docs/aidlc/（markdown 摘要）
- 生成代码前从 state.md **读取工作区根目录**

**按项目类型的结构模式**：
- **存量项目**：使用现有结构（如 `src/main/java/`、`lib/`、`pkg/`）
- **全新单单元项目**：工作区根目录下 `src/`、`tests/`、`config/`
- **全新多单元（微服务）**：`{unit-name}/src/`、`{unit-name}/tests/`
- **全新多单元（单体）**：`src/{unit-name}/`、`tests/{unit-name}/`

### 存量项目文件修改规则
- 生成前检查文件是否存在
- 如果存在：就地修改（绝不创建副本如 `ClassName_modified.java`）
- 如果不存在：创建新文件
- 生成后验证无重复文件（步骤 13）

### 规划阶段规则
- 为所有生成活动创建明确的编号步骤
- 在计划中包含故事可追溯性
- 记录单元上下文和依赖
- 在生成前获取用户明确审批

### 生成阶段规则
- **无硬编码逻辑**：仅执行单元计划中写的内容
- **严格遵循计划**：不偏离步骤顺序
- **更新复选框**：完成每个步骤后立即标记 [x]
- **故事可追溯性**：功能实现后标记单元故事 [x]
- **尊重依赖**：仅在单元依赖满足时实现

## 完成标准
- 完整的单元代码生成计划已创建并获批
- 单元代码生成计划中所有步骤已标记 [x]
- 所有单元故事已按计划实现
- 所有代码和测试已生成（测试将在构建和测试阶段执行）
- 部署产物已生成
- 完整单元已准备好进行构建和验证
