# NEXT STEP

## Single Next Step

- title: **`P10-10.1-assumptions-readonly-surface-minimal`**: начать **`MASTER` §10.1** в узком v1-режиме — добавить минимальную assumptions surface на существующих read-only данных (без форм/CRUD/mutations/server actions и без backend расширения), затем прогнать toolchain и зафиксировать evidence в **`DOCS/STATUS.md`**.
- owner: cursor
- type: implementation
- priority: high

## Why This Is The Next Step

- **`P9-9.3`** закрыт: есть честный read-only WIP warning для параллельных незавершённых outcomes. Следующий шаг по порядку roadmap — **`MASTER` §10.1 (Assumptions CRUD)**, начиная с минимального безопасного read-only UI-слоя.

## Input Needed

- **`DOCS/MASTER_TODO_CURSOR.md`** §10.1
- текущие outcomes surfaces (**`app/outcomes/page.tsx`**, **`app/outcomes/[id]/page.tsx`**)
- **`DOCS/UI_V1.md`** и **`DOCS/RELEASE_CRITERIA_V1.md`** для honesty-copy

## Exact Action

- Добавить минимальную assumptions-поверхность read-only (UI/copy level only) внутри текущего outcome-потока без изменений API/schema/migrations; затем выполнить **`npm run typecheck` / `npm run lint` / `npm test` / `npm run build`** и обновить **`DOCS/STATUS.md`**.

## Definition of Done

- [ ] Есть минимальная assumptions read-only surface с честными state/copy; нет мутаций и расширения backend scope; evidence в **`STATUS`**.

## If Blocked

- fallback: если текущие GET API не дают стабильный набор полей для assumptions-слоя, показать прозрачный placeholder о недостающих данных без backend-расширения в рамках задачи.
