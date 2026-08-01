export const meta = {
  name: 'aidlc-construction-batch',
  description: 'AI-DLC Construction 逐单元执行：批次仅用于进度分组，每个单元独立完成 TDD、审查与证据回写',
}

const state = await agent(
  `读取 docs/aidlc/state.md、工作单元定义和依赖文件，返回待执行单元。
每个单元必须包含 id、name、module、dependencies、dependencyDetails、requirementsPath、storiesPath、designPath；sharedInterfacesPath 无文件时可为空。dependencies 与 dependencyDetails 都必须显式返回数组；无依赖时均返回空数组。
每个 dependencyDetails 项对应一个实际依赖目标和类型（contract/implementation/runtime/none），并提供实际证据；适用的 contract 项提供契约 ID、基线 ID、Owner 目标代码路径、契约—Owner 映射、基线状态、代码版本与验证证据。每个契约 ID 必须有映射，但多个契约可以位于同一 Owner 目标代码路径；多基线必须拆成多项。
只返回状态不是 complete 的单元，并保留依赖顺序。依赖就绪结论由每个单元派发前按共享 steering 重新读取，不在本次批次清单中推导。`,
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
            required: ['id', 'name', 'dependencies', 'dependencyDetails', 'requirementsPath', 'storiesPath', 'designPath'],
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              module: { type: 'string' },
              dependencies: { type: 'array', items: { type: 'string' } },
              dependencyDetails: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['targetId', 'type'],
                  properties: {
                    targetId: { type: 'string' },
                    type: { type: 'string', enum: ['contract', 'implementation', 'runtime', 'none'] },
                    contractIds: { type: 'array', items: { type: 'string' } },
                    contractMappings: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['contractId', 'targetCodePath'],
                        properties: {
                          contractId: { type: 'string' },
                          targetCodePath: { type: 'string' },
                        },
                      },
                    },
                    baselineId: { type: 'string' },
                    baselineStatus: { type: 'string' },
                    baselineCodeVersion: { type: 'string' },
                    targetCodePaths: { type: 'array', items: { type: 'string' } },
                    providerStatus: { type: 'string' },
                    runtimeReady: { type: 'boolean' },
                    readinessEvidence: { type: 'string' },
                  },
                },
              },
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

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * SYNC: 判定规则必须与 steering/common-context-optimization.md 和
 * steering/construction-shared-contract-baseline.md 保持同步。
 * 修改共享规则中的依赖类型、状态名或判定条件时，必须同步更新此函数。
 *
 * 从批次初始化阶段已收集的 dependencyDetails 直接推导就绪结论。
 * 不做二次 agent 调用，不重复共享 steering 的判定逻辑。
 * 判定规则（与 common-context-optimization.md 一致）：
 * - contract：baselineStatus 必须为 verified
 * - implementation：providerStatus 必须为 complete
 * - runtime：runtimeReady 必须为 true
 * - none：始终满足
 */
function deriveReadiness(unit) {
  const details = unit.dependencyDetails || []
  if (details.length === 0) {
    return { status: 'READY', reason: '', nextAction: 'CONTINUE' }
  }

  for (const dep of details) {
    if (dep.type === 'contract') {
      if (dep.baselineStatus !== 'verified') {
        return {
          status: 'BLOCKED',
          reason: `单元 ${unit.id} 的 contract 依赖 ${dep.targetId} 基线状态为 ${dep.baselineStatus || '未知'}，需 verified`,
          nextAction: 'CONTINUE',
        }
      }
      if (!dep.contractIds || dep.contractIds.length === 0) {
        return {
          status: 'NEEDS_CONTEXT',
          reason: `单元 ${unit.id} 的 contract 依赖 ${dep.targetId} 缺少契约 ID`,
          nextAction: 'STOP',
        }
      }
    } else if (dep.type === 'implementation') {
      if (dep.providerStatus !== 'complete') {
        return {
          status: 'BLOCKED',
          reason: `单元 ${unit.id} 的 implementation 依赖 ${dep.targetId} 提供方状态为 ${dep.providerStatus || '未知'}，需 complete`,
          nextAction: 'CONTINUE',
        }
      }
    } else if (dep.type === 'runtime') {
      if (dep.runtimeReady !== true) {
        return {
          status: 'BLOCKED',
          reason: `单元 ${unit.id} 的 runtime 依赖 ${dep.targetId} 未就绪`,
          nextAction: 'CONTINUE',
        }
      }
    }
    // none: 始终满足
  }

  return { status: 'READY', reason: '', nextAction: 'CONTINUE' }
}

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
let terminalResult

execution:
for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
  const batch = batches[batchIndex]

  for (const unit of batch) {
    const readiness = deriveReadiness(unit)
    if (readiness.status !== 'READY') {
      await agent(
        `将 docs/aidlc/state.md 中单元 ${unit.id} 更新为 blocked，并记录带类型依赖门禁结果：${readiness.status}；原因：${readiness.reason}。不得更新其他单元。`,
        { label: `阻断单元 ${unit.id}` }
      )

      const blockedResult = {
        unitId: unit.id,
        status: readiness.status,
        tddEvidence: '',
        specReviewEvidence: '',
        qualityReviewEvidence: '',
        impactValidationEvidence: '',
        dependencyEvidence: readiness.reason,
        nextAction: readiness.nextAction,
        reason: readiness.reason,
      }
      results.push(blockedResult)
      if (blockedResult.nextAction === 'CONTINUE') {
        continue
      }
      terminalResult = {
        status: readiness.status,
        completedUnits: results.filter(item => item.status === 'DONE').length,
        blockedUnit: unit.id,
        reason: readiness.reason,
        results,
      }
      break execution
    }

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
带类型依赖上下文：${JSON.stringify(unit.dependencyDetails)}
当前共享就绪结论：${JSON.stringify(readiness)}

只处理该单元。派发前的就绪结论仅来自共享 steering；执行时若状态变化，按 common-context-optimization.md、construction-shared-contract-baseline.md 与 construction-subagent-execution.md 重新判定，不得重定义契约或绕过门禁。完成前必须把状态与验证证据写回 state.md；若不能完成，按共享结论返回相应状态、原因和下一调度动作。`,
      {
        label: `执行单元 ${unit.id}`,
        schema: {
          type: 'object',
          required: ['unitId', 'status', 'tddEvidence', 'specReviewEvidence', 'qualityReviewEvidence', 'impactValidationEvidence', 'dependencyEvidence', 'nextAction'],
          properties: {
            unitId: { type: 'string' },
            status: { type: 'string', enum: ['DONE', 'NEEDS_CONTEXT', 'BLOCKED'] },
            changedFiles: { type: 'array', items: { type: 'string' } },
            tddEvidence: { type: 'string' },
            specReviewEvidence: { type: 'string' },
            qualityReviewEvidence: { type: 'string' },
            impactValidationEvidence: { type: 'string' },
            dependencyEvidence: { type: 'string' },
            nextAction: { type: 'string', enum: ['CONTINUE', 'STOP'] },
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
      result.dependencyEvidence,
    ].every(value => typeof value === 'string' && value.trim().length > 0)

    if (result.status === 'DONE' && !evidenceComplete) {
      result.status = 'BLOCKED'
      result.reason = '执行者返回 DONE，但验证或依赖门禁证据不完整'
    }

    await agent(
      `核对 docs/aidlc/state.md 中单元 ${unit.id}：
- 返回状态：${result.status}
- TDD：${result.tddEvidence}
- 规格审查：${result.specReviewEvidence}
- 质量审查：${result.qualityReviewEvidence}
- 影响域验证：${result.impactValidationEvidence}
- 依赖门禁：${result.dependencyEvidence}

仅当状态为 DONE 且五类证据完整时，将该单元行更新为 complete；否则更新为 blocked 并记录原因：${result.reason || '需要处理'}。不得批量更新其他单元。`,
      { label: `核对单元 ${unit.id} 证据` }
    )

    results.push(result)
    if (result.status !== 'DONE') {
      if (result.nextAction === 'CONTINUE') {
        continue
      }
      terminalResult = {
        status: result.status,
        completedUnits: results.filter(item => item.status === 'DONE').length,
        blockedUnit: unit.id,
        reason: result.reason,
        results,
      }
      break execution
    }
  }

  await agent(
    `从 docs/aidlc/state.md 的单元行汇总批次 ${batchIndex + 1}。全部 complete 时将当前批次更新为 ${batchIndex + 2}；不要维护第二份批次表。`,
    { label: `完成批次 ${batchIndex + 1}` }
  )
}

const incompleteResults = results.filter(result => result.status !== 'DONE')

export const result = terminalResult ?? (incompleteResults.length > 0
  ? {
      status: incompleteResults[0].status,
      taskName: state.taskName,
      totalUnits: unitCount,
      totalBatches: batches.length,
      completedUnits: results.filter(item => item.status === 'DONE').length,
      incompleteUnits: incompleteResults.map(item => item.unitId),
      reason: '存在尚未完成的单元',
      results,
    }
  : {
      status: 'DONE',
      taskName: state.taskName,
      totalUnits: unitCount,
      totalBatches: batches.length,
      results,
    })
