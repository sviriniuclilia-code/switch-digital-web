import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, ensureSchema } from "@/lib/db";
import { leads } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return await verifySession(token);
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  await ensureSchema();
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(500);
  return NextResponse.json({ ok: true, leads: rows });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.status) return NextResponse.json({ ok: false }, { status: 400 });
  await db.update(leads).set({ status: String(body.status) }).where(eq(leads.id, String(body.id)));
  return NextResponse.json({ ok: true });
}
