import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import "./section.css";

type SectionProps = {
  children: ReactNode;
  /** Anchor id for in-page navigation. */
  id?: string;
  /** Paint the deep-navy inverse surface (light text). */
  inverse?: boolean;
  /** Tinted surface background (subtle). */
  surface?: boolean;
  /** Wrap children in a Container. Set false for full-bleed sections. */
  contained?: boolean;
  /** Container width preset when `contained`. */
  width?: "default" | "wide" | "fluid" | "text";
  /** Accessible label for the landmark. */
  ariaLabel?: string;
  className?: string;
};

/**
 * Section landmark with consistent vertical rhythm (.section padding).
 * Optionally paints the inverse navy surface and wraps content in a
 * Container. This is the standard outer shell every page section uses.
 */
export default function Section({
  children,
  id,
  inverse = false,
  surface = false,
  contained = true,
  width = "default",
  ariaLabel,
  className = "",
}: SectionProps) {
  const classes = [
    "section",
    "section-block",
    inverse ? "section-block--inverse" : "",
    surface ? "section-block--surface" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} className={classes} aria-label={ariaLabel}>
      {contained ? <Container width={width}>{children}</Container> : children}
    </section>
  );
}
