# NEXT STEP

## Single Next Step

- title: **`P9-9.3-wip-discipline-copy-honesty`**: по **`MASTER` §9.3** добавить минимальный честный copy-level WIP guard в текущие read-only поверхности (без backend enforcement): явно показать правило «one active outcome at a time» и предупреждение о риске параллельных незавершённых outcomes как текст/бейдж, без фальшивой автоматизации. Toolchain + **`DOCS/STATUS.md`**.
- owner: cursor
- type: implementation
- priority: high

## Why This Is The Next Step

- **`P9-9.2`** завершил route-каркас детали outcome. Следующий шаг по **`MASTER` §9** — зафиксировать дисциплину WIP в честном UI-копирайте, не расширяя API/DB scope.

## Input Needed

- **`app/page.tsx`**, **`app/outcomes/page.tsx`**, **`app/outcomes/[id]/page.tsx`**, **`DOCS/MASTER_TODO_CURSOR.md`** §9.3.

## Exact Action

- Добавить узкие copy/badge-подсказки про one-active-outcome и риск параллельного WIP в существующие read-only экраны. Затем **`typecheck` / `lint` / `test` / `build`** + **`STATUS`**.

## Definition of Done

- [ ] UI явно отражает WIP-дисциплину на уровне честного текста/индикаторов, без новых мутаций/API/enforcement; evidence записан в **`STATUS`**.

## If Blocked

- fallback: если правило нельзя отразить без расширения API, оставить строго статический disclaimer и зафиксировать ограничение в **`STATUS`**.
