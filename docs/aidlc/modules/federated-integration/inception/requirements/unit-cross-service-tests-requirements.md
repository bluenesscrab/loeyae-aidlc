# U-C06-CROSS-SERVICE-TESTS cross-service-tests 需求切片

- **unit_id / service_id**：`U-C06-CROSS-SERVICE-TESTS` / `test-suite`
- **source_ref**：[`requirements.full.md`](requirements.full.md)
- **主归属 FR**：`ADLC-FR-013`
- **状态**：设计/静态生成；测试执行 blocked/未验证

## ADLC-FR-013 真实项目端到端验收（主归属，Must）

首期必须与 Provider 使用真实脱敏项目完成角色化正式文档闭环：项目至少包含三类代表性沟通资料和两个以上修订；覆盖自动选择、显式包含/排除/旧版、索引降级、人工修订、固定片段引用、章节血缘、逆向说明 Git 关联、Legacy 零调用及 Kiro/Claude/OpenCode 业务语义一致。还需第二项目验证隔离。所有结果必须有稳定运行标识、固定版本矩阵、真实命令和受控报告位置；缺少 Provider、Legacy、conformance、权限隔离或 E2E 任一证据时，整体保持未验证。

```gherkin
Given 一个真实项目包含至少三类资料、两个以上修订并已配置 SSOT
When 分别通过受支持客户端执行资料选择、上下文、正式文档生成和血缘回写
Then 实际选择和固定引用可复现，平台差异不改变业务语义；缺少运行标识或 Provider 证据时不得标记端到端通过
```

## 相关 NFR 与约束

U-C06-CROSS-SERVICE-TESTS 聚合验证 `ADLC-NFR-001`—`008`，但不得修改生产逻辑。执行前必须闭合环境、API 别名、身份、Owner、运行依赖、两个项目、命令、报告位置、版本矩阵、阈值和 Secret 注入 12 个锚点；当前登记 `0/12`，因此 44 个 UC-D 全部继续 blocked，I14 静态生成不能替代测试证据。
