"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./preloader.css";

/**
 * Preloader — TEMPORARY placeholder for subpages that aren't built yet
 * (Services / Products). Shows the page name with an infinite looping progress
 * bar + counter so the client sees it's "in progress".
 */
export default function Preloader({ label }: { label: string }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPct((p) => (p >= 99 ? 0 : p + 1));
    }, 28);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="preloader" aria-label={`${label} — in progress`}>
      <div className="preloader__inner">
        <p className="preloader__eyebrow">In progress</p>
        <h1 className="preloader__title">{label}</h1>
        <p className="preloader__note">
          This page is being built — check back soon.
        </p>

        <div className="preloader__bar" aria-hidden="true">
          <span className="preloader__bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="preloader__pct" aria-hidden="true">
          {String(pct).padStart(3, "0")}%
        </p>

        <Link href="/" className="preloader__back">
          ← Back to home
        </Link>
      </div>
    </section>
  );
}
