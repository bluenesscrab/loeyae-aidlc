# 目录结构规范

**职责**：定义 AI-DLC 过程产物的位置。应用代码结构由目标项目现有约定和技术栈决定，本流程不另建平行代码目录。

## 通用规则

- 应用代码、测试和部署配置位于工作区正常项目结构中，不放入 `docs/aidlc/`。
- AI-DLC 需求、设计、计划、审计和报告仅放入 `docs/aidlc/`。
- `docs/aidlc/state.md` 是三平台唯一恢复状态源。
- 未执行的条件步骤不创建空目录或占位文件。
- 系统基线只保存索引、关系和证据引用，不复制 Secret、完整机器契约或外部平台数据。
- 多模块项目只加载当前模块产物、产品级契约和相关系统基线切片。

## 五类角色核心正式文档目录

以下映射冻结“正式研发文档写到哪里”，不创建按角色划分的平行目录，也不表示已存在独立角色模板：

| 角色 | 核心正式文档 | 既有目录 |
|------|--------------|----------|
| 产品经理 | PRD、产品/业务蓝图、画像与用户故事 | `<inception-root>/requirements/`、`<inception-root>/user-stories/` |
| 架构师 | 技术架构、关键技术说明与应用设计 | `<inception-root>/application-design/` |
| 项目经理 | 评估、计划、排期与风险建议 | `<inception-root>/plans/`、`<construction-root>/plans/` |
| 开发人员 | 开发设计、对接说明、逆向工程说明与单元实施记录 | `<inception-root>/reverse-engineering/`、`<inception-root>/application-design/`、`<construction-root>/<unit-name>/` |
| 测试人员 | 测试计划、用例与报告框架 | `<inception-root>/application-design/test-cases/`、`<construction-root>/build-and-test/` |

单模块的 `<inception-root>` 为 `docs/aidlc/inception`，多模块为 `docs/aidlc/modules/<module-name>/inception`；`<construction-root>` 同理。调研、会议和对接沟通等过程资料可由已配置 SSOT 权威管理，但正式文档正文和批准版本仍位于业务项目工作区/Git 或既有文档库。任务、人力、实际进度、测试执行、制品和部署结果仍以外部专业平台为准。

使用 SSOT 资料生成或修改正式文档时，文档必须记录实际资料修订/片段引用，并提供“资料版本/片段 → 正式文档章节”血缘入口；未配置 SSOT 的 Legacy 流程不产生额外远程调用。模板只在对应步骤实际执行时创建，当前目录映射不得表述为独立角色模板已存在或已验证。

## 系统基线根目录

| 架构 | `<system-baseline-root>` |
|------|--------------------------|
| 单模块 | `docs/aidlc/inception/system-baseline/` |
| 多模块/多服务 | `docs/aidlc/product/system-baseline/` |

仅在检测到分布式能力或外部运行时依赖时创建。可包含 `service-catalog.md`、`runtime-dependencies.md`、`external-systems.md`、`configuration-inventory.md`、`consistency-scenarios.md` 和 `customization-baseline.md`；实际文件按触发条件生成。

## 单模块结构

```text
<workspace>/
├── <project source and tests>
└── docs/aidlc/
    ├── state.md
    ├── audit-summary.md
    ├── inception/
    │   ├── plans/
    │   ├── reverse-engineering/
    │   ├── system-baseline/           # 条件
    │   ├── requirements/
    │   ├── user-stories/
    │   ├── ui-mock/
    │   └── application-design/
    │       ├── test-cases/
    │       ├── unit-of-work.md
    │       ├── unit-of-work-dependency.md
    │       └── unit-of-work-story-map.md
    ├── construction/
    │   ├── plans/
    │   ├── <unit-name>/
    │   ├── build-and-test/
    │   └── implementation-report.md
    └── operations/
        ├── plans/operations-plan.md
        ├── deployment-guide.md
        └── operations-summary.md
```

步骤的实际文件名由对应 steering 定义；本图只规定目录职责。

## 多模块结构

```text
<workspace>/
├── <project source and tests>
└── docs/aidlc/
    ├── state.md
    ├── audit-summary.md
    ├── product/
    │   ├── product-overview.md
    │   ├── modules.md
    │   ├── contracts.md
    │   ├── decision-summary.md
    │   └── system-baseline/           # 条件，产品级唯一维护
    ├── modules/
    │   └── <module-name>/
    │       ├── inception/
    │       └── construction/
    └── operations/
```

## 多模块规则

- 产品边界和跨边界契约索引只在 `product/contracts.md` 维护；完整机器契约留在项目既有事实来源。
- 服务目录和运行时关系只在产品级系统基线维护，模块级产物引用相关切片。
- 模块级 Inception/Construction 结构与单模块对应阶段一致，但不重复系统基线。
- Operations 是项目级部署准备；只有独立部署模块明确需要单独交付时，才在其模块目录生成部署补充说明。
- 切换模块前先更新 state.md 的活跃模块、活跃服务/单元、当前步骤、基线新鲜度和下一步交接。
