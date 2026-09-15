import Link from "next/link";
import PageHero from "../../components/page-hero";
import { cleanTitle, livePosts, textBlocks } from "../content";
import { pageMetadata } from "../seo";

export const metadata = pageMetadata({
  title: "Event ideas & venue news",
  description: "Event planning ideas and news from Heart of England in Coventry.",
  path: "/blog",
});

export default function Blog() {
  return <><PageHero image="/images/conference.jpg"><p className="eyebrow">News & ideas</p><h1>Heart of England blog</h1><p className="lede">News, event ideas and updates from the Heart of England Conference and Events Centre.</p></PageHero><section className="shell section"><div className="post-grid">{livePosts.map(post => <article key={post.slug}><p className="eyebrow green">{post.date?.slice(0, 10)}</p><h2>{cleanTitle(post.title.rendered)}</h2><p>{textBlocks(post.excerpt.rendered)[0]}</p><Link href={`/blog/${post.slug}`}>Read article →</Link></article>)}</div></section></>;
}
