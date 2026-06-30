"use client";

import { useEffect, useState } from "react";

/**
 * True while the page is scrolled within the first viewport — i.e. while
 * the sticky hero is still uncovered. Once a later section has scrolled up
 * over the hero, this flips to false.
 *
 * The hero is `position: sticky`, so it never leaves the viewport
 * geometrically; an IntersectionObserver would report it visible for the
 * whole page. A scroll-position check is what actually tells us the hero is
 * covered — used to pause its background video + grain (expensive when left
 * running behind every section).
 */
export function useFirstViewport(): boolean {
  const [active, setActive] = useState(true);

  useEffect(() => {
    let ticking = false;
    const check = () => {
      ticking = false;
      // Pause just before the hero is fully covered (95% of a viewport).
      setActive(window.scrollY < window.innerHeight * 0.95);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", check);
    };
  }, []);

  return active;
}
