"use client";
import { useState } from "react";
import Link from "next/link";
import { rooms, layouts, capacity, filterRooms } from "../app/rooms";
import ResilientImage from "./resilient-image";

export default function RoomFinder() {
  const [guests, setGuests] = useState("");
  const [use, setUse] = useState("");
  const [layout, setLayout] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const matches = filterRooms(guests, use, layout);
  const comparison = rooms.filter(room => selected.includes(room.slug));
  const enquiry = `/contact-us/?rooms=${encodeURIComponent(selected.join(","))}`;
  function reset() { setGuests(""); setUse(""); setLayout(""); }
  return <>
    <div className="room-filters" aria-label="Filter rooms">
      <div><label htmlFor="room-guests">Number of guests</label><input id="room-guests" type="number" min="1" step="1" placeholder="Any number" value={guests} onChange={e => setGuests(e.target.value)} /></div>
      <div><label htmlFor="room-use">Event type</label><select id="room-use" value={use} onChange={e => setUse(e.target.value)}><option value="">All event types</option>{["Meeting", "Conference", "Dining", "Exhibition", "Product launch"].map(value => <option key={value}>{value}</option>)}</select></div>
      <div><label htmlFor="room-layout">Seating layout</label><select id="room-layout" value={layout} onChange={e => setLayout(e.target.value)}><option value="">Any layout</option>{layouts.map(value => <option key={value}>{value}</option>)}</select></div>
      <button type="button" className="filter-reset" onClick={reset}>Clear filters</button>
    </div>
    <p className="room-guidance">Capacities depend on your seating layout. Choose a layout to check the right fit; the team will confirm availability and access requirements.</p>
    <div className="room-results"><p role="status">{matches.length} {matches.length === 1 ? "space" : "spaces"} found · {selected.length} of 3 selected for comparison</p>{selected.length > 0 && <a href="#room-comparison">Compare selected spaces ↓</a>}</div>
    {matches.length ? <div className="rooms-grid">{matches.map(room => <article key={room.slug}>
      <ResilientImage src={room.image} alt={room.name} sizes="(max-width: 540px) 100vw, (max-width: 800px) 50vw, 33vw" />
      <div><h3>{room.name}</h3><p><strong>{capacity(room, layout)}</strong><span>{layout ? `${layout} capacity` : "Maximum capacity"}</span></p><p>{room.access}</p><ul>{room.features.slice(0, 2).map(feature => <li key={feature}>{feature}</li>)}</ul>
        <Link href={`/${room.slug}/`}>View room →</Link>
        <label className="room-select"><input type="checkbox" checked={selected.includes(room.slug)} disabled={!selected.includes(room.slug) && selected.length === 3} onChange={() => setSelected(previous => previous.includes(room.slug) ? previous.filter(slug => slug !== room.slug) : [...previous, room.slug])} />Compare {room.name}</label>
      </div></article>)}</div> : <div className="room-empty"><h3>No spaces match those filters.</h3><p>Try another layout or guest count, or ask the team about combining spaces.</p><button className="button" type="button" onClick={reset}>Show all spaces</button> <Link href="/contact-us/">Ask the team →</Link></div>}
    {comparison.length > 0 && <section className="room-comparison" id="room-comparison" aria-labelledby="comparison-heading"><div className="comparison-heading"><h2 id="comparison-heading">Your spaces, side by side.</h2><button type="button" className="filter-reset" onClick={() => setSelected([])}>Clear comparison</button></div><p>Select up to three spaces. “Ask the team” means a capacity has not been published for that layout.</p>
      <div className="comparison-scroll" tabIndex={0} role="region" aria-label="Room comparison table; scroll horizontally on small screens"><table><caption>Room capacities, facilities and specifications</caption><thead><tr><th scope="col">Compare</th>{comparison.map(room => <th scope="col" key={room.slug}>{room.name}<button type="button" onClick={() => setSelected(previous => previous.filter(slug => slug !== room.slug))} aria-label={`Remove ${room.name} from comparison`}>Remove</button></th>)}</tr></thead><tbody>
        {layouts.map(value => <tr key={value}><th scope="row">{value}</th>{comparison.map(room => <td key={room.slug}>{room.layouts[value] ?? "Ask the team"}</td>)}</tr>)}
        <tr><th scope="row">Floor / access</th>{comparison.map(room => <td key={room.slug}>{room.access}</td>)}</tr>
        <tr><th scope="row">Facilities</th>{comparison.map(room => <td key={room.slug}><ul>{room.features.map(feature => <li key={feature}>{feature}</li>)}</ul></td>)}</tr>
        <tr><th scope="row">Room specification</th>{comparison.map(room => <td key={room.slug}><a href={room.spec}>View {room.name} spec (PDF)</a></td>)}</tr>
      </tbody></table></div><p className="room-guidance">For detailed dimensions, layouts and access arrangements, view the room specification or request floor plans from the team.</p><Link className="button" href={enquiry}>Enquire about selected spaces →</Link>
    </section>}
  </>;
}
