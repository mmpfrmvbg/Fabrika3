# NEXT STEP

## Single Next Step

- title: **`P9-9.3-wip-discipline-honest-warning-surface`**: выполнить **`MASTER` §9.3** в минимальном v1-объёме — добавить на read-only поверхности честный warning о параллельных незавершённых outcomes (без форм/мутаций/CRUD и без расширения backend scope), затем прогнать toolchain и зафиксировать evidence в **`DOCS/STATUS.md`**.
- owner: cursor
- type: implementation
- priority: high

## Why This Is The Next Step

- **`P9-9.2`** закрыт: есть read-only detail skeleton **`/outcomes/[id]`** с секциями и honesty-copy. Следующий шаг по порядку **`MASTER` §9** — минимальная дисциплина WIP из §9.3.

## Input Needed

- **`DOCS/MASTER_TODO_CURSOR.md`** §9.3
- текущие read-only UI поверхности outcomes (**`app/outcomes/page.tsx`**, **`app/outcomes/[id]/page.tsx`**)
- **`DOCS/UI_V1.md`** и **`DOCS/RELEASE_CRITERIA_V1.md`** для honesty-copy

## Exact Action

- Добавить узкий read-only warning-сигнал о множественных незавершённых outcomes (без изменения API/schema/migrations), не выходя за scope §9.3; затем выполнить **`npm run typecheck` / `npm run lint` / `npm test` / `npm run build`** и обновить **`DOCS/STATUS.md`**.

## Definition of Done

- [ ] Есть явный честный WIP warning для параллельных незавершённых outcomes; нет мутаций и расширения backend scope; evidence в **`STATUS`**.

## If Blocked

- fallback: если текущие GET API не позволяют надёжно вычислить WIP-сигнал, оставить прозрачный placeholder о недостающих данных без backend-расширения в рамках этой задачи.
