export const meta = {
  name: 'aidlc-construction-batch',
  description: 'AI-DLC Construction 逐单元执行：批次仅用于进度分组，每个单元独立完成 TDD、审查与证据回写',
}

const state = await agent(
  `读取 docs/aidlc/state.md、工作单元定义和依赖文件，返回待执行单元。
每个单元必须包含 id、name、module、dependencies、requirementsPath、storiesPath、designPath；sharedInterfacesPath 无文件时可为空。
只返回状态不是 complete 的单元，并保留依赖顺序。`,
  {
    label: '读取 Construction 状态',
    schema: {
      type: 'object',
      required: ['taskName', 'pendingUnits'],
      properties: {
        taskName: { type: 'string' },
        pendingUnits: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'name', 'requirementsPath', 'storiesPath', 'designPath'],
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              module: { type: 'string' },
              dependencies: { type: 'array', items: { type: 'string' } },
              requirementsPath: { type: 'string' },
              storiesPath: { type: 'string' },
              designPath: { type: 'string' },
              sharedInterfacesPath: { type: 'string' },
            },
          },
        },
      },
    },
  }
)

const unitCount = state.pendingUnits.length
const batchSize = unitCount >= 10 ? 2 : unitCount >= 5 ? 3 : Math.max(unitCount, 1)
const batches = []
for (let i = 0; i < unitCount; i += batchSize) {
  batches.push(state.pendingUnits.slice(i, i + batchSize))
}

await agent(
  `更新 docs/aidlc/state.md：
1. 写入执行模式、批次大小、总批次和当前批次。
2. 在“单元与批次进度”表中逐单元写入 module、batch、unit、pending、完成时间、验证证据、执行者。
3. 不创建“批次进度”或其他进度文件。`,
  { label: '初始化逐单元进度' }
)

const results = []
for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
  const batch = batches[batchIndex]

  for (const unit of batch) {
    await agent(
      `将 docs/aidlc/state.md 中单元 ${unit.id} 的状态更新为 in_progress，并保持其他单元行不变。`,
      { label: `开始单元 ${unit.id}` }
    )

    const result = await agent(
      `读取 agents/batch-executor.md 并严格按“单个单元”协议执行。
任务：${state.taskName}
模块：${unit.module || 'default'}
单元：${unit.id} ${unit.name}
state：docs/aidlc/state.md
需求：${unit.requirementsPath}
故事：${unit.storiesPath}
设计：${unit.designPath}
共享接口：${unit.sharedInterfacesPath || '不适用'}

只处理该单元。完成前必须把状态与验证证据写回 state.md。`,
      {
        label: `执行单元 ${unit.id}`,
        schema: {
          type: 'object',
          required: ['unitId', 'status', 'tddEvidence', 'specReviewEvidence', 'qualityReviewEvidence', 'impactValidationEvidence'],
          properties: {
            unitId: { type: 'string' },
            status: { type: 'string', enum: ['DONE', 'NEEDS_CONTEXT', 'BLOCKED'] },
            changedFiles: { type: 'array', items: { type: 'string' } },
            tddEvidence: { type: 'string' },
            specReviewEvidence: { type: 'string' },
            qualityReviewEvidence: { type: 'string' },
            impactValidationEvidence: { type: 'string' },
            reason: { type: 'string' },
          },
        },
      }
    )

    const evidenceComplete = [
      result.tddEvidence,
      result.specReviewEvidence,
      result.qualityReviewEvidence,
      result.impactValidationEvidence,
    ].every(value => typeof value === 'string' && value.trim().length > 0)

    if (result.status === 'DONE' && !evidenceComplete) {
      result.status = 'BLOCKED'
      result.reason = '执行者返回 DONE，但验证证据不完整'
    }

    await agent(
      `核对 docs/aidlc/state.md 中单元 ${unit.id}：
- 返回状态：${result.status}
- TDD：${result.tddEvidence}
- 规格审查：${result.specReviewEvidence}
- 质量审查：${result.qualityReviewEvidence}
- 影响域验证：${result.impactValidationEvidence}

仅当状态为 DONE 且四类证据完整时，将该单元行更新为 complete；否则更新为 blocked 并记录原因：${result.reason || '需要处理'}。不得批量更新其他单元。`,
      { label: `核对单元 ${unit.id} 证据` }
    )

    results.push(result)
    if (result.status !== 'DONE') {
      return {
        status: result.status,
        completedUnits: results.filter(item => item.status === 'DONE').length,
        blockedUnit: unit.id,
        reason: result.reason,
        results,
      }
    }
  }

  await agent(
    `从 docs/aidlc/state.md 的单元行汇总批次 ${batchIndex + 1}。全部 complete 时将当前批次更新为 ${batchIndex + 2}；不要维护第二份批次表。`,
    { label: `完成批次 ${batchIndex + 1}` }
  )
}

return {
  status: 'DONE',
  taskName: state.taskName,
  totalUnits: unitCount,
  totalBatches: batches.length,
  results,
}
