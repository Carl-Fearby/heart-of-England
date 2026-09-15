import EnquiryForm from "../../components/enquiry-form";
import PageHero from "../../components/page-hero";
import { pageMetadata } from "../seo";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Contact & event enquiries",
  description: "Plan your conference, team building day or celebration at Heart of England in Coventry. Contact the events team with your date and guest count.",
  path: "/contact-us",
});

export default function Contact() {
  return <><PageHero image="/images/showground.jpg"><p className="eyebrow">Contact</p><h1>Let’s make it happen.</h1><p className="lede">Tell us a little about your event and our team will help you take the next step.</p></PageHero><section className="shell section contact-grid"><div><h2>Speak with the team</h2><p><a href="tel:01676540333">01676 540333</a><br/><a href="mailto:sales@heartofengland.co.uk">sales@heartofengland.co.uk</a></p><p>Meriden Road, Fillongley,<br/>Coventry, CV7 8DX</p><Link href="/rooms-and-spaces/">Explore our spaces →</Link></div><EnquiryForm /></section></>;
}
