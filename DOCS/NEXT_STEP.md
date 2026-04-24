# NEXT STEP

## Single Next Step

- title: **`P6-scripted-smoke-five-apis`**: добавить **`scripts/smoke-api-five-entities.mjs`** — при **`DATABASE_URL`** и запущенном **`npm run dev`** (порт зафиксировать в скрипте или аргументом) выполнить минимальные **HTTP**-проверки **GET/POST** (или «GET после seed» где POST идемпотентно неудобен) для **`/api/projects`**, **`/api/outcomes`**, **`/api/assumptions`**, **`/api/acceptance-criteria`**, **`/api/evidence-items`**; **exit 0** только если все пять цепочек дают ожидаемые коды и парсабельный JSON с **`id`**; зафиксировать одну команду запуска + сухой лог итога в **`DOCS/STATUS.md`** (evidence) — **без** `PUT`/`PATCH`/`DELETE`, **без** UI, **без** изменений **`README.md`**, **`MASTER`**, **`DECISIONS`**, **`AGENTS.md`**, **`.mdc`**, **`db/schema.ts`**
- owner: cursor
- type: implementation (verification script only)
- priority: high

## Why This Is The Next Step

- **`P6-master-section6-dod-reconcile`** показал симметрию smoke только для **`evidence_item`**; честность фазы 6 требует воспроизводимой проверки остальных четырёх read/create путей тем же классом evidence.

## Input Needed

- Локальный Postgres + **`DATABASE_URL`**; возможность поднять **`npm run dev`**.

## Exact Action

- Реализовать скрипт и обновить **`STATUS.md`** evidence-блоком; при невозможности запуска — **не** маскировать: записать blocker в **`STATUS.md`**.

## Expected Output

- Файл **`scripts/smoke-api-five-entities.mjs`** + строка evidence в **`STATUS.md`** **или** честный blocker.

## Definition of Done

- [ ] Скрипт в репозитории и **`STATUS.md`** отражает успешный прогон **или** явную причину отказа.

## If Blocked

- fallback: Зафиксировать в **`STATUS.md` What Is Blocked`** отсутствие БД/порта и оставить **`NEXT_STEP`** на повтор после появления среды.
- escalate_to_user_if: Политика среды запрещает локальный dev listener.
