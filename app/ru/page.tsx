import type { Metadata } from "next";
import SiteView from "@/components/SiteView";
import { getSiteContent } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Switch Digital — Технологии, которые оптимизируют ваш бизнес" },
  description:
    "Консалтинг и внедрение доступных цифровых решений для бизнеса. Подбираем подходящие инструменты и используем их на полную, с минимальными затратами.",
  alternates: {
    canonical: "/ru",
    languages: {
      ro: "/",
      en: "/en",
      ru: "/ru",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Switch Digital",
    description: "Технологии, которые оптимизируют ваш бизнес.",
    locale: "ru_RU",
    type: "website",
    siteName: "Switch Digital",
  },
};

export default async function Page() {
  const data = await getSiteContent();
  return <SiteView data={data as any} lang="ru" />;
}
