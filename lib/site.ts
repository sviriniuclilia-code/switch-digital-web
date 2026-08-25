import "server-only";
import { db } from "./db";
import { siteContent } from "./schema";
import { eq } from "drizzle-orm";
import { content, contactInfo } from "./content";

export type SiteData = {
  ro: any;
  en: any;
  info: typeof contactInfo;
};

export const defaults: SiteData = {
  ro: content.ro,
  en: content.en,
  info: contactInfo,
};

/** Conținutul efectiv: din baza de date dacă există, altfel valorile implicite. */
export async function getSiteContent(): Promise<SiteData> {
  try {
    const rows = await db.select().from(siteContent).where(eq(siteContent.id, 1)).limit(1);
    if (rows.length) {
      const r = rows[0];
      return { ro: r.ro as any, en: r.en as any, info: r.info as any };
    }
  } catch {
    // baza de date indisponibilă → folosim valorile implicite
  }
  return defaults;
}
