#!/bin/bash
# UI Mock 分层推导自检 Hook（Claude Code PostToolUse）
# 功能：创建或编辑 HTML mock 文件后，输出自检提示让模型执行三层检查
#
# 安装：将本文件放入项目 .claude/hooks/ 目录并 chmod +x
# 配置：在 .claude/settings.local.json 中注册（见同目录 settings-hooks.json）

INPUT=$(cat)

# 提取文件路径
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); params=d.get('tool_input',{}); print(params.get('file_path', params.get('path','')))" 2>/dev/null)

# 只处理 ui-mock 目录下的 HTML 文件
if [[ "$FILE_PATH" != *"ui-mock"* ]] || [[ "$FILE_PATH" != *.html ]]; then
  exit 0
fi

# 排除骨架文件（<50行）
if [ -f "$FILE_PATH" ]; then
  LINE_COUNT=$(wc -l < "$FILE_PATH" | tr -d ' ')
  if [ "$LINE_COUNT" -lt 50 ]; then
    exit 0
  fi
fi

# 输出自检指令（PostToolUse 的 stdout 会被注入到模型上下文）
cat <<'EOF'
[UI Mock 自检触发] 请按三层分离原则逐层自检刚才写入的 HTML 文件：

【第一层：UI 内容本体 — 面向用户】
1. 页面头部是否声明了用户角色和核心任务？
2. 所有列标题、按钮文案是否无系统内部术语泄漏？
3. 条件表的 summary 和表头是否使用用户语言？
4. 列表信息不完整时，所有状态是否都有 [查看] 入口？
5. mock-box 是否按用户任务流组织？

【第二层：条件表内容 — 面向开发+验证】
1. 条件表单元格是否包含精确的状态判断条件？
2. 操作列是否在每种状态下列出完整按钮组合？
3. 状态列标题是否标注了系统枚举值？
4. 有没有状态差异被遗漏在条件表之外？

【第三层：底部说明 — 面向验证+开发】
1. 是否包含「推导说明」区块？
2. 是否包含「业务规则」区块？
3. 业务规则是否覆盖了数值约束、判断边界、异常处理？

逐层标注 ✅ 合规 或 ❌ 违规。违规项给出具体位置和修正建议。
EOF
exit 0
