import type { Metadata } from "next";

export const siteOrigin = "https://heartofengland.uk";
export const siteName = "Heart of England";
const defaultImage = "/images/conference.jpg";

export const canonicalAliases: Record<string, string> = {
  "/home": "/",
  "/contact": "/contact-us/",
  "/spaces": "/rooms-and-spaces/",
  "/about": "/about-us/",
};

export function canonicalPath(path: string) {
  const clean = path.replace(/\/$/, "") || "/";
  return canonicalAliases[clean] || (clean === "/" ? "/" : `${clean}/`);
}

export function absoluteUrl(path: string) {
  return `${siteOrigin}${canonicalPath(path)}`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function pageMetadata({ title, description, path, image = defaultImage, type = "website", noIndex = false }: PageMetadataInput): Metadata {
  const canonical = canonicalPath(path);
  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
  if (noIndex) metadata.robots = { index: false, follow: false };
  return metadata;
}

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "EventVenue",
  name: "Heart of England Conference and Events Centre",
  url: `${siteOrigin}/`,
  telephone: "+441676540333",
  image: `${siteOrigin}${defaultImage}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Meriden Road, Fillongley",
    addressLocality: "Coventry",
    postalCode: "CV7 8DX",
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 52.4808,
    longitude: -1.5895,
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: `${siteOrigin}/`,
  publisher: {
    "@type": "Organization",
    name: siteName,
    url: `${siteOrigin}/`,
  },
};

export function articleSchema({ title, description, path, date }: { title: string; description: string; path: string; date?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished: date,
    author: { "@type": "Organization", name: siteName, url: `${siteOrigin}/` },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: `${siteOrigin}/`,
      logo: { "@type": "ImageObject", url: `${siteOrigin}/images/heart-of-england-logo.png` },
    },
    image: `${siteOrigin}${defaultImage}`,
  };
}

export function eventListSchema(events: { title: string; description: string; path: string; startDate: string; image: string; price?: string }[]) {
  return events.map(event => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Heart of England Conference and Events Centre",
      address: localBusinessSchema.address,
    },
    image: `${siteOrigin}${event.image}`,
    url: event.path.startsWith("http") ? event.path : absoluteUrl(event.path),
    ...(event.price ? { offers: { "@type": "Offer", price: event.price, priceCurrency: "GBP", availability: "https://schema.org/InStock", url: event.path.startsWith("http") ? event.path : absoluteUrl(event.path) } } : {}),
  }));
}
