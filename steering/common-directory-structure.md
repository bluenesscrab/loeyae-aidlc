# 目录结构规范

**职责**：定义 AI-DLC 过程产物的位置。应用代码结构由目标项目现有约定和技术栈决定，本流程不另建平行代码目录。

## 通用规则

- 应用代码、测试和部署配置位于工作区正常项目结构中，不放入 `docs/aidlc/`。
- AI-DLC 需求、设计、计划、审计和报告仅放入 `docs/aidlc/`。
- `docs/aidlc/state.md` 是三平台唯一恢复状态源。
- 未执行的条件步骤不创建空目录或占位文件。
- 多模块项目只加载当前模块产物和产品级契约，不加载无关模块。

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
    │   └── decision-summary.md
    ├── modules/
    │   └── <module-name>/
    │       ├── inception/
    │       └── construction/
    └── operations/
```

## 多模块规则

- 产品边界和跨模块接口只在 `product/contracts.md` 定义。
- 模块级 Inception/Construction 结构与单模块对应阶段一致。
- Operations 是项目级部署准备；只有独立部署模块明确需要单独交付时，才在其模块目录生成部署补充说明。
- 切换模块前先更新 state.md 的活跃模块、当前步骤和下一步交接。
