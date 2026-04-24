# 数据表设计规范

## 公用字段

所有业务表必须包含以下审计字段：

| 字段名 | 类型      | 必填 | 说明 | Entity 注解                                        |
|--------|---------|------|------|--------------------------------------------------|
| `id` | BIGINT  | 是 | 主键（自增或业务ID） | `@TableId(type = IdType.AUTO)`                   |
| `creator` | BIGINT  | 否 | 创建人 | `@InsertFillData(AutoFillUserIdHandler.class)`    |
| `modifier` | BIGINT  | 否 | 修改人 | `@InsertUpdateFillData(AutoFillUserIdHandler.class)` |
| `create_time` | DATETIME | 是 | 创建时间 | `@InsertFillTime`                                |
| `update_time` | DATETIME | 是 | 更新时间 | `@InsertUpdateFillTime`                          |
| `deleted` | BIT(1)  | 是 | 逻辑删除（0-未删除，1-已删除） | `@TableLogic` + `@DefaultValue("b'0'")`          |

### 可选公用字段

| 字段名 | 类型 | 场景    | 说明 |
|--------|------|-------|------|
| `tenant_id` | BIGINT | 多租户   | 租户ID，框架自动隔离 |
| `version` | INT | 乐观锁   | 版本号，`@Version` |
| `enabled` | TINYINT(1) | 启用状态  | 是否启用（0-禁用，1-启用） |
| `status` | TINYINT | 状态    | 业务状态 |
| `remark` | VARCHAR(500) | 备注    | 备注信息 |
| `create_by` | VARCHAR(100) | 创建人姓名 | `@InsertFillData(AutoFillUserNameHandler.class)` |
| `update_by` | VARCHAR(100) | 修改人姓名 | `@InsertUpdateFillData(AutoFillUserNameHandler.class)` |

## 命名规范

### 表名

- 使用小写字母和下划线分隔
- 格式：`{模块前缀}_{业务名称}`
- 示例：`lowcode_component`、`bpm_user_group`

### 字段名

- 使用小写字母和下划线分隔
- 示例：`create_time`、`component_name`

### 主键策略

| 类型 | 适用场景 | 示例 |
|------|---------|------|
| 自增 BIGINT | 通用业务表 | `id BIGINT AUTO_INCREMENT` |
| 业务 VARCHAR | 分布式、需要可读ID | `component_id VARCHAR(40)` |

## 索引规范

### 必须创建

```sql
PRIMARY KEY (`id`)
```

### 推荐创建

```sql
-- 唯一约束
UNIQUE KEY `uk_{字段名}` (`字段名`)

-- 普通索引
KEY `idx_{字段名}` (`字段名`)

-- 复合索引
KEY `idx_{字段1}_{字段2}` (`字段1`, `字段2`)
```

### 索引命名

| 类型 | 前缀 | 示例 |
|------|------|------|
| 主键 | `PRIMARY` | `PRIMARY KEY` |
| 唯一 | `uk_` | `uk_component_path` |
| 普通 | `idx_` | `idx_app_name` |

## Entity 模板

```java
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@FieldNameConstants
@TableName(value = "table_name", autoResultMap = true)
@Schema(name = "Entity对象", description = "表描述")
public class ExampleEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "主键ID")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @Schema(description = "业务字段")
    @TableField(value = "field_name")
    private String fieldName;

    @Schema(description = "状态")
    @TableField(value = "status")
    @DefaultValue("1")
    private Integer status;

    @Schema(description = "是否启用")
    @TableField(value = "enabled")
    @DefaultValue("1")
    private Boolean enabled;

    @Schema(description = "创建时间")
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    @InsertFillTime
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    @InsertUpdateFillTime
    private LocalDateTime updateTime;

    @Schema(description = "创建人")
    @TableField(value = "creator", fill = FieldFill.INSERT)
    @InsertFillData(AutoFillUserNameHandler.class)
    private String creator;

    @Schema(description = "修改人")
    @TableField(value = "modifier", fill = FieldFill.INSERT_UPDATE)
    @InsertFillData(AutoFillUserNameHandler.class)
    private String modifier;

    @Schema(description = "逻辑删除")
    @TableField(value = "deleted")
    @DefaultValue("b'0'")
    @TableLogic
    private Boolean deleted;

    // 字段常量
    public static final String FIELD_ID = "id";
    public static final String FIELD_STATUS = "status";
    // ...
}
```

## DDL 模板

```sql
CREATE TABLE IF NOT EXISTS `module_table_name` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `field_name` VARCHAR(100) NOT NULL COMMENT '字段说明',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态',
    `enabled` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `creator` VARCHAR(100) COMMENT '创建人',
    `modifier` VARCHAR(100) COMMENT '修改人',
    `deleted` BIT(1) NOT NULL DEFAULT b'0' COMMENT '逻辑删除标记',
    `remark` VARCHAR(500) COMMENT '备注',
    PRIMARY KEY (`id`),
    KEY `idx_status` (`status`),
    KEY `idx_enabled` (`enabled`),
    KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='表说明';
```

## 字段类型映射

| Java 类型 | MySQL 类型 | 说明 |
|-----------|-----------|------|
| Long | BIGINT | 主键、外键 |
| String | VARCHAR(n) | 短文本 |
| String | TEXT / LONGTEXT | 长文本、JSON |
| Integer | INT / TINYINT | 整数、状态 |
| Boolean | TINYINT(1) | 布尔 |
| BigDecimal | DECIMAL(p,s) | 金额、精度数值 |
| LocalDateTime | DATETIME | 时间 |
| LocalDate | DATE | 日期 |
