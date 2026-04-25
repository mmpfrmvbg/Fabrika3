1. Базовые принципы
1.1 Разделять Command и Event
Command

Инструкция что-то сделать.

Примеры:

ResolveAssumptions
CompileContract
StartExecutionRun
RunVerification
CollectEvidence
RequestBehaviorApproval
DeployReleaseCandidate
Event

Факт, что что-то уже произошло.

Примеры:

AssumptionsResolved
ContractDrafted
ExecutionRunStarted
VerificationPassed
EvidenceBundleCompleted
BehaviorApproved
DeploymentSucceeded

Это важно, потому что:

команды могут быть отклонены;
события — immutable факт;
FSM должна слушать события, а не намерения.
1.2 События должны быть domain-first

Не:

run_python_step_done

А:

VerificationFailed
PolicyConflictDetected
EvidenceMarkedInsufficient

Иначе оркестратор утонет в слишком низком уровне.

1.3 Все события должны быть версионируемыми

У каждого event type:

event_type
event_version

Например:

contract.drafted.v1
execution.run_started.v1
2. Универсальный Event Envelope

Я бы все события заворачивал в единый envelope.

{
  "event_id": "evt_01JXYZ...",
  "event_type": "contract.drafted",
  "event_version": 1,
  "occurred_at": "2026-04-22T10:15:30Z",
  "producer": {
    "service": "spec-compiler",
    "instance_id": "spec-compiler-3"
  },
  "workspace_id": "ws_123",
  "project_id": "prj_456",
  "change_request_id": "chg_789",
  "execution_run_id": null,
  "correlation_id": "corr_abc",
  "causation_id": "evt_prev_001",
  "idempotency_key": "contract-drafted:chg_789:v3",
  "partition_key": "prj_456",
  "payload": {}
}
2.1 Обязательные поля envelope
event_id — уникальный id события
event_type
event_version
occurred_at
producer.service
workspace_id
project_id
correlation_id
causation_id
idempotency_key
partition_key
payload
2.2 Часто нужные nullable поля
intent_id
assumption_id
contract_id
contract_revision_id
passport_revision_id
policy_bundle_id
change_request_id
task_id
execution_run_id
evidence_bundle_id
release_candidate_id
deployment_id
3. Топики / очереди верхнего уровня

Я бы делил так:

3.1 Commands
orchestrator.commands
contracts.commands
execution.commands
verification.commands
evidence.commands
deployment.commands
3.2 Domain events
intent.events
assumptions.events
contract.events
policy.events
change.events
execution.events
verification.events
evidence.events
approval.events
release.events
runtime.events
3.3 System / dead letter
orchestrator.retries
orchestrator.dlq
audit.events

Если хочется проще для старта, можно начать с:

commands
domain-events
dlq

Но логически домены всё равно лучше разделять.

4. Доменные события по слоям
4.1 Intent Layer events
intent.created.v1

Когда создан новый intent.

{
  "intent_id": "int_001",
  "title": "Booking app for consultants",
  "source_type": "chat",
  "created_by": "usr_1"
}
intent.revised.v1

Intent изменён.

{
  "intent_id": "int_001",
  "intent_revision_id": "intrev_002",
  "version": 2,
  "change_summary": "Added payment requirement"
}
intent.abandoned.v1
4.2 Assumption Layer events
assumption.detected.v1
{
  "assumption_id": "asm_001",
  "intent_id": "int_001",
  "code": "A-001",
  "description": "User may cancel after payment",
  "criticality": "high",
  "status": "needs_human_decision"
}
assumption.status_changed.v1
{
  "assumption_id": "asm_001",
  "from_status": "needs_human_decision",
  "to_status": "approved",
  "resolution_type": "human",
  "resolved_by": "usr_1"
}
assumptions.blocking_detected.v1

Есть критические незакрытые assumptions.

{
  "intent_id": "int_001",
  "blocking_assumption_ids": ["asm_001", "asm_005"],
  "reason": "critical_assumptions_unresolved"
}
assumptions.resolved.v1

Все critical assumptions закрыты.

{
  "intent_id": "int_001",
  "assumptions_version": 4,
  "critical_open_count": 0
}
4.3 Contract Layer events
contract.draft_requested.v1 (command-like event or command)
contract.drafted.v1
{
  "contract_id": "ctr_001",
  "contract_revision_id": "ctrrev_003",
  "version": 3,
  "derived_from_intent_revision_id": "intrev_002",
  "assumptions_version": 4,
  "summary": "Booking app contract drafted with payment and cancellation flows"
}
contract.approval_requested.v1
{
  "contract_id": "ctr_001",
  "contract_revision_id": "ctrrev_003",
  "requested_from_user_id": "usr_1"
}
contract.approved.v1
{
  "contract_id": "ctr_001",
  "contract_revision_id": "ctrrev_003",
  "approved_by": "usr_1"
}
contract.rejected.v1
contract.superseded.v1
contract.drift_detected.v1
{
  "contract_id": "ctr_001",
  "contract_revision_id": "ctrrev_003",
  "drift_type": "contract_vs_runtime",
  "severity": "high",
  "details": "Observed cancellation behavior differs from contract rule"
}
4.4 Policy / Control events
passport.revised.v1
policy_bundle.activated.v1
{
  "passport_revision_id": "passrev_007",
  "policy_bundle_id": "pol_005",
  "version": 5
}
policy.conflict_detected.v1
{
  "change_request_id": "chg_789",
  "execution_run_id": "run_004",
  "conflict_type": "scope_violation",
  "severity": "block",
  "rule_code": "POL-SCOPE-001",
  "details": "Attempt to modify protected path src/core/**"
}
document.missing_required.v1
document.stale_detected.v1
run.invalidated_by_policy_change.v1
{
  "execution_run_id": "run_004",
  "policy_bundle_id": "pol_006",
  "reason": "policy_changed_after_run_started"
}
4.5 Change / FSM events

Это центральная группа.

change.created.v1
{
  "change_request_id": "chg_789",
  "change_kind": "feature",
  "source": "intent",
  "contract_revision_id": "ctrrev_003",
  "initial_state": "idea"
}
change.state_transitioned.v1
{
  "change_request_id": "chg_789",
  "from_state": "contract_approved",
  "to_state": "scaffolded",
  "event_type_causing_transition": "execution.scaffold_completed",
  "guard_result": "passed",
  "transition_reason": "Scaffold created successfully"
}

Это событие я бы считал обязательным.
Даже если есть более конкретные события, change.state_transitioned нужен для audit и replay.

change.blocked.v1
{
  "change_request_id": "chg_789",
  "blocked_state": "blocked_on_assumptions",
  "reason_code": "critical_assumption_unresolved",
  "blocking_refs": ["asm_001"]
}
change.escalated.v1
{
  "change_request_id": "chg_789",
  "escalation_type": "human_decision_required",
  "reason_code": "security_sensitive_change",
  "context_refs": {
    "assumption_ids": [],
    "policy_rule_ids": ["POL-SEC-003"]
  }
}
4.6 Execution events
execution.run_requested.v1
execution.run_started.v1
{
  "execution_run_id": "run_004",
  "change_request_id": "chg_789",
  "run_number": 1,
  "base_repo_revision": "abc123",
  "execution_manifest_id": "man_007"
}
execution.context_resolved.v1
{
  "execution_run_id": "run_004",
  "required_document_ids": ["doc_1", "doc_2"],
  "inventory_snapshot_id": "inv_008",
  "scope_guard_id": "sg_003"
}
execution.policy_resolved.v1
execution.scaffold_completed.v1
execution.implementation_completed.v1
{
  "execution_run_id": "run_004",
  "code_change_set_id": "ccs_001",
  "files_changed_count": 12
}
execution.failed.v1
{
  "execution_run_id": "run_004",
  "failure_stage": "implement",
  "failure_code": "generator_error",
  "retryable": true,
  "message": "Patch generation failed"
}
execution.invalidated.v1
4.7 Verification events
verification.requested.v1
verification.started.v1
verification.scope_violation_detected.v1
{
  "execution_run_id": "run_004",
  "code_change_set_id": "ccs_001",
  "violating_paths": ["src/core/payment.py"]
}
verification.failed.v1
{
  "execution_run_id": "run_004",
  "verification_report_id": "vr_001",
  "reason_codes": ["tests_failed", "policy_violation"],
  "blocking": true
}
verification.passed.v1
{
  "execution_run_id": "run_004",
  "verification_report_id": "vr_001",
  "scope_compliance": true,
  "policy_compliance": true,
  "contract_alignment": true
}
4.8 Test / check events
test.run_completed.v1
{
  "execution_run_id": "run_004",
  "test_execution_id": "tex_001",
  "test_case_id": "tc_101",
  "test_type": "e2e",
  "status": "passed"
}
quality_gate.failed.v1
{
  "execution_run_id": "run_004",
  "gate_type": "security",
  "gate_name": "sast",
  "status": "failed",
  "blocking": true
}
4.9 Evidence events
evidence.collection_requested.v1
evidence.bundle_created.v1
{
  "evidence_bundle_id": "evb_001",
  "execution_run_id": "run_004",
  "contract_revision_id": "ctrrev_003",
  "policy_bundle_id": "pol_005"
}
evidence.item_added.v1
{
  "evidence_bundle_id": "evb_001",
  "evidence_item_id": "evi_003",
  "evidence_type": "screenshot",
  "artifact_ref": "s3://bucket/screens/booking_success.png"
}
evidence.coverage_updated.v1
{
  "evidence_bundle_id": "evb_001",
  "acceptance_criterion_id": "ac_001",
  "coverage_status": "covered"
}
evidence.insufficient.v1
{
  "evidence_bundle_id": "evb_001",
  "missing_acceptance_criterion_ids": ["ac_004", "ac_009"],
  "reason": "acceptance_coverage_incomplete"
}
evidence.completed.v1
{
  "evidence_bundle_id": "evb_001",
  "coverage_status": "complete"
}
4.10 Approval events
approval.requested.v1
{
  "approval_request_id": "apr_001",
  "change_request_id": "chg_789",
  "approval_type": "behavior_approval",
  "requested_from_user_id": "usr_1"
}
approval.granted.v1
{
  "approval_request_id": "apr_001",
  "approval_type": "behavior_approval",
  "approved_by": "usr_1"
}
approval.rejected.v1
4.11 Release / deployment events
release.candidate_created.v1
{
  "release_candidate_id": "rc_001",
  "change_request_id": "chg_789",
  "execution_run_id": "run_004",
  "evidence_bundle_id": "evb_001"
}
release.readiness_confirmed.v1
{
  "release_candidate_id": "rc_001",
  "contract_version": 3,
  "policy_version": 5,
  "runtime_ready": true
}
deployment.requested.v1
deployment.started.v1
deployment.succeeded.v1
deployment.failed.v1
deployment.rolled_back.v1
4.12 Runtime assurance events
runtime.signal_detected.v1
{
  "deployment_id": "dep_001",
  "signal_type": "contract_violation",
  "severity": "high",
  "payload": {
    "flow_code": "FLOW-BOOKING-CREATE",
    "expected": "booking visible after creation",
    "observed": "booking missing from dashboard"
  }
}
runtime.check_failed.v1
rollback.triggered.v1
drift.detected.v1
{
  "project_id": "prj_456",
  "drift_type": "contract_vs_runtime",
  "severity": "critical",
  "source_ref": "dep_001"
}
5. Commands для оркестратора

Ниже минимальный command set.

5.1 Intent/contract
ResolveAssumptions
CompileContract
RequestContractApproval
5.2 Change/FSM
CreateChangeRequest
TransitionChangeState
EscalateChange
5.3 Execution
PrepareExecutionManifest
StartExecutionRun
RunScaffold
RunImplementation
RunHardening
5.4 Verification/evidence
RunVerification
RunQualityGates
CollectEvidence
RequestBehaviorApproval
5.5 Release/runtime
CreateReleaseCandidate
DeployReleaseCandidate
RunPostReleaseChecks
TriggerRollback
6. Partitioning / ordering strategy

Это очень важно.

6.1 Основное правило

Для большинства control-plane событий я бы partition key делал по:

change_request_id для workflow-событий
project_id для policy/runtime/drift-событий
Почему

change_request_id даёт порядок событий внутри одного workflow.
project_id нужен там, где важна консистентность на уровне проекта:

policy activation
locks
drift
runtime alerts
6.2 Практический компромисс
Топики workflow:

partition by change_request_id

change.events
execution.events
verification.events
evidence.events
approval.events
release.events
Топики governance/runtime:

partition by project_id

policy.events
runtime.events
drift.events
7. Идемпотентность и дедупликация

У каждого consumer должно быть:

event_id dedupe
idempotency_key dedupe для side effects

Пример:

один и тот же verification.passed.v1 не должен дважды переводить change в verified
один и тот же deployment.requested.v1 не должен запускать два deploy

Я бы хранил:

processed_event_id
last_idempotency_key
в отдельной consumer state таблице.
8. Happy path как последовательность событий

Вот минимальный happy path:

intent.created.v1
assumption.detected.v1
assumption.status_changed.v1
assumptions.resolved.v1
contract.drafted.v1
contract.approval_requested.v1
contract.approved.v1
change.created.v1
execution.run_requested.v1
execution.run_started.v1
execution.context_resolved.v1
execution.implementation_completed.v1
verification.started.v1
verification.passed.v1
evidence.bundle_created.v1
evidence.coverage_updated.v1
evidence.completed.v1
approval.requested.v1
approval.granted.v1
release.candidate_created.v1
release.readiness_confirmed.v1
deployment.started.v1
deployment.succeeded.v1
runtime.check_passed.v1 (если хочешь добавить)
change.state_transitioned.v1 на каждом этапе
9. Негативные ветки, которые обязаны быть
9.1 Assumption block
assumptions.blocking_detected.v1
change.blocked.v1
9.2 Policy conflict
policy.conflict_detected.v1
change.escalated.v1
9.3 Evidence insufficient
evidence.insufficient.v1
change.state_transitioned -> evidence_insufficient
9.4 Drift after deploy
runtime.signal_detected.v1
drift.detected.v1
rollback.triggered.v1
10. Outbox pattern

Я бы обязательно делал transactional outbox в сервисах, которые пишут критическое состояние:

orchestrator
contract service
execution service
verification service
evidence service
deployment service

Чтобы:

обновление БД,
запись в outbox,
публикация в Kafka

были согласованы.

Иначе FSM и event log начнут расходиться.

11. Минимальные consumer группы

Для старта достаточно:

orchestrator-fsm-consumer
assumption-manager
contract-compiler
execution-runner
verification-runner
evidence-collector
approval-manager
release-manager
runtime-assurance
12. Что должно быть в audit log отдельно

Хотя события уже и так лог, я бы всё равно писал отдельный нормализованный audit stream:

audit.events

Сюда реплицировать:

change.state_transitioned
policy.conflict_detected
approval.granted/rejected
deployment.started/succeeded/failed
rollback.triggered
drift.detected

Это удобно для compliance, replay и UI timeline.

13. Если совсем кратко: минимальный event contract

Если сжать до самого ядра, тебе нужны 12 обязательных событий:

intent.created
assumptions.resolved
contract.drafted
contract.approved
change.created
execution.run_started
execution.implementation_completed
verification.passed
evidence.completed
approval.granted
deployment.succeeded
drift.detected

И один обязательный meta-event:

change.state_transitioned

Этого уже хватит, чтобы оркестратор был событийным, трассируемым и совместимым с FSM.