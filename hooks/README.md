# AI-DLC Hook 模板

本目录包含各平台的 Hook 模板文件。将对应平台的 Hook 文件复制到目标项目中使用。

## Kiro

将 `kiro-batch-progress.json` 复制到目标项目的 `.kiro/hooks/` 目录：

```bash
cp hooks/kiro-batch-progress.json <your-project>/.kiro/hooks/
```

**功能**：每个 Spec task 完成后（PostTaskExec），自动检查并更新 state.md 中的批次进度。

**前提**：
- 项目使用 AI-DLC 且处于 Construction 分段模式
- state.md 中已有「执行策略」和「批次进度」字段

## Claude Code

Claude Code 通过 Workflow 实现分段执行（`.claude/workflows/aidlc-construction-batch.js`），无需额外 Hook。

Workflow 会在项目中使用 AI-DLC 时被 Claude 自动识别并调用。

## OpenCode

OpenCode 无 Hook 系统。分段执行依赖 AI 读取 `steering/common-context-optimization.md` 后自律执行。
