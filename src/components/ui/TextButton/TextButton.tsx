"use client";

import { CSSProperties } from "react";
import Link from "next/link";
import "./textButton.css";

interface TextButtonProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

function chars(label: string) {
  return Array.from(label).map((c, i) => (
    <span key={i} style={{ "--i": i } as CSSProperties}>
      {c === " " ? " " : c}
    </span>
  ));
}

/**
 * TextButton — white text link with a trailing arrow. Label uses the menu's
 * letter-swap hover (the original rolls up out of a mask while a clone rolls
 * in from below, staggered per character); the arrow nudges right on hover.
 */
export default function TextButton({
  href,
  label,
  onClick,
  className = "",
}: TextButtonProps) {
  const cls = ["text-btn", className].filter(Boolean).join(" ");
  return (
    <Link href={href} className={cls} onClick={onClick} aria-label={label}>
      <span className="text-btn__label" aria-hidden="true">
        <span className="text-btn__text">{chars(label)}</span>
        <span className="text-btn__clone">{chars(label)}</span>
      </span>
      <svg
        className="text-btn__arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden="true"
      >
        <line x1="3" y1="12" x2="18" y2="12" />
        <polyline points="12,6 18,12 12,18" />
      </svg>
    </Link>
  );
}
