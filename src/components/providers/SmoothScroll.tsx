"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsapPlugins } from "@/lib/gsap";

// useLayoutEffect on the client (runs before paint), useEffect on the server.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Wraps the app in Lenis smooth scrolling and bridges it to GSAP's
 * ScrollTrigger so pinned / scrubbed animations stay in sync.
 *
 *  - reload on viewport WIDTH change (pins measure once on mount)
 *  - opt out entirely under prefers-reduced-motion
 *  - reset scroll + refresh triggers on client-side route change
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Reload on width change only. Pinned ScrollTriggers and Lenis both
    // measure once on mount; a width change invalidates those numbers.
    // Height changes (mobile address-bar show/hide) are ignored.
    let lastWidth = window.innerWidth;
    let resizeTimeout: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          window.location.reload();
        }
      }, 300);
    };
    window.addEventListener("resize", onResize);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      return () => {
        window.clearTimeout(resizeTimeout);
        window.removeEventListener("resize", onResize);
      };
    }

    registerGsapPlugins();

    // Force pins to use position:fixed (never "transform" mode). Transform
    // pinning can create a containing block on an ancestor that breaks
    // global position:fixed elements such as the header.
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });
    ScrollTrigger.defaults({ pinType: "fixed" });

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    // Expose for an overlay menu (push-over needs to freeze/resume scroll).
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const handleLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", handleLenisScroll);

    // Drive Lenis off GSAP's ticker so both share one RAF loop.
    const tickerCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      window.clearTimeout(resizeTimeout);
      window.removeEventListener("resize", onResize);
      lenis.off("scroll", handleLenisScroll);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // Reset scroll to the top BEFORE the new route paints.
  useIsomorphicLayoutEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.start();
      lenis.scrollTo(0, { immediate: true, force: true });
    } else if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // After paint, re-measure all ScrollTriggers against the new route.
  useEffect(() => {
    const lenis = lenisRef.current;
    const toTop = () => {
      if (lenis) {
        lenis.start();
        lenis.scrollTo(0, { immediate: true, force: true });
      } else if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
    };
    toTop();
    ScrollTrigger.refresh();
    toTop();
    requestAnimationFrame(toTop);
  }, [pathname]);

  return <>{children}</>;
}
