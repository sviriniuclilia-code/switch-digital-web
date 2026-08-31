import type { MetadataRoute } from "next";
import { faqPath } from "@/lib/content";

const BASE = "https://switchdigital.md";

/* Next.js transformă fișierul ăsta în /sitemap.xml, automat.
   Când adaugi o pagină nouă (ex. blogul), adaugi o intrare aici — altfel
   motoarele o găsesc mai greu sau deloc.

   `alternates.languages` repetă în sitemap legătura dintre limbi, pe lângă
   etichetele hreflang din pagini. Google le folosește pe amândouă. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const homeAlternates = {
    languages: { ro: `${BASE}/`, en: `${BASE}/en`, ru: `${BASE}/ru` },
  };

  const faqAlternates = {
    languages: {
      ro: `${BASE}${faqPath.ro}`,
      en: `${BASE}${faqPath.en}`,
      ru: `${BASE}${faqPath.ru}`,
    },
  };

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1, alternates: homeAlternates },
    { url: `${BASE}/en`, lastModified: now, changeFrequency: "monthly", priority: 0.9, alternates: homeAlternates },
    { url: `${BASE}/ru`, lastModified: now, changeFrequency: "monthly", priority: 0.9, alternates: homeAlternates },

    { url: `${BASE}${faqPath.ro}`, lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: faqAlternates },
    { url: `${BASE}${faqPath.en}`, lastModified: now, changeFrequency: "monthly", priority: 0.7, alternates: faqAlternates },
    { url: `${BASE}${faqPath.ru}`, lastModified: now, changeFrequency: "monthly", priority: 0.7, alternates: faqAlternates },
  ];
}
