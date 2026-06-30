"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import Logo from "@/components/ui/Logo";
import SwapLink from "@/components/ui/SwapLink";
import { MAIN_NAV, LEGAL_NAV } from "@/lib/navigation";
import { OFFICES, type Office } from "@/components/sections/Offices/config";
import "./menu.css";
import "@/components/layout/OfficesMenu/officesMenu.css";

type Mode = "menu" | "offices" | null;

/** Google Maps embed (no API key needed) centred on the office address. */
const mapSrc = (o: Office) =>
  `https://www.google.com/maps?q=${encodeURIComponent(o.address)}&output=embed`;

/**
 * Header overlay — ONE full-height frosted panel shared by two triggers:
 * the burger (left) shows the site menu, the "Our Offices" button (right)
 * shows the offices. Opening either reveals the panel (clip-path wipe);
 * with the panel already open, clicking the other trigger swaps the centre
 * content in place and the icons follow (burger ⇆ X, shuriken ⇆ X). Closing
 * the active trigger collapses the panel. Lenis is locked while open.
 */
export default function Menu() {
  const [mode, setMode] = useState<Mode>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const prevModeRef = useRef<Mode>(null);
  const animatingRef = useRef(false);

  const open = mode !== null;

  // Initial hidden state.
  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;
    gsap.set(root, { autoAlpha: 0 });
    gsap.set(panel, { clipPath: "inset(0 0 100% 0)" });
  }, []);

  // React to mode transitions: open (reveal), switch (swap), close (collapse).
  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = (
      window as unknown as { __lenis?: { stop: () => void; start: () => void } }
    ).__lenis;
    const video = bgVideoRef.current;
    const prev = prevModeRef.current;
    const cards = () => panel.querySelectorAll<HTMLElement>(".nav-card");

    if (mode !== null && prev === null) {
      // OPEN from closed.
      lenis?.stop();
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
      animatingRef.current = true;
      gsap.set(root, { autoAlpha: 1 });
      const tl = gsap.timeline({
        onComplete: () => {
          animatingRef.current = false;
        },
      });
      tl.to(panel, {
        clipPath: "inset(0 0 0% 0)",
        duration: reduce ? 0 : 0.7,
        ease: "power3.inOut",
      });
      tl.fromTo(
        cards(),
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: reduce ? 0 : 0.6, stagger: 0.08, ease: "power3.out" },
        "-=0.35"
      );
    } else if (mode !== null && prev !== null && mode !== prev) {
      // SWITCH content while open — quick re-stagger of the new cells.
      gsap.fromTo(
        cards(),
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: reduce ? 0 : 0.45, stagger: 0.06, ease: "power3.out" }
      );
    } else if (mode === null && prev !== null) {
      // CLOSE.
      lenis?.start();
      video?.pause();
      animatingRef.current = true;
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { autoAlpha: 0 });
          animatingRef.current = false;
        },
      });
      tl.to(panel, {
        clipPath: "inset(0 0 100% 0)",
        duration: reduce ? 0 : 0.5,
        ease: "power3.inOut",
      });
    }

    prevModeRef.current = mode;
  }, [mode]);

  // Reset to the office photo whenever the offices view is shown.
  useEffect(() => {
    if (mode === "offices") setActiveId(null);
  }, [mode]);

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMode(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const pick = (target: Exclude<Mode, null>) => {
    // Block re-entry only while the open/close wipe is running; switching
    // between modes while open is always allowed.
    if (animatingRef.current && mode === null) return;
    setMode((m) => (m === target ? null : target));
  };
  const close = () => setMode(null);

  const active = OFFICES.find((o) => o.id === activeId) ?? null;

  return (
    <>
      {/* Burger (left) */}
      <button
        type="button"
        className={`menu-btn ${mode === "menu" ? "is-open" : ""}`.trim()}
        aria-label={mode === "menu" ? "Close menu" : "Open menu"}
        aria-expanded={mode === "menu"}
        aria-controls="site-overlay"
        onClick={() => pick("menu")}
      >
        <span className="menu-btn__burger" aria-hidden="true">
          <span />
          <span />
        </span>
        <span className="menu-btn__close" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="18" height="18" fill="none">
            <path
              d="M8 0v4c0 2.4 1.76 4 4 4h4M0 8h6m2 8v-6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </span>
      </button>

      {/* Logo (centre) */}
      <Link href="/" className="header__logo" aria-label="PV Link Energy — home">
        <Logo />
      </Link>

      {/* Our Offices (right) */}
      <button
        type="button"
        className={`office-btn ${mode === "offices" ? "is-open" : ""}`.trim()}
        aria-label={mode === "offices" ? "Close offices" : "Our offices"}
        aria-expanded={mode === "offices"}
        aria-controls="site-overlay"
        onClick={() => pick("offices")}
      >
        <span className="office-btn__text">Our Offices</span>
        <span className="office-btn__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
            <path
              d="M8 0v4c0 2.4 1.76 4 4 4h4M0 8h6m2 8v-6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </span>
      </button>

      {/* Shared overlay */}
      <div
        id="site-overlay"
        ref={rootRef}
        className="menu"
        role="dialog"
        aria-modal="true"
        aria-label={mode === "offices" ? "Our offices" : "Site menu"}
      >
        <div ref={panelRef} className="menu__panel">
          <video
            ref={bgVideoRef}
            className="menu__bg"
            muted
            loop
            playsInline
            preload="none"
            poster="/Menu/menu-poster.jpg"
            aria-hidden="true"
          >
            <source src="/Menu/menu-bg.mp4" type="video/mp4" />
          </video>

          <div className="menu__inner">
            {mode === "offices" ? (
              <div className="offices-ov__grid">
                {OFFICES.map((o) => {
                  const isA = o.id === activeId;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      className={`offices-ov__card nav-card offices-ov__office ${isA ? "is-active" : ""}`.trim()}
                      aria-pressed={isA}
                      onClick={() => setActiveId(o.id)}
                    >
                      <span className="offices-ov__eyebrow">{o.country}</span>
                      <span className="offices-ov__office-city">{o.city}</span>
                      <span className="offices-ov__office-addr">{o.address}</span>
                      {o.phone ? (
                        <span className="offices-ov__office-phone">{o.phone}</span>
                      ) : null}
                    </button>
                  );
                })}

                <div className="offices-ov__card nav-card offices-ov__media">
                  {active ? (
                    <div className="offices-ov__map">
                      <div className="offices-ov__crumb">
                        <button
                          type="button"
                          className="offices-ov__back"
                          onClick={() => setActiveId(null)}
                        >
                          <svg
                            className="offices-ov__back-arrow"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                            aria-hidden="true"
                          >
                            <line x1="21" y1="12" x2="6" y2="12" />
                            <polyline points="12,6 6,12 12,18" />
                          </svg>
                          Back
                        </button>
                        <span className="offices-ov__crumb-loc">
                          {active.city}, {active.country}
                        </span>
                      </div>
                      <iframe
                        key={active.id}
                        className="offices-ov__frame"
                        src={mapSrc(active)}
                        title={`Map of the ${active.city} office`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="offices-ov__img"
                        src="/Offices/Office.webp"
                        alt="A PV Link Energy office"
                      />
                      <span className="offices-ov__hint" aria-hidden="true">
                        Select an office to view its location
                      </span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="menu__grid">
                <nav className="menu__card nav-card menu__card--nav" aria-label="Primary">
                  <p className="menu__eyebrow">Navigate</p>
                  <ul className="menu__nav-list">
                    {MAIN_NAV.map((item) => (
                      <li key={item.href}>
                        <SwapLink
                          href={item.href}
                          label={item.label}
                          className="menu__nav-link"
                          onClick={close}
                        />
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="menu__card nav-card menu__card--contact">
                  <p className="menu__eyebrow">Get in touch</p>
                  <a href="mailto:info@pvlinkenergy.com" className="menu__contact-line">
                    info@pvlinkenergy.com
                  </a>
                </div>

                <div className="menu__card nav-card menu__card--meta">
                  <p className="menu__tagline">Empowering Global Energy Flows</p>
                  <ul className="menu__meta-links">
                    {LEGAL_NAV.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} onClick={close} className="menu__link">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
