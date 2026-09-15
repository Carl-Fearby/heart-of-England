export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { livePages, livePosts, quickenTreePages, quickenTreePosts } from "./content";
import { canonicalPath } from "./seo";

const origin = "https://heartofengland.uk";
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const paths = ["/", "/accessibility", "/contact-us", "/blog", "/accommodation", "/team-building", "/weddings", ...livePages.map(page => `/${page.slug}`), ...quickenTreePages.map(page => `/quicken-tree/${page.slug}`)];
  for (const path of new Set(paths.map(canonicalPath))) {
    entries.push({ url: `${origin}${path}`, changeFrequency: path === "/" ? "weekly" : "monthly", priority: path === "/" ? 1 : .7 });
  }
  for (const [prefix, posts] of [["/blog", livePosts], ["/quicken-tree/blog", quickenTreePosts]] as const) {
    for (const post of posts) entries.push({ url: `${origin}${canonicalPath(`${prefix}/${post.slug}`)}`, ...(post.date ? { lastModified: new Date(post.date) } : {}), changeFrequency: "yearly", priority: .6 });
  }
  return entries;
}
