// Creează (sau actualizează) contul de admin din variabilele ADMIN_EMAIL / ADMIN_PASSWORD.
// Rulează: npm run seed
import postgres from "postgres";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL;
const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD || "";

if (!url) { console.error("DATABASE_URL lipsește."); process.exit(1); }
if (!email || !password) { console.error("ADMIN_EMAIL / ADMIN_PASSWORD lipsesc."); process.exit(1); }

const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
const sql = postgres(url.split("?")[0], { ssl: isLocal ? undefined : "require" });
const hash = await bcrypt.hash(password, 12);
const id = crypto.randomUUID();

await sql`
  INSERT INTO admin_users (id, email, password_hash)
  VALUES (${id}, ${email}, ${hash})
  ON CONFLICT (email) DO UPDATE SET password_hash = ${hash}
`;

console.log("✔ Admin creat/actualizat:", email);
await sql.end();
