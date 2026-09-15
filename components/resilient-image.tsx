"use client";
/* Static WebP variants are generated ahead of deployment; no image server is needed. */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import manifest from "../app/data/optimised-images.json";

type ImageData = { width: number; height: number; variants: { src: string; width: number }[] };
export default function ResilientImage({ src, alt, className, priority = false, sizes = "(max-width: 700px) 100vw, 50vw" }: { src: string; alt: string; className?: string; priority?: boolean; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  const current = failed ? "/images/showground.jpg" : src;
  const data = (manifest as Record<string, ImageData>)[current];
  return <img className={className} src={data?.variants.at(-1)?.src || current} srcSet={data?.variants.map(v => `${v.src} ${v.width}w`).join(", ")} sizes={data ? sizes : undefined} width={data?.width} height={data?.height} alt={failed ? "Heart of England venue" : alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" onError={() => { if (!failed) setFailed(true); }} />;
}
