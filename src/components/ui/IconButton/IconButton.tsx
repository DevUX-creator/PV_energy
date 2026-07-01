import "./iconButton.css";

type IconButtonProps = {
  /** Which way the brand arrow points. */
  direction: "left" | "right";
  onClick: () => void;
  /** Accessible label — required (the button has no visible text). */
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
};

/**
 * IconButton — a compact square control showing the brand arrow (the same
 * chevron used in the site's CTA buttons). Used for prev/next stepping;
 * `direction` mirrors the arrow horizontally.
 */
export default function IconButton({
  direction,
  onClick,
  ariaLabel,
  disabled = false,
  className = "",
}: IconButtonProps) {
  const classes = ["icon-btn", `icon-btn--${direction}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <svg
        className="icon-btn__arrow"
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
    </button>
  );
}
