# U-C06-CROSS-SERVICE-TESTS cross-service-tests 需求切片

- **unit_id / service_id**：`U-C06-CROSS-SERVICE-TESTS` / `test-suite`
- **source_ref**：[`requirements.full.md`](requirements.full.md)
- **主归属 FR**：`ADLC-FR-013`
- **状态**：设计/静态生成；测试执行 blocked/未验证

## ADLC-FR-013 真实项目端到端验收（主归属，Must）

首期必须与 Provider 使用两个真实脱敏项目完成角色化正式文档闭环：项目包含代表性沟通资料与多个不可变修订；覆盖目标项目读取授权、固定修订/片段、历史内容恢复后的引用不漂移、写入成功/失败零泄露、滥用与主体级/项目级配额、成本归属、风险提示、通知、申诉、隔离处置和审计。还必须覆盖批准的 Provider/Consumer 版本组合，并验证 Kiro、Claude Code、OpenCode 只经 Core 使用 Provider、不得直连。所有结果必须有稳定运行标识、真实命令和受控报告位置；缺少任一证据时整体保持未验证。

```gherkin
Scenario: 双项目与三平台 Core 边界闭合
  Given 两个真实项目、受控认证主体、批准的 Provider/Consumer 组合及三平台入口均已准备
  When 经 Core 验证目标项目读取、固定引用、零泄露结果、滥用治理和历史内容恢复
  Then 三个平台均不得直连 Provider，读取与派生保持目标项目隔离，旧引用不漂移，且治理证据缺失时整体仍为未验证
```

## 相关 NFR 与约束

U-C06-CROSS-SERVICE-TESTS 聚合验证 `ADLC-NFR-001`—`008`，但不得修改生产逻辑或新增 Consumer 独立业务项目写入逻辑。执行前必须闭合环境、API 别名、身份、Owner、运行依赖、两个项目、命令、报告位置、版本组合、阈值和 Secret 注入 12 个锚点；当前登记 `0/12`，因此 44 个 UC-D 全部继续 blocked，I14 静态生成不能替代测试证据。
