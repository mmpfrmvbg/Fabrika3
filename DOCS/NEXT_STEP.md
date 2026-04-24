# NEXT STEP

## Single Next Step

- title: **`P6-project-patch-minimal`**: добавить **`app/api/projects/[id]/route.ts`** с **`PATCH`**: JSON body **строго** **`{ "name": "<non-empty string>" }`** (другие ключи → **`400`**); **`id`** в path не UUID → **`400`**; проект не найден → **`404`**; успех → **`200`** **`{ project: … }`** в том же snake_case, что **`GET /api/projects`** (включая **`updated_at`** через Drizzle **`set({ name, updatedAt: new Date() })`**). Расширить **`scripts/smoke-api-five-entities.mjs`**: после блока **POST project** — **PATCH** невалидный id (**`400`**), неизвестный UUID (**`404`**), пустой **`name`** (**`400`**), валидный **PATCH** + **GET ?slug=** read-back. Прогнать **`npm run typecheck`**, **`npm run lint`**, **`npm test`**, **`npm run build`** и **`npm run dev`** + **`npm run smoke:api-five -- http://127.0.0.1:<port>`** (или документировать blocker). Обновить **`DOCS/STATUS.md`** (evidence). **Не** трогать **`DELETE`**, **`AGENTS.md`**, **`.mdc`**, **`MASTER`**, **`DECISIONS`** (если нет нового решения), **`README`** — только если текст smoke снова расходится с фактом.
- owner: cursor
- type: implementation
- priority: high

## Why This Is The Next Step

- Симметрично **`P6-outcome-patch-minimal`**: второй canonical **Update** path для **`project`** без расширения на остальные сущности.

## Input Needed

- **`app/api/projects/route.ts`** (контракт **`GET`/`POST`**, маппер строки) и **`db/schema.ts`** (**`project`**).

## Exact Action

- Один новый route handler + точечное расширение smoke + **`STATUS`**.

## Definition of Done

- [ ] **`PATCH /api/projects/[id]`** + smoke-assertions + toolchain **exit 0** (или честный **blocked** в **`STATUS`**).
- [ ] **`STATUS.md`** / **`NEXT_STEP.md`** обновлены.

## If Blocked

- fallback: Зафиксировать в **`STATUS`** отсутствие **`DATABASE_URL`** / dev как blocker для smoke-only части; код **`PATCH`** всё равно должен проходить **`typecheck`/`build`**.
- escalate_to_user_if: Политика репо запрещает **PATCH** для **`project`**.
