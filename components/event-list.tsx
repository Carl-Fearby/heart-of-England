"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { upcomingEvents } from "../app/events";
import ResilientImage from "./resilient-image";
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
function subscribe(callback: () => void) { const timer = setInterval(callback, 60_000); return () => clearInterval(timer); }
export default function EventList({ buildDate }: { buildDate: string }) {
  const date = useSyncExternalStore(subscribe, today, () => buildDate);
  const events = upcomingEvents(date);
  return <div className="events-grid">{events.length ? events.map(event => <article key={event.id}>
    <ResilientImage src={event.image} alt={event.title} sizes="(max-width: 700px) 100vw, 33vw" />
    <div><p className="eyebrow green">{event.dateLabel}</p><h3>{event.title}</h3><p>{event.description}</p><p><strong>{event.price}</strong></p>
    <p><Link href={event.href}>Event details →</Link></p>{event.bookingUrl && <a className="text-cta" href={event.bookingUrl}>{event.bookingLabel} →</a>}</div>
  </article>) : <p>New events will be announced here. <Link href="/contact-us/">Contact the team for upcoming dates.</Link></p>}</div>;
}
