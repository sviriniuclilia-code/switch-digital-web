import type { MetadataRoute } from "next";

/* Next.js transformă fișierul ăsta în /robots.txt, automat.

   Roboții motoarelor AI (GPTBot, ClaudeBot, PerplexityBot, Google-Extended
   și ceilalți) intră sub regula „*" și au voie — intenționat. Scopul e exact
   ca site-ul să poată fi citit și citat de ele. Dacă vreodată vrei să blochezi
   unul anume, adaugi o regulă separată cu numele lui. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Panoul de administrare și rutele tehnice n-au ce căuta în căutare.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://switchdigital.md/sitemap.xml",
    host: "https://switchdigital.md",
  };
}
