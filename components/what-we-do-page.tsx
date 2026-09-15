import PageHero from "./page-hero";
import Link from "next/link";
import { whatWeDoIntro, whatWeDoServices } from "../app/what-we-do-services";

export default function WhatWeDoPage() {
  return <>
    <PageHero image="/images/conference.jpg">
      <p className="eyebrow">Heart of England · Coventry</p>
      <h1>What we do</h1>
      <p className="lede">{whatWeDoIntro}</p>
      <Link className="button light" href="/contact-us/">Plan your event →</Link>
    </PageHero>
    <section className="shell section services-hub">
      <p className="eyebrow green">Explore our services</p>
      <h2>Everything you need for an unforgettable event.</h2>
      <div className="services-grid">
        {whatWeDoServices.map((service, index) => <article className="service-card" key={service.href}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{service.title}</h3>
          <p>{service.copy}</p>
          <Link href={service.href}>{service.href.startsWith("http") ? "Visit site →" : "Discover more →"}</Link>
        </article>)}
      </div>
    </section>
    <section className="rooms-cta">
      <div className="shell">
        <p className="eyebrow">Need help choosing?</p>
        <h2>Talk to the events team.</h2>
        <p>Call <a href="tel:01676540333">01676 540333</a> or tell us about your plans and we will guide you to the right space and experience.</p>
        <Link className="button light" href="/contact-us/">Make an enquiry →</Link>
      </div>
    </section>
  </>;
}
