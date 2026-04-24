# 后端框架注解与工具类速查

本文件整合框架注解和工具类索引，按代码层级组织。编码时按需查阅。

完整 API 详见对应 MCP Skill：`loeyae-utils`、`loeyae-validation`、`loeyae-error-handling`、`loeyae-data-access`、`loeyae-data-security`。

---

## 常用工具类

| 工具类 | 包路径 | 用途 |
|--------|--------|------|
| `AssertUtil` | `c.l.b.common.utils` | 断言校验，失败抛 GlobalException |
| `ValidateUtil` | `c.l.b.common.utils` | Bean Validation 手动触发 |
| `SecurityUtil` | `c.l.b.common.utils` | 当前用户上下文 |
| `JsonTool` | `c.l.b.common.utils` | JSON序列化（Jackson+Hutool） |
| `CollectionUtils` | `c.l.b.common.utils` | 集合提取/过滤/转换 |
| `DateUtils` | `c.l.b.common.utils` | Date↔LocalDateTime互转 |
| `LocalDateTimeUtils` | `c.l.b.common.utils` | 时间计算/比较 |
| `JwtUtil` | `c.l.b.common.utils` | JWT Token编解码 |
| `ServletUtils` | `c.l.b.common.utils` | Web请求/响应操作 |
| `SecureUtil` | `c.l.b.common.utils` | MD5/SHA/AES/RSA加解密 |
| `LoeyaeBeanUtils` | `c.l.b.common.utils` | Bean复制/克隆 |
| `I18nMessageUtils` | `c.l.b.common.utils` | 国际化消息 |
| `CacheUtils` | `c.l.b.common.utils` | Guava Cache构建 |
| `OptionalUtil` | `c.l.b.common.utils` | 条件执行（if-null/if-boolean替代）→ skill: loeyae-optional-util |
| `Decide` | `c.l.b.common.utils` | 链式条件判断（if-else替代）→ skill: loeyae-decide |

---

## Controller 层注解

| 注解 | 位置 | 说明 |
|------|------|------|
| `@Pass` | 方法/类 | 免认证，用于登录/注册/公开接口 |
| `@CurrentUser AuthUser` | 参数 | 注入当前用户(id,account,name,tenantId,userType,recognition,orgIds,authRole,postIds,isSuper) |
| `@OperateLog` | 方法 | 自动记录操作日志（写操作） |
| `@LoginLog(userType, type)` | 方法 | 记录登录日志 |
| `@AuditLog` | 方法 | 审计日志 |
| `@RateLimiter(name, rate, rateInterval)` | 方法 | 限流，如 `rate=5, rateInterval="60s"` |
| `@Idempotent(timeout, message)` | 方法 | 幂等性保证 |
| `@Signature` | 方法 | 接口签名验证 |
| `@SecureRequestBody` | 参数 | 请求体解密 |
| `@SecureResponseBody` | 方法 | 响应体加密 |
| `@XssIgnore` | 方法/参数 | 跳过XSS过滤 |

`@Parameter(hidden = true)` 隐藏Swagger参数（用于@PathVariable和@CurrentUser）。

---

## Entity/Mapper 层注解

### Entity 自动填充（org.dromara.mpe.autofill.annotation）

| 注解 | 说明 |
|------|------|
| `@InsertFillData(AutoFillUserIdHandler.class)` | INSERT时填充用户ID |
| `@InsertUpdateFillData(AutoFillUserIdHandler.class)` | INSERT+UPDATE时填充用户ID |
| `@InsertFillTime` | INSERT时填充当前时间 |
| `@InsertUpdateFillTime` | INSERT+UPDATE时填充当前时间 |
| `@DefaultValue("1")` | 默认值 |
| `@FakerField(type, value)` | 测试数据生成 |

### MyBatis 注解

| 注解 | 位置 | 说明 |
|------|------|------|
| `@QueryMapper` | Mapper方法 | 自动解析Query DTO构建条件 |
| `@DataPermission(type)` | 方法/类 | 数据权限(ALL/DEPT/DEPT_AND_SUB/SELF/CUSTOM) |
| `@Crypto(model)` | Entity字段 | 字段加密(AES/RSA/SM2/SM4/BASE64) |

---

## DTO/VO 层规范

### 命名规范

| 类型 | 命名规则 | 说明 | 示例 |
|------|---------|------|------|
| Create DTO | `{Entity}Create` | 创建请求参数 | `UserCreate` |
| Update DTO | `{Entity}Update` | 更新请求参数 | `UserUpdate` |
| Query DTO | `{Entity}Query` | 查询条件参数 | `UserQuery` |
| PageQuery DTO | `{Entity}PageQuery` | 分页查询参数，继承 `PageParam` | `UserPageQuery` |
| View VO | `{Entity}View` | 列表展示对象 | `UserView` |
| Detail VO | `{Entity}Detail` | 详情展示对象 | `UserDetail` |

### 必须注解

```java
@Data
@Accessors(chain = true)  // 开启链式调用
@Schema(description = "...")  // Swagger文档
public class UserCreate {
    // 字段定义
}
```

### 验证注解（框架自定义）

| 注解 | 说明 | 示例 |
|------|------|------|
| `@Mobile` | 手机号格式 | `@Mobile String mobile` |
| `@Password` | 密码强度 | `@Password String password` |
| `@CreditCode` | 统一社会信用代码 | `@CreditCode String creditCode` |
| `@Exists(service)` | 存在性校验 | `@Exists(UserService.class) Long userId` |
| `@NoExists(service, column, exclude)` | 不存在校验 | `@NoExists(UserService.class, "account") String account` |
| `@EqualsTo(source, target)` | 字段相等 | `@EqualsTo("password", "confirmPassword")` |
| `@NonEqualsTo(source, target)` | 字段不等 | `@NonEqualsTo("newPassword", "oldPassword")` |
| `@EnumsContains(enums, property)` | 枚举包含 | `@EnumsContains(StatusEnum.class, "code")` |
| `@When(source, expr, target, type)` | 条件验证 | `@When("type", "='COMPANY'", "creditCode")` |
| `@NotBlank(required=false)` | 条件非空 | `@NotBlank(required = false)` |

### 验证分组

| 分组 | 使用场景 |
|------|---------|
| `Primary.class` | 主键校验（更新/删除） |
| `Insert.class` | 创建操作 |
| `Update.class` | 更新操作 |
| `Query.class` | 查询操作 |

---

## @QueryColumn（Query/PageQuery DTO用）

用于自动构建查询条件，标注在字段上：

| QueryMethod | SQL | 字段类型 | 示例 |
|-------------|-----|---------|------|
| `EQ` (默认) | `= ?` | 任意 | `@QueryColumn String name` |
| `NE` | `!= ?` | 任意 | `@QueryColumn(method = NE) String status` |
| `GT` / `GE` | `> ?` / `>= ?` | Number/Date | `@QueryColumn(method = GE) LocalDate startDate` |
| `LT` / `LE` | `< ?` / `<= ?` | Number/Date | `@QueryColumn(method = LE) LocalDate endDate` |
| `LIKE` | `LIKE '%?%'` | String | `@QueryColumn(method = LIKE) String keyword` |
| `LIKE_LEFT` | `LIKE '%?'` | String | 左模糊匹配 |
| `LIKE_RIGHT` | `LIKE '?%'` | String | 右模糊匹配 |
| `IN` | `IN (?)` | List | `@QueryColumn(method = IN) List<Long> ids` |
| `NOT_IN` | `NOT IN (?)` | List | `@QueryColumn(method = NOT_IN) List<Long> excludeIds` |
| `BETWEEN` | `BETWEEN ? AND ?` | List(2元素) | `@QueryColumn(method = BETWEEN) List<LocalDate> dateRange` |
| `IS_NULL` | `IS NULL` | - | 空值判断 |
| `IS_NOT_NULL` | `IS NOT NULL` | - | 非空判断 |
| `APPLY` | 自定义SQL | - | 复杂条件 |

属性：
- `column`: 指定数据库列名（当字段名与列名不一致时）
- `method`: 查询方法，默认 `EQ`

### JSON路径查询

`@JsonQueryColumn(path, method)` 用于JSON字段查询：

```java
@JsonQueryColumn(path = "$.address.city", method = LIKE)
private String city;
```

---

## 脱敏注解（VO用）

标注在VO字段上，返回数据时自动脱敏：

| 注解 | 效果 | 示例 |
|------|------|------|
| `@Desensitize(type=MOBILE)` | 138****1234 | 手机号 |
| `@Desensitize(type=EMAIL)` | a***@example.com | 邮箱 |
| `@Desensitize(type=ID_CARD)` | 110***********1234 | 身份证 |
| `@Desensitize(type=BANK_CARD)` | 6222****1234 | 银行卡 |
| `@Desensitize(type=NAME)` | 张* | 姓名 |
| `@Desensitize(type=ADDRESS)` | 北京市***区 | 地址 |

---

## Convert 规范

### BaseConvert 接口

所有Convert接口继承 `BaseConvert<E, V, D, C, U>`：

```java
@Mapper
public interface UserConvert extends BaseConvert<User, UserView, UserDetail, UserCreate, UserUpdate> {
    UserConvert INSTANCE = Mappers.getMapper(UserConvert.class);
}
```

### 泛型参数说明

| 参数 | 说明 |
|------|------|
| `E` | Entity 实体类 |
| `V` | View 视图对象 |
| `D` | Detail 详情对象 |
| `C` | Create 创建对象 |
| `U` | Update 更新对象 |

### 内置方法

| 方法 | 说明 |
|------|------|
| `convertCreate(C data)` | 创建DTO → Entity |
| `convertUpdate(U data)` | 更新DTO → Entity |
| `copyTo(U source, E target)` | 更新DTO属性复制到Entity |
| `convert2View(E data)` | Entity → View |
| `convert2Detail(E data)` | Entity → Detail |
| `convert2ViewList(List<E>)` | 批量转View |
| `convert2DetailList(List<E>)` | 批量转Detail |

### 使用规范

1. 禁止在Controller/Service中手写对象转换，必须使用Convert
2. Convert接口放在 `material/convert/` 目录
3. 复杂转换逻辑使用 `@AfterMapping` 注解

```java
@Mapper
public interface OrderConvert extends BaseConvert<Order, OrderView, OrderDetail, OrderCreate, OrderUpdate> {
    OrderConvert INSTANCE = Mappers.getMapper(OrderConvert.class);

    @AfterMapping
    default void afterMapping(@MappingTarget OrderView view, Order entity) {
        view.setStatusName(entity.getStatus().getDesc());
    }
}
```

---

## PageParam 分页参数

所有分页查询DTO必须继承 `PageParam`：

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class UserPageQuery extends PageParam {
    @QueryColumn(method = LIKE)
    private String name;

    @QueryColumn
    private Integer status;
}
```

`PageParam` 内置字段：
- `pageNo`: 页码（默认1）
- `pageSize`: 每页大小（默认10）
- `orderColumn`: 排序字段
- `orderDirection`: 排序方向（ASC/DESC）
