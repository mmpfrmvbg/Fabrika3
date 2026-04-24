# NEXT STEP

## Single Next Step

- title: **`P7-app-shell-7-1-minimal`**: по **`MASTER` §7.1** + **`DOCS/UI_V1.md`** реализовать **минимальный** глобальный shell: левая навигация (плейсхолдер-ссылки на разделы из §7.1) + верхняя полоса статуса (статический текст фазы / «prototype»); **без** реальных данных из API, **без** новых сущностей вне **`UI_V1`**, **без** смены **`MASTER`** за пределом evidence в **`STATUS`**; после — **`npm run typecheck`**, **`lint`**, **`test`**, **`build`** и короткая ручная проверка в браузере; обновить **`DOCS/STATUS.md`**
- owner: cursor
- type: implementation
- priority: high

## Why This Is The Next Step

- **Фаза 6** закрыта по HTTP+DB канону; следующий последовательный блок в **`MASTER`** — **§7 app shell**.

## Input Needed

- **`DOCS/MASTER_TODO_CURSOR.md` §7.1–§7.2**, **`DOCS/UI_V1.md`**, текущий **`app/layout.tsx`** / **`app/page.tsx`**.

## Exact Action

- Один сфокусированный PR по layout/nav (или два файла + минимальные компоненты), затем toolchain + **`STATUS`**.

## Definition of Done

- [ ] В браузере виден **nav + top bar** по заявленному минимуму; **`STATUS`** содержит evidence.

## If Blocked

- fallback: зафиксировать в **`STATUS`** **blocked**, если дизайн shell противоречит **`UI_V1`** без правки scope.
- escalate_to_user_if: Владелец запрещает любой UI до другой фазы.
