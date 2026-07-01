"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SHOWCASE_SERVICES } from "./config";
import "./whatWeDo.css";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const N = SHOWCASE_SERVICES.length;

/**
 * WhatWeDo — services showcase. Hovering (or focusing) a service swaps the
 * image and copy and slides the indicator bar — same change animation as
 * the original, just driven by hover instead of scroll. No pin / full-screen.
 */
export default function WhatWeDo() {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const imgStackRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  // Only let a clip play while the showcase is on screen — otherwise the
  // looping video keeps decoding off-screen and janks scrolling.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Move the indicator + image stack to the active item (on hover change).
  useIso(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = movedRef.current && !reduce ? 0.3 : 0;
    const item = itemRefs.current[active];
    if (item && indicatorRef.current && listRef.current) {
      // Measure with getBoundingClientRect (subpixel-accurate) rather than
      // offsetTop/Height/Width (integer-rounded) so the bar doesn't jitter
      // ~1px against the fractional, vw-sized text as you hover the list.
      const itemRect = item.getBoundingClientRect();
      const listRect = listRef.current.getBoundingClientRect();
      gsap.to(indicatorRef.current, {
        y: itemRect.top - listRect.top,
        width: itemRect.width + 22, // extend past the text on the right
        height: itemRect.height,
        duration: dur,
        ease: "power3.inOut",
        overwrite: true,
      });
    }
    if (imgStackRef.current && imgWrapRef.current) {
      gsap.to(imgStackRef.current, {
        y: -active * imgWrapRef.current.offsetHeight,
        duration: dur ? 0.4 : 0,
        ease: "power3.inOut",
        overwrite: true,
      });
    }
    movedRef.current = true;
  }, [active]);

  // Play only the active service's clip — and only while in view. Others
  // stay paused (and reset) so re-hover restarts the transform.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (inView && i === active) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [active, inView]);

  return (
    <div ref={rootRef} className="ww-show">
      <div className="ww-show__inner">
        <div
          ref={listRef}
          className="ww-show__list"
          // On hover devices, leaving the list returns to Trading (index 0) —
          // the only clip that auto-plays at rest. On touch there's no hover,
          // so a tap should stick; skip the reset for coarse pointers.
          onMouseLeave={() => {
            if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
              setActive(0);
            }
          }}
        >
          <div ref={indicatorRef} className="ww-show__indicator" aria-hidden="true" />
          <ul className="ww-show__items">
            {SHOWCASE_SERVICES.map((s, i) => (
              <li
                key={s.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={`ww-show__item ${i === active ? "is-active" : ""}`.trim()}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
              >
                <span className="ww-show__item-full">{s.name}</span>
                <span className="ww-show__item-short">{s.short}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ww-show__media">
          <div ref={imgWrapRef} className="ww-show__img-wrap">
            <div ref={imgStackRef} className="ww-show__img-stack">
              {SHOWCASE_SERVICES.map((s, i) =>
                s.video ? (
                  <div key={s.id} className="ww-show__img">
                    <video
                      ref={(el) => {
                        videoRefs.current[i] = el;
                      }}
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster={s.poster}
                    >
                      {/* H.264 only — hardware-decoded everywhere; VP9/WebM
                          looping clips are often software-decoded and jank. */}
                      <source src={s.video} type="video/mp4" />
                    </video>
                  </div>
                ) : (
                  <div key={s.id} className="ww-show__img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" />
                  </div>
                )
              )}
            </div>
          </div>

          {/* All copies are stacked in one grid cell so the block stays as
              tall as the longest one — height never changes on hover, so the
              media column (and the centered list) doesn't reflow. */}
          <div className="ww-show__copy-stack">
            {SHOWCASE_SERVICES.map((s, i) => (
              <p
                key={s.id}
                className={`ww-show__copy ${i === active ? "is-active" : ""}`.trim()}
                aria-hidden={i === active ? undefined : true}
              >
                {s.copy}
              </p>
            ))}
          </div>

          <div className="ww-show__index">
            <span>{String(active + 1).padStart(2, "0")}</span>
            <span className="ww-show__sep" aria-hidden="true" />
            <span>{String(N).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
