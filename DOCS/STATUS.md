# STATUS

## Current Phase
- name: 6. DATA MODEL V1 (MINIMUM)
- status: in_progress
- owner: cursor
- started_at: 2026-04-23
- updated_at: 2026-04-24 (evidence_item read + seed)

## Current Task
- id: P6-project-post-minimal
- title: Минимальный **`POST /api/projects`** (create **`project`**) по **`DATA_MODEL_V1`** + smoke + **`STATUS`** — см. **`NEXT_STEP.md`**
- status: planned
- linked_phase: 6

## Closed phases (recent)

- **5. CURSOR GOVERNANCE LAYER** — `done`, closed_at **2026-04-23**, closing_task **P5-5.3-templates** *(§5.1–§5.3: governance + templates; Definition of done §5 в **`MASTER`**)*  
- **4. DOCS AS SOURCE OF TRUTH** — `done`, closed_at **2026-04-23**, closing_task **P4-4.3-release-criteria** *(§4.3 canonical docs incl. **`RELEASE_CRITERIA_V1`**; см. **`MASTER`** Definition of done §4)*  
- **3. Repository Bootstrap** — `done`, closed_at **2026-04-23**, closing_task **RB-3.phase-close-sync** *(MASTER §3.1–§3.3 согласованы с репозиторием)*

## Goal of This Phase
- **Фаза 6:** довести **реальную** БД до канона **`DATA_MODEL_V1.md`** (пять таблиц + индексы/seed по **`MASTER` §6.3** в узком прочтении), затем CRUD по **`MASTER` §6 Definition of done** — **не** строить лишние сущности из старого списка §6.1–6.2.

## Done Criteria (фаза 4 — закрыта)
- [x] **`DOCS/INDEX.md`** — канонический указатель (**P4-4.1-index**); синхронизирован с **`V1_SCOPE.md`**
- [x] **`DOCS/V1_SCOPE.md`**
- [x] **`MASTER_TODO_CURSOR.md` §4.1**
- [x] **§4.2** целиком: RFC, ERD, event, UI, UX extracts (**P4-4.2-***)
- [x] **§4.3 —** **`DOCS/ARCHITECTURE_V1.md`** + строка в MASTER (**P4-4.3-architecture**)
- [x] **§4.3** — `DATA_MODEL_V1` (**P4-4.3-data-model**)
- [x] **§4.3** — `EVENTS_V1` (**P4-4.3-events**)
- [x] **§4.3** — `UI_V1` (**P4-4.3-ui**)
- [x] **§4.3** — `RELEASE_CRITERIA_V1` (**P4-4.3-release-criteria**)

## Done Criteria (фаза 6 — в работе)
- [x] **`P6-read-master-from-section-6`** — сверка **`MASTER` §6+** с **`DATA_MODEL_V1.md`** и `db/schema.ts`; примечание в **`MASTER` §6**; честный вход в фазу (**2026-04-23**)
- [x] **Пять таблиц** в Drizzle + **одна** SQL-миграция в репо (`db/migrations/0000_*.sql`); **`_fabrika_bootstrap_probe`** снят со схемы; в миграции — `DROP TABLE IF EXISTS` для наследия
- [x] **`npm run db:migrate`** применён к Postgres (**2026-04-22**): хост **`localhost`**, порт **`5665`**, база **`fabrika`**; **`drizzle-kit migrate`** — вывод **`migrations applied successfully!`**; журнал миграции **`0000_sparkling_fixer`** *(пароль/полная строка подключения в **`STATUS`** не записываются)*
- [x] **Seed sample `project` + `outcome` + `assumption` + `acceptance_criterion` + `evidence_item`** (**2026-04-24**): метод **`npm run db:seed:sample-project`** — см. **Notes**; идемпотентные ключи: slug проекта, **`title`** outcome, **`description`** assumption, **`code`** критерия, **`title`** evidence_item при фиксированном **`outcome_id`**  
- [ ] Definition of done **`MASTER` §6** (минимальная схема + CRUD по пяти сущностям) — **не** закрывать до доказательства

## Done Criteria (фаза 5 — закрыта)
- [x] **`MASTER` §5.1** — `AGENTS.md` + перечисленные **`.cursor/rules/*.mdc`** сверены с **`MASTER`**; зафиксирован дополнительный файл **`subagents-delegation.mdc`** (**P5-phase-5-reconcile**, **2026-04-23**)
- [x] **`MASTER` §5.2** — словарь phase/stage/session status; правила **`STATUS` / `NEXT_STEP` / `DECISIONS`**; согласовано с **`AGENTS.md`** + правками **`cursor-executor`**, **`evidence-reviewer`**, **`release-readiness`**, **`subagents-delegation`** (**P5-5.2-protocol**, **2026-04-23**)
- [x] **`MASTER` §5.3** — каталог **`DOCS/templates/`** + четыре файла (**`P5-5.3-templates`**, **2026-04-23**)
- [x] Definition of done §5 в **`MASTER`** — §5.1–§5.3 отражены в репо; шаблоны на месте

## Done Criteria (фаза 3 — закрыта)
- [x] Структура папок из §3.1 (`app/`, `components/`, `lib/`, `db/`, `tests/`, `playwright/`, `DOCS/`, `.cursor/rules/`)
- [x] Корневой `README` с честным статусом и ссылкой на `DOCS/MASTER_TODO_CURSOR.md` (RB-3.1-readme)
- [x] Пункты **§3.2 Initialize stack** — bootstrap выполнен
- [x] §3.3 полностью: скрипты **`db:generate` / `db:migrate`**; **clean bootstrap from zero** — проверено `npm ci` + `npm run typecheck` / `lint` / `test` / `build`; Husky — **намеренно отложено** (**DEC-004**)
- [x] Полный Definition of done §3 + сверка **§3.1–§3.2** в `MASTER_TODO_CURSOR.md` с репозиторием (**RB-3.phase-close-sync**)

## What Was Completed
- **P4-4.3-architecture:** создан **`DOCS/ARCHITECTURE_V1.md`** — цель документа; граница v1; строительные блоки; ссылки на **data / execution / UI/UX** через extracts; **out of scope**; правила для Cursor; «do not assume». В **`MASTER_TODO_CURSOR.md`** отмечена строка **`ARCHITECTURE_V1.md`** в **§4.3**. Обновлены **`DOCS/INDEX.md`** (Primary tier, порядок чтения п. 8, таблица §4, §7 phase navigation), **`STATUS.md`**, **`NEXT_STEP.md`**. **Код / README / DECISIONS** не менялись.
- **P4-4.3-data-model:** создан **`DOCS/DATA_MODEL_V1.md`** — цель; пять сущностей; по каждой: назначение, минимальные поля, связи, что сознательно не моделируется; docs-only vs БД; порядок миграций + индексы; явный out-of-scope; «do not assume»; приоритет узкой трактовки vs **`V1_SCOPE`**. Обновлены **`ARCHITECTURE_V1.md`** (§2 Data, §4, §8 rule 3, §9, document control), **`MASTER_TODO_CURSOR.md`** §4.3 строка **`DATA_MODEL_V1`**, **`INDEX.md`** (Primary, чтение п. 9–14, таблица §4, §7, описание **`ERD - Data Model`**). **`README` / код** не менялись; **`DECISIONS.md`** — без новых записей (рекомендации uuid/bigserial и FK — в тексте **`DATA_MODEL_V1`**, не как DEC).
- **P4-4.3-events:** создан **`DOCS/EVENTS_V1.md`** — цель; что такое state/event в v1; минимальные переходы; docs-only конвенции; явный out-of-scope (брокер, outbox, оркестратор); как пользоваться документом в Cursor; «do not assume»; приоритет **`V1_SCOPE`** при натяжке с extract. Обновлены **`ARCHITECTURE_V1.md`** (§5, §8 п.5, §9, document control), **`MASTER_TODO_CURSOR.md`** §4.3 строка **`EVENTS_V1`**, **`INDEX.md`** (Primary, чтение п. 9–15, таблица §4, §7, описание **`EVENTS_V1_EXTRACT`**). **`README` / код / DECISIONS`** не менялись.
- **P4-4.3-ui:** создан **`DOCS/UI_V1.md`** — цель; канонические поверхности (Today, Outcome, опционально index); по каждой: purpose / primary action / visible elements / key states; связь с solo-founder workflow через **`UX_V1_EXTRACT`** как контекст (не второй UI-спек); out-of-scope UI; «build within / do not assume»; правило узкой трактовки при натяжении с UX. Обновлены **`ARCHITECTURE_V1.md`** (§5–§6, §8 п.4, §9, document control, §5 state bullet), **`MASTER_TODO_CURSOR.md`** §4.3 строка **`UI_V1`**, **`INDEX.md`** (Primary, чтение п. 11–16, таблица §4, §7, **`UI_V1_EXTRACT`** / **`UI.MD`** описания). **`README` / код / DECISIONS`** не менялись.
- **P4-4.3-release-criteria:** создан **`DOCS/RELEASE_CRITERIA_V1.md`** — цель; уровни L1–L3; условия; evidence; human approval; no-go; known limitations; «do not assume»; сжатие духа RFC FSM «guards» без enterprise-политики. Обновлены **`MASTER_TODO_CURSOR.md`** §4.3, **`ARCHITECTURE_V1.md`** (§8 п.4, §9, document control), **`INDEX.md`** (Primary, чтение п. 12–17, таблица §4, §7, **`RFC.md`** описание), **`UI_V1.md`** (ссылка на критерии + document control). **Фаза 4** закрыта в **`STATUS`**; **`NEXT_STEP`** → сверка **§5**. **`README` / код / DECISIONS`** не менялись.
- **P5-phase-5-reconcile:** сверка **`MASTER` §5.1** с репозиторием — подтверждены **`AGENTS.md`**, **`outcome-planner.mdc`**, **`cursor-executor.mdc`**, **`evidence-reviewer.mdc`**, **`release-readiness.mdc`**; зафиксирован дополнительный **`subagents-delegation.mdc`**. **`MASTER_TODO_CURSOR.md` §5.1** обновлён пометками *present* + строка про **`subagents-delegation`**. **`STATUS.md`** (критерий §5.1), **`NEXT_STEP.md`** → **`P5-5.2-protocol`** (только §5.2, **без** §5.3). **`README` / код / остальные product-docs / DECISIONS`** не менялись.
- **P5-5.2-protocol:** расширен **`MASTER` §5.2** (phase / stage / session status + когда обновлять **`STATUS`**, **`NEXT_STEP`**, **`DECISIONS`**, evidence canon); **`AGENTS.md`** — пункт 4 DOCS-first, секция §5.2, Prove/Ship; выровнены четыре статуса в **`cursor-executor.mdc`**, **`evidence-reviewer.mdc`**, **`release-readiness.mdc`**; уточнён **`subagents-delegation.mdc`**. **`README` / код / `DOCS/templates` / unrelated DOCS / DECISIONS`** не менялись.
- **P5-5.3-templates:** созданы **`DOCS/templates/OUTCOME_BRIEF.md`**, **`EVIDENCE_CHECKLIST.md`**, **`RELEASE_REVIEW.md`**, **`SESSION_SUMMARY.md`** (§5.2 / **`RELEASE_CRITERIA_V1`** / deliverable pack); обновлены **`MASTER` §5.3**, **`INDEX.md`** §4, **`STATUS`**, **`NEXT_STEP`**. **`README` / код / DECISIONS / unrelated DOCS`** не менялись.
- **P6-read-master-from-section-6:** сверка **`MASTER` §6–§7** (заголовки) с **`DATA_MODEL_V1.md`** и `db/schema.ts`. **Зазор:** §6.1–6.2 перечисляет **10** устаревших сущностей/имён (вкл. `cursor_runs`, `evidence_bundles`, …); канон v1 — **5** таблиц; в репо только **`_fabrika_bootstrap_probe`**, **ноль** таблиц канона. В **`MASTER` §6** добавлен блок **Canonical v1 alignment**; Definition of done §6 уточнён под пять сущностей. **`STATUS`**, **`NEXT_STEP`** → **`P6-drizzle-v1-schema-migration`**. **Код / README / templates / AGENTS / .mdc / DECISIONS** не менялись.
- **P6-drizzle-v1-schema-migration:** реализованы пять таблиц и enum’ы в **`db/schema.ts`** по **`DATA_MODEL_V1.md`**; сгенерирована **одна** миграция **`db/migrations/0000_*.sql`** (+ meta); индексы/FK как в каноне (**RESTRICT** project→outcome, **CASCADE** outcome→дети); **`README` / app / templates / AGENTS / .mdc** не менялись. **`DECISIONS.md`** — **DEC-005** (uuid PK).
- **Применение миграции к БД (2026-04-22):** **`npm run db:migrate`** с валидным **`DATABASE_URL`** (Postgres **`localhost:5665`**, БД **`fabrika`**) — **успех**, см. критерий фазы 6 выше.
- **P6-seed-one-sample-project (2026-04-24):** добавлен **`scripts/seed-sample-project.mjs`** + **`npm run db:seed:sample-project`**; в БД **`fabrika`** вставлен **один** `project` (slug **`fabrika-v1-sample`**, статус **`active`**); повторный запуск скрипта подтвердил идемпотентность (**`OK: sample project already exists`**). **`README`** — одна строка про seed-команду.
- **P6-project-read-minimal (2026-04-24):** добавлен **`app/api/projects/route.ts`** — **`GET /api/projects`** (лимит 50) и **`GET /api/projects?slug=…`**; **`runtime = nodejs`**, **`dynamic = force-dynamic`**; ответ JSON **`{ projects: [{ id, name, slug, status, created_at, updated_at }] }`** (имплементационные snake_case для времени). Проверка: **`npm run typecheck`**, **`lint`**, **`test`**, **`build`** — успех; **`npm run dev`** (порт **3011**) + **`curl.exe`** к **`/api/projects?slug=fabrika-v1-sample`** вернул sample-строку с **`id`** **`a1438677-0879-457e-bb19-363da9986dbb`**.
- **P6-outcome-read-minimal (2026-04-24):** **`app/api/outcomes/route.ts`** — **`GET /api/outcomes?project_id=<uuid>`** (обязательный query, лимит 100, **`400`** без/с неверным UUID); **`scripts/seed-sample-project.mjs`** расширен: после sample **`project`** идемпотентно вставляет **один** **`outcome`** (**title** `Fabrika v1 sample outcome (P6 read)`, **`draft`** / **`not_assessed`**). Проверка: **`npm run typecheck`**, **`lint`**, **`test`**, **`build`** — успех; **`npm run db:seed:sample-project`** → **`OK: inserted sample outcome`**; **`npm run dev -p 3012`** + **`curl.exe`** к **`/api/outcomes?project_id=a1438677-0879-457e-bb19-363da9986dbb`** вернул **`outcomes`** с **`id`** **`1de1bfd2-ad8e-47d5-9187-10015dde4579`**.
- **P6-assumption-read-minimal (2026-04-24):** **`app/api/assumptions/route.ts`** — **`GET /api/assumptions?outcome_id=<uuid>`** (лимит 100, **`400`** без/невалидный UUID); **`scripts/seed-sample-project.mjs`**: убран преждевременный **`return`** при существующем **`outcome`** (иначе **`assumption`** не дошивался); добавлена **одна** идемпотентная строка **`assumption`** (**`description`** `Fabrika v1 sample assumption (P6 read)`, **`medium`** / **`open`**). Проверка: **`npm run typecheck`**, **`lint`**, **`test`**, **`build`** — успех; **`npm run db:seed:sample-project`** → **`OK: inserted sample assumption`** (**`id`** **`08bed5d9-808a-4d00-8624-d4ad3c52cfd3`**); **`npm run dev -p 3013`** + **`curl.exe`** к **`/api/assumptions?outcome_id=1de1bfd2-ad8e-47d5-9187-10015dde4579`** вернул непустой **`assumptions`**.
- **P6-acceptance-criterion-read-minimal (2026-04-24):** **`app/api/acceptance-criteria/route.ts`** — **`GET /api/acceptance-criteria?outcome_id=<uuid>`** (лимит 100, **`400`** без/невалидный UUID, **`runtime = nodejs`**, **`dynamic = force-dynamic`**); **`scripts/seed-sample-project.mjs`**: убран преждевременный **`return`** после существующей **`assumption`** (иначе **`acceptance_criterion`** не дошивался); добавлена **одна** идемпотентная строка по **`(outcome_id, code)`** (**`code`** **`fabrika-v1-ac-01`**, **`pending`**). Проверка: **`npm run typecheck`**, **`lint`**, **`test`**, **`build`** — успех; seed + smoke — см. **Notes** / **Read `acceptance_criterion`**.
- **P6-evidence-item-read-minimal (2026-04-24):** **`app/api/evidence-items/route.ts`** — **`GET /api/evidence-items?outcome_id=<uuid>`** (лимит 100, сортировка **`created_at DESC`**, **`400`** без/невалидный UUID, **`runtime = nodejs`**, **`dynamic = force-dynamic`**); **`scripts/seed-sample-project.mjs`**: убран преждевременный **`return`** при уже существующем **`acceptance_criterion`** (иначе **`evidence_item`** не дошивался); добавлена **одна** идемпотентная строка по **`(outcome_id, title)`** (**`evidence_type`** **`manual_note`**, **`status`** **`draft`**, **`artifact_ref`** **`local:fabrika-v1-sample-evidence`**). Проверка: **`npm run typecheck`**, **`lint`**, **`test`**, **`build`** — успех (**2026-04-24**); seed + smoke — см. **Notes** / **Read `evidence_item`**.

## What Is In Progress
- item: **Фаза 6** — минимальные **read** по пяти таблицам канона закрыты; дальше **CRUD** по **`MASTER` §6** — см. **`NEXT_STEP.md`** (**`P6-project-post-minimal`**).

## What Is Blocked
- item: нет
  reason:
  severity: low
  unblock_action:

## Risks
- item: Имя каталога репозитория `Fabrika3` vs ограничения npm на `name` в нижнем регистре
  impact: scaffold пришлось собирать во временной папке и переносить файлы
  mitigation: `package.json` → `"name": "fabrika3"`
- item: Нехватка места на диске (ENOSPC)
  impact: невозможно скачать Playwright Chromium; срыв npm при тяжёлых установках
  mitigation: e2e на **системном Edge** (`channel: 'msedge'`); см. **DEC-003**
- item: Vitest 4 + optional native deps (rolldown) на части машин
  impact: падение `vitest run` без binding
  mitigation: пин на **Vitest 2.1.9** + guard в `postcss.config.mjs`
- item: Дублирование **`ERD_V1_EXTRACT`** vs будущий **`DATA_MODEL_V1`**
  impact: расхождения
  mitigation: в **`DATA_MODEL_V1.md`** явно указать роль extract как baseline

## Current Product State
- maturity: prototype
- release_readiness: no
- evidence_state: фаза 3: локальные **`npm ci`**, **`npm run typecheck`**, **`npm run lint`**, **`npm test`**, **`npm run build`** (см. RB-3.3-clean-bootstrap); MASTER §3.1–§3.3 согласован с репозиторием. **P6-drizzle-v1-schema-migration (2026-04-23):** повторно пройдены **`npm run typecheck`**, **`lint`**, **`test`**, **`build`** — успех. **Применение миграции (2026-04-22):** **`npm run db:migrate`** к Postgres **`localhost:5665`**, БД **`fabrika`** — **`migrations applied successfully!`** (Drizzle Kit). **P6-seed / read (2026-04-24):** seed-скрипт обеспечивает **`project`** + **`outcome`** + **`assumption`** + **`acceptance_criterion`** + **`evidence_item`** (см. **Notes**); smoke **`curl`** ко всем пяти read-эндпоинтам — см. **What Was Completed** (**`P6-evidence-item-read-minimal`**).
- db_schema_state: в **`db/schema.ts`** — **5 / 5** таблиц **`DATA_MODEL_V1`**; в целевой БД **`fabrika`** применена миграция **`0000_sparkling_fixer`**; sample **`project`** + **`outcome`** + **`assumption`** + **`acceptance_criterion`** + **`evidence_item`** (см. seed в **Notes**); **`_fabrika_bootstrap_probe`** не входит в каноническую схему
- active_outcome: v1 governed product-to-code (см. MASTER_TODO §2)

## Files/Artifacts Touched In This Phase
- `DOCS/ARCHITECTURE_V1.md`, `DOCS/DATA_MODEL_V1.md`, `DOCS/EVENTS_V1.md`, `DOCS/UI_V1.md`, `DOCS/RELEASE_CRITERIA_V1.md`, `DOCS/MASTER_TODO_CURSOR.md`, `DOCS/INDEX.md`, `DOCS/STATUS.md`, `DOCS/NEXT_STEP.md` *(фаза 4)*  
- `DOCS/MASTER_TODO_CURSOR.md`, `DOCS/STATUS.md`, `DOCS/NEXT_STEP.md` *(**P5-phase-5-reconcile**, фаза 5 §5.1)*  
- `DOCS/MASTER_TODO_CURSOR.md`, `AGENTS.md`, `.cursor/rules/cursor-executor.mdc`, `.cursor/rules/evidence-reviewer.mdc`, `.cursor/rules/release-readiness.mdc`, `.cursor/rules/subagents-delegation.mdc`, `DOCS/STATUS.md`, `DOCS/NEXT_STEP.md` *(**P5-5.2-protocol**)*  
- `DOCS/templates/*.md`, `DOCS/MASTER_TODO_CURSOR.md`, `DOCS/INDEX.md`, `DOCS/STATUS.md`, `DOCS/NEXT_STEP.md` *(**P5-5.3-templates**)*  
- `DOCS/MASTER_TODO_CURSOR.md`, `DOCS/STATUS.md`, `DOCS/NEXT_STEP.md` *(**P6-read-master-from-section-6**)* 
- `db/schema.ts`, `db/migrations/*` *(**P6-drizzle-v1-schema-migration**)*  
- `scripts/seed-sample-project.mjs`, `package.json` *(**P6-seed-one-sample-project**)*; **`README.md`** *(одна строка про seed)*  
- `app/api/projects/route.ts` *(**P6-project-read-minimal**)*; **`README.md`** *(кратко про smoke API)*  
- `app/api/outcomes/route.ts`, `scripts/seed-sample-project.mjs` *(**P6-outcome-read-minimal**)*; **`README.md`** *(curl для `/api/outcomes`)*  
- `app/api/assumptions/route.ts`, `scripts/seed-sample-project.mjs` *(**P6-assumption-read-minimal**)*; **`README.md`** *(curl для `/api/assumptions`)*  
- `app/api/acceptance-criteria/route.ts`, `scripts/seed-sample-project.mjs` *(**P6-acceptance-criterion-read-minimal**)*; **`README.md`** *(curl для `/api/acceptance-criteria`)*  
- `app/api/evidence-items/route.ts`, `scripts/seed-sample-project.mjs` *(**P6-evidence-item-read-minimal**)*; **`README.md`** *(curl для `/api/evidence-items`)*

## Notes
- **Форматирование (format):** Prettier **намеренно отложен** (см. предыдущие Notes).
- **`npm run test:e2e`** не входил в минимальную цепочку верификации bootstrap; предпосылки — **DEC-003** и README.
- **§5.2:** phase (MASTER) ≠ stage (`AGENTS` routing) ≠ session outcome status (четыре токена) — сведено в **`MASTER` §5.2** + **`AGENTS.md`**.
- **§6+ vs канон (после `P6-read-master-from-section-6`):** **`MASTER` §7+** описывает UI/экраны — **не** стартовать до миграции пяти таблиц и явного **`NEXT_STEP`**, иначе расхождение с **`UI_V1`**. Канон БД = **`DATA_MODEL_V1`**; старый список §6.1 — только с пометкой в **`MASTER` §6**.
- **`_fabrika_bootstrap_probe` (после `P6-drizzle-v1-schema-migration`):** удалён из **`db/schema.ts`** — больше не нужен: есть реальные v1-таблицы и поверхность для Drizzle Kit. В **единственной** миграции в начале добавлено **`DROP TABLE IF EXISTS "_fabrika_bootstrap_probe"`** для БД, где проба уже создавалась вручную/`push`.
- **`db:migrate` (2026-04-22):** после передачи валидного **`DATABASE_URL`** миграция **`0000_sparkling_fixer`** применена к БД **`fabrika`** (**`localhost:5665`**). **Безопасность:** пароль из чата / **`.env.local`** не копировать в **`STATUS`** и не коммитить; при утечке строки подключения — **сменить пароль** в Postgres.
- **Seed sample `project` + `outcome` + `assumption` + `acceptance_criterion` + `evidence_item` (2026-04-24, обновлено):** **`npm run db:seed:sample-project`** → **`node scripts/seed-sample-project.mjs`**; **`DATABASE_URL`** только из окружения (для локальной проверки без экспорта переменной: **`node --env-file=.env.local scripts/seed-sample-project.mjs`**). **`project`**: slug **`fabrika-v1-sample`**; **`outcome`**: **`title`** `Fabrika v1 sample outcome (P6 read)`; **`assumption`**: **`description`** `Fabrika v1 sample assumption (P6 read)` (**`medium`** / **`open`**); **`acceptance_criterion`**: **`code`** **`fabrika-v1-ac-01`**, **`description`** `Fabrika v1 sample acceptance criterion (P6 read)`, **`required`** true, **`sort_order`** 0, **`status`** **`pending`**; **`evidence_item`**: **`title`** `Fabrika v1 sample evidence item (P6 read)`, **`evidence_type`** **`manual_note`**, **`artifact_ref`** **`local:fabrika-v1-sample-evidence`**, **`summary`** null, **`status`** **`draft`**. UUID (прогоны **2026-04-24**): **`project`** **`a1438677-0879-457e-bb19-363da9986dbb`**; **`outcome`** **`1de1bfd2-ad8e-47d5-9187-10015dde4579`**; **`assumption`** **`08bed5d9-808a-4d00-8624-d4ad3c52cfd3`**; **`acceptance_criterion`** **`06878a2a-345c-4757-96e5-5f440ddbd6a5`**; **`evidence_item`** **`49e40ba9-97e1-41c8-8442-15f0c168eba5`** — для сверки без секретов.
- **Read `project` (2026-04-24):** **`GET /api/projects`** / **`GET /api/projects?slug=fabrika-v1-sample`** — smoke: **`npm run dev`**, затем **`curl.exe`** (см. **`README.md`**). **Не** CUD.
- **Read `outcome` (2026-04-24):** **`GET /api/outcomes?project_id=<uuid>`** — обязательный **`project_id`**; smoke после seed; **не** CUD.
- **Read `assumption` (2026-04-24):** **`GET /api/assumptions?outcome_id=<uuid>`** — обязательный **`outcome_id`**; smoke после seed; **не** CUD.
- **Read `acceptance_criterion` (2026-04-24):** **`GET /api/acceptance-criteria?outcome_id=<uuid>`** — обязательный **`outcome_id`**; **`npm run typecheck`**, **`lint`**, **`test`**, **`build`** — успех (**2026-04-24**); seed с **`--env-file=.env.local`** → **`OK: inserted sample acceptance_criterion`**; **`npm run dev -- -p 3014`** + **`curl.exe`** к **`http://127.0.0.1:3014/api/acceptance-criteria?outcome_id=1de1bfd2-ad8e-47d5-9187-10015dde4579`** → **`200`**, JSON **`acceptance_criteria`** с **`id`** **`06878a2a-345c-4757-96e5-5f440ddbd6a5`** (первый запрос к API после старта dev занял ~36s компиляции Turbopack — зафиксировано честно); **не** CUD.
- **Read `evidence_item` (2026-04-24):** **`GET /api/evidence-items?outcome_id=<uuid>`** — обязательный **`outcome_id`**; **`npm run typecheck`**, **`lint`**, **`test`**, **`build`** — успех; **`node --env-file=.env.local scripts/seed-sample-project.mjs`** → **`OK: inserted sample evidence_item`**; **`npm run dev -- -p 3015`** + **`curl.exe`** к **`http://127.0.0.1:3015/api/evidence-items?outcome_id=1de1bfd2-ad8e-47d5-9187-10015dde4579`** → **`200`**, JSON **`evidence_items`** с **`id`** **`49e40ba9-97e1-41c8-8442-15f0c168eba5`** (первый **`GET`** после старта dev: компиляция **`/api/evidence-items`** ~22s, ответ **~25s** в логе Next — зафиксировано честно); **не** CUD.
