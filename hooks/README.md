# AI-DLC Hook 模板

本目录包含各平台的 Hook 模板文件。将对应平台的 Hook 文件复制到目标项目中使用。

## Kiro

### kiro-batch-progress.json

复制到目标项目的 `.kiro/hooks/` 目录：

```bash
cp hooks/kiro/kiro-batch-progress.json <your-project>/.kiro/hooks/
```

**功能**：每个 Spec task 完成后（PostTaskExec），自动检查并更新 state.md 中的批次进度。

**前提**：
- 项目使用 AI-DLC 且处于 Construction 分段模式
- state.md 中已有「执行策略」和「批次进度」字段

### ui-mock-one-page.json / ui-mock-principles-check.json / ui-mock-principles-edit-check.json

UI Mock 阶段的质量保障 Hook，复制到目标项目的 `.kiro/hooks/` 目录：

```bash
cp hooks/kiro/ui-mock-one-page.json hooks/kiro/ui-mock-principles-check.json hooks/kiro/ui-mock-principles-edit-check.json <your-project>/.kiro/hooks/
```

**功能**：
- `ui-mock-one-page.json`（PreToolUse）：UI Mock 阶段2内容填充时，一次只允许写入一个子页面 HTML，写完等用户确认后再继续。
- `ui-mock-principles-check.json` / `ui-mock-principles-edit-check.json`（PostFileCreate / PostFileSave）：HTML 文件创建或编辑后，按 `inception-ui-mock-reasoning-principles.md` 的三层分离原则触发自检。

**前提**：项目处于 AI-DLC Inception 的 UI Mock 步骤（I9-I10）。

## Claude Code

### aidlc-construction-batch.js

Claude Code 通过 Workflow 实现 Construction 分段执行（`.claude/workflows/aidlc-construction-batch.js`），无需额外 Hook。Workflow 会在项目中使用 AI-DLC 时被 Claude 自动识别并调用。

### ui-mock-one-page.sh / ui-mock-principles-check.sh

UI Mock 阶段的质量保障 Hook。安装步骤：

```bash
mkdir -p .claude/hooks
cp hooks/claude-code/*.sh <your-project>/.claude/hooks/
chmod +x <your-project>/.claude/hooks/*.sh
```

再将 `hooks/claude-code/settings-hooks.jsonc` 的内容合并到目标项目的 `.claude/settings.local.json`。

**功能**：
- `ui-mock-one-page.sh`（PreToolUse）：作用同 Kiro 的逐页确认 Hook。
- `ui-mock-principles-check.sh`（PostToolUse）：作用同 Kiro 的分层推导自检 Hook。

**前提**：项目处于 AI-DLC Inception 的 UI Mock 步骤（I9-I10）。

## OpenCode

OpenCode 无 Hook 系统。Construction 分段执行依赖 AI 读取 `steering/common-context-optimization.md` 后自律执行；UI Mock 质量保障依赖 AI 读取 `inception-ui-mock-reasoning-principles.md` 后自律执行。
