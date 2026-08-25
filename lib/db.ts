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
