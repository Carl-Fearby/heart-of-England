import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cleanTitle, contentMedia, quickenTreePosts, textBlocks } from "../../../content";
import ResilientImage from "../../../../components/resilient-image";

export function generateStaticParams() { return quickenTreePosts.map(post => ({ slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = quickenTreePosts.find(item => item.slug === slug);
  if (!post) return { title: "Not found" };
  const title = `${cleanTitle(post.title.rendered)} | The Quicken Tree`;
  const description = textBlocks(post.excerpt.rendered)[0] || "News and events from The Quicken Tree restaurant in Coventry.";
  return { title, description, alternates: { canonical: `/quicken-tree/blog/${slug}/` }, openGraph: { type: "article", title, description, url: `/quicken-tree/blog/${slug}/`, images: ["/images/quicken-tree-hero.jpg"] } };
}

export default async function QuickenPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = quickenTreePosts.find(item => item.slug === slug);
  if (!post) notFound();
  const media = contentMedia(post.content.rendered);
  return <><section className="page-hero"><div className="shell"><p className="eyebrow">The Quicken Tree</p><h1>{cleanTitle(post.title.rendered)}</h1></div></section><article className="shell section article-copy long-copy">{media[0] && <ResilientImage src={media[0].src} alt={media[0].alt} />}{textBlocks(post.content.rendered).map((block, index) => <p key={index}>{block}</p>)}<Link className="text-cta" href="/quicken-tree/blog">More from The Quicken Tree →</Link></article></>;
}
