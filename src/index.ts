import type { Plugin, Hooks } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// 获取插件目录路径
const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = join(__dirname, "..");

// 插件元数据
const PLUGIN_NAME = "loeyae-aidlc";

/**
 * 读取 steering 文件内容
 */
function loadSteeringContent(filename: string): string | null {
  const filePath = join(PLUGIN_ROOT, "steering", filename);
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * 读取 skill 文件内容
 */
function loadSkillContent(skillName: string): string | null {
  const filePath = join(PLUGIN_ROOT, "skills", skillName, "SKILL.md");
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * 获取所有可用的 skills 列表
 */
function getAvailableSkills(): Array<{ name: string; description: string }> {
  const skillsDir = join(PLUGIN_ROOT, "skills");
  if (!existsSync(skillsDir)) return [];

  const skills: Array<{ name: string; description: string }> = [];
  const dirs = readdirSync(skillsDir, { withFileTypes: true });

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const skillFile = join(skillsDir, dir.name, "SKILL.md");
    if (!existsSync(skillFile)) continue;

    try {
      const content = readFileSync(skillFile, "utf-8");
      const descMatch = content.match(/description:\s*"([^"]+)"/);
      skills.push({
        name: dir.name,
        description: descMatch ? descMatch[1] : `Skill: ${dir.name}`,
      });
    } catch {
      skills.push({ name: dir.name, description: `Skill: ${dir.name}` });
    }
  }

  return skills;
}

/**
 * 获取所有可用的 steering 文件列表
 */
function getAvailableSteering(): string[] {
  const steeringDir = join(PLUGIN_ROOT, "steering");
  if (!existsSync(steeringDir)) return [];

  try {
    return readdirSync(steeringDir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
}

/**
 * Loeyae AI-DLC 插件主入口（OpenCode）
 */
export const LoeyaeAidlc: Plugin = async (ctx) => {
  const { client } = ctx;

  await client.app.log({
    body: {
      service: PLUGIN_NAME,
      level: "info",
      message: "Loeyae AI-DLC 插件已初始化",
    },
  });

  const hooks: Hooks = {
    /**
     * 注入核心工作流到系统提示
     */
    "experimental.chat.system.transform": async (_input, output) => {
      const coreWorkflow = loadSteeringContent("core-workflow-slim.md");
      if (coreWorkflow) {
        output.system.push(
          `\n<!-- Loeyae AI-DLC: Core Workflow -->\n${coreWorkflow}`
        );
      }

      // 注入可用 skills 列表，让 agent 知道可以调用哪些
      const skills = getAvailableSkills();
      if (skills.length > 0) {
        const skillsList = skills
          .map((s) => `  - ${s.name}: ${s.description}`)
          .join("\n");
        output.system.push(
          `\n<!-- Loeyae AI-DLC: Available Skills -->\n` +
            `当用户消息中出现 "AI-DLC" 或 "aidlc" 时，使用 aidlc_use_skill 工具加载 "using-aidlc" skill。\n\n` +
            `可用的 AI-DLC skills:\n${skillsList}\n\n` +
            `可用的 AI-DLC steering 文件可通过 aidlc_load_steering 工具按需加载。`
        );
      }
    },

    /**
     * Compaction 后重新注入 skills 列表
     */
    "experimental.session.compacting": async (_input, output) => {
      const skills = getAvailableSkills();
      if (skills.length > 0) {
        const skillsList = skills
          .map((s) => `  - ${s.name}: ${s.description}`)
          .join("\n");
        output.context.push(
          `## Loeyae AI-DLC Skills (compaction reminder)\n\n` +
            `当需要使用 AI-DLC 工作流时，调用 aidlc_use_skill 工具。\n\n` +
            `可用 skills:\n${skillsList}`
        );
      }
    },

    /**
     * 自定义工具：加载 skill
     */
    tool: {
      aidlc_use_skill: tool({
        description:
          "加载 Loeyae AI-DLC 的指定 skill 内容到上下文中。当用户提到 AI-DLC/aidlc 时调用 using-aidlc，或按工作流需要加载其他 skill。",
        args: {
          name: tool.schema.string(
            "Skill 名称，如 using-aidlc, aidlc-inception, aidlc-construction, aidlc-operations, aidlc-workflow"
          ),
        },
        async execute(args) {
          const content = loadSkillContent(args.name);
          if (!content) {
            const available = getAvailableSkills()
              .map((s) => s.name)
              .join(", ");
            return `Skill "${args.name}" 未找到。可用的 skills: ${available}`;
          }
          return content;
        },
      }),

      aidlc_load_steering: tool({
        description:
          "按需加载 Loeyae AI-DLC 的 steering 文件（工作流规则文档）。仅在进入对应阶段时加载，避免不必要的 token 消耗。",
        args: {
          filename: tool.schema.string(
            "Steering 文件名，如 core-workflow.md, common-persuasion-defense.md, construction-tdd.md, inception-requirements-analysis.md"
          ),
        },
        async execute(args) {
          const content = loadSteeringContent(args.filename);
          if (!content) {
            const available = getAvailableSteering().join(", ");
            return `Steering 文件 "${args.filename}" 未找到。可用文件: ${available}`;
          }
          return content;
        },
      }),
    },
  };

  return hooks;
};

// 导出插件模块
export default LoeyaeAidlc;
