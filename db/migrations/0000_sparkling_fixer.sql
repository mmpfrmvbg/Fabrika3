DROP TABLE IF EXISTS "_fabrika_bootstrap_probe";--> statement-breakpoint
CREATE TYPE "public"."acceptance_criterion_status" AS ENUM('pending', 'satisfied', 'waived', 'failed');--> statement-breakpoint
CREATE TYPE "public"."assumption_criticality" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."assumption_status" AS ENUM('open', 'auto_defaulted', 'needs_human_decision', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."evidence_item_status" AS ENUM('draft', 'valid', 'stale');--> statement-breakpoint
CREATE TYPE "public"."evidence_item_type" AS ENUM('test_result', 'link', 'screenshot', 'log', 'manual_note', 'other');--> statement-breakpoint
CREATE TYPE "public"."outcome_release_readiness" AS ENUM('not_assessed', 'not_release_ready', 'working_in_preview', 'verified');--> statement-breakpoint
CREATE TYPE "public"."outcome_status" AS ENUM('draft', 'active', 'blocked', 'done', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TABLE "acceptance_criterion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outcome_id" uuid NOT NULL,
	"code" text NOT NULL,
	"description" text NOT NULL,
	"required" boolean NOT NULL,
	"sort_order" integer NOT NULL,
	"status" "acceptance_criterion_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assumption" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outcome_id" uuid NOT NULL,
	"code" text,
	"description" text NOT NULL,
	"criticality" "assumption_criticality" NOT NULL,
	"status" "assumption_status" NOT NULL,
	"resolution_note" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outcome_id" uuid NOT NULL,
	"evidence_type" "evidence_item_type" NOT NULL,
	"title" text NOT NULL,
	"artifact_ref" text NOT NULL,
	"summary" text,
	"status" "evidence_item_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outcome" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "outcome_status" NOT NULL,
	"release_readiness" "outcome_release_readiness" NOT NULL,
	"release_readiness_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"status" "project_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "acceptance_criterion" ADD CONSTRAINT "acceptance_criterion_outcome_id_outcome_id_fk" FOREIGN KEY ("outcome_id") REFERENCES "public"."outcome"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assumption" ADD CONSTRAINT "assumption_outcome_id_outcome_id_fk" FOREIGN KEY ("outcome_id") REFERENCES "public"."outcome"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_item" ADD CONSTRAINT "evidence_item_outcome_id_outcome_id_fk" FOREIGN KEY ("outcome_id") REFERENCES "public"."outcome"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outcome" ADD CONSTRAINT "outcome_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "acceptance_criterion_outcome_sort_idx" ON "acceptance_criterion" USING btree ("outcome_id","sort_order");--> statement-breakpoint
CREATE INDEX "assumption_outcome_id_idx" ON "assumption" USING btree ("outcome_id");--> statement-breakpoint
CREATE INDEX "assumption_outcome_id_status_idx" ON "assumption" USING btree ("outcome_id","status");--> statement-breakpoint
CREATE INDEX "evidence_item_outcome_created_idx" ON "evidence_item" USING btree ("outcome_id","created_at" desc);--> statement-breakpoint
CREATE INDEX "outcome_project_id_idx" ON "outcome" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_slug_unique" ON "project" USING btree ("slug") WHERE "project"."slug" IS NOT NULL;