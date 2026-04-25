# NEXT STEP

## Single Next Step

- title: **`P9-9.1-outcomes-list-readonly-fields`**: на **`/outcomes`** (без форм/CRUD, без `/outcomes/[id]`) расширить read-only список по **`MASTER` §9.1**: явно показать **status**, **release_readiness**, **updated_at** (из текущего API), и добавить честное поле/индикатор для “risk/blocker/next step” как **placeholder**, если этих данных нет в `GET /api/outcomes`. Toolchain + **`DOCS/STATUS.md`**.
- owner: cursor
- type: implementation
- priority: high

## Why This Is The Next Step

- После закрытия **P7-10-1** Today-copy синхронизирован с фактом **`/outcomes`**. Следующий по **`MASTER`** шаг - начать **§9.1 Outcomes list**: сделать индекс outcomes полезнее как read-only поверхность, не создавая видимости “управления outcomes” через UI.

## Input Needed

- **`app/outcomes/page.tsx`**, **`DOCS/UI_V1.md`** §3.3, **`DOCS/MASTER_TODO_CURSOR.md`** §9.1.

## Exact Action

- Правка **`app/outcomes/page.tsx`** (узкий diff), затем **`typecheck` / `lint` / `test` / `build`** + **`STATUS`**.

## Definition of Done

- [ ] **`/outcomes`** показывает перечисленные поля, остаётся честным (read-only; no detail route; no CRUD); **`STATUS`** - evidence.

## If Blocked

- fallback: если нужен **динамический** счётчик на Today — **не** делать в этой задаче; зафиксировать как отдельный scope в **`STATUS`**.
