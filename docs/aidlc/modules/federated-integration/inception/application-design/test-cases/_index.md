# Consumer I13 测试用例索引

- 生成时间：`2026-07-20T01:37:03Z`
- 聚合正文：[`consumer-aggregated-test-cases.md`](consumer-aggregated-test-cases.md)
- 产品覆盖：`35/35`
- 技术覆盖：`10` 个最小风险用例
- 总数边界：`35` 个产品 UC-D + `10` 个技术 UC-D = `45`
- 状态边界：全部 `design_status=ready`、`execution_status=blocked`、`status=blocked`；057 保持 `0/12`
- 运行边界：本文只登记 I13 设计追踪；Consumer 无 test script/SSOT 适配运行证据，Provider 无实现环境，不能据此声明 Consumer、Legacy、三平台、契约或 E2E 已运行通过。

## 产品用例索引

| 用例 ID | source_ref | 故事/场景 | 簇 | 类型 | design_status | execution_status | blocked_by | 正文锚点 |
|---------|------------|-----------|----|------|---------------|------------------|------------|----------|
| TC-C-001-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-001/S01` | ADLC-US-001/S01 | I | integration | ready | blocked | runtime_dependencies_ref, test_command_ref, report_location_ref, owner_ref | [正文](consumer-aggregated-test-cases.md#tc-c-001-s01) |
| TC-C-001-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-001/S02` | ADLC-US-001/S02 | I | resilience | ready | blocked | runtime_dependencies_ref, test_command_ref, report_location_ref, owner_ref | [正文](consumer-aggregated-test-cases.md#tc-c-001-s02) |
| TC-C-002-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-002/S01` | ADLC-US-002/S01 | E | unit | ready | blocked | runtime_dependencies_ref, test_command_ref, report_location_ref, owner_ref | [正文](consumer-aggregated-test-cases.md#tc-c-002-s01) |
| TC-C-002-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-002/S02` | ADLC-US-002/S02 | E | integration | ready | blocked | runtime_dependencies_ref, test_command_ref, report_location_ref, owner_ref | [正文](consumer-aggregated-test-cases.md#tc-c-002-s02) |
| TC-C-003-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-003/S01` | ADLC-US-003/S01 | B | contract | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-003-s01) |
| TC-C-003-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-003/S02` | ADLC-US-003/S02 | B | contract | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-003-s02) |
| TC-C-003-S03 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-003/S03` | ADLC-US-003/S03 | B | resilience | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-003-s03) |
| TC-C-004-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-004/S01` | ADLC-US-004/S01 | E | integration | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-004-s01) |
| TC-C-004-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-004/S02` | ADLC-US-004/S02 | E | integration | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-004-s02) |
| TC-C-004-S03 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-004/S03` | ADLC-US-004/S03 | E | integration | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-004-s03) |
| TC-C-005-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-005/S01` | ADLC-US-005/S01 | E | contract | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-005-s01) |
| TC-C-005-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-005/S02` | ADLC-US-005/S02 | E | resilience | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-005-s02) |
| TC-C-005-S03 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-005/S03` | ADLC-US-005/S03 | E | resilience | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, project_ref_02, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-005-s03) |
| TC-C-006-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-006/S01` | ADLC-US-006/S01 | F | integration | ready | blocked | runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, owner_ref | [正文](consumer-aggregated-test-cases.md#tc-c-006-s01) |
| TC-C-006-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-006/S02` | ADLC-US-006/S02 | F | unit | ready | blocked | runtime_dependencies_ref, test_command_ref, report_location_ref, owner_ref | [正文](consumer-aggregated-test-cases.md#tc-c-006-s02) |
| TC-C-007-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-007/S01` | ADLC-US-007/S01 | F | integration | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-007-s01) |
| TC-C-007-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-007/S02` | ADLC-US-007/S02 | F | contract | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-007-s02) |
| TC-C-007-S03 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-007/S03` | ADLC-US-007/S03 | G | resilience | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-007-s03) |
| TC-C-008-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-008/S01` | ADLC-US-008/S01 | F | contract | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-008-s01) |
| TC-C-008-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-008/S02` | ADLC-US-008/S02 | F | contract | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-008-s02) |
| TC-C-008-S03 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-008/S03` | ADLC-US-008/S03 | F | resilience | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-008-s03) |
| TC-C-009-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-009/S01` | ADLC-US-009/S01 | I | integration | ready | blocked | owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref | [正文](consumer-aggregated-test-cases.md#tc-c-009-s01) |
| TC-C-009-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-009/S02` | ADLC-US-009/S02 | I | integration | ready | blocked | owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-009-s02) |
| TC-C-010-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-010/S01` | ADLC-US-010/S01 | H | integration | ready | blocked | owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref | [正文](consumer-aggregated-test-cases.md#tc-c-010-s01) |
| TC-C-010-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-010/S02` | ADLC-US-010/S02 | H | resilience | ready | blocked | owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref | [正文](consumer-aggregated-test-cases.md#tc-c-010-s02) |
| TC-C-011-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-011/S01` | ADLC-US-011/S01 | G | resilience | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-011-s01) |
| TC-C-011-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-011/S02` | ADLC-US-011/S02 | G | resilience | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-011-s02) |
| TC-C-011-S03 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-011/S03` | ADLC-US-011/S03 | G | resilience | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-011-s03) |
| TC-C-012-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-012/S01` | ADLC-US-012/S01 | J | e2e | ready | blocked | owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref | [正文](consumer-aggregated-test-cases.md#tc-c-012-s01) |
| TC-C-012-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-012/S02` | ADLC-US-012/S02 | J | unit | ready | blocked | owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref | [正文](consumer-aggregated-test-cases.md#tc-c-012-s02) |
| TC-C-012-S03 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-012/S03` | ADLC-US-012/S03 | J | unit | ready | blocked | owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref | [正文](consumer-aggregated-test-cases.md#tc-c-012-s03) |
| TC-C-013-S01 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-013/S01` | ADLC-US-013/S01 | J | e2e | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-013-s01) |
| TC-C-013-S02 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-013/S02` | ADLC-US-013/S02 | J | e2e | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-013-s02) |
| TC-C-013-S03 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-013/S03` | ADLC-US-013/S03 | J | e2e | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, project_ref_02, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-013-s03) |
| TC-C-013-S04 | `docs/aidlc/modules/federated-integration/inception/user-stories/stories.full.md#ADLC-US-013/S04` | ADLC-US-013/S04 | J | e2e | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, project_ref_02, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-013-s04) |

## 技术风险用例索引

| 用例 ID | source_ref | 故事/场景 | 簇 | 类型 | design_status | execution_status | blocked_by | 正文锚点 |
|---------|------------|-----------|----|------|---------------|------------------|------------|----------|
| TC-C-TECH-001 | `docs/aidlc/product/system-baseline/consistency-scenarios.md#CONS-ADLC-DOC-001` | 不适用 / CONS-ADLC-DOC-001 | F | integration | ready | blocked | owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref | [正文](consumer-aggregated-test-cases.md#tc-c-tech-001) |
| TC-C-TECH-002 | `../loeyae-ssot-server/contracts/ssot-api-v3.openapi.json#/paths/~1v3~1projects:resolve/post` | 不适用 / SSOT-PROJECT-001 | B | contract | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, project_ref_02, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-tech-002) |
| TC-C-TECH-003 | `../loeyae-ssot-server/contracts/ssot-api-v3.openapi.json#/paths/~1v3~1projects~1{projectId}~1retrieval:search/post;../loeyae-ssot-server/contracts/ssot-api-v3.openapi.json#/paths/~1v3~1projects~1{projectId}~1materials~1{materialId}~1revisions~1{revisionId}/get` | 不适用 / SSOT-RETRIEVAL-001 + SSOT-MATERIAL-001 | E | contract | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-tech-003) |
| TC-C-TECH-004 | `../loeyae-ssot-server/contracts/ssot-api-v3.openapi.json#/paths/~1v3~1projects~1{projectId}~1context-bundles/post;../loeyae-ssot-server/contracts/ssot-api-v3.openapi.json#/paths/~1v3~1projects~1{projectId}~1materials~1{materialId}~1revisions~1{revisionId}~1index-status/get` | 不适用 / SSOT-CONTEXT-001 + SSOT-INDEX-STATUS-001 | E | contract | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, project_ref_02, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-tech-004) |
| TC-C-TECH-005 | `docs/aidlc/product/system-baseline/consistency-scenarios.md#CONS-ADLC-LINEAGE-001;../loeyae-ssot-server/contracts/ssot-api-v3.openapi.json#/paths/~1v3~1projects~1{projectId}~1lineage-records:publish/post;../loeyae-ssot-server/contracts/ssot-api-v3.openapi.json#/paths/~1v3~1projects~1{projectId}~1lineage-records:query/post` | 不适用 / CONS-ADLC-LINEAGE-001 + SSOT-LINEAGE-001 | G | resilience | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-tech-005) |
| TC-C-TECH-006 | `docs/aidlc/product/system-baseline/consistency-scenarios.md#CONS-ADLC-REVERSE-001;../loeyae-ssot-server/contracts/ssot-api-v3.openapi.json#/paths/~1v3~1projects~1{projectId}~1reverse-documents~1{reverseDocumentId}~1revisions/post` | 不适用 / CONS-ADLC-REVERSE-001 + SSOT-REVERSE-DOC-001 | F | contract | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-tech-006) |
| TC-C-TECH-007 | `docs/aidlc/product/system-baseline/consistency-scenarios.md#CONS-ADLC-RECOVERY-001;../loeyae-ssot-server/contracts/ssot-api-v3.openapi.json#/components/schemas/SsotError` | 不适用 / CONS-ADLC-RECOVERY-001 + SSOT-FAILURE-001 | G | resilience | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-tech-007) |
| TC-C-TECH-008 | `docs/aidlc/product/system-baseline/consistency-scenarios.md#CONS-ADLC-LEGACY-001;docs/aidlc/product/system-baseline/consistency-scenarios.md#统一恢复约束` | 不适用 / CONS-ADLC-LEGACY-001 | H | integration | ready | blocked | owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-tech-008) |
| TC-C-TECH-009 | `docs/aidlc/modules/federated-integration/inception/application-design/component-dependency.md#依赖禁止项` | 不适用 / CORE-CONFORMANCE-KIRO-CLAUDE-OPENCODE | I | integration | ready | blocked | owner_ref, runtime_dependencies_ref, test_command_ref, report_location_ref, version_matrix_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-tech-009) |
| TC-C-TECH-010 | `docs/aidlc/modules/federated-integration/inception/plans/test-case-derivation-plan.md#执行锚点缺口` | 不适用 / I13-J-TWO-PROJECT-E2E-EVIDENCE | J | e2e | ready | blocked | environment_ref, api_base_url_alias, identity_ref, owner_ref, runtime_dependencies_ref, project_ref_01, project_ref_02, test_command_ref, report_location_ref, version_matrix_ref, thresholds_ref, secret_injection_ref | [正文](consumer-aggregated-test-cases.md#tc-c-tech-010) |

## 覆盖结论

### 产品场景

- `ADLC-US-001`—`ADLC-US-013`：13/13 故事已列入。
- Gherkin Scenario：35/35，每个场景有唯一 `TC-C-{故事三位编号}-S{两位编号}`，正文原文各出现一次，不按平台复制。

### 一致性场景

| CONS 场景 | 覆盖用例 | 结论 |
|-----------|----------|------|
| CONS-ADLC-DOC-001 | TC-C-TECH-001 | 已建立设计覆盖，运行阻断 |
| CONS-ADLC-LINEAGE-001 | TC-C-TECH-005 | 已建立设计覆盖，运行阻断 |
| CONS-ADLC-REVERSE-001 | TC-C-TECH-006 | 已建立设计覆盖，运行阻断 |
| CONS-ADLC-RECOVERY-001 | TC-C-TECH-007 | 已建立设计覆盖，运行阻断 |
| CONS-ADLC-LEGACY-001 | TC-C-TECH-008 | 已建立设计覆盖，运行阻断 |

结论：CONS-ADLC 覆盖 `5/5`，仅为派生与设计覆盖，不是运行通过。

### 八项 Provider 契约 Consumer 映射

| 契约 | operationId | 覆盖用例 | 结论 |
|------|-------------|----------|------|
| SSOT-PROJECT-001 | `resolveProject` | TC-C-TECH-002 | Consumer 映射已设计，运行阻断 |
| SSOT-MATERIAL-001 | `getMaterialRevision` | TC-C-TECH-003 | Consumer 映射已设计，运行阻断 |
| SSOT-RETRIEVAL-001 | `searchProjectMaterials` | TC-C-TECH-003 | Consumer 映射已设计，运行阻断 |
| SSOT-CONTEXT-001 | `createContextBundle` | TC-C-TECH-004 | Consumer 映射已设计，运行阻断 |
| SSOT-REVERSE-DOC-001 | `createReverseDocumentRevision` | TC-C-TECH-006 | Consumer 映射已设计，运行阻断 |
| SSOT-LINEAGE-001 | `publishLineageRecords`、`queryLineageRecords` | TC-C-TECH-005 | Consumer 映射已设计，运行阻断 |
| SSOT-INDEX-STATUS-001 | `getRevisionIndexStatus` | TC-C-TECH-004 | Consumer 映射已设计，运行阻断 |
| SSOT-FAILURE-001 | 八个 operationId 的统一错误决策 | TC-C-TECH-007 | 跨操作错误映射已设计，运行阻断 |

结论：八项 v3 读取契约映射 `8/8`；路径前缀均为 `/v3`，OpenAPI 仅作 Provider 机器事实引用，本文未复制 Schema。

### Provider/Core v3 独立消费者契约边界

| 消费边界 | 当前组合 | 覆盖用例 | 设计断言 | execution_status |
|----------|----------|----------|----------|------------------|
| Core v3 读取契约 | Provider `3.0.0-candidate.1`、`/v3` → Core | TC-C-005-S01、TC-C-TECH-002—007 | 只消费八项现行契约中的固定来源、索引与降级状态，不消费讨论摘要 | blocked |
| 三平台间接消费 | Core → Kiro/Claude Code/OpenCode | TC-C-009-S01—S02、TC-C-TECH-009 | 三平台共享同一 Core，Provider 直连为 0，无讨论摘要 | blocked |
| 版本不支持 | 任一非 `3.0.0-candidate.1` 组合 | TC-C-TECH-007 | `CONTRACT_VERSION_UNSUPPORTED` 阻断且 state 不推进 | blocked |

上述仅为独立消费者契约设计，不表示 Core、三平台或任一版本组合已适配、已验证或已运行。

### V-XPIMPORT-01—12 静态候选设计映射

| V-XPIMPORT | 当前设计映射 | Consumer 边界 | execution_status |
|------------|--------------|---------------|------------------|
| V-XPIMPORT-01 | TC-C-003-S01—S03、TC-C-TECH-002 | 读取授权不扩大；跨项目例外仅属 Provider 写侧 | blocked |
| V-XPIMPORT-02 | TC-C-TECH-002—007 | v3 `3.0.0-candidate.1`、`/v3`、八项读取契约引用闭合 | blocked |
| V-XPIMPORT-03 | TC-C-013-S03、TC-C-TECH-010 | 跨项目写入成功/失败/冲突/重复均零泄露 | blocked |
| V-XPIMPORT-04 | TC-C-013-S03、TC-C-TECH-010 | active/archived 状态恢复与历史内容恢复新修订 | blocked |
| V-XPIMPORT-05 | TC-C-013-S03、TC-C-TECH-010 | 配额、成本、风险、通知、申诉、隔离、审计责任 | blocked |
| V-XPIMPORT-06 | TC-C-005-S03、TC-C-013-S01、TC-C-TECH-003—005 | 读取、Context、血缘与派生保持目标项目隔离 | blocked |
| V-XPIMPORT-07 | TC-C-013-S03、TC-C-TECH-010 | Portal 行为仅作为 Provider 前置证据，不由 Consumer 复制 | blocked |
| V-XPIMPORT-08 | TC-C-TECH-002—008 | U-C01 仅适配 v3 读取/Context/血缘/逆向写，不暴露四个生命周期写入口 | blocked |
| V-XPIMPORT-09 | TC-C-009-S01—S02、TC-C-013-S01、TC-C-TECH-009 | 三平台只经 Core、零直连 Provider、业务语义一致 | blocked |
| V-XPIMPORT-10 | 35 个产品 UC-D、10 个技术 UC-D 与 I14 映射 | 追踪闭合；6 单元结构不变 | blocked |
| V-XPIMPORT-11 | TC-C-013-S04、TC-C-TECH-010 | 实现、环境、身份、数据与外部消费者未知项不猜测 | blocked |
| V-XPIMPORT-12 | TC-C-013-S03—S04、TC-C-TECH-007、010 | 版本组合、停止写入、状态/内容回滚与审计保留 | blocked |

V-XPIMPORT-01—12 仅为静态候选设计映射，全部 `execution_status=blocked`；未运行、未通过。

### Legacy、三平台与版本/恢复

- Legacy 与 Secret 隔离：TC-C-010-S01、TC-C-010-S02、TC-C-TECH-008 覆盖未配置模式、Provider v3 八项读取契约及四个生命周期写入口调用均为 0、任一误调用即失败，以及 Secret/令牌/完整资料正文不进入 state v2 或普通日志；运行阻断。
- 三平台共享 Core conformance：TC-C-009-S01、TC-C-009-S02、TC-C-TECH-009 使用单一参数集验证 Kiro/Claude Code/OpenCode 薄适配；三平台共享 Core、Provider 零直连、无讨论摘要；运行阻断。
- 版本/恢复：TC-C-TECH-005 覆盖超时未知、重复和 partial；TC-C-TECH-007 仅接受 Provider v3 `3.0.0-candidate.1`，其他版本以 `CONTRACT_VERSION_UNSUPPORTED` 阻断且 state 不推进，不消费讨论摘要；运行阻断。
- 真实闭环与证据：TC-C-013-S01—S04、TC-C-TECH-010 覆盖双项目隔离、Provider/Legacy/conformance/E2E 证据完整性；运行阻断。

## blocked 待决策清单

| blocked_by | 当前结论 | 解除阻断所需登记 |
|------------|----------|------------------|
| environment_ref | 未登记，执行阻断 | Provider 非敏感环境受控引用 |
| api_base_url_alias | 未登记，执行阻断 | API 基址稳定脱敏别名 |
| identity_ref | 未登记，执行阻断 | 测试身份受控引用 |
| owner_ref | 未登记，执行阻断 | 环境、运行和证据 Owner 引用 |
| runtime_dependencies_ref | 未登记，执行阻断 | Provider/Core/三平台固定依赖与重置方式 |
| project_ref_01 | 未登记，执行阻断 | 第一真实脱敏项目稳定引用 |
| project_ref_02 | 未登记，执行阻断 | 第二真实脱敏项目稳定引用 |
| test_command_ref | 未登记，执行阻断 | Core、契约、conformance、Legacy、E2E 的真实单次命令引用 |
| report_location_ref | 未登记，执行阻断 | 契约、conformance、Legacy、E2E 报告受控位置 |
| version_matrix_ref | 未登记，执行阻断 | Provider/Core/三平台固定版本与兼容结论 |
| thresholds_ref | 未登记，执行阻断 | 检索、预算、恢复、性能和安全批准阈值 |
| secret_injection_ref | 未登记，执行阻断 | Secret 注入机制的非敏感受控引用 |

当前登记状态：`0/12`。Consumer 总数为 35 个产品 UC-D + 10 个技术 UC-D = 45；本索引不填示例值，也不把设计常量、相对路径、候选版本或仓库版本误作运行锚点。

## C8 证据映射边界

| C8 证据域 | 对应用例 | 当前状态 |
|-----------|----------|----------|
| Core 单元/集成与 state v2 | TC-C-001-S01—TC-C-002-S02、TC-C-006-S01—S02、TC-C-012-S01—S03、TC-C-TECH-001 | test_command_ref/report_location_ref 未登记，未执行 |
| Provider Consumer 契约 | TC-C-003-S01—TC-C-008-S03、TC-C-011-S01—S03、TC-C-TECH-002—007 | Provider 无实现环境，未执行 |
| Legacy 零调用与 Secret 隔离 | TC-C-010-S01—S02、TC-C-TECH-008 | 黄金环境、Secret 注入与命令/报告未登记，未执行 |
| 三平台 conformance | TC-C-009-S01—S02、TC-C-TECH-009 | 三平台依赖、命令、报告和版本矩阵未登记，未执行 |
| 真实项目 E2E | TC-C-013-S01—S04、TC-C-TECH-010 | 两个项目与全部在线锚点未登记，未执行 |
| 版本、恢复和故障 | TC-C-007-S03、TC-C-011-S01—S03、TC-C-TECH-005、TC-C-TECH-007 | 故障环境、阈值、版本矩阵和报告未登记，未执行 |

I14 已生成并由 060=A 批准实际工作单元；用例到单元的设计归属见 `../unit-of-work-story-map.md`。Consumer 6/6 单元仍未认领；Provider 的 U-P01 已认领不改变本仓运行阻断。C8 只能在后续获批单元的 Construction 中使用真实命令和稳定报告回填执行证据。静态 Markdown、设计锚点或 OpenAPI 引用不得替代 C8 运行证据。
