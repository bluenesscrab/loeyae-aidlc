# 后端编码规范

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
