"use client";

import { useState } from "react";

export default function ResilientImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  return <img className={className} src={currentSrc} alt={alt} onError={() => setCurrentSrc("/images/showground.jpg")} />;
}
