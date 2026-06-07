/**
 * Loeyae AI-DLC plugin for OpenCode.ai
 *
 * - config hook: 注入 skills 路径 + 尝试注入 mcpServers
 * - experimental.chat.messages.transform: 注入 bootstrap 到首条用户消息
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Skills 目录（相对于插件根目录）
const aidlcSkillsDir = path.resolve(__dirname, '../../skills');

// Steering 目录
const steeringDir = path.resolve(__dirname, '../../steering');

/**
 * 简易 frontmatter 提取
 */
const extractAndStripFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };
  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter = {};
  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }
  return { frontmatter, content: body };
};

// Bootstrap 内容缓存
let _bootstrapCache = undefined;

/**
 * 生成 bootstrap 内容（首次调用后缓存）
 */
const getBootstrapContent = () => {
  if (_bootstrapCache !== undefined) return _bootstrapCache;

  // 加载 using-aidlc skill 内容
  const skillPath = path.join(aidlcSkillsDir, 'using-aidlc', 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    _bootstrapCache = null;
    return null;
  }

  const fullContent = fs.readFileSync(skillPath, 'utf8');
  const { content: skillBody } = extractAndStripFrontmatter(fullContent);

  // 加载 core-workflow-slim（精简版工作流）
  const slimPath = path.join(steeringDir, 'core-workflow-slim.md');
  let slimContent = '';
  if (fs.existsSync(slimPath)) {
    slimContent = fs.readFileSync(slimPath, 'utf8');
  }

  // 工具映射说明
  const toolMapping = `
**OpenCode 工具映射：**
- \`skill\` 工具 → 使用 OpenCode 原生 \`skill\` 工具加载和列出 skills
- 文件操作 → 使用 OpenCode 原生工具（read, write, edit, bash）
- MCP 工具 → 使用 \`mcp__loeyae-skills__get_skill_outline\`、\`mcp__loeyae-skills__get_skill_section\`、\`mcp__loeyae-skills__search_skill\` 等

**渐进式披露策略**：优先 \`outline\` → \`section\`，避免直接调用 \`get_skill_content\` 导致 token 浪费。

**加载更多 steering 文件：**
使用 OpenCode 原生 \`skill\` 工具加载 aidlc-inception、aidlc-construction、aidlc-operations 等 skill，或直接读取 steering/ 目录下的文件。
`;

  _bootstrapCache = `<EXTREMELY_IMPORTANT>
你已装载 Loeyae AI-DLC 工作流。

**重要：using-aidlc skill 内容已包含在下方，无需再次使用 skill 工具加载 "using-aidlc"。**

${skillBody}

---

## 精简版工作流（core-workflow-slim）

${slimContent}

---

${toolMapping}
</EXTREMELY_IMPORTANT>`;

  return _bootstrapCache;
};

export const LoeyaeAidlcPlugin = async ({ client, directory }) => {
  return {
    /**
     * config hook: 注入 skills 路径 + 尝试注入 mcpServers
     */
    config: async (config) => {
      // 注入 skills 路径
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(aidlcSkillsDir)) {
        config.skills.paths.push(aidlcSkillsDir);
      }

      // 尝试注入 mcpServers（不确定是否生效，但不会报错）
      config.mcp = config.mcp || {};
      if (!config.mcp['loeyae-skills']) {
        config.mcp['loeyae-skills'] = {
          type: 'remote',
          url: 'https://mcp-skills.dev.loeyae.com/sse',
        };
      }
    },

    /**
     * 注入 bootstrap 到首条用户消息
     *
     * 使用 messages.transform 而非 system.transform，避免：
     * 1. Token 膨胀（system messages 每轮重复）
     * 2. 多条 system message 导致部分模型异常
     */
    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (!bootstrap || !output.messages.length) return;

      const firstUser = output.messages.find(m => m.info.role === 'user');
      if (!firstUser || !firstUser.parts.length) return;

      // 防止重复注入
      if (firstUser.parts.some(p => p.type === 'text' && p.text.includes('EXTREMELY_IMPORTANT'))) return;

      const ref = firstUser.parts[0];
      firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap });
    },
  };
};
