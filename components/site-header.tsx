"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import ResilientImage from "./resilient-image";

const groups = [
  { label: "Plan an event", links: [["Explore our events", "/what-we-do/"], ["Conferences", "/conferences/"], ["Team building", "/team-building/"], ["Wellbeing workshops", "/wellbeing-workshops/"], ["Weddings & celebrations", "/weddings/"], ["Christmas parties", "https://christmasattheheart.co.uk/"]] },
  { label: "Eat & stay", links: [["The Quicken Tree", "/quicken-tree/home/"], ["Restaurant menus", "/quicken-tree/menus/"], ["Accommodation", "/accommodation/"]] },
  { label: "About", links: [["About us", "/about-us/"], ["News & ideas", "/blog/"], ["Join our team", "/join-our-team/"], ["Contact & directions", "/contact-us/"], ["Accessibility", "/accessibility/"]] },
];
function NavigationLinks() {
  function group(index: number) {
    const item = groups[index];
    return <details className="nav-group"><summary>{item.label}<span aria-hidden="true">⌄</span></summary><div className="group-links">{item.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div></details>;
  }
  return <>{group(0)}<Link href="/rooms-and-spaces/">Rooms & spaces</Link><Link href="/whats-on/">What’s on</Link>{group(1)}{group(2)}</>;
}
export default function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  function closeAll() { header.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(details => { details.open = false; }); }
  useEffect(() => {
    function outside(event: PointerEvent) { if (!header.current?.contains(event.target as Node)) closeAll(); }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  return <><header className="site-header" ref={header} onClick={event => { if ((event.target as HTMLElement).closest("a")) closeAll(); }} onKeyDown={event => {
    if (event.key === "Escape") {
      const details = (event.target as HTMLElement).closest("details");
      if (details) { details.open = false; details.querySelector("summary")?.focus(); event.preventDefault(); }
    }
  }} onToggle={event => {
    const current = event.target as HTMLDetailsElement;
    if (current.open && current.classList.contains("nav-group")) current.parentElement?.querySelectorAll<HTMLDetailsElement>(".nav-group[open]").forEach(other => { if (other !== current) other.open = false; });
  }}>
    <div className="shell brand-row"><Link href="/" aria-label="Heart of England home"><ResilientImage priority sizes="200px" src="/images/heart-of-england-logo.png" alt="Heart of England" /></Link><nav className="primary-navigation" aria-label="Primary navigation"><NavigationLinks /></nav><div className="header-tools"><a href="tel:01676540333">01676 540333</a><Link className="enquire" href="/contact-us/">Make an enquiry ↗</Link></div>
      <details className="nav-mobile"><summary><span>Menu</span><span className="menu-icon" aria-hidden="true"><i /><i /><i /></span></summary><nav aria-label="Mobile navigation"><NavigationLinks /></nav></details>
    </div>
  </header><Link className="mobile-enquiry" href="/contact-us/">Make an enquiry ↗</Link></>;
}
