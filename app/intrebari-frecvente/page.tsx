import type { Metadata } from "next";
import FaqView from "@/components/FaqView";
import { getSiteContent } from "@/lib/site";
import { faqPath } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // Titlul primește automat „· Switch Digital" din șablonul din layout.
  title: "Întrebări frecvente",
  description:
    "Răspunsuri la întrebările pe care ni le pun cel mai des antreprenorii: ce înseamnă diagnosticul gratuit, cât costă, cât durează și de ce ai nevoie de sisteme digitale înainte de AI.",
  alternates: {
    canonical: faqPath.ro,
    languages: { ro: faqPath.ro, en: faqPath.en, ru: faqPath.ru, "x-default": faqPath.ro },
  },
};

export default async function Page() {
  const data = await getSiteContent();
  const items = (data as any).ro.faq.items;

  /* FAQPage JSON-LD: formatul pe care Google și motoarele AI îl preiau
     ca răspuns direct. Se construiește din aceleași texte afișate în pagină,
     deci nu pot ajunge niciodată să difere. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it: any) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FaqView data={data as any} lang="ro" />
    </>
  );
}
