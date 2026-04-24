# NEXT STEP

## Single Next Step

- title: **P6 — минимальный create для `project`:** один **`POST /api/projects`** с валидацией полей по **`DATA_MODEL_V1`** (имя, slug, статус из канона), **`getDb()`** + Drizzle **`insert`**; **без** UI; smoke **`curl`** + запись evidence в **`STATUS.md`** — первый шаг к Definition of done **`MASTER` §6** (CRUD по пяти сущностям; остальные сущности — отдельными задачами после этого шага)
- owner: cursor
- type: implementation (backend write path)
- priority: high

## Why This Is The Next Step

- Минимальные **read** по всем пяти таблицам **`DATA_MODEL_V1`** закрыты; по **`MASTER` §6** следующий критерий фазы — работающий **CRUD**; логично начать с корня иерархии — **`project`**.

## Input Needed

- **`DATABASE_URL`**; при необходимости — не конфликтовать со slug **`fabrika-v1-sample`** в smoke-тестах.

## Exact Action

1. Добавить **`POST`** в **`app/api/projects/route.ts`** (или отдельный handler, если разделение чище) с телом JSON и ответом с созданной строкой.  
2. **`npm run typecheck`**, **`lint`**, **`test`**, **`build`**.  
3. Обновить **`STATUS.md`**.

## Expected Output

- Создание **`project`** через API с честным smoke в **`STATUS`**.

## Definition of Done

- [ ] В **`STATUS.md`** есть evidence для **`POST /api/projects`**.

## If Blocked

- fallback: зафиксировать ошибку enum/constraint в **Notes** без секретов.
