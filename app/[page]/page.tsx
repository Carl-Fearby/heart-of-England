import RoomFinder from "../../components/room-finder";
import JsonLd from "../../components/json-ld";
import PageHero from "../../components/page-hero";
import WhatWeDoPage from "../../components/what-we-do-page";
import { canonicalPath, eventListSchema } from "../seo";
import EventList from "../../components/event-list";
import optimisedImages from "../data/optimised-images.json";
import { upcomingEvents } from "../events";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cleanTitle, contentBlocks, contentDocuments, contentMedia, derivedLivePages, livePages, subsiteLivePages, textBlocks } from "../content";
import ContentArticle from "../../components/content-article";
import HeroImageRotator from "../../components/hero-image-rotator";

type Alias = { title: string; intro: string; blocks: string[] };
const aliases: Record<string, Alias> = {
  spaces: { title: "Rooms and spaces", intro: "Flexible spaces for every scale of gathering.", blocks: ["From intimate meeting rooms to the showground, Heart of England gives you the flexibility to create an event that feels exactly right.", "Choose from conference suites, smaller meeting rooms, the Loft, the Dome, the Big Dome, the Marquee and extensive outdoor space."] },
  about: { title: "About Heart of England", intro: "A remarkable Midlands venue for conferences, events and experiences.", blocks: ["Heart of England is a conference and events centre in Coventry, Warwickshire, with the room and expertise to host unforgettable occasions."] },
};
function pageSource(slug: string) {
  return livePages.find(page => page.slug === slug)
    || derivedLivePages.find(page => page.slug === slug)
    || subsiteLivePages.find(page => page.slug === slug);
}
const roomHeroImages: Record<string, string> = {
  "birchley-suite": "/images/rooms/birchley-suite.jpg", "chestnut-suite": "/images/rooms/chestnut-suite.jpg", "pine-suite": "/images/rooms/pine-suite.jpg", "willow-suite": "/images/rooms/willow-suite.jpg", "cedar-suite": "/images/rooms/cedar-suite.jpg", "the-marquee": "/images/rooms/marquee.jpg", "the-big-dome-2": "/images/rooms/big-dome.jpg", "the-dome": "/images/rooms/dome.jpg",
};

const birchleyHero = (optimisedImages as Record<string, { variants: { src: string }[] }>)["/images/birchley.jpg"]?.variants[0]?.src || "/images/birchley.jpg";

function RoomsDirectory() {
  return <><section className="rooms-hero" style={{ backgroundImage: `linear-gradient(110deg,#113d37b8,#1b5948a8),url('${birchleyHero}')` }}><div className="shell"><p className="eyebrow">Heart of England · Coventry</p><h1>Rooms & spaces</h1><p>From focused meetings to large-scale conferences, find a flexible space that fits your event.</p><div><Link className="button" href="/contact-us">Request floor plans <span aria-hidden="true">→</span></Link><a className="rooms-all" href="#all-rooms">Browse all rooms <span aria-hidden="true">↓</span></a></div></div></section><section id="all-rooms" className="shell rooms-directory"><div className="rooms-heading"><p className="eyebrow green">Explore the venue</p><h2>Find your space.</h2><p>Filter by guest count, event type and seating layout. Select up to three spaces to compare their capacities and facilities.</p></div><RoomFinder /></section><section className="rooms-cta"><div className="shell"><p className="eyebrow">Planning an event?</p><h2>We’ll help you find the right fit.</h2><Link className="button light" href="/contact-us">Talk to the events team →</Link></div></section></>;
}

function WhatsOnPage() {
  const buildDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const events = upcomingEvents(buildDate);
  const schema = eventListSchema(events.map(event => ({
    title: event.title,
    description: event.description,
    path: event.href,
    startDate: event.dates.find(date => date >= buildDate) || event.dates[0],
    image: event.image,
    price: event.price,
  })));
  return <><JsonLd data={schema} /><PageHero className="events-hero" image="/images/showground.jpg"><p className="eyebrow">Heart of England · Coventry</p><h1>What’s on</h1><p>Public events, seasonal celebrations and family days at Heart of England and The Quicken Tree.</p></PageHero><section className="shell events-list"><div className="events-heading"><p className="eyebrow green">Coming up</p><h2>Make a day of it.</h2><p>Find dates, prices and booking links. Please check availability and final prices with the booking provider.</p></div><EventList buildDate={buildDate} /></section></>;
}

export function generateStaticParams() { return [...livePages.map(p => p.slug), ...derivedLivePages.map(p => p.slug), ...subsiteLivePages.map(p => p.slug), ...Object.keys(aliases)].map(page => ({ page })); }
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> { const { page } = await params; const source = pageSource(page), alias = aliases[page]; const title = source ? cleanTitle(source.title.rendered) : alias?.title; const description = source ? (textBlocks(source.excerpt.rendered)[0] || textBlocks(source.content.rendered)[0] || `Explore ${title} at Heart of England in Coventry.`).slice(0, 160) : alias?.intro; const media = source ? contentMedia(source.content.rendered) : []; const image = roomHeroImages[page] || media[0]?.src || "/images/conference.jpg"; return title && description ? { title, description, alternates: { canonical: canonicalPath(`/${page}`) }, openGraph: { title, description, url: `/${page}`, images: [{ url: image, width: 1200, height: 630, alt: title }] }, twitter: { card: "summary_large_image", title, description, images: [image] } } : { title: "Not found" }; }

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const source = pageSource(page), alias = aliases[page];
  if (!source && !alias) notFound();
  if (page === "rooms-and-spaces") return <RoomsDirectory />;
  if (page === "what-we-do") return <WhatWeDoPage />;
  if (page === "whats-on") return <WhatsOnPage />;
  const title = source ? cleanTitle(source.title.rendered) : alias.title;
  const articleBlocks = source ? contentBlocks(source.content.rendered) : alias.blocks.map(text => ({ type: "paragraph" as const, text }));
  const intro = source ? articleBlocks.find(block => block.type === "paragraph")?.text || textBlocks(source.excerpt.rendered)[0] || "Discover more at Heart of England." : alias.intro;
  const media = source ? contentMedia(source.content.rendered) : [];
  const documents = source ? contentDocuments(source.content.rendered) : [];
  const heroImage = roomHeroImages[page] || media[0]?.src || (page.includes("suite") ? "/images/birchley.jpg" : "/images/showground.jpg");
  const heroImages = roomHeroImages[page]
    ? [{ src: roomHeroImages[page], alt: title }]
    : media.length > 0
      ? media
      : [{ src: heroImage, alt: title }];
  const hasGallery = articleBlocks.some(block => block.type === "image");
  return <><section className="interior-hero"><div className="shell interior-grid"><div><p className="eyebrow green">Heart of England · Coventry</p><h1>{title}</h1><p className="lede">{intro}</p><Link className="text-cta" href="/contact-us">Talk to our events team <span aria-hidden="true">→</span></Link></div><HeroImageRotator images={heroImages} alt={media[0]?.alt || title} /></div></section><section className="shell article-layout"><aside aria-label="On this page"><p className="eyebrow green">Explore</p><a href="#details">Overview</a>{hasGallery && <a href="#gallery">Gallery</a>}{documents.length > 0 && <a href="#downloads">Downloads</a>}<a href="#enquire">Make an enquiry</a></aside><article id="details" className="article-copy"><ContentArticle blocks={articleBlocks} documents={documents} title={title} /></article></section></>;
}
