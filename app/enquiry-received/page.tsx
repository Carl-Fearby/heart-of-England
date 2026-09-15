import PageHero from "../../components/page-hero";
import Link from "next/link";

export const metadata = { title: "Enquiry received", robots: { index: false, follow: false }, alternates: { canonical: "/enquiry-received/" } };

export default function EnquiryReceived() {
  return <PageHero image="/images/birchley.jpg"><p className="eyebrow">Thank you</p><h1>Your enquiry has been received.</h1><p className="lede">The team will review your plans and get in touch using the details you provided. This is an enquiry, not a confirmed booking.</p><Link className="button light" href="/rooms-and-spaces/">Explore our spaces →</Link></PageHero>;
}
