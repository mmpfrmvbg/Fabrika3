# NEXT STEP

## Single Next Step

- title: **P6 — минимальный CRUD (старт с `project`):** реализовать **чтение** списка/одной строки **`project`** через **`getDb()`** + Drizzle (**без** UI-полировки: один **Route Handler** `GET` или **server action**, строго по **`DATA_MODEL_V1`**); smoke-проверка вручную или **один** тест на выборку; затем обновить **`DOCS/STATUS.md`** / **`NEXT_STEP.md`** → следующий шаг: **`outcome`** (с FK на существующий sample `project`)
- owner: cursor
- type: implementation (backend read path)
- priority: high

## Why This Is The Next Step

- **`MASTER` §6** Definition of done требует **CRUD** по пяти сущностям; sample **`project`** уже в БД — честный первый инкремент — **read** для **`project`** перед расширением на **`outcome`**.

## Input Needed

- **`DATABASE_URL`** в **`.env.local`**; миграции и seed уже применены (см. **`STATUS.md`**).

## Exact Action

1. Добавить узкий слой запроса (можно inline в route) — **без** лишних абстракций.  
2. Вернуть JSON с полями канона (`id`, `name`, `slug`, `status`, timestamps).  
3. Зафиксировать evidence в **`STATUS.md`**.

## Expected Output

- Локально вызываемый HTTP/действие возвращает строку sample-проекта из Postgres.

## Definition of Done

- [ ] В **`STATUS.md`** есть указатель на первый работающий read-path для **`project`**.

## If Blocked

- fallback: Одна строка в **Notes** с ошибкой runtime (env, импорт `getDb`, и т.д.).
