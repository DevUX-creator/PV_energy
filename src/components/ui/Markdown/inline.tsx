import { Fragment, type ReactNode } from "react";

/** Render inline **bold** runs within a line of text. */
export function inline(text: string, base = "i"): ReactNode[] {
  return text.split(/\*\*/).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${base}-b${i}`}>{part}</strong>
    ) : (
      <Fragment key={`${base}-t${i}`}>{part}</Fragment>
    )
  );
}
