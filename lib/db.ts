import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const g = globalThis as unknown as { _pg?: ReturnType<typeof postgres> };

const raw = process.env.DATABASE_URL || "";
const isLocal = raw.includes("localhost") || raw.includes("127.0.0.1");
const cleanUrl = raw.split("?")[0]; // ignorăm parametrii (schema, sslmode etc.)

const client =
  g._pg ??
  postgres(cleanUrl, {
    max: 1,
    ssl: isLocal ? undefined : "require", // Neon & co. cer SSL în producție
  });

if (process.env.NODE_ENV !== "production") g._pg = client;

export const db = drizzle(client, { schema });
export const sqlClient = client;

// Creează tabelele automat la prima folosire (o singură dată per instanță),
// ca să nu fie nevoie să rulezi manual SQL la publicare.
let schemaReady: Promise<void> | null = null;
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await client`CREATE TABLE IF NOT EXISTS "leads" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "phone" text,
        "message" text,
        "status" text DEFAULT 'new' NOT NULL,
        "source" text DEFAULT 'website' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      )`;
      await client`CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON "leads" ("created_at")`;
      await client`CREATE TABLE IF NOT EXISTS "site_content" (
        "id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
        "ro" jsonb NOT NULL,
        "en" jsonb NOT NULL,
        "info" jsonb NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )`;
      await client`CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" text PRIMARY KEY NOT NULL,
        "email" text NOT NULL UNIQUE,
        "password_hash" text NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      )`;
    })().catch((e) => {
      schemaReady = null;
      throw e;
    });
  }
  return schemaReady;
}
