import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/lib/validation";
import { createSession, SESSION_COOKIE } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// La prima autentificare, dacă nu există niciun admin, îl creează din
// variabilele ADMIN_EMAIL / ADMIN_PASSWORD (deploy fără terminal).
async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) return;
  try {
    const existing = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
    if (existing.length) return;
    const hash = await bcrypt.hash(password, 12);
    await db.insert(adminUsers).values({ email, passwordHash: hash });
  } catch {
    // dacă tabela nu există încă sau DB indisponibilă, lăsăm login-ul să eșueze normal
  }
}

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ ok: false, error: "Prea multe încercări." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Date invalide." }, { status: 400 });

  await ensureAdmin();

  const rows = await db.select().from(adminUsers).where(eq(adminUsers.email, parsed.data.email.toLowerCase())).limit(1);
  const user = rows[0];
  const ok = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !ok) {
    return NextResponse.json({ ok: false, error: "Email sau parolă greșite." }, { status: 401 });
  }

  const token = await createSession({ sub: user.id, email: user.email });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
