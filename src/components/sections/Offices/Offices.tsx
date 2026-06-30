"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import RevealSection from "@/animations/RevealSection";
import { OFFICES, type Office } from "./config";
import "./offices.css";

/** Google Maps embed (no API key needed) centred on the office address. */
const mapSrc = (office: Office) =>
  `https://www.google.com/maps?q=${encodeURIComponent(office.address)}&output=embed`;

/**
 * Offices — split panel: a column of office cards on the left, a media box
 * on the right. The box shows the office photo by default; clicking an
 * office swaps it for a Google map of that location with a breadcrumb to
 * go back to the photo.
 */
export default function Offices() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = OFFICES.find((o) => o.id === activeId) ?? null;

  return (
    <Section id="offices" surface ariaLabel="Office locations">
      <RevealSection>
        <p className="eyebrow">Global Presence</p>
        <h2 className="offices__title">Our offices around the world</h2>
        <p className="offices__lead">
          Strong presence across key energy markets, with on-ground specialists
          handling each region. Select an office to view it on the map.
        </p>
      </RevealSection>

      <div className="offices__panel">
        <div className="offices__list" role="list">
          {OFFICES.map((office) => {
            const isActive = office.id === activeId;
            return (
              <button
                key={office.id}
                type="button"
                role="listitem"
                className={`offices__card${isActive ? " is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => setActiveId(office.id)}
              >
                <span className="offices__card-city">
                  {office.city}, {office.country}
                </span>
                <span className="offices__card-address">{office.address}</span>
                {office.phone ? (
                  <span className="offices__card-phone">{office.phone}</span>
                ) : null}
                <span className="offices__card-cta" aria-hidden="true">
                  View on map →
                </span>
              </button>
            );
          })}
        </div>

        <div className="offices__media">
          {active ? (
            <div className="offices__map">
              <div className="offices__breadcrumb">
                <button
                  type="button"
                  className="offices__back"
                  onClick={() => setActiveId(null)}
                >
                  ← Back
                </button>
                <span className="offices__crumb">
                  {active.city}, {active.country}
                </span>
              </div>
              <iframe
                key={active.id}
                className="offices__map-frame"
                src={mapSrc(active)}
                title={`Map of the ${active.city} office`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="offices__image"
                src="/Offices/Office.webp"
                alt="A PV Link Energy office"
                loading="lazy"
              />
              <span className="offices__hint" aria-hidden="true">
                Select an office to view its location
              </span>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}
