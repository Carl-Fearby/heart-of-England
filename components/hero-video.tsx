"use client";
import { useState } from "react";

export default function HeroVideo() {
  const [playing, setPlaying] = useState(false);
  return <>
    {playing && <iframe className="hero-video" src="https://www.youtube-nocookie.com/embed/6MYNMfP5Pw4?autoplay=1&mute=1&controls=0&loop=1&playlist=6MYNMfP5Pw4&playsinline=1&rel=0" title="Heart of England venue film" allow="autoplay; encrypted-media" />}
    <button className="video-toggle" type="button" aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? "Stop venue video" : "Play venue video"}</button>
  </>;
}
