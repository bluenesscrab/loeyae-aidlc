# 后端最佳实践与快速开始

本文件整合开发最佳实践和新项目初始化指南。分层架构、异常处理、事务、日志等基础规范见 `common-tech-backend.md`。

---

## 条件判断

### 使用 Decide 替代 if-else

```java
// ❌ 传统写法
if (user != null) {
    return user.getName();
} else {
    return "未知";
}

// ✅ Decide 写法
return Decide.nonNull(user)
    .map(User::getName)
    .mapOrElseMap("未知");
```

### 使用 OptionalUtil 替代 if-null

```java
// ❌ 传统写法
if (user != null) {
    user.setName(name);
}

// ✅ OptionalUtil 写法
OptionalUtil.isNotNullWithout(user, () -> user.setName(name));
```

---

## 数据查询

### 分页查询

```java
// Service 层 — 继承 BaseServiceExtImpl 后自动获得
public PageResult<UserView> page(UserPageQuery query) {
    return super.page(query);
}
```

### 关联查询

```java
// 使用 MPJLambdaWrapper
public List<UserOrgView> listWithOrg() {
    MPJLambdaWrapper<User> wrapper = new MPJLambdaWrapper<>();
    wrapper.selectAll(User.class)
           .select(Org::getName, Org::getCode)
           .leftJoin(Org.class, Org::getId, User::getOrgId);
    return baseRepository.selectJoinList(UserOrgView.class, wrapper);
}
```

---

## 缓存使用

### 自定义缓存

```java
@Component
public class UserCache extends BaseCache<Long, User, CacheSetting> {
    public UserCache(CacheSetting config, RedissonClient client) {
        super(config, client);
    }
}
```

### 使用缓存

```java
userCache.set(userId, user);        // 设置
User user = userCache.get(userId);  // 获取
userCache.remove(userId);           // 删除
userCache.removeAll();              // 清空
```

### 缓存热点数据模式

```java
public User getUser(Long id) {
    User user = userCache.get(id);
    if (user == null) {
        user = userRepository.getById(id);
        if (user != null) {
            userCache.set(id, user);
        }
    }
    return user;
}
```

---

## 消息队列

### 定义消息

```java
@Data
public class OrderMessage extends AbstractKafkaMessage {
    private Long orderId;
    private String orderNo;

    @Override
    public String getTopic() {
        return "order-topic";
    }
}
```

### 发送消息

```java
@Autowired
private KafkaMessageSendService kafkaMessageSendService;

public void sendOrderMessage(Order order) {
    OrderMessage message = new OrderMessage();
    message.setOrderId(order.getId());
    message.setOrderNo(order.getOrderNo());
    kafkaMessageSendService.send(message);
}
```

### 消费消息

```java
@Component
public class OrderMessageConsumer extends AbstractKafkaMessageConsumer<OrderMessage> {
    @Override
    protected void consume(OrderMessage message) {
        // 处理消息
    }
}
```

---

## 定时任务

### 定义任务

```java
@Component
public class SyncUserJob implements JobHandler {
    @Override
    public void execute(JobExecutionContext context) {
        // 任务逻辑
    }
}
```

### 动态管理任务

```java
@Autowired
private SchedulerManagerService schedulerManagerService;

schedulerManagerService.createJob(jobName, cron, jobClassName, description);  // 创建
schedulerManagerService.pauseJob(jobName);   // 暂停
schedulerManagerService.resumeJob(jobName);  // 恢复
schedulerManagerService.deleteJob(jobName);  // 删除
```

---

## 性能优化

### 批量操作

```java
// ❌ 循环单条插入
for (User user : users) {
    userRepository.save(user);
}

// ✅ 批量插入
userRepository.saveBatch(users);
```

### 懒加载关联

```java
userRepository.lambdaQueryPlus()
    .bindField(User::getOrgId, Org::getName)  // 自动关联查询
    .list();
```

---

## 安全实践

### 敏感数据加密

```java
@TableField(typeHandler = CryptoTypeHandler.class)
@Crypto(model = CryptoModel.AES)
private String idCard;
```

### 接口签名

```java
@Signature
@PostMapping("/payment")
public ApiResult<Void> payment(@RequestBody PaymentRequest request) {
    // 自动验证签名
}
```

### 数据权限

```java
@DataPermission(table = "sys_user", conditionField = "org_id", type = DataPermissionMode.ORG)
public List<User> listUsers() {
    // 自动添加数据权限条件
}
```

---

## 代码审查清单

### 提交前检查

- [ ] 代码编译通过
- [ ] 单元测试通过
- [ ] 无 LSP 错误
- [ ] 遵循命名规范
- [ ] 无硬编码
- [ ] 无敏感信息
- [ ] 异常处理正确
- [ ] 日志打印规范
- [ ] 注释完整

### 功能检查

- [ ] 功能符合需求
- [ ] 边界条件处理
- [ ] 空值处理
- [ ] 并发安全
- [ ] 事务正确
- [ ] 性能可接受

---

## 常见问题

### Q: 如何获取当前登录用户？

```java
@CurrentUser AuthUser user  // 注入
SecurityUtil.getUserId()     // 工具类
AuthUtils.getLoginUser()     // 工具类
```

### Q: 如何实现软删除？

Entity 继承框架的 Entity 基类，框架自动处理 `deleted` 字段。

### Q: 如何实现多租户？

Entity 添加 `tenant_id` 字段，框架自动注入租户条件。

### Q: 如何自定义 API 前缀？

Controller 放在 `controller.admin` 包下自动添加 `/api/admin` 前缀。

### Q: 如何跳过认证？

使用 `@Pass` 注解。

---

# 快速开始指南

## 环境要求

| 依赖 | 版本 |
|------|------|
| JDK | 21+ |
| Maven | 3.8+ |
| MySQL | 8.0+ |
| Redis | 6.0+ |

## 项目初始化

### 1. 添加父POM

```xml
<parent>
    <groupId>com.loeyae.boot</groupId>
    <artifactId>loeyae-boot</artifactId>
    <version>3.0.3-SNAPSHOT</version>
</parent>
```

### 2. 引入BOM

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.loeyae.boot</groupId>
            <artifactId>loeyae-boot-bom</artifactId>
            <version>${revision}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 3. 添加核心依赖

```xml
<dependencies>
    <dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter</artifactId></dependency>
    <dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-mybatis</artifactId></dependency>
    <dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-security</artifactId></dependency>
    <dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-cache</artifactId></dependency>
    <dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-swagger</artifactId></dependency>
</dependencies>
```

## CRUD 模块目录结构

```
com.loeyae.dev.module.user/
├── controller/
│   └── admin/
│       └── AdminUserController.java
├── service/
│   ├── IUserService.java
│   └── impl/
│       └── UserServiceImpl.java
├── dal/
│   ├── entity/
│   │   └── User.java
│   └── mapper/
│       └── UserMapper.java
├── repository/
│   ├── UserRepository.java
│   └── impl/
│       └── UserRepositoryImpl.java
└── material/
    ├── convert/
    │   └── UserConvert.java
    ├── dto/
    │   ├── UserCreate.java
    │   ├── UserUpdate.java
    │   └── UserQuery.java
    └── vo/
        ├── UserView.java
        └── UserDetail.java
```

## CRUD 完整示例

### Entity

```java
@Data
@TableName("sys_user")
@Schema(description = "用户")
public class User extends Entity {
    @Schema(description = "用户名")
    private String name;

    @Schema(description = "账号")
    private String account;

    @Schema(description = "手机号")
    private String mobile;

    @Schema(description = "状态")
    private Integer status;

    @Schema(description = "租户ID")
    private Long tenantId;
}
```

### DTO/VO

```java
@Data
@Accessors(chain = true)
@Schema(description = "用户创建")
public class UserCreate {
    @NotBlank(groups = Insert.class)
    @Schema(description = "用户名")
    private String name;

    @NotBlank(groups = Insert.class)
    @Mobile
    @Schema(description = "手机号")
    private String mobile;
}

@Data
@Schema(description = "用户视图")
public class UserView {
    @Schema(description = "ID")
    private Long id;

    @Schema(description = "用户名")
    private String name;

    @Desensitize(type = DesensitizeType.MOBILE)
    @Schema(description = "手机号")
    private String mobile;
}
```

### Convert → Mapper → Repository → Service → Controller

```java
// Convert
@Mapper
public interface UserConvert extends BaseConvert<User, UserView, UserDetail, UserCreate, UserUpdate> {
    UserConvert INSTANCE = Mappers.getMapper(UserConvert.class);
}

// Mapper
@Mapper
public interface UserMapper extends BaseMapperX<User> {}

// Repository
public interface UserRepository extends IBaseRepositoryX<User> {}

@Repository
public class UserRepositoryImpl extends BaseRepositoryX<User> implements UserRepository {}

// Service
public interface IUserService extends IBaseService<UserView, UserDetail, UserCreate, UserUpdate, UserQuery, UserPageQuery, Long> {}

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl extends BaseServiceExtImpl<UserRepository, UserConvert, User, UserView, UserDetail, UserCreate, UserUpdate, UserQuery, UserPageQuery, Long> implements IUserService {}

// Controller
@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "用户管理")
public class AdminUserController {
    private final IUserService userService;

    @PostMapping
    @Operation(summary = "创建用户")
    public ApiResult<UserView> create(@RequestBody @Validated(Insert.class) UserCreate create) {
        return ApiResult.ok(userService.create(create));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新用户")
    public ApiResult<UserView> update(@PathVariable Long id, @RequestBody @Validated(Update.class) UserUpdate update) {
        return ApiResult.ok(userService.update(id, update));
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取用户详情")
    public ApiResult<UserDetail> get(@PathVariable Long id) {
        return ApiResult.ok(userService.get(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户")
    public ApiResult<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ApiResult.ok();
    }

    @GetMapping
    @Operation(summary = "用户列表")
    public ApiResult<List<UserView>> list(UserQuery query) {
        return ApiResult.ok(userService.all(query));
    }

    @GetMapping("/page")
    @Operation(summary = "用户分页")
    public ApiResult<PageResult<UserView>> page(UserPageQuery query) {
        return ApiResult.ok(userService.page(query));
    }
}
```

## 配置文件

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
  data:
    redis:
      host: localhost
      port: 6379

mybatis-plus:
  mapper-locations: classpath*:mapper/**/*.xml
  configuration:
    map-underscore-to-camel-case: true

loeyae:
  security:
    token-header: Authorization
    secret: your-secret-key
  cache:
    type: redis
```

## 启动类

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```
