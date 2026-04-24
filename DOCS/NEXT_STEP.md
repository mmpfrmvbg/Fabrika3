# NEXT STEP

## Single Next Step

- title: **`P7-8-1-overview-static-blocks`**: по **`MASTER` §8.1** на странице **`/`** (внутри существующего **Today** placeholder) добавить **шесть** статических блоков с заголовками и честным placeholder-текстом: **Current objective**, **Verified outcomes summary**, **Blockers summary**, **Last change summary**, **Release maturity stage**, **One next recommended step** — вёрстка через уже существующие **`SectionCard`** / **`MetaLabel`** / **`StatusBadge`**; **без** `fetch` к **`/api/*`**, **без** ложных «всё зелёное» состояний (**`MASTER` §8.2**); затем **`npm run typecheck`**, **`lint`**, **`test`**, **`build`** и короткий просмотр в браузере; обновить **`DOCS/STATUS.md`**
- owner: cursor
- type: implementation
- priority: high

## Why This Is The Next Step

- §7.1 shell и §7.2 минимальные токены готовы; **`MASTER` §8.1** задаёт обязательную структуру **Today** — следующий узкий шаг — визуальные блоки без данных.

## Input Needed

- **`DOCS/MASTER_TODO_CURSOR.md` §8.1–§8.2**, **`DOCS/UI_V1.md` §3.1**, текущий **`app/page.tsx`**.

## Exact Action

- Один файл **`app/page.tsx`** (+ при необходимости маленький **`components/v1/`** helper), затем toolchain + **`STATUS`**.

## Definition of Done

- [ ] На **`/`** видны **все шесть** заголовков §8.1 с честным empty/copy; **`STATUS`** содержит evidence.

## If Blocked

- fallback: **blocked** в **`STATUS`**, если копирайт **Today** противоречит **`UI_V1`** / **`UX_V1_EXTRACT`** без уточнения scope.
- escalate_to_user_if: Нужен другой порядок блоков, чем в **`MASTER` §8.1**.
