# DECISIONS

## Decision Log

### DEC-001
- date: 2026-04-22
- status: accepted
- area: process / repository layout
- made_by: cursor
- related_phase: 3. Repository Bootstrap
- related_task: RB-3.1-structure

#### Context
- В `MASTER_TODO` §3.1 первый пункт: «Create monorepo or single-repo structure for app + docs».
- В репозитории уже лежат `DOCS/` и корневые `KICKOFF.md`, `AGENTS.md` — типичный single-repo с документацией внутри.

#### Decision
- Для v1 принять **single-repo** (один workspace): приложение и `DOCS/` в одном репозитории, **без** отдельного monorepo-пакета на старте.

#### Why
- Соответствует default в MASTER_TODO («Один проект, один workspace») и минимизирует поверхность для solo founder.

#### Alternatives Considered
- Monorepo (pnpm workspaces / turbo) — отложено до явной необходимости.

#### Consequences
- positive: Проще bootstrap, меньше moving parts для Cursor и владельца.
- negative: Если позже понадобится вынести пакеты, потребуется миграция.

#### Follow-up Needed
- [ ] Пересмотреть решение только если появится второй deployable app или shared packages как обязательное требование.

---

### DEC-002
- date: 2026-04-22
- status: accepted
- area: Cursor / execution workflow
- made_by: cursor
- related_phase: 5. Cursor Governance Layer (поддержка; фаза 5 по MASTER всё ещё не закрыта целиком)
- related_task: project-local subagents

#### Context
- Нужен узкий набор ролей для solo founder / non-coder режима без второго «параллельного плана».

#### Decision
- Ввести **пять project-local subagents** в `.cursor/agents/` (`repo-researcher`, `outcome-planner`, `outcome-implementer`, `evidence-reviewer`, `release-gate`) как **делегируемые промпты**.
- Источник истины по фазам и порядку работ остаётся в **`DOCS/`**; субагенты не переопределяют `MASTER_TODO`, `STATUS`, `NEXT_STEP`, `DECISIONS`.

#### Why
- Разделяет обязанности (исследование / план / код / доказательства / ворота) и снижает размывание scope в одной сессии.

#### Alternatives Considered
- Только `.mdc` rules без subagents — уже частично есть; subagents добавлены для явной изоляции ролей при вызове из UI или ручном @-mention.

#### Consequences
- positive: Предсказуемые роли; проще требовать read-only или no-code режим.
- negative: Зависимость от того, как конкретная версия Cursor показывает custom agents; при отсутствии UI — использовать содержимое файлов вручную (см. `.cursor/agents/README.md`).

#### Follow-up Needed
- [ ] При изменении продукта Cursor пересмотреть `.cursor/agents/README.md` (раздел про invocation).

---

### DEC-003
- date: 2026-04-23
- status: accepted
- area: testing / developer environment
- made_by: cursor
- related_phase: 3. Repository Bootstrap — §3.2 / §3.3
- related_task: RB-3.2-playwright, RB-3.3-db-scripts

#### Context
- На машине разработки `npx playwright install chromium` завершался **ENOSPC** при записи ~180 MiB браузера Playwright.
- Нужен стабильный smoke e2e без расширения диска в рамках bootstrap.

#### Decision
- Для **локального** Playwright smoke использовать **системный Microsoft Edge** через **`channel: 'msedge'`** в `playwright.config.ts` (проект `Desktop Edge`), чтобы **не** зависеть от скачивания bundled Chromium в этой среде.
- В **CI/Linux** или средах без Edge — либо освободить место и выполнить `npx playwright install chromium` (или нужный browser), либо переключить конфиг на bundled browser по политике команды.

#### Why
- Разблокирует проверку e2e runner без обязательной загрузки тяжёлого артефакта при нехватке места на диске.

#### Alternatives Considered
- Только bundled Chromium — надёжнее для CI, но здесь блокировался ENOSPC.

#### Consequences
- positive: `npm run test:e2e` может проходить локально на Windows с предустановленным Edge.
- negative: На headless Linux без установленного Edge конфиг по умолчанию может потребовать правки или установки browsers.

#### Follow-up Needed
- [ ] В CI добавить шаг `npx playwright install` + выбрать проект `chromium`, если Edge недоступен.

---

### DEC-004
- date: 2026-04-23
- status: accepted
- area: developer workflow / git hooks
- made_by: cursor
- related_phase: 3. Repository Bootstrap — §3.3
- related_task: RB-3.3-clean-bootstrap

#### Context
- `MASTER_TODO_CURSOR.md` §3.3: «Add Husky/lint-staged **only if it does not slow down v1 too much**».
- На стадии bootstrap нет требования обязательных pre-commit хуков; полуустановка Husky без политики хука хуже явного отложения.

#### Decision
- **Husky и lint-staged намеренно не добавляются** в текущем цикле v1 bootstrap. Pre-commit / format-on-commit можно ввести позже, когда появится стабильная команда или CI-политика и будет ясно, какие команды должны гарантироваться до push (без замедления solo founder).

#### Why
- Соответствует формулировке MASTER («only if»); минимизирует зависимости и скрытые сбои `prepare` на машинах с ограниченным диском/сетью.

#### Alternatives Considered
- Минимальный Husky + `lint-staged` только на `eslint` — отложено до отдельной задачи после явного запроса или CI gate.

#### Consequences
- positive: Меньше moving parts при `npm ci`; нет обязательного git-хука при каждом коммите.
- negative: Дисциплина качества до merge остаётся на локальных командах и будущем CI.

#### Follow-up Needed
- [ ] Пересмотреть при появлении общего remote и обязательных quality gates в CI.

---

### DEC-005
- date: 2026-04-23
- status: accepted
- area: persistence / Drizzle schema
- made_by: cursor
- related_phase: 6. DATA MODEL V1 (MINIMUM)
- related_task: P6-drizzle-v1-schema-migration

#### Context
- **`DOCS/DATA_MODEL_V1.md`** §3.1: первичный ключ `project` (и остальных сущностей) — «prefer **uuid** or **bigserial** — pick **one** convention per repo and keep stable».

#### Decision
- Для всех пяти v1-таблиц использовать **uuid** с **`DEFAULT gen_random_uuid()`** в Postgres (как сгенерировал Drizzle Kit из **`defaultRandom()`** в **`db/schema.ts`**).

#### Why
- Один стабильный стиль PK на весь v1-набор; uuid удобен для клиентских вставок и будущих интеграций без центрального sequence.

#### Alternatives Considered
- **bigserial** — проще и компактнее в индексах; отложено: смена потребовала бы новой политики миграций и расхождения с уже принятой генерацией.

#### Consequences
- positive: Единообразие; соответствует формулировке «pick one» в **`DATA_MODEL_V1`**.
- negative: UUID занимают больше места, чем bigint.

#### Follow-up Needed
- [ ] Не смешивать bigint-PK в новых v1-таблицах без явного изменения **`DATA_MODEL_V1`** / **`DECISIONS`**.

---
