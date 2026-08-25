import SiteView from "@/components/SiteView";
import { getSiteContent } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getSiteContent();
  return <SiteView data={data as any} />;
}
