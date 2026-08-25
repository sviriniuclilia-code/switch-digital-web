import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/schema";
import { leadSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`lead:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Prea multe cereri. Încearcă mai târziu." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Cerere invalidă." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Datele nu sunt valide." }, { status: 400 });
  }
  // honeypot: dacă e completat, tratăm ca succes fals (bot)
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, phone, message } = parsed.data;
  try {
    await db.insert(leads).values({
      name,
      email,
      phone: phone || null,
      message: message || null,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Eroare de server." }, { status: 500 });
  }

  // TODO Modul 3: trimite lead-ul în Odoo CRM (nume, telefon, cerință).
  return NextResponse.json({ ok: true });
}
