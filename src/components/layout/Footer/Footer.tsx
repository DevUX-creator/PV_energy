import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { MAIN_NAV, LEGAL_NAV } from "@/lib/navigation";
import { ALL_PRODUCTS } from "@/lib/products";
import { OFFICES } from "@/components/sections/Offices/config";
import Wordmark from "@/components/ui/Wordmark";
import { CookieSettingsButton } from "@/components/ui/CookieConsent";
import FooterLines from "./FooterLines";
import "./footer.css";

const YEAR = 2026; // Date.* is unavailable in some build contexts; bump as needed.
const LINKEDIN_URL = "https://www.linkedin.com/company/pvlink-energy/";

/**
 * Global footer — a full-bleed white slab the dark sections above resolve
 * into, carrying a mouse-reactive lines background (FooterLines) that spans
 * the full width. Content mirrors pvlinkenergy.com/contact: quick links,
 * office locations, contact + social, a brand logotype, and a legal row.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__panel">
        <FooterLines />

        <div className="footer__content">
          <div className="footer__top">
            <div className="footer__brand">
              <Link
                href="/"
                className="footer__logo-link"
                aria-label="PV Link Energy — home"
              >
                <Logo className="footer__logo" />
              </Link>
              <h3 className="footer__tagline">
                Empowering global
                <br />
                energy flows.
              </h3>

              <a
                className="footer__sponsor"
                href="https://www.argusmedia.com/en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PV Link Energy is a platinum sponsor of Argus Media"
              >
                <span className="footer__sponsor-label">Platinum Sponsor of</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="footer__sponsor-logo"
                  src="/argus-media.svg"
                  alt="Argus Media"
                  width={400}
                  height={157}
                />
              </a>
            </div>

            <nav className="footer__nav" aria-label="Footer">
              <div className="footer__col">
                <span className="footer__col-title">Quick Links</span>
                <ul>
                  {MAIN_NAV.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer__col">
                <span className="footer__col-title">Products</span>
                <ul>
                  {ALL_PRODUCTS.map((p) => (
                    <li key={p.id}>
                      <Link href={`/products/${p.id}`}>{p.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer__col footer__col--offices">
                <span className="footer__col-title">Offices</span>
                <ul>
                  {OFFICES.map((o) => (
                    <li key={o.id}>
                      <span className="footer__office-city">
                        {o.city}, {o.country}
                      </span>
                      <span className="footer__office-addr">{o.address}</span>
                      {o.phone ? (
                        <a
                          className="footer__office-phone"
                          href={`tel:${o.phone.replace(/\s+/g, "")}`}
                        >
                          {o.phone}
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer__col">
                <span className="footer__col-title">Connect</span>
                <ul>
                  <li>
                    <a href="mailto:info@pvlinkenergy.com">info@pvlinkenergy.com</a>
                  </li>
                  <li>
                    <a
                      href={LINKEDIN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          <div className="footer__wordmark">
            <Wordmark decorative />
          </div>

          <div className="footer__bottom">
            <p className="footer__rights">
              Copyright © {YEAR} PV Link Energy. All rights reserved.
            </p>
            <ul className="footer__legal">
              {LEGAL_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton className="footer__cookie-btn" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
