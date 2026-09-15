import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cleanTitle, contentDocuments, contentMedia, quickenTreePages, textBlocks } from "../../content";
import ResilientImage from "../../../components/resilient-image";

const menus = [
  { title: "Breakfast", detail: "A hearty start to the day.", file: "/menus/breakfast-menu.pdf" },
  { title: "Main menu", detail: "Classic grill dishes, light bites and desserts.", file: "/menus/main-menu.pdf" },
  { title: "Sunday lunch", detail: "A relaxed Sunday table with all the trimmings.", file: "/menus/sunday-lunch-menu.pdf" },
  { title: "Outside menu", detail: "Summer food for the terrace and garden.", file: "/menus/outside-menu.pdf" },
  { title: "Bottomless brunch", detail: "Good food, good company and plenty of fizz.", file: "/menus/bottomless-brunch-menu.pdf" },
  { title: "Afternoon tea", detail: "Sweet and savoury treats, served with tea or bubbles.", file: "/menus/afternoon-tea-menu.pdf" },
];

export function generateStaticParams() { return quickenTreePages.map(page => ({ page: page.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const item = quickenTreePages.find(x => x.slug === page);
  const title = item ? `${cleanTitle(item.title.rendered)} | The Quicken Tree` : "Not found";
  const description = item ? textBlocks(item.excerpt.rendered)[0] || "The Quicken Tree restaurant at Heart of England." : "";
  return item ? { title, description, alternates: { canonical: `/quicken-tree/${page}` }, openGraph: { title, description, url: `/quicken-tree/${page}`, images: [{ url: "/images/quicken-tree-hero.jpg", width: 1200, height: 630, alt: "The Quicken Tree" }] }, twitter: { card: "summary_large_image", title, description, images: ["/images/quicken-tree-hero.jpg"] } } : { title };
}

function QuickenHero({ title, lede }: { title: string; lede: string }) {
  return <section className="interior-hero"><div className="shell interior-grid"><div><p className="eyebrow green">The Quicken Tree · Coventry</p><h1>{title}</h1><p className="lede">{lede}</p></div><ResilientImage src="/images/quicken-tree-hero.jpg" alt="The Quicken Tree restaurant" /></div></section>;
}

function MenusPage() {
  return <article>
    <QuickenHero title="Menus" lede="Seasonal food, served all day at The Quicken Tree." />
    <section className="shell qt-menus" aria-labelledby="menu-downloads"><div className="qt-menu-intro"><p className="eyebrow green">Food & drink</p><h2 id="menu-downloads">Choose your menu.</h2><p>Every published Quicken Tree menu is available here as an accessible PDF download. Menus can change with the seasons, so please check back before visiting.</p></div><div className="qt-menu-grid">{menus.map(menu => <article className="qt-menu-card" key={menu.file}><h3>{menu.title}</h3><p>{menu.detail}</p><a href={menu.file} download aria-label={`Download the ${menu.title} PDF menu`}>Download PDF <span aria-hidden="true">↓</span></a></article>)}</div></section>
    <section className="qt-booking"><div className="shell"><p className="eyebrow">Make a reservation</p><h2>Join us at the table.</h2><p>Book online or call the team on <a href="tel:01676543300">01676 543300</a>.</p><a className="button light" href="https://dishcult.com/restaurant/thequickentree?sortOrder=0&page=1" target="_blank" rel="noreferrer">Book a table <span aria-hidden="true">→</span></a></div></section>
  </article>;
}

export default async function QuickenTreePage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const item = quickenTreePages.find(x => x.slug === page);
  if (!item) notFound();
  if (page === "menus") return <MenusPage />;
  if (page === "home") return <><section className="qt-hero"><img src="/images/quicken-tree-hero.jpg" alt="The Quicken Tree restaurant at Heart of England" /><div className="shell"><p className="eyebrow">The Quicken Tree · Coventry</p><h1>Good food.<br />Great company.</h1><p>Bar, grill and restaurant with lake views at the Heart of England.</p><div><Link className="button" href="/quicken-tree/menus">View menus</Link><Link className="qt-link" href="/quicken-tree/contact-us">Book a table →</Link></div></div></section><section className="shell qt-intro"><p className="eyebrow green">Eat, drink, relax</p><h2>A welcoming table, whatever the occasion.</h2><p>From breakfast and lunch to dinner, Sunday roasts and afternoon tea, The Quicken Tree is a smart, relaxed place to spend time together.</p><div className="qt-cards"><Link href="/quicken-tree/menus">Menus</Link><Link href="/quicken-tree/whats-on">What’s on</Link><Link href="/quicken-tree/private-dining-and-parties">Private dining</Link></div></section></>;
  const blocks = textBlocks(item.content.rendered);
  const media = contentMedia(item.content.rendered);
  const documents = contentDocuments(item.content.rendered);
  return <article><QuickenHero title={cleanTitle(item.title.rendered)} lede="Bar, grill and restaurant at the Heart of England." /><div className="shell article-layout"><article className="article-copy">{blocks.map((block, index) => <p key={index}>{block}</p>)}{documents.length > 0 && <section className="source-downloads"><h2>Downloads</h2><ul>{documents.map(document => <li key={document.href}><a href={document.href} download>{document.label} <span aria-hidden="true">↓</span></a></li>)}</ul></section>}{media.length > 0 && <section className="source-gallery" aria-label={`${cleanTitle(item.title.rendered)} gallery`}>{media.map((image, index) => <ResilientImage key={`${image.src}-${index}`} src={image.src} alt={image.alt} />)}</section>}</article></div></article>;
}
