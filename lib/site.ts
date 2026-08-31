import "server-only";
import { db, ensureSchema } from "./db";
import { siteContent } from "./schema";
import { eq } from "drizzle-orm";
import { content, contactInfo } from "./content";

export type SiteData = {
  ro: any;
  en: any;
  ru: any;
  info: typeof contactInfo;
};

export const defaults: SiteData = {
  ro: content.ro,
  en: content.en,
  ru: content.ru,
  info: contactInfo,
};

/** Conținutul efectiv: din baza de date dacă există, altfel valorile implicite. */
export async function getSiteContent(): Promise<SiteData> {
  try {
    await ensureSchema();
    const rows = await db.select().from(siteContent).where(eq(siteContent.id, 1)).limit(1);
    if (rows.length) {
      const r = rows[0] as any;
      return {
        ro: r.ro,
        en: r.en,
        // Baza de date poate fi mai veche decât codul și să nu aibă încă rusa.
        ru: r.ru ?? content.ru,
        info: r.info,
      };
    }
  } catch {
    // baza de date indisponibilă → folosim valorile implicite
  }
  return defaults;
}
