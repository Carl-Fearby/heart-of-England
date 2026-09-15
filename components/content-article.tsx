import Link from "next/link";
import type { ContentBlock } from "../app/content";
import ResilientImage from "./resilient-image";

export default function ContentArticle({
  blocks,
  documents,
  title,
}: {
  blocks: ContentBlock[];
  documents: { href: string; label: string }[];
  title: string;
}) {
  const images = blocks.filter(block => block.type === "image");
  const body = blocks.filter(block => block.type !== "image");

  return <>
    {body.map((block, index) => {
      if (block.type === "heading") {
        const Tag = block.level <= 2 ? "h2" : "h3";
        return <Tag key={index}>{block.text}</Tag>;
      }
      if (block.type === "list") {
        return <ul key={index}>{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
      }
      return <p key={index}>{block.text}</p>;
    })}
    {images.length > 0 && <section id="gallery" className="source-gallery" aria-label={`${title} gallery`}>
      {images.map((image, index) => <ResilientImage key={`${image.src}-${index}`} src={image.src} alt={image.alt || `${title} image ${index + 1}`} />)}
    </section>}
    {documents.length > 0 && <section id="downloads" className="source-downloads">
      <h2>Downloads</h2>
      <ul>{documents.map(document => <li key={document.href}><a href={document.href} download>{document.label} <span aria-hidden="true">↓</span></a></li>)}</ul>
    </section>}
    <div id="enquire" className="article-enquiry">
      <p className="eyebrow green">Bring your idea to life</p>
      <h2>Talk to the team.</h2>
      <p>We will help you choose the right space and shape the day around your needs.</p>
      <Link className="button" href="/contact-us">Make an enquiry →</Link>
    </div>
  </>;
}
