export const meta = {
  name: 'aidlc-construction-batch',
  description: 'AI-DLC Construction 分段执行：将多单元任务拆分为批次，每批次在独立上下文中执行 TDD + 审查',
}

// 第一步：读取 state.md，确定待执行单元和分段策略
const state = await agent(
  `读取 docs/aidlc/state.md，提取以下信息并以 JSON 返回：
   1. taskName: 任务名称
   2. module: 所属模块
   3. pendingUnits: 待执行单元列表（数组，每项含 id 和 name）
   4. completedUnits: 已完成单元列表
   5. architectureMode: 架构模式（single/multi）`,
  {
    label: '读取任务状态',
    schema: {
      type: 'object',
      required: ['taskName', 'pendingUnits'],
      properties: {
        taskName: { type: 'string' },
        module: { type: 'string' },
        pendingUnits: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
            },
          },
        },
        completedUnits: { type: 'array', items: { type: 'string' } },
        architectureMode: { type: 'string' },
      },
    },
  }
)

const unitCount = state.pendingUnits.length

// 确定分段策略
let batchSize
if (unitCount >= 10) batchSize = 2
else if (unitCount >= 5) batchSize = 3
else batchSize = unitCount

// 生成批次
const batches = []
for (let i = 0; i < state.pendingUnits.length; i += batchSize) {
  batches.push(state.pendingUnits.slice(i, i + batchSize))
}

// 更新 state.md 执行策略
await agent(
  `更新 docs/aidlc/state.md，在"执行策略"部分写入：
   - 执行模式: ${unitCount < 5 ? 'continuous' : 'segmented'}
   - 批次大小: ${batchSize}
   - 总批次: ${batches.length}
   - 当前批次: 1

   在"批次进度"部分写入批次计划表：
   ${batches.map((b, i) => `批次 ${i + 1}: 单元 ${b.map(u => u.id).join(', ')} - 待执行`).join('\n')}`,
  { label: '更新执行策略' }
)

// 逐批次执行
const results = []

for (let i = 0; i < batches.length; i++) {
  const batch = batches[i]
  const batchNum = i + 1
  const unitIds = batch.map(u => u.id).join(', ')

  // 每个批次在独立 agent 中执行
  const batchResult = await agent(
    `你是 AI-DLC Construction 批次执行者。

任务：${state.taskName}
模块：${state.module || '默认'}
批次：${batchNum}/${batches.length}
单元列表：${JSON.stringify(batch)}

执行要求：
1. 对批次内每个单元，执行完整的 Construction 流程：
   - 读取该单元的需求切片、故事切片、设计切片
   - 执行 TDD 循环（RED-GREEN-REFACTOR）
   - 执行两阶段审查（规格合规 → 代码质量）
   - 验证构建通过
2. 严格遵循 steering/construction-tdd.md 的 TDD 规则
3. 严格遵循 steering/construction-code-review.md 的审查规则
4. 如果项目使用 Loeyae Boot Framework，通过 MCP Skill 加载编码规范

完成后报告：每个单元的状态、产出文件数、测试数。`,
    {
      label: `批次 ${batchNum}: ${unitIds}`,
      schema: {
        type: 'object',
        required: ['status', 'units'],
        properties: {
          status: { type: 'string', enum: ['completed', 'failed'] },
          units: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                unitId: { type: 'string' },
                status: { type: 'string' },
                filesCreated: { type: 'number' },
                testsCreated: { type: 'number' },
              },
            },
          },
          failureReason: { type: 'string' },
        },
      },
    }
  )

  results.push(batchResult)

  // 更新 state.md 批次进度
  const totalFiles = batchResult.units
    ? batchResult.units.reduce((sum, u) => sum + (u.filesCreated || 0), 0)
    : 0
  const progress = Math.round(((i + 1) / batches.length) * 100)

  await agent(
    `更新 docs/aidlc/state.md：
     1. 将批次 ${batchNum} 的状态更新为 ${batchResult.status === 'completed' ? '✅ 完成' : '❌ 失败'}
     2. 记录产出文件数：${totalFiles}
     3. 记录完成时间为当前时间
     4. 将当前批次更新为 ${batchNum + 1}
     5. 将批次内各单元标记为已完成（如果批次成功）`,
    { label: `更新进度 ${progress}%` }
  )

  // 批次失败则停止
  if (batchResult.status === 'failed') {
    return {
      status: 'failed',
      completedBatches: i,
      totalBatches: batches.length,
      failedBatch: batchNum,
      reason: batchResult.failureReason,
      results,
    }
  }
}

return {
  status: 'completed',
  taskName: state.taskName,
  totalUnits: unitCount,
  totalBatches: batches.length,
  results,
}
