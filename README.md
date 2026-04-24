# Loeyae AI-DLC Power

基于 AI-DLC 方法论的团队开发工作流，覆盖需求分析、架构设计、代码生成和测试，集成 Loeyae Boot Framework 编码规范和 Vue 3 前端规范。

## 快速开始

在 Kiro 中安装本 Power 后，使用以下方式激活：

```
使用 AI-DLC，[描述你的开发需求]
```

## 当前架构

```
Inception（规划） → Construction（实现）
```

- **Inception**：需求分析、用户故事、架构设计（做什么、为什么做）
- **Construction**：功能设计、代码生成、构建测试（怎么做）

## 恢复 Operations 阶段

当前工作流为两阶段架构（Inception → Construction），Operations 阶段已预留但未启用。如果未来需要将运维阶段纳入工作流，按以下步骤操作：

### 1. 扩展 operations-operations.md

`steering/operations-operations.md` 是运维阶段的占位文件，需要补充完整的执行步骤，建议包含：

```markdown
# 运维阶段（Operations）

## 部署规划
- 环境配置（dev/staging/prod）
- 部署策略（蓝绿部署、滚动更新、金丝雀发布）
- 回滚方案

## 监控与可观测性
- 日志收集与聚合
- 指标监控（APM、基础设施指标）
- 告警规则配置
- 链路追踪

## 事件响应
- 事件分级标准
- 响应流程与升级机制
- 事后复盘模板

## 维护与支持
- 定期维护窗口
- 数据备份与恢复
- 安全补丁更新流程

## 生产就绪检查清单
- [ ] 性能压测通过
- [ ] 安全扫描通过
- [ ] 监控告警配置完成
- [ ] 回滚方案验证
- [ ] 文档更新完成
```

### 2. 修改 core-workflow.md

在 `steering/core-workflow.md` 中添加 Operations 阶段：

**a) 在顶部阶段概述中添加第三阶段：**

```markdown
## 自适应工作流原则
- **Inception（规划阶段）** — 做什么、为什么做
- **Construction（实现阶段）** — 怎么做
- **Operations（运维阶段）** — 如何运行和维护   ← 新增
```

**b) 在 Construction 阶段的"构建和测试"之后，添加 Operations 阶段定义：**

```markdown
# OPERATIONS 阶段

**目的**：部署、监控和维护

**聚焦**：如何运行和维护（HOW to operate）

**执行条件**：
- 需要部署到生产环境
- 需要配置监控和告警
- 需要制定维护计划

**跳过条件**：
- 纯本地开发/原型验证
- 无部署需求

**执行**：
1. 加载 `operations-operations.md` 的所有步骤
2. 执行部署规划
3. 配置监控与可观测性
4. 制定事件响应流程
5. 完成生产就绪检查清单
6. **等待明确批准** - 用户确认前不得继续
```

### 3. 更新相关文件

- **common-welcome-message.md**：将两阶段图更新为三阶段图
- **common-process-overview.md**：Mermaid 流程图中添加 Operations 节点
- **common-terminology.md**：添加 Operations 相关术语
- **POWER.md**：更新阶段描述和 steering 文件列表

### 4. 更新目录结构

在 `core-workflow.md` 的目录结构中添加：

```text
aidlc-docs/
├── inception/
├── construction/
└── operations/          ← 新增
    ├── deployment/
    ├── monitoring/
    └── checklists/
```
