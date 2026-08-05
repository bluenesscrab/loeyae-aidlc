export const meta = {
  name: 'aidlc-construction-batch',
  description: 'AI-DLC Construction 逐单元执行：批次仅用于进度分组，每个单元独立完成 TDD、审查与证据回写',
}

const state = await agent(
  `读取 docs/aidlc/state.md、工作单元定义和依赖文件，返回待执行单元。
每个单元必须包含 id、name、module、dependencies、dependencyDetails、requirementsPath、storiesPath、designPath；sharedInterfacesPath 无文件时可为空。dependencies 与 dependencyDetails 都必须显式返回数组；无依赖时均返回空数组。
每个 dependencyDetails 项对应一个实际依赖目标和类型（contract/implementation/runtime/none），并提供实际证据；适用的 contract 项提供契约 ID、基线 ID、Owner 目标代码路径、契约—Owner 映射、基线状态、代码版本与验证证据。每个契约 ID 必须有映射，但多个契约可以位于同一 Owner 目标代码路径；多基线必须拆成多项。
只把状态为 pending 的单元放入 pendingUnits，并保留依赖顺序；blocked、in_progress 与 complete 不放入 pendingUnits，blocked 单元 ID 写入 blockedUnitIds，in_progress 单元 ID 写入 inProgressUnitIds。若存在 rework_required 单元，设置 hasReworkRequired=true 并在 reworkRequiredUnitIds 返回其 ID，不得把它们放入 pendingUnits或修改其状态。state.md 存在未决或协调中的“活跃产品协调”时设置 hasActiveProductCoordination=true。依赖就绪结论由每个单元派发前按共享 steering 重新读取，不在本次批次清单中推导。`,
  {
    label: '读取 Construction 状态',
    schema: {
      type: 'object',
      required: ['taskName', 'pendingUnits', 'blockedUnitIds', 'inProgressUnitIds', 'hasActiveProductCoordination', 'hasReworkRequired', 'reworkRequiredUnitIds'],
      properties: {
        taskName: { type: 'string' },
        blockedUnitIds: { type: 'array', items: { type: 'string' } },
        inProgressUnitIds: { type: 'array', items: { type: 'string' } },
        hasActiveProductCoordination: { type: 'boolean' },
        hasReworkRequired: { type: 'boolean' },
        reworkRequiredUnitIds: { type: 'array', items: { type: 'string' } },
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

async function readUnitDispatchState(unitId, phase) {
  return agent(
    `重新读取 docs/aidlc/state.md 中单元 ${unitId} 的当前状态和“活跃产品协调”。返回该单元当前状态；若状态已是 rework_required，或活跃协调的影响范围包含该单元，则 requiresRework=true。不得修改 state.md。`,
    {
      label: `${phase}检查单元 ${unitId} 状态`,
      schema: {
        type: 'object',
        required: ['status', 'requiresRework'],
        properties: {
          status: { type: 'string', enum: ['pending', 'in_progress', 'rework_required', 'complete', 'blocked'] },
          requiresRework: { type: 'boolean' },
        },
      },
    }
  )
}

async function ensureReworkRequired(unitId, currentStatus) {
  if (currentStatus === 'rework_required') return
  await agent(
    `活跃产品协调已影响单元 ${unitId}。将该单元状态更新为 rework_required，保留既有证据但明确标记失效；不得改为 pending、in_progress、complete 或 blocked，不得修改其他单元。`,
    { label: `标记返工单元 ${unitId}` }
  )
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

const results = []
let terminalResult

execution: {
  if (state.hasActiveProductCoordination || state.hasReworkRequired || state.reworkRequiredUnitIds.length > 0) {
    const coordinationReason = state.hasActiveProductCoordination
      ? '存在活跃产品协调'
      : `存在 rework_required 单元：${state.reworkRequiredUnitIds.join(', ')}`
    await agent(
      `检测到 ${coordinationReason}。保持相关协调、单元状态和旧证据失效标记不变，在 docs/aidlc/state.md 更新下一操作为：按 common-workflow-changes.md 完成产品产物协调、更新单元定义并清除旧证据；协调关闭且返工单元转为 pending 前禁止调度。不得初始化或执行任何单元。`,
      { label: '阻断活跃产品协调' }
    )
    terminalResult = {
      status: 'NEEDS_CONTEXT',
      taskName: state.taskName,
      totalUnits: unitCount + state.blockedUnitIds.length + state.inProgressUnitIds.length + state.reworkRequiredUnitIds.length,
      totalBatches: batches.length,
      completedUnits: 0,
      incompleteUnits: [...new Set([...state.inProgressUnitIds, ...state.reworkRequiredUnitIds])],
      reason: coordinationReason,
      results,
    }
    break execution
  }

  if (state.inProgressUnitIds.length > 0) {
    terminalResult = {
      status: 'NEEDS_CONTEXT',
      taskName: state.taskName,
      totalUnits: unitCount + state.blockedUnitIds.length + state.inProgressUnitIds.length,
      totalBatches: batches.length,
      completedUnits: 0,
      incompleteUnits: state.inProgressUnitIds,
      reason: '存在 in_progress 单元，必须先按 state.md 恢复或确认其中断状态',
      results,
    }
    break execution
  }

  await agent(
    `更新 docs/aidlc/state.md：
1. 写入执行模式、批次大小、总批次和当前批次。
2. 在“单元与批次进度”表中仅为 pendingUnits 中尚无进度行的单元写入 module、batch、unit、pending、完成时间、验证证据、执行者；保留所有既有状态和证据，不得覆盖 blocked、rework_required 或 complete。
3. 不创建“批次进度”或其他进度文件。`,
    { label: '初始化逐单元进度' }
  )

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex]

    for (const unit of batch) {
      const dispatchState = await readUnitDispatchState(unit.id, '派发前')
      if (dispatchState.requiresRework) {
        await ensureReworkRequired(unit.id, dispatchState.status)
        terminalResult = {
          status: 'NEEDS_CONTEXT',
          completedUnits: results.filter(item => item.status === 'DONE').length,
          blockedUnit: unit.id,
          reason: `单元 ${unit.id} 受活跃产品协调影响，必须先完成返工准备`,
          results,
        }
        break execution
      }
      if (dispatchState.status === 'complete') continue
      if (dispatchState.status !== 'pending') {
        terminalResult = {
          status: 'BLOCKED',
          completedUnits: results.filter(item => item.status === 'DONE').length,
          blockedUnit: unit.id,
          reason: `单元 ${unit.id} 当前状态为 ${dispatchState.status}，仅 pending 可派发`,
          results,
        }
        break execution
      }

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

只处理该单元。派发前的就绪结论仅来自共享 steering；执行时若状态变化，按 common-context-optimization.md、construction-shared-contract-baseline.md 与 construction-subagent-execution.md 重新判定，不得重定义契约或绕过门禁。严格执行 batch-executor.md 的写回前门禁：重新检查当前单元状态和活跃产品协调，受影响时保持/标记 rework_required、使本次证据失效并返回 NEEDS_CONTEXT，不得写入 complete 或 blocked。`,
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

      const postExecutionState = await readUnitDispatchState(unit.id, '证据回写前')
      if (postExecutionState.requiresRework) {
        await ensureReworkRequired(unit.id, postExecutionState.status)
        result.status = 'NEEDS_CONTEXT'
        result.nextAction = 'STOP'
        result.reason = `单元 ${unit.id} 在执行期间受到产品协调影响，当前结果和证据已失效`
        results.push(result)
        terminalResult = {
          status: result.status,
          completedUnits: results.filter(item => item.status === 'DONE').length,
          blockedUnit: unit.id,
          reason: result.reason,
          results,
        }
        break execution
      }

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

    const persistedState = await agent(
      `核对 docs/aidlc/state.md 中单元 ${unit.id}：
- 返回状态：${result.status}
- TDD：${result.tddEvidence}
- 规格审查：${result.specReviewEvidence}
- 质量审查：${result.qualityReviewEvidence}
- 影响域验证：${result.impactValidationEvidence}
- 依赖门禁：${result.dependencyEvidence}

更新前必须再次读取当前单元状态和“活跃产品协调”。若单元已为 rework_required，或协调影响范围包含当前单元，则保持/更新为 rework_required，标记本次结果与既有证据失效，不得写入 complete 或 blocked；否则，仅当返回状态为 DONE 且五类证据完整时将该单元行更新为 complete，其他情况更新为 blocked 并记录原因：${result.reason || '需要处理'}。不得批量更新其他单元。完成后返回实际持久化状态；requiresRework 仅在最终保持/写入 rework_required 时为 true。`,
      {
        label: `核对单元 ${unit.id} 证据`,
        schema: {
          type: 'object',
          required: ['persistedStatus', 'requiresRework'],
          properties: {
            persistedStatus: { type: 'string', enum: ['complete', 'blocked', 'rework_required'] },
            requiresRework: { type: 'boolean' },
          },
        },
      }
    )

    if (persistedState.requiresRework || persistedState.persistedStatus === 'rework_required') {
      result.status = 'NEEDS_CONTEXT'
      result.nextAction = 'STOP'
      result.reason = `单元 ${unit.id} 在最终写回前受到产品协调影响，结果未持久化为完成`
    } else if (result.status === 'DONE' && persistedState.persistedStatus !== 'complete') {
      result.status = 'BLOCKED'
      result.nextAction = 'STOP'
      result.reason = `单元 ${unit.id} 返回 DONE，但 state.md 实际状态为 ${persistedState.persistedStatus}`
    }

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
}

const incompleteResults = results.filter(result => result.status !== 'DONE')
const persistedBlockedUnitIds = state.blockedUnitIds || []

export const result = terminalResult ?? (incompleteResults.length > 0
  ? {
      status: incompleteResults[0].status,
      taskName: state.taskName,
      totalUnits: unitCount + persistedBlockedUnitIds.length,
      totalBatches: batches.length,
      completedUnits: results.filter(item => item.status === 'DONE').length,
      incompleteUnits: [...new Set([...incompleteResults.map(item => item.unitId), ...persistedBlockedUnitIds])],
      reason: '存在尚未完成的单元',
      results,
    }
  : persistedBlockedUnitIds.length > 0
    ? {
        status: 'BLOCKED',
        taskName: state.taskName,
        totalUnits: unitCount + persistedBlockedUnitIds.length,
        totalBatches: batches.length,
        completedUnits: results.filter(item => item.status === 'DONE').length,
        incompleteUnits: persistedBlockedUnitIds,
        reason: 'state.md 中仍有 blocked 单元',
        results,
      }
    : {
        status: 'DONE',
        taskName: state.taskName,
        totalUnits: unitCount,
        totalBatches: batches.length,
        results,
      })
