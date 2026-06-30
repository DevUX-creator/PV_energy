"use client";

import type { ReactNode } from "react";

/**
 * A text button that reopens the cookie consent banner (so visitors can change
 * their choice at any time). Dispatches the `cookie-consent:open` event the
 * banner listens for.
 */
export default function CookieSettingsButton({
  children = "Cookie settings",
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent("cookie-consent:open"))}
    >
      {children}
    </button>
  );
}
