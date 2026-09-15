import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cleanTitle, contentDocuments, contentMedia, livePages, textBlocks } from "../content";
import ResilientImage from "../../components/resilient-image";

type Alias = { title: string; intro: string; blocks: string[] };
const aliases: Record<string, Alias> = {
  spaces: { title: "Rooms and spaces", intro: "Flexible spaces for every scale of gathering.", blocks: ["From intimate meeting rooms to the showground, Heart of England gives you the flexibility to create an event that feels exactly right.", "Choose from conference suites, smaller meeting rooms, the Loft, the Dome, the Big Dome, the Marquee and extensive outdoor space."] },
  accommodation: { title: "Stay at Heart", intro: "On-site accommodation that keeps your guests close.", blocks: ["Make more of your time at Heart of England by staying on site. We offer characterful accommodation for event guests, families and groups.", "Choose from nine rooms at Old Hall House, our 4-star bed and breakfast, alongside glamping pods, shepherd huts, a log cabin and camping pitches."] },
  "team-building": { title: "Team building", intro: "Experiences that bring teams together.", blocks: ["Our wide collection of activities and equipment lets us create team-building days that suit your goals, group and budget."] },
  weddings: { title: "Weddings and celebrations", intro: "A celebration with room to be yours.", blocks: ["From the first conversation to the final toast, we help you create a celebration that feels personal and effortless."] },
  about: { title: "About Heart of England", intro: "A remarkable Midlands venue for conferences, events and experiences.", blocks: ["Heart of England is a conference and events centre in Coventry, Warwickshire, with the room and expertise to host unforgettable occasions."] },
};
const rooms = [
  ["Birchley Suite", "650", "birchley-suite", "/images/rooms/birchley-suite.jpg"],
  ["Chestnut Suite", "120", "chestnut-suite", "/images/rooms/chestnut-suite.jpg"],
  ["Pine Suite", "60", "pine-suite", "/images/rooms/pine-suite.jpg"],
  ["Willow Suite", "28", "willow-suite", "/images/rooms/willow-suite.jpg"],
  ["Cedar Suite", "40", "cedar-suite", "/images/rooms/cedar-suite.jpg"],
  ["The Marquee", "500", "the-marquee", "/images/rooms/marquee.jpg"],
  ["The Big Dome", "Large events", "the-big-dome-2", "/images/rooms/big-dome.jpg"],
  ["The Dome", "60", "the-dome", "/images/rooms/dome.jpg"],
] as const;
const roomHeroImages: Record<string, string> = {
  "birchley-suite": "/images/rooms/birchley-suite.jpg", "chestnut-suite": "/images/rooms/chestnut-suite.jpg", "pine-suite": "/images/rooms/pine-suite.jpg", "willow-suite": "/images/rooms/willow-suite.jpg", "cedar-suite": "/images/rooms/cedar-suite.jpg", "the-marquee": "/images/rooms/marquee.jpg", "the-big-dome-2": "/images/rooms/big-dome.jpg", "the-dome": "/images/rooms/dome.jpg",
};

function RoomsDirectory() {
  return <><section className="rooms-hero" style={{ backgroundImage: "linear-gradient(110deg,#113d37b8,#1b5948a8),url('/images/birchley.jpg')" }}><div className="shell"><p className="eyebrow">Heart of England · Coventry</p><h1>Rooms & spaces</h1><p>From focused meetings to large-scale conferences, find a flexible space that fits your event.</p><div><Link className="button" href="/contact-us">Request floor plans <span aria-hidden="true">→</span></Link><a className="rooms-all" href="#all-rooms">Browse all rooms <span aria-hidden="true">↓</span></a></div></div></section><section id="all-rooms" className="shell rooms-directory"><div className="rooms-heading"><p className="eyebrow green">Explore the venue</p><h2>Find your space.</h2><p>Every room has its own character, practical features and flexible layouts. Select a room for full details.</p></div><div className="rooms-grid">{rooms.map(([name, capacity, slug, image]) => <article key={slug}><ResilientImage src={image} alt={`${name} at Heart of England`} /><div><h3>{name}</h3><p><strong>{capacity}</strong>{capacity !== "Large events" && <> <span>maximum capacity</span></>}</p><Link href={`/${slug}`}>View room <span aria-hidden="true">→</span></Link></div></article>)}</div></section><section className="rooms-cta"><div className="shell"><p className="eyebrow">Planning an event?</p><h2>We’ll help you find the right fit.</h2><Link className="button light" href="/contact-us">Talk to the events team →</Link></div></section></>;
}

function WhatsOnPage() {
  const source = livePages.find(item => item.slug === "whats-on");
  const events = source ? contentMedia(source.content.rendered) : [];
  return <><section className="events-hero"><div className="shell"><p className="eyebrow">Heart of England · Coventry</p><h1>What’s on</h1><p>Discover public events, seasonal celebrations and family days at Heart of England and The Quicken Tree.</p></div></section><section className="shell events-list"><div className="events-heading"><p className="eyebrow green">Coming up</p><h2>Make a day of it.</h2><p>See the latest events and follow the links for tickets, details and booking information.</p></div><div className="events-grid">{events.map((event, index) => <article key={event.src}><ResilientImage src={event.src} alt={event.alt || "Heart of England event"} /><div><p className="eyebrow green">Event</p><h3>{event.alt || `Heart of England event ${index + 1}`}</h3><Link href="/contact-us">Find out more <span aria-hidden="true">→</span></Link></div></article>)}</div></section></>;
}

export function generateStaticParams() { return [...livePages.map(p => p.slug), ...Object.keys(aliases)].map(page => ({ page })); }
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> { const { page } = await params; const source = livePages.find(x => x.slug === page), alias = aliases[page]; const title = source ? cleanTitle(source.title.rendered) : alias?.title; const description = source ? textBlocks(source.excerpt.rendered)[0] || "Information from Heart of England." : alias?.intro; return title && description ? { title, description, alternates: { canonical: `/${page}` }, openGraph: { title, description, url: `/${page}`, images: [{ url: roomHeroImages[page] || "/images/conference.jpg", width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description, images: [roomHeroImages[page] || "/images/conference.jpg"] } } : { title: "Not found" }; }

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const source = livePages.find(x => x.slug === page), alias = aliases[page];
  if (!source && !alias) notFound();
  if (page === "rooms-and-spaces") return <RoomsDirectory />;
  if (page === "whats-on") return <WhatsOnPage />;
  const title = source ? cleanTitle(source.title.rendered) : alias.title;
  const intro = source ? textBlocks(source.excerpt.rendered)[0] || "Discover more at Heart of England." : alias.intro;
  const blocks = (source ? textBlocks(source.content.rendered) : alias.blocks).filter(x => x.toLowerCase() !== intro.toLowerCase());
  const media = source ? contentMedia(source.content.rendered) : [];
  const documents = source ? contentDocuments(source.content.rendered) : [];
  const image = roomHeroImages[page] || media[0]?.src || (page.includes("suite") || page === "rooms-and-spaces" ? "/images/birchley.jpg" : "/images/showground.jpg");
  const isRoomPage = Boolean(roomHeroImages[page]);
  return <><section className="interior-hero"><div className="shell interior-grid"><div><p className="eyebrow green">Heart of England · Coventry</p><h1>{title}</h1><p className="lede">{intro}</p><Link className="text-cta" href="/contact-us">Talk to our events team <span aria-hidden="true">→</span></Link></div><ResilientImage className={/(brochure|poster|menu)/i.test(image) ? "source-portrait" : ""} src={image} alt={media[0]?.alt || ""} /></div></section><section className="shell article-layout"><aside aria-label="On this page"><p className="eyebrow green">Explore</p><a href="#details">Overview</a>{documents.length > 0 && <a href="#downloads">Downloads</a>}<a href="#enquire">Make an enquiry</a></aside><article id="details" className="article-copy">{blocks.map((block, index) => <p key={index}>{block}</p>)}{documents.length > 0 && <section id="downloads" className="source-downloads"><h2>Downloads</h2><ul>{documents.map(document => <li key={document.href}><a href={document.href} download>{document.label} <span aria-hidden="true">↓</span></a></li>)}</ul></section>}{!isRoomPage && media.length > 1 && <section className="source-gallery" aria-label={`${title} gallery`}>{media.slice(1).map((item, index) => <ResilientImage key={`${item.src}-${index}`} src={item.src} alt={item.alt} />)}</section>}<div id="enquire" className="article-enquiry"><p className="eyebrow green">Bring your idea to life</p><h2>Talk to the team.</h2><p>We will help you choose the right space and shape the day around your needs.</p><Link className="button" href="/contact-us">Make an enquiry →</Link></div></article></section></>;
}
