"use client";

import { useEffect, useRef, useState } from "react";
import { useFirstViewport } from "@/lib/useFirstViewport";
import "./heroVideo.css";

type HeroVideoProps = {
  /** First clip — plays once on load. */
  first: string;
  /** Second clip — starts (looping) when the first ends. */
  second: string;
  /** Poster image — shown before playback and if a clip fails to load. */
  poster: string;
  className?: string;
};

/**
 * HeroVideo — plays the first clip once, then crossfades to the second
 * (looping). Robust autoplay (Axon pattern): muted + playsInline + a
 * programmatic .play() rather than the `autoplay` attribute, so mobile
 * Safari/Chrome don't surface the native play-button overlay. Falls back
 * to the poster on reduced-motion / data-saver or if a clip can't load.
 */
export default function HeroVideo({
  first,
  second,
  poster,
  className = "",
}: HeroVideoProps) {
  const firstRef = useRef<HTMLVideoElement>(null);
  const secondRef = useRef<HTMLVideoElement>(null);
  const [showSecond, setShowSecond] = useState(false);
  const [allowed, setAllowed] = useState(false);
  // The hero is sticky, so it never leaves the viewport geometrically —
  // pause the (heavy, 1080p) clips once a section has scrolled over it.
  const visible = useFirstViewport();

  // Energy-aware: rest on the poster for reduced-motion / data-saver.
  useEffect(() => {
    let ok = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ok = false;
    const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) ok = false;
    // Intentional one-shot capability check on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllowed(ok);
  }, []);

  // Kick off / resume the current clip; pause both when hidden or disallowed.
  useEffect(() => {
    const first = firstRef.current;
    const second = secondRef.current;
    if (!allowed || !visible) {
      first?.pause();
      second?.pause();
      return;
    }
    const v = showSecond ? second : first;
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }
  }, [allowed, visible, showSecond]);

  // Endless 1 → 2 → 1 → 2 … cycle: when a clip ends, restart the other from
  // the top (while it's still hidden under the crossfade) and reveal it.
  const handleFirstEnded = () => {
    const v = secondRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = true;
      v.play().catch(() => {});
    }
    setShowSecond(true);
  };

  const handleSecondEnded = () => {
    const v = firstRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = true;
      v.play().catch(() => {});
    }
    setShowSecond(false);
  };

  return (
    <div
      className={`hero-video ${className}`.trim()}
      style={{ backgroundImage: `url(${poster})` }}
      aria-hidden="true"
    >
      {/* Second clip sits underneath; revealed when the first ends. */}
      <video
        ref={secondRef}
        className="hero-video__clip hero-video__clip--second"
        muted
        playsInline
        preload="auto"
        poster={poster}
        onEnded={handleSecondEnded}
      >
        <source src={second} type="video/mp4" />
      </video>

      {/* First clip on top; fades out on end to reveal the second. */}
      <video
        ref={firstRef}
        className={`hero-video__clip hero-video__clip--first ${showSecond ? "is-done" : ""}`.trim()}
        muted
        playsInline
        preload="auto"
        poster={poster}
        onEnded={handleFirstEnded}
      >
        <source src={first} type="video/mp4" />
      </video>
    </div>
  );
}
