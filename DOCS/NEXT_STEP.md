# NEXT STEP

## Single Next Step

- title: **`P9-9.2-outcome-detail-readonly-skeleton`**: начать **`MASTER` §9.2** — добавить route **`/outcomes/[id]`** как честный read-only skeleton (Summary, Acceptance, Assumptions, Evidence, Release readiness delta) на текущих GET API, **без** форм/CRUD и без расширения backend scope. Обновить навигацию с `/outcomes` на detail link только после подтверждения данных. Toolchain + **`DOCS/STATUS.md`**.
- owner: cursor
- type: implementation
- priority: high

## Why This Is The Next Step

- **`P9-9.1`** выполнил цель списка (поля + placeholder honesty). Следующий шаг по **`MASTER` §9** — начать страницу детали outcome, сохраняя behavior-first и read-only дисциплину.

## Input Needed

- **`app/outcomes/page.tsx`**, **`DOCS/UI_V1.md`** §3.2, **`DOCS/MASTER_TODO_CURSOR.md`** §9.2.

## Exact Action

- Добавить **`app/outcomes/[id]/page.tsx`** (узкий diff) и, при необходимости, минимальный helper для read-only загрузки. Затем **`typecheck` / `lint` / `test` / `build`** + **`STATUS`**.

## Definition of Done

- [ ] Есть route **`/outcomes/[id]`** с read-only разделами §9.2; нет мутаций/форм; честные empty/error состояния; evidence записан в **`STATUS`**.

## If Blocked

- fallback: если текущий API не даёт все поля для одного из разделов, показывать явный placeholder «данных нет в API», не расширяя backend в этой задаче.
