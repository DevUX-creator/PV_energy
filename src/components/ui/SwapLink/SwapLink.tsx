"use client";

import { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import "./swapLink.css";

interface SwapLinkProps {
  href: string;
  /** Visible label. Each character is split into a span for staggered hover. */
  label: string;
  /** Forwarded to the anchor; useful for closing menus on click. */
  onClick?: () => void;
  tabIndex?: number;
  className?: string;
  children?: ReactNode;
}

function characterSpans(label: string) {
  return Array.from(label).map((c, i) => (
    <span key={i} style={{ "--i": i } as CSSProperties}>
      {c === " " ? " " : c}
    </span>
  ));
}

/**
 * Letter-swap hover link (ported from the Fabrisa reference). The visible
 * label sits inside an overflow-hidden mask; on hover both the original
 * text and a clone positioned one mask-height below translate up together
 * — the text exits the top, the clone enters from the bottom, staggered
 * per character.
 *
 * Tunables via CSS vars on a parent: --swap-height, --swap-shift,
 * --swap-stagger.
 */
export default function SwapLink({
  href,
  label,
  onClick,
  tabIndex,
  className,
  children,
}: SwapLinkProps) {
  const cls = ["swapLink", className].filter(Boolean).join(" ");
  const content = children ?? characterSpans(label);

  return (
    <Link
      href={href}
      className={cls}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={label}
    >
      <span className="swapLink__text" aria-hidden="true">
        {content}
      </span>
      <span className="swapLink__clone" aria-hidden="true">
        {content}
      </span>
    </Link>
  );
}
