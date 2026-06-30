import Link from "next/link";
import type { ReactNode } from "react";
import "./button.css";

type ButtonVariant = "primary" | "outline" | "ghost";

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  /** Show the trailing arrow glyph. Default true. */
  showArrow?: boolean;
  ariaLabel?: string;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
  onClick?: () => void;
};

type ActionButtonProps = CommonProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

type ButtonProps = LinkButtonProps | ActionButtonProps;

/**
 * The site's button — polymorphic: renders an <a> (next/link) when `href`
 * is given, otherwise a <button>. Defaults to the solid primary CTA; pass
 * variant="outline" for the hairline style or "ghost" for a bare link-like
 * control. Clean corporate silhouette (rounded, no chamfer) to match the
 * professional, light-first direction.
 */
export default function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    showArrow = true,
    ariaLabel,
    className = "",
  } = props;

  const classes = ["btn", `btn--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="btn__fill" aria-hidden="true" />
      <span className="btn__label">{children}</span>
      {showArrow ? (
        <svg
          className="btn__arrow"
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
      ) : null}
    </>
  );

  if (props.href !== undefined) {
    return (
      <Link
        href={props.href}
        className={classes}
        aria-label={ariaLabel}
        onClick={props.onClick}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      aria-label={ariaLabel}
      onClick={props.onClick}
    >
      {inner}
    </button>
  );
}
