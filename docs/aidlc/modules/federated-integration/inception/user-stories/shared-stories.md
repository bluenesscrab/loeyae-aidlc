# Consumer 共享故事边界

- **source_ref**：[`stories.full.md`](stories.full.md)
- **状态**：设计/静态生成；运行 blocked/未验证

## 主归属规则

本模块没有跨单元共同主归属故事。`ADLC-US-001`—`ADLC-US-013` 各有且仅有一个主单元：U-C01-CORE-PROVIDER-CLIENT 主归属 003/010/011，U-C02-CORE-CONTEXT-DOCUMENT 主归属 001/002/004/005/006/007/008/012，U-C03-KIRO-ADAPTER 主归属 009，U-C06-CROSS-SERVICE-TESTS 主归属 013。U-C04-CLAUDE-ADAPTER/U-C05-OPENCODE-ADAPTER 仅协作 `ADLC-US-009`。

## 跨单元统一故事边界

1. SSOT Provider 的资料治理、解析/索引内部实现和 Portal 旅程不属于 Consumer 故事；Consumer 只引用八项契约，不复制字段 Schema。
2. Kiro、Claude Code、OpenCode 使用相同 Core 语义，平台适配只处理调用、短时凭据、Hook/入口和呈现差异，不形成独立业务项目属性或故事主线。
3. Legacy 项目保持 state v2 和八项契约零调用；失败不得伪造远端读取、引用、上传、血缘或同步成功。
4. Manifest、事件、远端 CR/impact、完整 Trace、state v3 和跨项目共享不属于现行故事。
5. 每个源 Scenario 的主归属随其故事；三平台协作可复用同一验收参数，但不得复制为三个主场景。

## 共同完成边界

- 每个有来源章节具有固定修订/片段引用，事实状态可辨识；正式正文仍由业务工作区/Git权威管理。
- 任务、进度、CI/测试、制品和部署结果缺稳定外部证据时保持未验证。
- 运行证据必须来自实际命令、稳定运行标识和受控报告；当前 12 个运行锚点为 `0/12`，所有 UC-D 继续 blocked。
