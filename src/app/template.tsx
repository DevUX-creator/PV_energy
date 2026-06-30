import type { ReactNode } from "react";

/**
 * App Router template — re-mounts on every navigation, so the CSS entry
 * animation (globals.css `.page-transition`) plays each time, giving a
 * smooth fade + lift between pages.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-transition">{children}</div>;
}
