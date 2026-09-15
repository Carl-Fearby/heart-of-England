import optimisedImages from "../app/data/optimised-images.json";

type ImageData = { variants: { src: string }[] };

export function heroBackgroundImage(image = "/images/conference.jpg") {
  const variants = (optimisedImages as Record<string, ImageData>)[image]?.variants;
  const src = variants?.at(-1)?.src || image;
  return `linear-gradient(115deg,#123d37d9,#246250c9),url('${src}')`;
}

export default function PageHero({
  image = "/images/conference.jpg",
  className = "page-hero",
  children,
}: {
  image?: string;
  className?: "page-hero" | "events-hero";
  children: React.ReactNode;
}) {
  return <section className={className} style={{ backgroundImage: heroBackgroundImage(image) }}><div className="shell">{children}</div></section>;
}
