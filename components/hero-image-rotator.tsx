"use client";

import { useEffect, useState } from "react";
import ResilientImage from "./resilient-image";

type HeroImage = { src: string; alt: string };

const HERO_EXCLUDE = /(shape\d|logo|brochure|poster|menu|icon|badge|favicon)/i;
const HERO_INTERVAL_MS = 5500;
const HERO_FADE_MS = 1400;

export function heroImageCandidates(media: HeroImage[], limit = 5) {
  return media.filter(image => !HERO_EXCLUDE.test(image.src)).slice(0, limit);
}

export default function HeroImageRotator({
  images,
  alt,
  className,
}: {
  images: HeroImage[];
  alt: string;
  className?: string;
}) {
  const candidates = heroImageCandidates(images);
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion || candidates.length < 2) return;
    const timer = window.setInterval(() => {
      setActive(current => (current + 1) % candidates.length);
    }, HERO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [candidates.length, reduceMotion]);

  if (candidates.length === 0) {
    return <ResilientImage priority className={className} src="/images/conference.jpg" alt={alt} />;
  }

  if (candidates.length === 1 || reduceMotion) {
    const image = candidates[0];
    const portrait = /(brochure|poster|menu)/i.test(image.src);
    return (
      <ResilientImage
        priority
        className={`${className || ""}${portrait ? " source-portrait" : ""}`.trim()}
        src={image.src}
        alt={image.alt || alt}
      />
    );
  }

  return (
    <div
      className={`hero-rotator${className ? ` ${className}` : ""}`}
      style={{ "--hero-fade-ms": `${HERO_FADE_MS}ms` } as React.CSSProperties}
      aria-hidden="true"
    >
      {candidates.map((image, index) => (
        <ResilientImage
          key={image.src}
          priority={index === 0}
          className={index === active ? "is-active" : undefined}
          src={image.src}
          alt={image.alt || alt}
        />
      ))}
    </div>
  );
}
