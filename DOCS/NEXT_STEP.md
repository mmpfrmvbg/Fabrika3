# NEXT STEP

## Single Next Step

- title: **P6 — минимальный read для `outcome`:** один **`GET`** Route Handler (например **`/api/outcomes?project_id=<uuid>`**), **`getDb()`** + Drizzle, только чтение из канонической таблицы **`outcome`**; **без** UI, **без** CUD, **без** abstraction-слоёв; smoke через **`curl`** или краткая запись в **`STATUS.md`**; затем **`NEXT_STEP`** → следующий узкий шаг (**`assumption`** read или первый **write** для `project` — по выбранному порядку CRUD в **`MASTER` §6**)
- owner: cursor
- type: implementation (backend read path)
- priority: high

## Why This Is The Next Step

- **`project`** уже читается через API; по **`DATA_MODEL_V1`** следующая сущность в цепочке — **`outcome`** (**FK** на **`project`**); так двигаемся к **CRUD** по пяти таблицам без расширения scope.

## Input Needed

- В БД при необходимости **одна** строка **`outcome`**, привязанная к sample **`project_id`** *(если пусто — либо минимальный seed одной строки `outcome`, либо read, возвращающий пустой массив — зафиксировать честно в **`STATUS`**, без «фейковых» данных)*.

## Exact Action

1. Добавить **`app/api/outcomes/route.ts`** (или эквивалент по конвенции репо) с **`runtime = nodejs`**.  
2. Фильтр по **`project_id`** query (обязательно для узкого scope) или документированный блокер.  
3. Обновить **`STATUS.md`**.

## Expected Output

- HTTP JSON с массивом **`outcome`** (минимальные поля канона) для заданного **`project_id`**.

## Definition of Done

- [ ] В **`STATUS.md`** есть evidence smoke для **`outcome`** read-path.

## If Blocked

- fallback: Нет **`DATABASE_URL`** / нет строки `outcome` — одна строка **Notes** + честный пустой ответ **или** минимальный seed **одной** строки `outcome` **только** если это зафиксировано как unblock и не противоречит текущему **`NEXT_STEP`**.
