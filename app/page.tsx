import type { Metadata } from "next";
import SiteView from "@/components/SiteView";
import { getSiteContent } from "@/lib/site";

export const dynamic = "force-dynamic";

/* hreflang: spune motoarelor de căutare că „/", „/en" și „/ru" sunt aceeași
   pagină în limbi diferite — nu pagini duplicate. */
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      ro: "/",
      en: "/en",
      ru: "/ru",
      "x-default": "/",
    },
  },
};

export default async function Page() {
  const data = await getSiteContent();
  return <SiteView data={data as any} lang="ro" />;
}
