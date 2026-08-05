# AI-DLC Hook 模板

本目录包含各平台的可选 Hook 模板文件。Hook 需要用户按平台手动安装或配置，只提供本地交互约束或提醒，**不属于 AI-DLC 正确性保证，不得替代共享 steering、交叉审查、state.md 阻断或质量门禁证据**。未安装、未启用或未触发 Hook 时，主流程要求保持不变。

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

UI Mock 阶段的可选辅助 Hook，复制到目标项目的 `.kiro/hooks/` 目录：

```bash
cp hooks/kiro/ui-mock-one-page.json hooks/kiro/ui-mock-principles-check.json hooks/kiro/ui-mock-principles-edit-check.json <your-project>/.kiro/hooks/
```

**功能**：
- `ui-mock-one-page.json`（PreToolUse）：UI Mock 阶段2内容填充时，一次只允许写入一个子页面 HTML，写完等用户确认后再继续。
- `ui-mock-principles-check.json` / `ui-mock-principles-edit-check.json`（PostFileCreate / PostFileSave）：HTML 文件创建或编辑后，按 `inception-ui-mock-reasoning-principles.md` 的三层分离原则触发自检。

**能力边界**：这些 Hook 不读取需求和用户故事，不执行 I10 语义一致性审查，也不能作为 I10 或质量门禁通过证据。

**前提**：项目处于 AI-DLC Inception 的 UI Mock 步骤（I9-I10）。

## Claude Code

### aidlc-construction-batch.js

Claude Code 通过 Workflow 实现 Construction 分段执行（`.claude/workflows/aidlc-construction-batch.js`），无需额外 Hook。Workflow 会在项目中使用 AI-DLC 时被 Claude 自动识别并调用。

### ui-mock-one-page.sh / ui-mock-principles-check.sh

UI Mock 阶段的可选辅助 Hook。安装步骤：

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

OpenCode 无 Hook 系统。Construction 分段执行和 UI Mock 审查均以共享 steering、state.md 与质量门禁为准；不存在 Hook 不得降低检查要求。
