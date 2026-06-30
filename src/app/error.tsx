"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for diagnostics; wire to a real logger during integration.
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="section container" style={{ textAlign: "center" }}>
      <p className="eyebrow">Something went wrong</p>
      <h1 style={{ marginBlock: "var(--space-6)" }}>An unexpected error occurred.</h1>
      <p style={{ color: "var(--fg-secondary)", marginBottom: "var(--space-10)" }}>
        Please try again. If the problem persists, contact info@pvlinkenergy.com.
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={reset} showArrow={false}>
          Try again
        </Button>
      </div>
    </main>
  );
}
