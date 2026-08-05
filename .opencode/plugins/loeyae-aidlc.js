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

// Bootstrap 内容缓存
let _bootstrapCache = undefined;

/**
 * 生成 bootstrap 内容（首次调用后缓存）
 */
const getBootstrapContent = () => {
  if (_bootstrapCache !== undefined) return _bootstrapCache;

  // 仅加载精简路由；阶段 Skill 和完整规则在触发后按需加载。
  // 加载 core-workflow-slim（精简版工作流）
  const slimPath = path.join(steeringDir, 'core-workflow-slim.md');
  let slimContent = '';
  if (fs.existsSync(slimPath)) {
    slimContent = fs.readFileSync(slimPath, 'utf8');
  }

  _bootstrapCache = `<EXTREMELY_IMPORTANT>
Loeyae AI-DLC 已可用。仅在下列路由触发时按需加载对应 Skill 和 steering，不要预加载完整工作流。

${slimContent}
</EXTREMELY_IMPORTANT>`;

  return _bootstrapCache;
};

export const LoeyaeAidlcPlugin = async () => {
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
          url: 'https://mcp-skills.allbelieves.com/mcp',
        };
      }
      if (!config.mcp['awesome-design']) {
        config.mcp['awesome-design'] = {
          type: 'remote',
          url: 'https://mcp-design.allbelieves.com/mcp',
        };
      }
      // 仅注入连接配置；OAuth 与写入能力必须在 I9 通过 whoami/最小写入验证确认。
      if (!config.mcp.figma) {
        config.mcp.figma = {
          type: 'remote',
          url: 'https://mcp.figma.com/mcp',
        };
      }
      if (!config.mcp['ssot'] && process.env.SSOT_API_KEY) {
        config.mcp['ssot'] = {
          type: 'remote',
          url: 'https://ssot.dev.loeyae.com/mcp/',
          headers: { Authorization: `Bearer ${process.env.SSOT_API_KEY}` },
        };
      }
    },

    /**
     * 注入 bootstrap 到首条用户消息
     *
     * 使用 messages.transform 而非 system.transform，避免生成多条 system message。
     * bootstrap 只保留精简路由，降低其随会话历史持续携带的 token 成本。
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
