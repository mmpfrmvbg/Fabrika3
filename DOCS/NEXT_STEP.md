# NEXT STEP

## Single Next Step

- title: **`P7-9-3-outcomes-index-query-project-id`**: на **`/outcomes`** добавить опциональный query **`?project_id=<uuid>`** — если задан и валиден как UUID, вызывать **`GET /api/outcomes?project_id=...`** напрямую; если не задан — сохранить текущий путь через **`GET /api/projects?slug=fabrika-v1-sample`**; при **400** от API показать честное сообщение; **без** CRUD UI, **без** **`/outcomes/[id]`**; toolchain + **`DOCS/STATUS.md`**
- owner: cursor
- type: implementation
- priority: high

## Why This Is The Next Step

- Read-only список уже есть; следующий узкий шаг — **не хардкодить** только sample-slug при отладке других проектов.

## Input Needed

- **`app/outcomes/page.tsx`**, **`app/api/outcomes/route.ts`** (валидация **`project_id`**).

## Exact Action

- Правка **`app/outcomes/page.tsx`** (+ при необходимости вынести helper в **`lib/`**), затем toolchain + **`STATUS`**.

## Definition of Done

- [ ] **`/outcomes?project_id=…`** и **`/outcomes`** без query оба ведут себя предсказуемо; **`STATUS`** — evidence.

## If Blocked

- fallback: **blocked** в **`STATUS`**, если нужна политика **CORS** / **абсолютный base URL** для **`fetch`** вне dev.
- escalate_to_user_if: Запрещён любой query на **`/outcomes`**.
