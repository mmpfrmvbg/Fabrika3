# **RFC: Intent → Verified Product System (v0.1)**

## 1. Glossary

**Intent**  
Свободная формулировка желания пользователя (natural language, примеры, референсы).

**Assumption**  
Неявное допущение, сделанное системой. Имеет статус и уровень критичности.

**Product Contract**  
Машиночитаемая спецификация продукта (`product/flows/rules/acceptance/design`).

**Project Control Plane**  
Инженерный слой управления: policies, passport, FSM, orchestration, guards.

**Execution**  
Процесс генерации и изменения реализации (код, конфиги, инфраструктура).

**Evidence Bundle**  
Набор доказательств, что реализация соответствует контракту.

**Runtime Assurance**  
Наблюдение за поведением после релиза (monitoring, drift detection, rollback).

**Scope**  
Допустимая область изменений (файлы, модули, ресурсы).

**Policy**  
Ограничения и правила выполнения (security, approvals, tooling).

**Drift**  
Расхождение между контрактом, политиками и фактическим состоянием системы.

---

## 2. System Layers

### 2.1 Intent Layer

- Вход: natural language, диалог, примеры
- Выход: структурированное описание намерения (черновик)

---

### 2.2 Assumption Layer

- Реестр допущений:
  - `id`
  - `description`
  - `criticality`
  - `status`:
    - `open`
    - `auto_defaulted`
    - `needs_human_decision`
    - `approved`
    - `rejected`

**Правило:**  
Контракт не может быть утверждён, пока все `critical` assumptions не закрыты.

---

### 2.3 Product Contract Layer

Обязательные артефакты:

- `product.yaml`
- `flows.yaml`
- `rules.yaml`
- `acceptance.yaml`
- `design.yaml` (или markdown)

**Свойства:**

- машиночитаемость
- возможность генерации тестов
- привязка к версиям

---

### 2.4 Project Control Layer

Содержит:

- `passport.yaml`
- `policies/*.yaml`
- `documents.yaml`
- `inventory.yaml`
- FSM (task/run/PR)
- orchestration
- locks
- scope guards

**Функция:**  
Определяет допустимый engineering envelope и управляет переходами.

---

### 2.5 Execution Layer

Pipeline:

```
scaffold → implement → harden → fix → preview → deploy
```

Все действия:

-   
ограничены `scope`  

-   
подчинены `policy`  

-   
привязаны к `contract_version`  


---

### 2.6 Evidence Layer

**Evidence Bundle включает:**

-   
результаты тестов (unit, integration, e2e)  

-   
сценарии (flow execution traces)  

-   
скриншоты / видео  

-   
coverage acceptance criteria  

-   
security / perf / accessibility результаты  

-   
human-readable summary  

-   
ссылки на версии:  

  -   
  contract  

  -   
  policy  

  -   
  code  


---

### 2.7 Runtime Assurance Layer

-   
monitoring  

-   
alerting  

-   
rollback  

-   
drift detection:  

  -   
  contract vs runtime  

  -   
  policy vs execution  

  -   
  expected vs observed behavior  


---

## 3. FSM (High-level)

### Основной путь:

```
idea
→ elicitation
→ assumptions_resolved
→ contract_drafted
→ contract_approved
→ scaffolded
→ implemented
→ hardened
→ verified
→ evidence_collected
→ previewed
→ accepted
→ deployed
→ monitored
```

---

### Ошибки / блокировки:

- `blocked_on_assumptions`  

- `policy_conflict`  

- `contract_drift`  

- `evidence_insufficient`  

- `verification_failed`  

- `execution_failed`  


---

### Основные guards:

- `contract_approved`:  

  -   
  все critical assumptions закрыты  

- `implemented → hardened`:  

  -   
  scope не нарушен  

- `verified`:  

  -   
  все обязательные проверки зелёные  

- `evidence_collected`:  

  -   
  покрыты все acceptance criteria  

- `deployed`:  

  -   
  evidence соответствует актуальным версиям contract/policy  


---

## 4. Artifact Schemas (минимальные)

### 4.1 assumptions.yaml

```
version: 1
assumptions:
  - id: A1
    description: "User can cancel booking after payment"
    criticality: high
    status: needs_human_decision
```

---

### 4.2 acceptance.yaml

```
version: 1
criteria:
  - id: AC1
    description: "User can create booking"
    flow: booking.create
    expected_result: "Booking stored and visible"
    required: true
```

---

### 4.3 evidence_bundle.yaml

```
version: 1

contract_version: v3
policy_version: v5

results:
  tests:
    unit: passed
    integration: passed
    e2e: passed

  acceptance_coverage:
    - AC1: covered
    - AC2: covered

  artifacts:
    screenshots:
      - booking_success.png
    videos:
      - booking_flow.mp4

  checks:
    security: passed
    performance: within_budget
    accessibility: passed

summary: "All booking flows verified successfully"
```

---

### 4.4 passport.yaml (фрагмент)

```
version: 1

policies:
  protected_paths:
    - "src/core/**"

  autofix:
    enabled: true
    deny_kinds:
      - security
      - migration

  approvals:
    required_for:
      - path: "src/core/**"
```

---

## 5. Invariants & Escalations

### 5.1 Invariants (обязательные правила)

-   
Нельзя перейти в `accepted`, если:  

  -   
  есть незакрытые critical assumptions  

-   
Нельзя перейти в `deployed`, если:  

  -   
  evidence не покрывает acceptance criteria  

-   
Descriptive слои не переопределяют normative:  

  -   
  конфликт → `policy_conflict`  

-   
Scope не может быть нарушен агентом  

-   
Human approval ≠ замена тестов  

-   
Изменение policy:  

  -   
  может инвалидировать active runs  


---

### 5.2 Supported Envelope

Поддерживается:

-   
CRUD / SaaS apps  

-   
dashboards  

-   
booking / CRM  

-   
internal tools  

-   
workflow automation  


Не поддерживается:

-   
low-level systems  

-   
safety-critical domains  

-   
сложные distributed systems  

-   
heavy infra проекты  


---

### 5.3 Escalation Triggers

Система обязана остановиться, если:

- `needs_human_decision` assumption  

-   
policy conflict  

-   
stale/missing document  

-   
security-sensitive change  

-   
migration required  

-   
insufficient evidence  

-   
выход за golden path  

-   
repeated failures  


---

## Финальное определение “готово”

Change считается завершённым, если:

1.   
Contract complete  

2.   
Policy compliant  

3.   
Evidence complete  

4.   
Human approved behavior  

5.   
Runtime ready  


---

## Итог

Система реализует:

```
Intent
→ Assumptions
→ Executable Contract
→ Governed Execution
→ Evidence-backed Acceptance
→ Runtime Assurance
```

