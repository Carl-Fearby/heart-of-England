export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { livePages, livePosts, quickenTreePages, quickenTreePosts } from "./content";

const origin = "https://heartofengland.uk";
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "accessibility", "contact", "contact-us"];
  return [
    ...staticPaths.map(path => ({ url: `${origin}/${path}`, lastModified: new Date(), changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .7 })),
    ...livePages.map(page => ({ url: `${origin}/${page.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .8 })),
    ...livePosts.map(post => ({ url: `${origin}/blog/${post.slug}`, lastModified: new Date(post.date || Date.now()), changeFrequency: "yearly" as const, priority: .6 })),
    ...quickenTreePages.map(page => ({ url: `${origin}/quicken-tree/${page.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .7 })),
    ...quickenTreePosts.map(post => ({ url: `${origin}/quicken-tree/blog/${post.slug}`, lastModified: new Date(post.date || Date.now()), changeFrequency: "yearly" as const, priority: .5 })),
  ];
}
