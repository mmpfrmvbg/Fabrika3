# NEXT STEP

## Single Next Step

- title: **`P7-7-2-design-system-minimal`**: по **`MASTER` §7.2** добавить **статические** (без привязки к данным) компоненты **badges**: перечень статусов (**idea**, **specified**, **building**, **working_in_preview**, **verified**, **approved**, **live**, **blocked**), **maturity** (**prototype**, **usable**, **hardened**, **release-ready**, **live**), **risk** — как визуальные варианты (Tailwind + существующий shadcn/Button или простые **`span`**), плюс минимальное выравнивание типографики/отступов в **`AppShell`** / главной странице; **без** новых npm-зависимостей, **без** вызовов API, **без** экранов Today/Outcome; затем **`npm run typecheck`**, **`lint`**, **`test`**, **`build`** и короткий просмотр в браузере; обновить **`DOCS/STATUS.md`**
- owner: cursor
- type: implementation
- priority: high

## Why This Is The Next Step

- **`P7-app-shell-7-1-minimal`** закрыт; в **`MASTER` §7** следующий явный блок после §7.1 — **§7.2 Shared design system** (минимальный слой перед §8 Overview screen).

## Input Needed

- **`DOCS/MASTER_TODO_CURSOR.md` §7.2**, **`DOCS/UI_V1.md`**, текущие **`components/ui/*`**, **`app/globals.css`**.

## Exact Action

- Один небольшой набор компонентов (например **`components/ui/badge.tsx`** или **`components/v1-badges.tsx`**) + точечные правки layout/главной страницы.

## Definition of Done

- [ ] В UI видны **все** перечисленные в §7.2 **имена** статусов/стадий (хотя бы в демо-рядке на dev-странице или внизу **`/`**), **`STATUS`** обновлён.

## If Blocked

- fallback: зафиксировать **blocked** в **`STATUS`**, если shadcn-конвенции конфликтуют с минимализмом без новых пакетов.
- escalate_to_user_if: Нужен другой дизайн-токен / библиотека иконок.
