import { Raleway, B612, Geist_Mono } from "next/font/google";

/**
 * Type system for PV Link Energy.
 *
 * Raleway — elegant geometric sans for DISPLAY / titles (the stretched
 * "PV LINK ENERGY" wordmark and headings).
 *
 * B612 — body copy (legibility-first).
 *
 * Geist Mono — short technical accents: buttons, eyebrows/labels, numerals.
 *
 * Exposed as CSS variables, wired in theme.css to
 * --font-display / --font-sans / --font-mono.
 */
export const display = Raleway({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display-src",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const body = B612({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-b612-src",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-src",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

/** Class string applied on <html> so all font variables are in scope. */
export const fontVariables = `${display.variable} ${body.variable} ${geistMono.variable}`;
