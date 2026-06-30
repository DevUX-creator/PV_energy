"use client";

import { useCallback, useEffect, useState } from "react";
import "@/components/ui/Button/button.css"; // the .btn styles the action buttons use
import "./cookie-consent.css";

/*
 * Cookie consent — GDPR / ePrivacy compliant.
 *
 *   - "Accept all" and "Reject all" carry equal visual weight (regulators
 *     reject dark-pattern UX that nudges accept).
 *   - "Manage choices" expands per-category toggles; nothing non-essential
 *     is pre-ticked.
 *   - Choice persists in localStorage under a versioned key, re-shown after
 *     365 days or a version bump.
 *   - On save a `cookie-consent` CustomEvent fires so analytics / marketing
 *     loaders can react. The banner itself loads no third-party scripts.
 *   - `cookie-consent:open` reopens it (e.g. a footer "Cookie settings" link).
 */

const STORAGE_KEY = "pvlink.cookieConsent.v1";
const TTL_DAYS = 365;

export interface ConsentChoice {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  ts: string;
}

interface StoredChoice extends ConsentChoice {
  expires: string;
}

function readStored(): StoredChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredChoice;
    if (!parsed.expires) return null;
    if (new Date(parsed.expires).getTime() < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(choice: ConsentChoice) {
  if (typeof window === "undefined") return;
  const expires = new Date(Date.now() + TTL_DAYS * 864e5).toISOString();
  const stored: StoredChoice = { ...choice, expires };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* private mode / quota — banner simply reappears next load */
  }
  window.dispatchEvent(new CustomEvent("cookie-consent", { detail: choice }));
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = readStored();
    if (!existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
      return;
    }
    setAnalytics(existing.analytics);
    setMarketing(existing.marketing);
  }, []);

  const save = useCallback(
    (choice: { analytics: boolean; marketing: boolean }) => {
      const full: ConsentChoice = {
        essential: true,
        analytics: choice.analytics,
        marketing: choice.marketing,
        ts: new Date().toISOString(),
      };
      persist(full);
      setAnalytics(choice.analytics);
      setMarketing(choice.marketing);
      setOpen(false);
      setShowDetails(false);
    },
    []
  );

  const acceptAll = useCallback(() => save({ analytics: true, marketing: true }), [save]);
  const rejectAll = useCallback(() => save({ analytics: false, marketing: false }), [save]);
  const saveSelection = useCallback(
    () => save({ analytics, marketing }),
    [analytics, marketing, save]
  );

  // Allow a "Cookie settings" link elsewhere to reopen the banner.
  useEffect(() => {
    const reopen = () => {
      const existing = readStored();
      if (existing) {
        setAnalytics(existing.analytics);
        setMarketing(existing.marketing);
      }
      setOpen(true);
      setShowDetails(true);
    };
    window.addEventListener("cookie-consent:open", reopen);
    return () => window.removeEventListener("cookie-consent:open", reopen);
  }, []);

  if (!open) return null;

  return (
    <div
      className="cookie"
      role="dialog"
      aria-labelledby="cookie-heading"
      aria-describedby="cookie-body"
    >
      <div className="cookie__panel">
        <h2 id="cookie-heading" className="cookie__heading">
          Cookies on this site
        </h2>
        <p id="cookie-body" className="cookie__body">
          We use essential cookies to make this site work. With your permission,
          we&rsquo;d also use analytics cookies to understand how the site is
          used and improve it. See our{" "}
          <a className="cookie__link" href="/cookie-policy">
            Cookie Policy
          </a>{" "}
          and{" "}
          <a className="cookie__link" href="/privacy-policy">
            Privacy Policy
          </a>
          .
        </p>

        {showDetails && (
          <div className="cookie__choices" role="group" aria-label="Cookie categories">
            <div className="cookie__choice">
              <div className="cookie__choice-head">
                <span className="cookie__choice-label">Essential</span>
                <span className="cookie__choice-meta">Always active</span>
              </div>
              <p className="cookie__choice-body">
                Required for the site to function — page loading, your
                preferences, and security. These cannot be turned off.
              </p>
            </div>

            <div className="cookie__choice">
              <label className="cookie__choice-head" htmlFor="cookie-analytics">
                <span className="cookie__choice-label">Analytics</span>
                <input
                  id="cookie-analytics"
                  type="checkbox"
                  className="cookie__toggle"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                />
              </label>
              <p className="cookie__choice-body">
                Anonymous statistics that show which pages are useful — no
                personal data, no cross-site tracking.
              </p>
            </div>

            <div className="cookie__choice">
              <label className="cookie__choice-head" htmlFor="cookie-marketing">
                <span className="cookie__choice-label">Marketing</span>
                <input
                  id="cookie-marketing"
                  type="checkbox"
                  className="cookie__toggle"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                />
              </label>
              <p className="cookie__choice-body">
                Used to measure campaigns and show relevant content if you arrive
                via a partner site. Off by default.
              </p>
            </div>
          </div>
        )}

        <div className="cookie__actions">
          {showDetails ? (
            <button type="button" className="btn btn--primary cookie__btn" onClick={saveSelection}>
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Save choices</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--outline cookie__btn"
              onClick={() => setShowDetails(true)}
            >
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Manage choices</span>
            </button>
          )}
          <button type="button" className="btn btn--outline cookie__btn" onClick={rejectAll}>
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">Reject all</span>
          </button>
          <button type="button" className="btn btn--primary cookie__btn" onClick={acceptAll}>
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">Accept all</span>
          </button>
        </div>
      </div>
    </div>
  );
}
