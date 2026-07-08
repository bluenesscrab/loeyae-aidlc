#!/bin/bash
# UI Mock 逐页确认 Hook（Claude Code PreToolUse）
# 功能：阶段2填充时，一次只允许写一个子页面，写完等用户确认再继续
#
# 安装：将本文件放入项目 .claude/hooks/ 目录并 chmod +x
# 配置：在 .claude/settings.local.json 中注册（见同目录 settings-hooks.json）

# 从 stdin 读取 JSON 输入
INPUT=$(cat)

# 提取工具名和文件路径
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); params=d.get('tool_input',{}); print(params.get('file_path', params.get('path','')))" 2>/dev/null)

# 只拦截写入 ui-mock 目录下的 HTML 文件
if [[ "$FILE_PATH" != *"ui-mock"* ]] || [[ "$FILE_PATH" != *.html ]]; then
  exit 0
fi

# 排除主文件（非子页面）
BASENAME=$(basename "$FILE_PATH")
if [[ "$BASENAME" == *"-app.html" ]] || [[ "$BASENAME" == *"-admin.html" ]] || [[ "$BASENAME" == *"-pc.html" ]]; then
  exit 0
fi

# 排除 page-specs.md
if [[ "$FILE_PATH" == *.md ]]; then
  exit 0
fi

# 输出提示（exit 0 + stdout JSON 触发 ask 确认）
echo '{"hookSpecificOutput":{"permissionDecision":"ask","permissionDecisionReason":"UI Mock 阶段2逐页确认：每次只允许写入一个子页面 HTML，写完需等待用户确认后继续下一个。"}}'
exit 0
