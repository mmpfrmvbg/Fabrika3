import { sql, desc } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/** @see DOCS/DATA_MODEL_V1.md §3.1 */
export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "archived",
]);

/** @see DOCS/DATA_MODEL_V1.md §3.2 */
export const outcomeStatusEnum = pgEnum("outcome_status", [
  "draft",
  "active",
  "blocked",
  "done",
  "abandoned",
]);

export const outcomeReleaseReadinessEnum = pgEnum(
  "outcome_release_readiness",
  [
    "not_assessed",
    "not_release_ready",
    "working_in_preview",
    "verified",
  ],
);

/** @see DOCS/DATA_MODEL_V1.md §3.3 */
export const assumptionCriticalityEnum = pgEnum("assumption_criticality", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const assumptionStatusEnum = pgEnum("assumption_status", [
  "open",
  "auto_defaulted",
  "needs_human_decision",
  "approved",
  "rejected",
]);

/** @see DOCS/DATA_MODEL_V1.md §3.4 */
export const acceptanceCriterionStatusEnum = pgEnum(
  "acceptance_criterion_status",
  ["pending", "satisfied", "waived", "failed"],
);

/** @see DOCS/DATA_MODEL_V1.md §3.5 */
export const evidenceItemTypeEnum = pgEnum("evidence_item_type", [
  "test_result",
  "link",
  "screenshot",
  "log",
  "manual_note",
  "other",
]);

export const evidenceItemStatusEnum = pgEnum("evidence_item_status", [
  "draft",
  "valid",
  "stale",
]);

export const project = pgTable(
  "project",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug"),
    status: projectStatusEnum("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("project_slug_unique").on(t.slug).where(sql`${t.slug} IS NOT NULL`),
  ],
);

export const outcome = pgTable(
  "outcome",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    description: text("description"),
    status: outcomeStatusEnum("status").notNull(),
    releaseReadiness: outcomeReleaseReadinessEnum("release_readiness")
      .notNull(),
    releaseReadinessNote: text("release_readiness_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("outcome_project_id_idx").on(t.projectId)],
);

export const assumption = pgTable(
  "assumption",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    outcomeId: uuid("outcome_id")
      .notNull()
      .references(() => outcome.id, { onDelete: "cascade" }),
    code: text("code"),
    description: text("description").notNull(),
    criticality: assumptionCriticalityEnum("criticality").notNull(),
    status: assumptionStatusEnum("status").notNull(),
    resolutionNote: text("resolution_note"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("assumption_outcome_id_idx").on(t.outcomeId),
    index("assumption_outcome_id_status_idx").on(t.outcomeId, t.status),
  ],
);

export const acceptanceCriterion = pgTable(
  "acceptance_criterion",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    outcomeId: uuid("outcome_id")
      .notNull()
      .references(() => outcome.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    description: text("description").notNull(),
    required: boolean("required").notNull(),
    sortOrder: integer("sort_order").notNull(),
    status: acceptanceCriterionStatusEnum("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("acceptance_criterion_outcome_sort_idx").on(
      t.outcomeId,
      t.sortOrder,
    ),
  ],
);

export const evidenceItem = pgTable(
  "evidence_item",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    outcomeId: uuid("outcome_id")
      .notNull()
      .references(() => outcome.id, { onDelete: "cascade" }),
    evidenceType: evidenceItemTypeEnum("evidence_type").notNull(),
    title: text("title").notNull(),
    artifactRef: text("artifact_ref").notNull(),
    summary: text("summary"),
    status: evidenceItemStatusEnum("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("evidence_item_outcome_created_idx").on(
      t.outcomeId,
      desc(t.createdAt),
    ),
  ],
);
