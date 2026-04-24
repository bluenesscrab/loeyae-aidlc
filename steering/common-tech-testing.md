# 测试规范

---

## 测试框架

- **JUnit 5**: 测试框架
- **Mockito 4.11.0**: Mock框架
- **Spring Boot Test**: 集成测试支持
- **DataFaker 2.5.4**: 测试数据生成

---

## 测试类命名规范

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 单元测试 | `{Class}Test` | `UserServiceTest` |
| 集成测试 | `{Class}IntegrationTest` | `UserControllerIntegrationTest` |
| Repository测试 | `{Entity}RepositoryTest` | `UserRepositoryTest` |

---

## 测试配置

### Redis 测试配置

```java
@SpringBootTest
@Import(RedisTestConfiguration.class)
class UserServiceTest {
    // 自动使用内嵌 Redis
}
```

### SQL 初始化配置

```java
@SpringBootTest
@SqlInitializationTestConfiguration(scripts = "classpath:sql/init-data.sql")
class UserRepositoryTest {
    // 自动执行初始化SQL
}
```

### 组合配置

```java
@SpringBootTest
@Import({RedisTestConfiguration.class})
@SqlInitializationTestConfiguration(scripts = "classpath:sql/test-data.sql")
class OrderServiceIntegrationTest {
    // 完整测试环境
}
```

---

## 测试数据生成

### @FakerField 注解

用于自动生成测试数据：

```java
@Data
public class UserCreate {
    @FakerField(type = FakerFieldType.NAME)
    private String name;

    @FakerField(type = FakerFieldType.MOBILE)
    private String mobile;

    @FakerField(type = FakerFieldType.EMAIL)
    private String email;

    @FakerField(type = FakerFieldType.ID_CARD)
    private String idCard;

    @FakerField(type = FakerFieldType.AGE, value = "18-60")
    private Integer age;
}
```

### FakerFieldType 类型

| 类型 | 说明 | 示例值 |
|------|------|--------|
| `NAME` | 中文姓名 | 张三 |
| `MOBILE` | 手机号 | 13812345678 |
| `EMAIL` | 邮箱 | test@example.com |
| `ID_CARD` | 身份证号 | 110101199001011234 |
| `AGE` | 年龄 | 25 |
| `ADDRESS` | 地址 | 北京市朝阳区 |
| `COMPANY` | 公司名 | 测试科技有限公司 |
| `DATE` | 日期 | 2024-01-15 |
| `DATETIME` | 日期时间 | 2024-01-15 10:30:00 |
| `NUMBER` | 数字 | 12345 |
| `UUID` | UUID | 550e8400-e29b-41d4-a716-446655440000 |

### 使用 FakerField 生成数据

```java
@Test
void testCreateUser() {
    UserCreate create = FakerFieldUtils.generate(UserCreate.class);
    // create 已填充随机测试数据
    userService.create(create);
}
```

---

## 单元测试规范

### Service 层测试

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserConvert userConvert;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    @DisplayName("创建用户 - 成功")
    void create_success() {
        // Given
        UserCreate create = new UserCreate();
        create.setName("张三");
        create.setMobile("13812345678");

        User entity = new User();
        entity.setId(1L);
        entity.setName("张三");

        when(userConvert.convertCreate(any())).thenReturn(entity);
        when(userRepository.save(any())).thenReturn(true);
        when(userConvert.convert2View(any())).thenReturn(new UserView());

        // When
        UserView result = userService.create(create);

        // Then
        assertNotNull(result);
        verify(userRepository).save(any());
    }

    @Test
    @DisplayName("创建用户 - 手机号已存在")
    void create_mobileExists() {
        // Given
        UserCreate create = new UserCreate();
        create.setMobile("13812345678");

        when(userRepository.existsByMobile("13812345678")).thenReturn(true);

        // When & Then
        assertThrows(GlobalException.class, () -> userService.create(create));
    }
}
```

### 测试方法命名

使用 `@DisplayName` 描述测试场景：

```java
@Test
@DisplayName("场景描述")
void testMethodName_scenario() {
    // ...
}
```

---

## 集成测试规范

### Controller 集成测试

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/admin/user/{id} - 成功")
    void getById_success() throws Exception {
        mockMvc.perform(get("/api/admin/user/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(0))
            .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("POST /api/admin/user - 创建成功")
    void create_success() throws Exception {
        UserCreate create = new UserCreate();
        create.setName("张三");
        create.setMobile("13812345678");

        mockMvc.perform(post("/api/admin/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(create)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(0));
    }
}
```

### 带认证的集成测试

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class UserControllerAuthTest {

    @Autowired
    private MockMvc mockMvc;

    private String token;

    @BeforeEach
    void setUp() {
        // 登录获取token
        token = "Bearer " + loginAndGetToken();
    }

    @Test
    @DisplayName("需要认证的接口")
    void authenticatedEndpoint() throws Exception {
        mockMvc.perform(get("/api/admin/user/me")
                .header("Authorization", token))
            .andExpect(status().isOk());
    }
}
```

---

## 测试覆盖要求

| 层级 | 最低覆盖率 | 说明 |
|------|-----------|------|
| Service | 80% | 业务逻辑核心 |
| Controller | 70% | 接口层 |
| Repository | 60% | 数据访问层 |
| Util | 90% | 工具类 |
| Convert | 50% | MapStruct生成 |

---

## 测试原则

### 必须遵守

1. **测试不通过，任务不完成**
2. **禁止跳过失败测试** - 不使用 `@Disabled` 逃避问题
3. **禁止改断言"通过"测试** - 断言失败说明代码有问题
4. **测试数据独立** - 不依赖其他测试的数据
5. **测试可重复执行** - 多次执行结果一致

### 测试结构 (AAA模式)

```java
@Test
void testMethod() {
    // Arrange (Given) - 准备测试数据
    User user = new User();
    user.setName("张三");

    // Act (When) - 执行被测方法
    UserView result = userService.create(user);

    // Assert (Then) - 验证结果
    assertNotNull(result);
    assertEquals("张三", result.getName());
}
```

---

## Mock 规范

### 何时使用 Mock

| 场景 | 是否Mock |
|------|---------|
| 外部服务调用 | 是 |
| 数据库操作（单元测试） | 是 |
| 时间相关 | 是 |
| 文件系统 | 是 |
| 内部业务逻辑 | 否 |

### Mock 示例

```java
// Mock 返回值
when(repository.findById(1L)).thenReturn(Optional.of(user));

// Mock 抛异常
when(repository.save(any())).thenThrow(new RuntimeException("DB Error"));

// Mock 无返回值方法
doNothing().when(service).sendEmail(any());

// 验证调用
verify(repository, times(1)).save(any());
verify(repository, never()).delete(any());
```

---

## 参数化测试

```java
@ParameterizedTest
@ValueSource(strings = {"13812345678", "15912345678", "18612345678"})
@DisplayName("手机号格式验证 - 有效")
void mobileValid(String mobile) {
    assertTrue(MobileValidator.isValid(mobile));
}

@ParameterizedTest
@CsvSource({
    "张三, 13812345678",
    "李四, 15912345678"
})
@DisplayName("创建用户 - 参数化")
void create_multipleUsers(String name, String mobile) {
    UserCreate create = new UserCreate();
    create.setName(name);
    create.setMobile(mobile);
    // ...
}
```

---

## 测试工具类

### Podam (POJO数据生成)

```java
PodamFactory podam = new PodamFactoryImpl();
User user = podam.manufacturePojo(User.class);
```

### AssertJ (流式断言)

```java
assertThat(result)
    .isNotNull()
    .extracting("name", "mobile")
    .containsExactly("张三", "13812345678");
```

---

## 持续集成

测试在 CI/CD 流水线中自动执行：

```yaml
# .gitlab-ci.yml 示例
test:
  stage: test
  script:
    - mvn test
  coverage: '/Total.*?([0-9]{1,3})%/'
```

覆盖率报告通过 JaCoCo 生成，低于阈值则构建失败。
