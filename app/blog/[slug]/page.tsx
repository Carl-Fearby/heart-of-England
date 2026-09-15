import JsonLd from "../../../components/json-ld";
import PageHero from "../../../components/page-hero";
import { articleSchema, pageMetadata } from "../../seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cleanTitle, contentMedia, livePosts, textBlocks } from "../../content";

export function generateStaticParams() { return livePosts.map(post => ({ slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = livePosts.find(x => x.slug === slug);
  if (!post) return { title: "Not found" };
  const title = cleanTitle(post.title.rendered);
  const description = textBlocks(post.excerpt.rendered)[0] || "News from Heart of England.";
  return pageMetadata({ title, description, path: `/blog/${slug}`, type: "article" });
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = livePosts.find(x => x.slug === slug);
  if (!post) notFound();
  const title = cleanTitle(post.title.rendered);
  const description = textBlocks(post.excerpt.rendered)[0] || "News from Heart of England.";
  const heroImage = contentMedia(post.content.rendered)[0]?.src || "/images/conference.jpg";
  return <article>
    <JsonLd data={articleSchema({ title, description, path: `/blog/${slug}`, date: post.date })} />
    <PageHero image={heroImage}><p className="eyebrow">Heart of England blog</p><h1>{title}</h1></PageHero>
    <div className="shell section article-copy long-copy">{textBlocks(post.content.rendered).map((block, index) => <p key={index}>{block}</p>)}<Link className="button" href="/contact-us">Plan an event →</Link></div>
  </article>;
}
