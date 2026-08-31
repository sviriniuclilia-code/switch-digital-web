import type { Metadata } from "next";
import FaqView from "@/components/FaqView";
import { getSiteContent } from "@/lib/site";
import { faqPath } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Вопросы и ответы",
  description:
    "Ответы на то, о чём предприниматели спрашивают чаще всего: что входит в бесплатную диагностику, сколько это стоит, сколько занимает и зачем нужны цифровые системы до внедрения ИИ.",
  alternates: {
    canonical: faqPath.ru,
    languages: { ro: faqPath.ro, en: faqPath.en, ru: faqPath.ru, "x-default": faqPath.ro },
  },
};

export default async function Page() {
  const data = await getSiteContent();
  const items = (data as any).ru.faq.items;

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
      <FaqView data={data as any} lang="ru" />
    </>
  );
}
