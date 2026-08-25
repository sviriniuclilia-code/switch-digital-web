CREATE TABLE IF NOT EXISTS "leads" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text,
  "message" text,
  "status" text DEFAULT 'new' NOT NULL,
  "source" text DEFAULT 'website' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON "leads" ("created_at");

CREATE TABLE IF NOT EXISTS "site_content" (
  "id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
  "ro" jsonb NOT NULL,
  "en" jsonb NOT NULL,
  "info" jsonb NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "admin_users" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
