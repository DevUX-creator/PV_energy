"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import RevealText from "@/animations/RevealText";
import { OFFICES } from "@/components/sections/Offices/config";
import { CookieSettingsButton } from "@/components/ui/CookieConsent";
import "./legal.css";
import "./legalView.css";

type LegalDoc = {
  id: string;
  /** Short label shown in the side tab. */
  label: string;
  /** Full document title shown in the panel head. */
  title: string;
  updated?: string;
  body: ReactNode;
};

/* -------------------------------------------------------------------------
 * Documents. Content mirrors the live site (imprint / privacy) plus our
 * GDPR-aligned cookie policy. Kept here so the whole legal surface lives in
 * one place and deep-links by hash (#imprint / #privacy-policy / #cookie-policy).
 * ---------------------------------------------------------------------- */
const DOCS: LegalDoc[] = [
  {
    id: "imprint",
    label: "Imprint",
    title: "Imprint",
    body: (
      <>
        <p>
          Information provided in accordance with applicable disclosure
          requirements.
        </p>

        <h2>Company</h2>
        <p>
          <strong>PV Link Energy Limited</strong>
          <br />
          International energy &amp; commodities trading.
        </p>
        <p>
          Email:{" "}
          <a href="mailto:info@pvlinkenergy.com">info@pvlinkenergy.com</a>
        </p>

        <h2>Registered offices</h2>
        <div className="legal__offices">
          {OFFICES.map((o) => (
            <div className="legal__office" key={o.id}>
              <span className="legal__office-city">
                {o.city}, {o.country}
              </span>
              <address>
                {o.address}
                {o.phone ? (
                  <>
                    <br />
                    {o.phone}
                  </>
                ) : null}
              </address>
            </div>
          ))}
        </div>

        <h2>Registration &amp; tax</h2>
        <p>
          {/* TODO: client — registration number, jurisdiction, VAT / tax id,
              managing director(s). Not published on the current site. */}
          Company registration and tax identification details are available on
          request. Please contact us at{" "}
          <a href="mailto:info@pvlinkenergy.com">info@pvlinkenergy.com</a>.
        </p>

        <h2>Disclaimer</h2>
        <p>
          The content of this website has been prepared with care. However, we
          accept no liability for the accuracy, completeness or timeliness of
          the information provided. This site may contain links to external
          websites over whose content we have no control and for which we accept
          no responsibility.
        </p>

        <h2>Copyright</h2>
        <p>
          © 2026 PV Link Energy. All rights reserved. All content, trademarks
          and materials on this site are the property of PV Link Energy unless
          otherwise stated and may not be reproduced without permission.
        </p>
      </>
    ),
  },
  {
    id: "privacy-policy",
    label: "Privacy Policy",
    title: "Privacy Policy",
    updated: "15 December 2025",
    body: (
      <>
        <p>
          PV Link Energy (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates from
          Dubai, UAE and is committed to protecting the personal data of our
          visitors, clients and partners. This policy explains what we collect,
          why, and the rights you have, in line with the EU General Data
          Protection Regulation (GDPR) and other applicable laws. For any
          privacy query, contact{" "}
          <a href="mailto:info@pvlinkenergy.com">info@pvlinkenergy.com</a>.
        </p>

        <h2>Data we collect</h2>
        <p>Depending on how you interact with us, we may collect:</p>
        <ul>
          <li>Names and company affiliation;</li>
          <li>Contact information (email, phone, address);</li>
          <li>Service and product interests, and logistics details;</li>
          <li>Business correspondence you send us;</li>
          <li>
            Technical website data (e.g. IP address, browser, pages visited).
          </li>
        </ul>
        <p>
          We do not intentionally collect sensitive personal data unless
          required for a legitimate business or regulatory purpose.
        </p>

        <h2>How we use your data</h2>
        <p>We process personal data to:</p>
        <ul>
          <li>Respond to enquiries and prepare quotations;</li>
          <li>Manage contracts and trading operations;</li>
          <li>Coordinate logistics and deliveries;</li>
          <li>Meet regulatory and compliance obligations;</li>
          <li>Operate, secure and improve our website.</li>
        </ul>

        <h2>Legal basis</h2>
        <p>
          We rely on one or more of: your consent; performance of a contract;
          our legitimate interests in conducting international trade; and
          compliance with legal obligations.
        </p>

        <h2>Cookies &amp; analytics</h2>
        <p>
          Our website uses essential cookies to function and, with your consent,
          analytics cookies to understand how the site is used so we can improve
          it. Analytics data is anonymous and does not identify you unless you
          voluntarily provide your details. You can change your choice at any
          time via the &ldquo;Cookie settings&rdquo; link in the footer.
        </p>

        <h2>Sharing your data</h2>
        <p>
          We may share data with logistics and shipping providers, inspection
          bodies, professional advisors, and authorities where legally required.
          All recipients are required to keep your data confidential and to use
          it only for the agreed purpose.
        </p>

        <h2>International transfers</h2>
        <p>
          As a global business, we may transfer personal data across borders.
          Where we do, we apply appropriate safeguards consistent with the GDPR
          and applicable laws.
        </p>

        <h2>Security &amp; retention</h2>
        <p>
          We implement appropriate technical and organisational measures to
          protect personal data. No method of transmission or storage is
          completely secure, so we cannot guarantee absolute security. We retain
          personal data only as long as necessary for the purposes set out above
          or as required by law.
        </p>

        <h2>Your rights</h2>
        <p>
          Subject to applicable law, you may request access to, correction or
          deletion of your personal data, or ask us to restrict its processing.
          To exercise these rights, email{" "}
          <a href="mailto:info@pvlinkenergy.com">info@pvlinkenergy.com</a>.
        </p>

        <h2>Contact</h2>
        <p>
          For any question about this policy or your data, contact us at{" "}
          <a href="mailto:info@pvlinkenergy.com">info@pvlinkenergy.com</a>.
        </p>
      </>
    ),
  },
  {
    id: "cookie-policy",
    label: "Cookie Policy",
    title: "Cookie Policy",
    updated: "1 July 2026",
    body: (
      <>
        <p>
          This Cookie Policy explains how PV Link Energy (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) uses cookies and similar technologies on this
          website, and the choices you have. It should be read together with our{" "}
          <a href="#privacy-policy">Privacy Policy</a>.
        </p>

        <h2>What are cookies?</h2>
        <p>
          Cookies are small text files placed on your device when you visit a
          website. They are widely used to make sites work, or work more
          efficiently, and to provide information to the site owner. Similar
          technologies include local storage and pixels; we refer to them all as
          &ldquo;cookies&rdquo; here.
        </p>

        <h2>How we use cookies</h2>
        <p>We group cookies into three categories:</p>
        <ul>
          <li>
            <strong>Essential.</strong> Required for the site to function — page
            loading, remembering your preferences, and security. These are
            always active and cannot be switched off.
          </li>
          <li>
            <strong>Analytics.</strong> Help us understand how the site is used
            (which pages are useful) so we can improve it. The data is anonymous
            and is not used to identify you or track you across other sites.
            These run only with your consent.
          </li>
          <li>
            <strong>Marketing.</strong> Used to measure campaigns and show
            relevant content if you arrive via a partner site. Off by default
            and set only with your consent.
          </li>
        </ul>

        <h2>Consent</h2>
        <p>
          When you first visit, we ask for your consent to non-essential
          cookies. Essential cookies are set automatically because the site
          cannot work without them. You can accept all, reject all, or choose by
          category, and you can change your choice at any time using the button
          below or the &ldquo;Cookie settings&rdquo; link in the footer.
        </p>
        <p>
          <CookieSettingsButton className="legal__cookie-btn" />
        </p>

        <h2>Third-party cookies</h2>
        <p>
          Some cookies may be set by third parties we use to operate the site
          (for example, analytics providers). These providers process data under
          their own policies; we only enable them with your consent.
        </p>

        <h2>Managing cookies in your browser</h2>
        <p>
          In addition to our cookie settings, you can control cookies through
          your browser — blocking or deleting them at any time. Note that
          blocking essential cookies may stop parts of the site from working.
          Browser help pages explain how to manage cookies for your specific
          browser.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this Cookie Policy from time to time. The &ldquo;last
          updated&rdquo; date above shows when it was last revised.
        </p>

        <h2>Contact</h2>
        <p>
          For any question about our use of cookies, contact us at{" "}
          <a href="mailto:info@pvlinkenergy.com">info@pvlinkenergy.com</a>.
        </p>
      </>
    ),
  },
];

/**
 * LegalView — the unified /legal page. BeBawa side-tab layout in our style:
 * a dark hero band, then a white deck that overlaps it holding a sticky left
 * tab rail (the three documents + a company-info card) and the active document
 * panel on the right. Tabs deep-link by hash so the footer / cookie banner can
 * link straight to a specific policy.
 */
export default function LegalView() {
  const [activeId, setActiveId] = useState(DOCS[0].id);

  // Sync the active tab from the URL hash (deep links + back/forward).
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace("#", "");
      if (DOCS.some((d) => d.id === hash)) setActiveId(hash);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const select = useCallback((id: string) => {
    setActiveId(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
  }, []);

  const active = DOCS.find((d) => d.id === activeId) ?? DOCS[0];

  return (
    <main id="main-content" className="legal-view">
      <header className="legal-view__hero">
        <div className="legal-view__hero-inner">
          <RevealText split="none">
            <p className="eyebrow legal-view__eyebrow">[ Legal ]</p>
          </RevealText>
          <RevealText eager>
            <h1 className="legal-view__hero-title">Legal &amp; policies</h1>
          </RevealText>
          <RevealText split="none" delay={0.1}>
            <p className="legal-view__hero-lead">
              The notices and policies that govern how PV Link Energy operates
              this website and handles your data.
            </p>
          </RevealText>
        </div>
      </header>

      <div className="legal-view__deck">
        <div className="legal-view__grid">
          <aside className="legal-view__side">
            <nav
              className="legal-view__nav"
              role="tablist"
              aria-label="Legal documents"
            >
              {DOCS.map((d) => {
                const isActive = d.id === active.id;
                return (
                  <button
                    key={d.id}
                    id={`tab-${d.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${d.id}`}
                    className={`legal-view__tab${isActive ? " is-active" : ""}`}
                    onClick={() => select(d.id)}
                  >
                    <span className="legal-view__tab-dot" aria-hidden="true" />
                    {d.label}
                  </button>
                );
              })}
            </nav>

            <div className="legal-view__info">
              <span className="legal-view__info-name">PV Link Energy</span>
              <p className="legal-view__info-line">
                International energy &amp; commodities trading.
              </p>
              <a
                className="legal-view__info-link"
                href="mailto:info@pvlinkenergy.com"
              >
                info@pvlinkenergy.com
              </a>
            </div>
          </aside>

          <article
            key={active.id}
            id={`panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${active.id}`}
            className="legal-view__panel"
          >
            <div className="legal-view__panel-head">
              <h2 className="legal-view__panel-title">{active.title}</h2>
              {active.updated ? (
                <p className="legal-view__panel-updated">
                  Last updated: {active.updated}
                </p>
              ) : null}
            </div>
            <div className="legal-view__panel-body legal__body">
              {active.body}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
