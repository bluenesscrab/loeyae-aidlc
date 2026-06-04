#!/usr/bin/env node

/**
 * Loeyae AI-DLC Setup Script
 *
 * 安装时自动注册 loeyae-skills MCP 服务器到用户的全局 OpenCode 配置。
 *
 * 用法:
 *   bunx loeyae-aidlc install
 *   npx loeyae-aidlc install
 *   node scripts/setup.mjs
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { homedir, platform } from "os"

const MCP_SERVER_NAME = "loeyae-skills"
const MCP_SERVER_CONFIG = {
  type: "sse",
  url: "https://mcp-skills.dev.loeyae.com/sse",
}

const PLUGIN_NAME = "loeyae-aidlc"

/**
 * 获取 OpenCode 全局配置目录
 */
function getGlobalConfigDir() {
  const os = platform()
  if (os === "win32") {
    // Windows: %APPDATA%\opencode 或 ~/.config/opencode
    const appData = process.env.APPDATA
    if (appData) {
      return join(appData, "opencode")
    }
    return join(homedir(), ".config", "opencode")
  }
  // macOS/Linux: ~/.config/opencode
  const xdgConfig = process.env.XDG_CONFIG_HOME
  if (xdgConfig) {
    return join(xdgConfig, "opencode")
  }
  return join(homedir(), ".config", "opencode")
}

/**
 * 获取全局配置文件路径
 */
function getGlobalConfigPath() {
  const configDir = getGlobalConfigDir()
  const jsonPath = join(configDir, "opencode.json")
  const jsoncPath = join(configDir, "opencode.jsonc")

  if (existsSync(jsoncPath)) return jsoncPath
  if (existsSync(jsonPath)) return jsonPath

  // 默认创建 opencode.json
  return jsonPath
}

/**
 * 读取 JSON/JSONC 文件（安全去注释，不影响字符串内容）
 */
function readJsonc(filePath) {
  if (!existsSync(filePath)) return null
  const raw = readFileSync(filePath, "utf-8")
  // 先尝试直接解析（纯 JSON 文件无需去注释）
  try {
    return JSON.parse(raw)
  } catch {
    // JSONC：逐字符解析，只删除字符串外的注释
    let result = ""
    let inString = false
    let escape = false
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i]
      if (escape) {
        result += ch
        escape = false
        continue
      }
      if (inString) {
        if (ch === "\\") escape = true
        if (ch === '"') inString = false
        result += ch
      } else {
        if (ch === '"') {
          inString = true
          result += ch
        } else if (ch === "/" && raw[i + 1] === "/") {
          while (i < raw.length && raw[i] !== "\n") i++
          result += "\n"
        } else if (ch === "/" && raw[i + 1] === "*") {
          i += 2
          while (i < raw.length && !(raw[i] === "*" && raw[i + 1] === "/")) i++
          i++
        } else {
          result += ch
        }
      }
    }
    try {
      return JSON.parse(result)
    } catch {
      return null
    }
  }
}

/**
 * 写入配置（保持格式化）
 */
function writeConfig(filePath, config) {
  const dir = dirname(filePath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  writeFileSync(filePath, JSON.stringify(config, null, 2) + "\n", "utf-8")
}

/**
 * 注册 MCP 服务器
 */
function registerMcpServer(configPath) {
  let config = readJsonc(configPath)
  let created = false

  if (!config) {
    config = {}
    created = true
  }

  // 检查是否已注册
  if (config.mcpServers && config.mcpServers[MCP_SERVER_NAME]) {
    console.log(`✓ ${MCP_SERVER_NAME} MCP 服务器已存在，跳过注册`)
    return false
  }

  // 注入 MCP 配置
  if (!config.mcpServers) {
    config.mcpServers = {}
  }
  config.mcpServers[MCP_SERVER_NAME] = MCP_SERVER_CONFIG

  writeConfig(configPath, config)

  if (created) {
    console.log(`✓ 已创建配置文件: ${configPath}`)
  }
  console.log(`✓ 已注册 ${MCP_SERVER_NAME} MCP 服务器 (${MCP_SERVER_CONFIG.url})`)
  return true
}

/**
 * 注册插件到 plugin 列表
 */
function registerPlugin(configPath) {
  let config = readJsonc(configPath)
  if (!config) {
    config = {}
  }

  if (!config.plugin) {
    config.plugin = []
  }

  if (config.plugin.includes(PLUGIN_NAME)) {
    console.log(`✓ ${PLUGIN_NAME} 插件已在 plugin 列表中，跳过`)
    return false
  }

  config.plugin.push(PLUGIN_NAME)
  writeConfig(configPath, config)
  console.log(`✓ 已将 ${PLUGIN_NAME} 添加到 plugin 列表`)
  return true
}

/**
 * 主安装流程
 */
function main() {
  console.log("")
  console.log("╔══════════════════════════════════════════════╗")
  console.log("║     Loeyae AI-DLC - Setup                   ║")
  console.log("╚══════════════════════════════════════════════╝")
  console.log("")

  const configPath = getGlobalConfigPath()
  const configDir = getGlobalConfigDir()

  console.log(`配置目录: ${configDir}`)
  console.log(`配置文件: ${configPath}`)
  console.log("")

  // 1. 注册插件
  registerPlugin(configPath)

  // 2. 注册 MCP 服务器
  registerMcpServer(configPath)

  console.log("")
  console.log("安装完成！重启 OpenCode 后生效。")
  console.log("")
  console.log("可用的 MCP 工具:")
  console.log("  - search_skill(query)       搜索开发规范")
  console.log("  - get_skill_summary(name)   获取规范摘要")
  console.log("  - get_skill_content(name)   获取规范完整内容")
  console.log("")
}

main()
