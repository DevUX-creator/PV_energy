import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main id="main-content" className="section container" style={{ textAlign: "center" }}>
      <p className="eyebrow">404</p>
      <h1 style={{ marginBlock: "var(--space-6)" }}>This page could not be found.</h1>
      <p style={{ color: "var(--fg-secondary)", marginBottom: "var(--space-10)" }}>
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button href="/">Back to home</Button>
      </div>
    </main>
  );
}
