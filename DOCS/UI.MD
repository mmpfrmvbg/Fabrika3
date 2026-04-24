Отлично, теперь мы спускаемся с архитектуры на UX — это критично, потому что **если UI неправильный, вся эта система не будет использоваться non-coder’ами**, даже если под капотом всё идеально.

Я соберу это как **UI operating model**, а не набор экранов.

---

# 1. Главный принцип UI

**Пользователь не видит:**

- код
- YAML
- FSM
- event’ы
- policies напрямую

**Пользователь видит:**

- намерение
- сценарии
- правила
- изменения поведения
- доказательства

👉 То есть UI = **behavior-first, not code-first**

---

# 2. Главные экраны (mental model)

Я бы сделал 5 ключевых зон:

---

## 2.1 Home / Project Overview

**Что видит пользователь:**

- Что это за продукт
- В каком состоянии он сейчас
- Есть ли проблемы
- Есть ли изменения в работе

### UI:

- 🟢 Status: “Stable / Needs attention”
- 📦 Current version: v12
- ⚠️ Issues:
  - “2 flows failing”
  - “1 assumption unresolved”
- 🚀 Last change:
  - “Booking cancellation added”

### Главное:

👉 Это **dashboard состояния продукта**, не репозитория

---

## 2.2 “What you’re building” (Product Space)

Это замена “редактирования кода”.

### UI состоит из 4 вкладок:

---

### 1. Scenarios (Flows)

Карточки:

```
[Book a session]
User → Select time → Confirm → Payment → Success

✔ Works
```

```
[Cancel booking]
User → Cancel → Refund → Confirmation

⚠ Needs review
```

👉 Можно:

- 

открыть  

- 

проиграть (preview)  

- 

редактировать как блок-схему  

---

### 2. Rules (Business Logic)

Пример:

- 

“User can cancel up to 24h before session”  

- 

“Refund = 100% if >24h, 0% otherwise”  

UI:

- 

readable  

- 

toggleable  

- 

editable без кода  

---

### 3. Roles & Permissions

Таблица:


| Role | Can book | Can cancel | Can refund |
| ---- | -------- | ---------- | ---------- |


---

### 4. Design / UI

- 

Screens  

- 

Components  

- 

Theme  

👉 Всё визуально

---

# 3. Assumptions UI (очень важный экран)

Отдельный экран:

## “Things we assumed for you”

```
⚠ Needs your decision

[ A-001 ]
Can users cancel after payment?
→ Yes / No

[ A-002 ]
Should system send email notifications?
→ Auto-enabled (you can change)
```

Цвета:

- 

🔴 blocking  

- 

🟡 optional  

- 

🟢 resolved  

👉 Без этого UI система будет делать “не то”

---

# 4. Changes (вместо PR)

Это ключевой экран.

## Вместо diff — “What changed”

Карточка изменения:

```
✨ Add cancellation flow

What changed:
+ Users can cancel bookings
+ Refund logic added

Affected:
- Booking flow
- Payments

Risk:
Medium
```

---

### 4.1 Before / After

```
BEFORE:
User cannot cancel

AFTER:
User can cancel → refund processed
```

---

### 4.2 Live preview

Кнопка:  

👉 “Try it”

Открывает:

- 

реальный UI  

- 

sandbox  

---

### 4.3 Evidence summary

```
✔ 12 tests passed
✔ 3 scenarios verified
✔ UI checked
✔ No regressions
```

---

👉 Кнопка:

**“Approve this behavior”**

НЕ:

- 

merge  

- 

commit  

- 

approve PR  

---

# 5. Evidence UI (главный слой доверия)

## “Proof that it works”

### Вкладки:

---

### 1. Scenarios

```
[Book session] ✔
[Cancel booking] ✔
[Refund edge case] ⚠
```

---

### 2. Visual proof

- 

screenshots  

- 

videos  

- 

replay flows  

---

### 3. Checks

```
Security ✔
Performance ✔
Accessibility ⚠
```

---

### 4. Coverage

```
Acceptance criteria:
✔ AC-1 covered
✔ AC-2 covered
❌ AC-3 missing
```

---

👉 Это заменяет:

- 

CI logs  

- 

test reports  

- 

manual QA  

---

# 6. System Behavior Timeline

Очень важно.

## Timeline:

```
You said: "Add cancellation"

→ We clarified assumptions
→ You approved refund rules
→ We built the feature
→ We tested it
→ Here is the proof
```

👉 Это:

- 

объясняет систему  

- 

снижает страх  

- 

создаёт доверие  

---

# 7. Modes (очень важно для vibe)

## Explore mode

- 

быстрые изменения  

- 

меньше проверок  

- 

instant preview  

UI:

- 

“Try idea”  

- 

“Generate version”  

---

## Production mode (Hardening)

- 

строгие проверки  

- 

assumptions обязательны  

- 

evidence обязательный  

UI:

- 

“Prepare for release”  

- 

“Fix issues before deploying”  

---

# 8. Alerts & Escalations UI

Когда система блокирует:

```
🚫 Cannot proceed

Reason:
Cancellation policy not defined

Action:
Please decide how refunds work
```

ИЛИ:

```
⚠ Risk detected

This change affects payments

Action:
Review required
```

---

# 9. What user NEVER sees

Очень важно:

❌ YAML  

❌ policies  

❌ FSM  

❌ event streams  

❌ raw logs  

❌ stack traces (по умолчанию)

(но можно дать “Advanced mode”)

---

# 10. Mapping UI → Architecture


| UI элемент         | Что под капотом        |
| ------------------ | ---------------------- |
| Scenarios          | flows.yaml             |
| Rules              | rules.yaml             |
| Assumptions screen | assumptions.yaml       |
| Changes            | change_request         |
| Evidence           | evidence_bundle        |
| Status             | FSM                    |
| Preview            | execution + deployment |
| Alerts             | drift / policy events  |


---

# 11. Самое важное UX-правило

Если одной строкой:

👉 **User approves outcomes, not implementation**

---



