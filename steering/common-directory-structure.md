# 目录结构规范

定义 AI-DLC 工作流的文档和代码组织规则。

---

## 关键规则

- **应用代码**：工作区根目录（绝不放在 docs/ 中）
- **AIDLC 过程文档**：仅放在 docs/aidlc/
- **设计文档**：docs/specs/（与 cc-aidlc、oc-aidlc 共享）
- **实现计划**：docs/plans/（superpowers 写入）或 .sisyphus/plans/（Sisyphus 写入）
- **项目结构**：参见 `construction-code-generation.md` 了解各项目类型的模式
- **审计日志**：分段存储，audit-summary.md 为必加载的极简摘要
- **文档切片**：多单元项目在单元生成后按单元拆分产出物（参见 `common-token-management.md` 策略 E）

---

## 单模块模式

```text
<工作区根目录>/                      # ⚠️ 应用代码在这里
├── [项目特定结构]                   # 因项目而异（参见 code-generation.md）
│
├── docs/                           # 📄 文档根目录（三版本共享）
│   ├── specs/                      # 设计文档（cc-aidlc/oc-aidlc 共享）
│   │   └── YYYY-MM-DD-<topic>-design.md
│   ├── plans/                      # 实现计划（superpowers 写入）
│   │   └── YYYY-MM-DD-<feature>.md
│   └── aidlc/                      # AIDLC 过程文档
│       ├── inception/              # 🔵 INCEPTION 阶段
│       │   ├── plans/
│       │   ├── audit-inception.md
│       │   ├── reverse-engineering/
│       │   │   └── decision-summary.md
│       │   ├── requirements/
│       │   │   ├── index.md
│       │   │   ├── shared-requirements.md
│       │   │   ├── unit-{name}-requirements.md
│       │   │   └── decision-summary.md
│       │   ├── user-stories/
│       │   │   ├── index.md
│       │   │   ├── unit-{name}-stories.md
│       │   │   └── decision-summary.md
│       │   ├── ui-mock/
│       │   │   ├── platform-admin.html
│       │   │   ├── merchant-pc.html
│       │   │   ├── merchant-app.html
│       │   │   └── user-app.html
│       │   └── application-design/
│       │       ├── index.md
│       │       ├── shared-interfaces.md
│       │       ├── unit-{name}-design.md
│       │       ├── unit-of-work.md
│       │       ├── unit-of-work-dependency.md
│       │       ├── unit-of-work-story-map.md
│       │       └── decision-summary.md
│       ├── construction/           # 🟢 CONSTRUCTION 阶段
│       │   ├── plans/
│       │   ├── implementation-report.md
│       │   ├── audit-construction-{unit-name}.md
│       │   ├── {unit-name}/
│       │   │   ├── implementation-summary.md
│       │   │   ├── functional-design/
│       │   │   ├── nfr-requirements/
│       │   │   ├── nfr-design/
│       │   │   ├── infrastructure-design/
│       │   │   └── code/
│       │   └── build-and-test/
│       ├── operations/             # 🟠 OPERATIONS 阶段（条件）
│       │   ├── plans/
│       │   │   └── operations-plan.md
│       │   ├── audit-operations.md
│       │   ├── deployment-guide.md
│       │   └── operations-summary.md
│       ├── state.md
│       └── audit-summary.md
```

---

## 多模块模式

```text
<工作区根目录>/                      # ⚠️ 应用代码在这里
├── [项目特定结构]                   # 因项目而异
│
├── docs/                           # 📄 文档根目录
│   ├── specs/                      # 设计文档（共享）
│   ├── plans/                      # 实现计划（共享）
│   └── aidlc/                      # AIDLC 过程文档
│       ├── product/                # 🟣 产品级 Inception 产出物
│       │   ├── product-overview.md
│       │   ├── modules.md
│       │   ├── contracts.md
│       │   ├── decision-summary.md
│       │   └── audit-product.md
│       │
│       ├── modules/                # 各模块独立目录
│       │   ├── {module-name}/
│       │   │   ├── inception/      # 模块级 Inception（结构同单模块）
│       │   │   ├── construction/   # 模块级 Construction（结构同单模块）
│       │   │   └── audit-module.md
│       │   ├── base-infrastructure/
│       │   └── user-management/
│       │
│       ├── operations/             # 🟠 OPERATIONS（全局）
│       │   ├── plans/
│       │   │   └── operations-plan.md
│       │   ├── audit-operations.md
│       │   ├── deployment-guide.md
│       │   └── operations-summary.md
│       │
│       ├── state.md
│       └── audit-summary.md
```

---

## 多模块模式规则

- 产品级产出物放在 `docs/aidlc/product/`
- 各模块产出物放在 `docs/aidlc/modules/{module-name}/`
- 模块间只通过 `contracts.md` 交互，不直接引用其他模块的产出物
- 模块级的 inception/ 和 construction/ 结构与单模块模式完全一致
- 单模块模式自动退化：不创建 product/ 和 modules/ 目录
