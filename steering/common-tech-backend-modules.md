# Loeyae Boot Framework — 模块索引

groupId: `com.loeyae.boot`，版本由父POM管理无需指定。

**适用范围**：仅适用于 Java 项目且引用了 Loeyae Boot Framework（state.md 中 `后端框架 = Loeyae Boot`）。

详细API参考: cache/tactic/security/message/flowable/job/mail 见对应 MCP Skill。

---

## 模块选型决策树

根据业务场景选择需要引入的模块：

```
项目启动
├─ 所有项目必须引入 → 最小依赖（starter + web + mybatis）
├─ 需要用户认证？ → + security
├─ 需要 API 文档？ → + swagger
├─ 需要缓存？ → + cache
├─ 需要数据字典？ → + dict
├─ 需要接口幂等/限流/分布式锁？ → + tactic
├─ 需要数据脱敏？ → + desensitize
├─ 需要接口签名验证？ → + signature
├─ 需要定时任务？ → + job（扩展模块）
├─ 需要邮件发送？ → + mail（扩展模块）
├─ 需要消息队列？ → + message + 选择实现（kafka/rabbit/redis）
├─ 需要消息审计？ → + message-audit（扩展模块）
├─ 需要数据变更审计？ → + mybatis-audit（扩展模块）
├─ 需要服务间调用？ → + feign（扩展模块）
├─ 需要许可证验证？ → + license（扩展模块）
├─ 需要 CMS 多站点？ → + cms（扩展模块）
├─ 需要工作流？ → + flowable 系列
└─ 需要低代码？ → + lowcode 系列
```

### 场景速查

| 场景 | 推荐模块组合 |
|------|-------------|
| 简单 CRUD 后台 | 最小依赖 + security + swagger + cache |
| 标准业务系统 | 标准Web应用 + dict + tactic + desensitize |
| 微服务节点 | 标准Web应用 + feign + message + message-audit |
| 审计合规系统 | 标准业务系统 + mybatis-audit + signature |
| 低代码平台 | 标准Web应用 + lowcode 系列 |
| 内容管理系统 | 标准Web应用 + cms |

---

## 核心模块 (loeyae-boot)

版本: `${loeyae-boot.version}`

| artifactId | 说明 | 核心类/接口 |
|------------|------|------------|
| loeyae-common | 通用工具、Entity、ApiResult、异常体系 | `ApiResult`, `AuthUser`, `PageParam`, `PageResult`, `AssertUtil`, `ValidateUtil`, `SecurityUtil`, `Decide`, `OptionalUtil` |
| loeyae-spring-boot-starter | 全局异常处理、国际化、Jackson、线程池 | `GlobalExceptionHandler`, `I18nMessageUtils` |
| loeyae-spring-boot-starter-web | 统一响应、XSS/CSRF防护、CORS、TraceId | `ApiResultWrapper`, `XssFilter`, `CsrfFilter` |
| loeyae-spring-boot-starter-mybatis | IBaseService、IBaseRepository、多租户、数据权限、分页 | `IBaseService<V,D,C,U,Q,P,S>`, `IBaseRepositoryX<T>`, `BaseServiceExtImpl`, `BaseConvert`, `BaseMapperX`, `@DataPermission`, `@Crypto` |
| loeyae-spring-boot-starter-security | JWT认证、RBAC权限、会话管理 | `JwtAuthenticationFilter`, `AuthorizeRequestsCustomizer`, `AuthUtils`, `@CurrentUser`, `@Pass` |
| loeyae-spring-boot-starter-cache | BaseCache抽象、Redis、Caffeine、二级缓存 | `BaseCache<K,V,C>`, `TwoLevelCache`, `RedisService`, `CacheSetting` |
| loeyae-spring-boot-starter-swagger | Knife4j API文档 | `Knife4jConfiguration` |
| loeyae-spring-boot-starter-tactic | 幂等、分布式锁、限流 | `@Idempotent`, `@RateLimiter`, `@Lock4j` |
| loeyae-spring-boot-starter-dict | 数据字典 | `DictFrameworkUtils`, `@DictContains`, `@DictFormat` |
| loeyae-spring-boot-starter-desensitize | 数据脱敏 | `@MobileDesensitize`, `@IdCardDesensitize` |
| loeyae-spring-boot-starter-signature | 接口签名验证 | `@Signature` |
| loeyae-spring-boot-starter-test | 测试工具 | `@FakerField`, `RedisTestConfiguration`, `SqlInitializationTestConfiguration` |
| loeyae-spring-boot-starter-banner | 启动Banner | - |
| loeyae-spring-boot-starter-maintain | 系统审计 | - |

---

## 扩展模块 (loeyae-boot-extensions)

版本: `${loeyae-boot-extensions.version}`

| artifactId | 说明 | 核心类/接口 |
|------------|------|------------|
| loeyae-spring-boot-starter-cms | 多站点CMS、Thymeleaf模板、静态化 | `@CmsController`, `SiteContextHolder`, `SiteFrameworkService`, `CmsTemplateEngin` |
| loeyae-spring-boot-starter-feign | Feign服务间调用、认证透传、签名、日志审计 | `AuthHeaderInterceptor`, `SignatureInterceptor`, `FeignLogFrameworkService` |
| loeyae-spring-boot-starter-job | Quartz定时任务、动态任务管理 | `JobHandler`, `SchedulerManagerService`, `JobLogInternalService`, `CronUtils` |
| loeyae-spring-boot-starter-license | 许可证验证 | `BootLicenseFilter`, `LicenseProperties` |
| loeyae-spring-boot-starter-mail | 邮件发送 | `MailSenderService`, `MailDto`, `MailAsyncSendFactory` |
| loeyae-spring-boot-starter-message | 消息队列统一抽象 | `MessageDto`, `AbstractStreamMessage`, `MessageConsumerInterceptor`, `MessageProducerInterceptor` |
| loeyae-spring-boot-starter-message-audit | 消息审计 | `MqMessageLogFrameworkService`, `MessageQueueLogDto`, `MqMessageStatus` |
| loeyae-spring-boot-starter-message-kafka | Kafka消息实现 | `AbstractKafkaMessage`, `AbstractKafkaMessageConsumer`, `KafkaMessageSendService` |
| loeyae-spring-boot-starter-message-rabbit | RabbitMQ消息实现 | `AbstractRabbitMessage`, `AbstractRabbitMessageConsumer`, `RabbitMessageSendService` |
| loeyae-spring-boot-starter-message-redis | Redis Stream消息实现 | `AbstractRedisStreamMessage`, `RedisStreamSendService` |
| loeyae-spring-boot-starter-mybatis-audit | 数据审计（变更快照） | `@AuditLog`, `AuditLogFrameworkService`, `DataMetaAuditLogInterceptor` |

---

## 工作流模块 (loeyae-boot-flowable)

版本: `${loeyae-boot-flowable.version}`

| artifactId | 说明 | 核心类/接口 |
|------------|------|------------|
| loeyae-spring-boot-flowable-api | 工作流API定义 | 流程定义、任务操作API |
| loeyae-spring-boot-flowable | 工作流核心实现 | Flowable集成、流程引擎配置 |
| loeyae-spring-boot-flowable-editor | 流程设计器 | 在线流程设计、BPMN编辑 |
| loeyae-spring-boot-starter-flowable | 工作流Starter | 自动配置、一键引入 |

---

## 低代码模块 (loeyae-boot-lowcode)

版本: `${loeyae-boot-lowcode.version}`

| artifactId | 说明 | 核心类/接口 |
|------------|------|------------|
| loeyae-spring-boot-lowcode | 低代码核心 | LiteFlow流程编排、动态表单 |
| loeyae-spring-boot-lowcode-page-editor | 页面设计器 | 可视化页面搭建、组件拖拽 |
| loeyae-spring-boot-lowcode-script-editor | 脚本编辑器 | Monaco Editor集成、代码提示 |
| loeyae-spring-boot-starter-lowcode | 低代码Starter | 自动配置、插件扩展点 |

---

## 依赖组合

### 最小依赖

```xml
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter</artifactId></dependency>
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-web</artifactId></dependency>
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-mybatis</artifactId></dependency>
```

### 标准Web应用（在最小依赖基础上加）

```xml
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-security</artifactId></dependency>
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-cache</artifactId></dependency>
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-swagger</artifactId></dependency>
```

### 微服务应用（加Feign和消息队列）

```xml
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-feign</artifactId></dependency>
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-message</artifactId></dependency>
<!-- 选择一种消息实现 -->
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-message-kafka</artifactId></dependency>
```

### 完整业务应用

```xml
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-dict</artifactId></dependency>
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-job</artifactId></dependency>
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-mail</artifactId></dependency>
<dependency><groupId>com.loeyae.boot</groupId><artifactId>loeyae-spring-boot-starter-mybatis-audit</artifactId></dependency>
```

---

## 版本管理

所有版本由 `loeyae-boot-bom` 统一管理，在父POM中引入：

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
