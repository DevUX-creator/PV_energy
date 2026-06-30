import type { ElementType, ReactNode } from "react";

type ContainerWidth = "default" | "wide" | "fluid" | "text";

type ContainerProps = {
  children: ReactNode;
  /** Max-width preset. Maps to the .container* utilities in globals.css. */
  width?: ContainerWidth;
  /** Render element. Defaults to a <div>. */
  as?: ElementType;
  className?: string;
};

const WIDTH_CLASS: Record<ContainerWidth, string> = {
  default: "container",
  wide: "container-wide",
  fluid: "container-fluid",
  text: "container", // narrow prose handled via inline max-width below
};

/**
 * Horizontal layout wrapper — centres content and applies the fluid
 * gutter. Thin shell over the .container* utilities so sections don't
 * repeat the class names. `width="text"` clamps to the readable measure.
 */
export default function Container({
  children,
  width = "default",
  as: Tag = "div",
  className = "",
}: ContainerProps) {
  const classes = [WIDTH_CLASS[width], className].filter(Boolean).join(" ");
  const style =
    width === "text" ? { maxWidth: "var(--max-width-text)" } : undefined;

  return (
    <Tag className={classes} style={style}>
      {children}
    </Tag>
  );
}
