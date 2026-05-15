# 后端编码规范

**适用范围**：仅适用于 Java 项目且引用了 Loeyae Boot Framework。非 Loeyae Boot 项目请按通用 Spring Boot 规范编码。

**MCP Skill 对照**：本文件提供精简速查规则，详细 API 和完整代码模板通过 MCP Skill 按需获取（参见 `construction-code-generation.md` 的加载策略）。

## 注解 (MUST)

- Controller: `@RestController` `@RequestMapping` `@RequiredArgsConstructor` `@Tag`
- Service: `@Service` `@RequiredArgsConstructor` `@Slf4j`
- Entity: `@Data` `@TableName` `@Schema`
- DTO: `@Data` `@Accessors(chain = true)` `@Schema` + 验证注解

## 异常 (MUST)

使用 `AssertUtil.notNull/notBlank(obj, ErrorCode)` 断言，错误码实现 `IErrorCode`（9位: 模块3+项目3+错误3）。

## 事务 (MUST)

写: `@Transactional(rollbackFor = Exception.class)` | 读: `@Transactional(readOnly = true)`

## 日志 (MUST)

使用 `@Slf4j`，占位符格式 `log.info("msg, key: {}", val)`，error 带异常对象。

## 分层规范 (MUST)

### Controller 层
- 只做参数校验（`ValidateUtil.validateEntity`）和委托调用，禁止业务逻辑
- 返回值必须使用定义好的 VO，禁止 `Map<String, Object>`
- 多参数必须使用定义好的 DTO，禁止 `Map<String, Object>` 或多 `@RequestParam`

### Service 层
- 业务逻辑全部在 Service 实现类中
- 返回值使用 VO，内部可使用引擎原生对象

### DTO/VO 规范
- 分页查询参数必须继承 `PageParam`，禁止散参数 `pageNo/pageSize`
- 多参数查询必须定义为 Query DTO

### Convert 层
- 实体转换必须在 `material/convert/` 中使用 MapStruct 定义
- Convert 接口使用 `@Mapper` + `INSTANCE = Mappers.getMapper(...)` 模式
- 禁止在 Controller/Service 中手写对象转换


## 低代码模块规范 (MUST - 仅低代码项目)

### 适用条件
- 项目引入了 `loeyae-spring-boot-starter-lowcode`
- state.md 中 `低代码模式 = 是`

### 核心概念
- **数据模型**：通过可视化定义表结构，自动生成 Entity/Mapper/Repository
- **流程编排**：使用 LiteFlow EL 表达式定义业务流程
- **页面设计**：使用 AMIS JSON Schema 定义前端页面
- **Groovy 脚本**：在流程节点中编写自定义逻辑

### 分层规范
- 数据模型层：通过低代码平台管理，禁止手动创建 Entity
- 流程层：使用 LiteFlow 组件，禁止在 Service 中硬编码流程逻辑
- 页面层：使用 AMIS Schema，禁止手写 Vue 页面（除非自定义组件）
- 自定义组件：放在 `components/` 目录，遵循 LiteFlow 组件规范

### MCP Skill 参考
低代码详细规范通过以下 MCP Skill 获取：
- `loeyae-lowcode-getting-started` — 入门教程
- `loeyae-lowcode-crud-template` — CRUD 模板
- `loeyae-lowcode-flow` — 流程编排
- `loeyae-lowcode-groovy` — Groovy 脚本
- `loeyae-lowcode-amis` — AMIS 页面
- `loeyae-lowcode-component-dev` — 组件开发
- `loeyae-lowcode-api-integration` — API 对接
- `loeyae-lowcode-best-practices` — 最佳实践
