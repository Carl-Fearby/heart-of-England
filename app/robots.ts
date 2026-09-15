export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { siteOrigin } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/enquiry-received/" },
    sitemap: `${siteOrigin}/sitemap.xml`,
  };
}
