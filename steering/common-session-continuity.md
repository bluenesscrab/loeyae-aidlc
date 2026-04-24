# 会话连续性模板

## 欢迎回来提示模板
当用户返回继续处理现有的 AI-DLC 项目时，展示此提示：

```markdown
**欢迎回来！我发现您有一个正在进行中的 AI-DLC 项目。**

根据您的 state.md，以下是您当前的状态：
- **项目**：[project-name]
- **当前阶段**：[INCEPTION/CONSTRUCTION/OPERATIONS]
- **当前步骤**：[Stage Name]
- **上次完成**：[上次完成的步骤]
- **下一步**：[下一个要处理的步骤]

**您今天想做什么？**

A) 从上次中断的地方继续（[下一步描述]）
B) 回顾之前的阶段（[显示可用阶段]）

[回答]: 
```

## 强制要求：会话连续性指令
1. **检测到现有项目时，始终先读取 state.md**
2. **从工作流文件中解析当前状态**以填充提示内容
3. **强制要求：加载前序阶段产物** - 在恢复任何阶段之前，自动读取前序阶段的所有相关产物：
   - **逆向工程**：读取 architecture.md、code-structure.md、api-documentation.md
   - **需求分析**：读取 requirements.md、requirement-verification-questions.md
   - **用户故事**：读取 stories.md、personas.md、story-generation-plan.md
   - **应用设计**：读取应用设计产物（components.md、component-methods.md、services.md）
   - **设计（单元）**：读取 unit-of-work.md、unit-of-work-dependency.md、unit-of-work-story-map.md
   - **单元级设计**：读取 functional-design.md、nfr-requirements.md、nfr-design.md、infrastructure-design.md
   - **代码阶段**：读取所有代码文件、计划以及所有前序产物
4. **按阶段智能加载上下文**：
   - **早期阶段（工作区检测、逆向工程）**：加载工作区分析
   - **需求/故事**：加载逆向工程 + 需求产物
   - **设计阶段**：加载需求 + 故事 + 架构 + 设计产物
   - **代码阶段**：加载所有产物 + 现有代码文件
5. **根据架构选择和当前阶段调整选项**
6. **显示具体的下一步操作**而非通用描述
7. **在 audit.md 中记录连续性提示**并附带时间戳
8. **上下文摘要**：加载产物后，提供已加载内容的简要摘要，让用户了解情况
9. **提问方式**：始终将澄清问题或用户反馈问题放在 .md 文件中。不要在聊天会话中内联放置多选题。

## 错误处理
如果在会话恢复期间产物缺失或损坏，请参阅 [error-handling.md](error-handling.md) 获取恢复流程指导。
