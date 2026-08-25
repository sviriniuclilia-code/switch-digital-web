import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, ensureSchema } from "@/lib/db";
import { siteContent } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { getSiteContent } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return await verifySession(token);
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const data = await getSiteContent();
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || !body.ro || !body.en || !body.info) {
    return NextResponse.json({ ok: false, error: "Date incomplete." }, { status: 400 });
  }
  await ensureSchema();
  const existing = await db.select({ id: siteContent.id }).from(siteContent).where(eq(siteContent.id, 1)).limit(1);
  if (existing.length) {
    await db.update(siteContent).set({ ro: body.ro, en: body.en, info: body.info, updatedAt: new Date() }).where(eq(siteContent.id, 1));
  } else {
    await db.insert(siteContent).values({ id: 1, ro: body.ro, en: body.en, info: body.info });
  }
  return NextResponse.json({ ok: true });
}
