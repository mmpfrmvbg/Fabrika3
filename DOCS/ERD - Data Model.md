ERD / Data Model
1. Главные bounded contexts

Я бы разделил модель на 6 контекстов:

Workspace / Project
Intent / Assumptions / Contract
Control Plane / Policies / Documents
Change Management / FSM
Execution / Build / Preview / Release
Evidence / Runtime Assurance
2. Сущности верхнего уровня
2.1 Workspace
workspace

Главный контейнер системы.

Поля:

id
name
slug
description
owner_id
status (active, archived, setup_required)
created_at
updated_at

Связи:

1:N с project
1:N с user_workspace_role
1:N с intent
1:N с document
1:N с change_request
2.2 Project
project

Конкретный продукт/репозиторий внутри workspace.

Поля:

id
workspace_id
name
repo_url
default_branch
runtime_type (web_app, internal_tool, api_service, etc.)
supported_envelope_profile
status
created_at
updated_at

Связи:

N:1 с workspace
1:N с project_version
1:1 с project_passport
1:N с policy_bundle
1:N с document_registry_entry
1:N с inventory_snapshot
1:N с change_request
3. Intent / Assumptions / Contract
3.1 Intent
intent

Сырая бизнес-идея или новая пользовательская цель.

Поля:

id
workspace_id
project_id nullable
title
raw_prompt
source_type (chat, import, template, manual)
status (draft, in_refinement, converted_to_contract, abandoned)
created_by
created_at
updated_at

Связи:

1:N с intent_revision
1:N с assumption
1:0..N с product_contract
intent_revision

Версионность intent.

Поля:

id
intent_id
version
content
change_summary
created_by
created_at
3.2 Assumptions
assumption

Явное допущение.

Поля:

id
intent_id
project_id
code (A-001)
description
category (business_rule, ux, data_model, integration, security, ops)
criticality (low, medium, high, critical)
status (open, auto_defaulted, needs_human_decision, approved, rejected)
resolution_type (human, default, derived)
resolution_note
resolved_by
resolved_at
created_at
updated_at

Связи:

N:1 с intent
M:N с product_contract_revision
1:N с assumption_event
assumption_event

История изменения assumption.

Поля:

id
assumption_id
from_status
to_status
reason
actor_type (human, agent, policy_engine)
actor_id
created_at
3.3 Product Contract

Я бы делал контракт как aggregate root, а не как просто пачку файлов.

product_contract

Контейнер продуктового контракта.

Поля:

id
project_id
intent_id
current_revision_id
status (draft, pending_approval, approved, superseded, invalidated)
created_by
created_at
updated_at

Связи:

1:N с product_contract_revision
1:N с change_request
product_contract_revision

Версия контракта.

Поля:

id
product_contract_id
version
status
summary
derived_from_intent_revision_id
assumptions_version_hash
created_by
created_at

Связи:

1:1 с product_spec
1:N с flow_definition
1:N с business_rule
1:N с acceptance_criterion
1:N с design_spec_reference
product_spec

Аналог product.yaml.

Поля:

id
contract_revision_id
product_type
target_users_json
value_proposition
core_entities_json
integrations_json
constraints_json
flow_definition

Аналог flows.yaml.

Поля:

id
contract_revision_id
code (FLOW-BOOKING-CREATE)
name
actor_role
trigger
preconditions_json
steps_json
success_outcome
failure_outcomes_json
priority
required
business_rule

Аналог rules.yaml.

Поля:

id
contract_revision_id
code
description
rule_type (validation, pricing, authorization, state_transition, notification)
expression_json nullable
severity (informational, required, blocking)
acceptance_criterion

Аналог acceptance.yaml.

Поля:

id
contract_revision_id
code (AC-001)
description
flow_code nullable
rule_code nullable
verification_type (test, visual, manual_review, runtime_check)
required
priority

Связи:

M:N с evidence_item
M:N с test_case
design_spec_reference

Ссылка на дизайн/бренд.

Поля:

id
contract_revision_id
document_id
kind (design_yaml, brand_doc, wireframe, mock)
required
4. Control Plane / Policies / Documents
4.1 Passport and Policies
project_passport

Нормативная конституция проекта.

Поля:

id
project_id
current_revision_id
status
created_at
updated_at
project_passport_revision

Версия паспорта.

Поля:

id
project_passport_id
version
summary
envelope_profile
default_quality_gate_profile
created_by
created_at
policy_bundle

Группа policy-файлов, действующих вместе.

Поля:

id
project_id
passport_revision_id
version
status (draft, active, superseded)
created_at
policy_rule

Нормативное правило.

Поля:

id
policy_bundle_id
code
policy_type (scope, security, approval, tooling, deploy, document_requirement)
scope_pattern
rule_payload_json
severity (warn, block)
active
scope_guard

Явная модель границ изменений.

Поля:

id
project_id
name
allow_patterns_json
deny_patterns_json
applies_to_change_kind_json
created_at
4.2 Documents
document

Любой документ в Project Space.

Поля:

id
workspace_id
project_id
title
path
source_type (repo, uploaded, generated, external_ref)
doc_type (policy, charter, playbook, domain_doc, design_doc, adr)
authority (normative, operational, descriptive, generated, advisory)
freshness_status (verified, stale, provisional, unknown)
owner_id
last_verified_at
created_at
updated_at
document_registry_entry

Реестр применимости документа.

Поля:

id
project_id
document_id
document_code
required_for_json
scope_tags_json
applies_to_paths_json
applies_to_change_types_json
priority
active
document_dependency

Связь документов.

Поля:

id
parent_document_id
child_document_id
dependency_type (requires, references, supersedes, derived_from)
4.3 Inventory / Observed State
inventory_snapshot

Автогенерируемый observed state.

Поля:

id
project_id
repo_revision
scanner_version
status (provisional, current, superseded, failed)
generated_at
inventory_module

Обнаруженный модуль/сервис.

Поля:

id
inventory_snapshot_id
name
path
module_type
language
criticality
owner_hint
metadata_json
inventory_tooling

Обнаруженные команды/инструменты.

Поля:

id
inventory_snapshot_id
tool_type (test, lint, build, deploy, migration)
name
command
confidence
drift_event

Конфликт между normative/descriptive/runtime.

Поля:

id
project_id
drift_type (passport_vs_inventory, contract_vs_runtime, policy_vs_execution)
severity
description
detected_by
status (open, acknowledged, resolved, ignored)
created_at
resolved_at
5. Change Management / FSM
5.1 Change Request
change_request

Главная сущность изменения.

Поля:

id
project_id
title
description
change_kind (feature, bugfix, refactor, hardening, migration, policy_update)
source (intent, manual, observer, runtime_alert)
intent_id nullable
contract_revision_id
passport_revision_id
policy_bundle_id
priority
risk_level
current_state
current_run_id nullable
created_by
created_at
updated_at

Связи:

1:N с change_state_transition
1:N с task
1:N с execution_run
1:N с approval_request
1:N с release_candidate
change_state_transition

Журнал FSM-переходов.

Поля:

id
change_request_id
from_state
to_state
event_type
guard_result (passed, failed)
reason
actor_type
actor_id
metadata_json
created_at
task

Декомпозиция change на исполнимые задачи.

Поля:

id
change_request_id
parent_task_id nullable
title
description
task_kind
scope_guard_id
status
priority
assigned_agent_type
created_at
updated_at
approval_request

Явная точка human approval.

Поля:

id
change_request_id
approval_type (assumption_resolution, contract_approval, behavior_approval, deploy_approval)
status (pending, approved, rejected, expired)
requested_from_user_id
decision_note
decided_at
created_at
lock_record

Lock на модуль/путь/ресурс.

Поля:

id
project_id
resource_type (path, module, contract, policy_bundle)
resource_key
locked_by_run_id
expires_at
created_at
6. Execution / Build / Preview / Release
6.1 Execution
execution_run

Конкретная попытка исполнения change.

Поля:

id
change_request_id
run_number
trigger_type (manual, auto, retry)
status (queued, context_resolved, policy_resolved, running, blocked, failed, succeeded, invalidated)
execution_manifest_id
base_repo_revision
started_at
finished_at
execution_manifest

Скомпилированный контекст запуска.

Поля:

id
change_request_id
contract_revision_id
passport_revision_id
policy_bundle_id
inventory_snapshot_id
scope_guard_id
required_document_ids_json
tool_permissions_json
gates_json
version_hash
created_at
agent_action

Нормализованный журнал действий агента.

Поля:

id
execution_run_id
agent_type (analyst, spec_compiler, executor, hardener, verifier)
action_type (read_doc, generate_patch, run_test, request_approval, collect_evidence)
input_ref_json
output_ref_json
status
started_at
finished_at
code_change_set

Набор изменений в коде.

Поля:

id
execution_run_id
repo_revision_before
repo_revision_after nullable
branch_name
diff_summary
files_changed_count
lines_added
lines_removed
scope_violation_detected
created_at
changed_file

Файлы внутри change set.

Поля:

id
code_change_set_id
path
change_type (added, modified, deleted, renamed)
in_allowed_scope
risk_label
6.2 Test and Verification
test_case

Нормализованный тест или проверка.

Поля:

id
project_id
code
name
test_type (unit, integration, e2e, contract, visual, security, performance, accessibility)
source_ref
active
test_execution

Запуск теста/чека в рамках run.

Поля:

id
execution_run_id
test_case_id
status (passed, failed, skipped)
raw_result_ref
started_at
finished_at
verification_report

Агрегированный отчёт verifier.

Поля:

id
execution_run_id
status (passed, failed, insufficient)
scope_compliance
policy_compliance
contract_alignment
summary
created_at
6.3 Preview and Release
preview_environment

Preview для change.

Поля:

id
change_request_id
execution_run_id
url
status
expires_at
created_at
release_candidate

Кандидат на релиз.

Поля:

id
change_request_id
execution_run_id
contract_revision_id
policy_bundle_id
evidence_bundle_id
artifact_ref
status (draft, ready, approved, deployed, rejected, invalidated)
created_at
updated_at
deployment

Факт деплоя.

Поля:

id
release_candidate_id
environment (staging, prod)
status (started, succeeded, failed, rolled_back)
deployed_at
rolled_back_at
7. Evidence / Runtime Assurance
7.1 Evidence
evidence_bundle

Главный контейнер доказательств.

Поля:

id
change_request_id
execution_run_id
contract_revision_id
policy_bundle_id
code_change_set_id
status (draft, complete, insufficient, superseded)
coverage_status
summary
created_at
evidence_item

Единица доказательства.

Поля:

id
evidence_bundle_id
evidence_type (test_result, screenshot, video, trace, metric, manual_note, verification_report)
title
artifact_ref
status
metadata_json
created_at
acceptance_coverage

Связь evidence с acceptance criterion.

Поля:

id
evidence_bundle_id
acceptance_criterion_id
coverage_status (covered, partial, missing, failed)
evidence_item_id nullable
note
human_behavior_review

Поведенческое подтверждение.

Поля:

id
evidence_bundle_id
reviewer_id
status (approved, rejected, changes_requested)
comment
created_at
7.2 Runtime Assurance
runtime_signal

Сигнал из продовой среды.

Поля:

id
project_id
deployment_id
signal_type (error_rate, latency, security_alert, business_anomaly, contract_violation)
severity
payload_json
detected_at
runtime_check

Пост-релизная проверка.

Поля:

id
deployment_id
check_type
status
result_ref
created_at
rollback_event

Событие отката.

Поля:

id
deployment_id
trigger_type
reason
initiated_by
created_at
8. Ключевые связи в виде текста

Упрощённо:

workspace -> project
project -> intent
intent -> assumption
intent -> product_contract
product_contract -> product_contract_revision
product_contract_revision -> flow_definition, business_rule, acceptance_criterion
project -> project_passport -> project_passport_revision
project -> policy_bundle -> policy_rule
project -> document_registry_entry -> document
project -> inventory_snapshot
project -> change_request
change_request -> execution_run
execution_run -> execution_manifest
execution_run -> code_change_set
execution_run -> test_execution
execution_run -> verification_report
execution_run -> preview_environment
execution_run -> evidence_bundle
evidence_bundle -> evidence_item
evidence_bundle -> acceptance_coverage
change_request -> release_candidate -> deployment
deployment -> runtime_signal, runtime_check, rollback_event
9. Какой здесь aggregate root

Я бы держал такие aggregate roots:

A. product_contract

Внутри:

revisions
flows
rules
acceptance criteria
design refs
B. change_request

Внутри:

tasks
transitions
approvals
runs
release candidates
C. execution_run

Внутри:

manifest
agent actions
change set
test executions
verification report
D. evidence_bundle

Внутри:

evidence items
acceptance coverage
behavior review

Это удобно и для ORM, и для event sourcing, и для API boundaries.

10. Минимальные индексы

Нужны почти наверняка:

Для change_request
(project_id, current_state)
(project_id, priority, risk_level)
(contract_revision_id)
(policy_bundle_id)
Для assumption
(intent_id, status, criticality)
(project_id, status)
Для execution_run
(change_request_id, status)
(base_repo_revision)
(started_at)
Для document_registry_entry
(project_id, active)
GIN по scope_tags_json
GIN по applies_to_paths_json
Для acceptance_coverage
(evidence_bundle_id, acceptance_criterion_id)
(acceptance_criterion_id, coverage_status)
Для drift_event
(project_id, status, severity)
Для runtime_signal
(deployment_id, signal_type, severity)
(project_id, detected_at)
11. Что лучше хранить как JSON, а что нормализовать
Нормализовать:
contracts
acceptance criteria
assumptions
policies
state transitions
evidence coverage
deployments
test executions
Можно в JSON:
flow steps
UI constraints
integration config summaries
rule payloads DSL
manifest gates/tool permissions
inventory metadata
signal payloads

То есть:

ядро управления — нормализованное
гибкие payloads — JSON
12. Если совсем кратко: “скелет базы”

Если бы я делал первый production-minded schema set, я бы начал с 20 таблиц:

workspace
project
intent
assumption
product_contract
product_contract_revision
flow_definition
business_rule
acceptance_criterion
project_passport_revision
policy_rule
document
document_registry_entry
inventory_snapshot
change_request
change_state_transition
execution_run
execution_manifest
evidence_bundle
acceptance_coverage

А затем уже добавлял:

task
approval_request
code_change_set
changed_file
test_case
test_execution
verification_report
preview_environment
release_candidate
deployment
runtime_signal
13. Практическая рекомендация

Я бы делал это как смесь:

Postgres — source of truth для control plane
Object storage — screenshots, videos, logs, reports
Search / vector / full-text layer — для documents and retrieval
Event log — для transitions, agent actions, runtime signals

То есть ERD — это именно control-plane database, а не место, где лежат все бинарные артефакты.