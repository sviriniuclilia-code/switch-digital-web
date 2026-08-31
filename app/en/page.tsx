import type { Metadata } from "next";
import SiteView from "@/components/SiteView";
import { getSiteContent } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // `absolute` = titlu complet propriu, fără „· Switch Digital" adăugat automat.
  title: { absolute: "Switch Digital — Technology that optimizes your business" },
  description:
    "Consulting and implementation of affordable digital solutions for business. We identify the right tools and use them to the fullest, at minimal cost.",
  alternates: {
    canonical: "/en",
    languages: {
      ro: "/",
      en: "/en",
      ru: "/ru",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Switch Digital",
    description: "Technology that optimizes your business.",
    locale: "en_US",
    type: "website",
    siteName: "Switch Digital",
  },
};

export default async function Page() {
  const data = await getSiteContent();
  return <SiteView data={data as any} lang="en" />;
}
