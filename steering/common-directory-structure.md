# 目录结构规范

**职责**：定义 AI-DLC 过程产物的位置。应用代码结构由目标项目现有约定和技术栈决定，本流程不另建平行代码目录。

## 通用规则

- 应用代码、测试和部署配置位于工作区正常项目结构中，不放入 `docs/aidlc/`。
- AI-DLC 需求、设计、计划、审计和报告仅放入 `docs/aidlc/`。
- `docs/aidlc/state.md` 是三平台唯一恢复状态源。
- 未执行的条件步骤不创建空目录或占位文件。
- 系统基线只保存索引、关系和证据引用，不复制 Secret、完整机器契约或外部平台数据。
- 多模块项目只加载当前模块产物、产品级契约和相关系统基线切片。

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
