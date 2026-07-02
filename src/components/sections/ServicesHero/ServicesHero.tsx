"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Globe from "@/components/ui/Globe";
import HeroCursor from "./HeroCursor";
import "./servicesHero.css";

/** Swaps text with a blur-out → blur-in transition when `value` changes. */
function BlurSwap({ value, className = "" }: { value: string; className?: string }) {
  const [display, setDisplay] = useState(value);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (value === display) return;
    setOut(true);
    const t = setTimeout(() => {
      setDisplay(value);
      setOut(false);
    }, 240);
    return () => clearTimeout(t);
  }, [value, display]);
  return (
    <span className={`services-hero__swap${out ? " is-out" : ""} ${className}`.trim()}>
      {display}
    </span>
  );
}

const OFFICES = [
  {
    lat: 25.19,
    lng: 55.28,
    city: "Dubai",
    copy: "Our Middle East hub — trading, storage and logistics across the Gulf and the wider region.",
  },
  {
    lat: 37.98,
    lng: 23.72,
    city: "Athens",
    copy: "Our European desk — connecting ARA and Mediterranean flows with on-the-ground execution.",
  },
  {
    lat: 22.32,
    lng: 114.17,
    city: "Hong Kong",
    copy: "Our Asia-Pacific base — servicing fast-moving demand across the region's key markets.",
  },
];

const DEFAULT_SUB =
  "From sourcing to final delivery, we provide best-in-class energy & commodities services across every major market — worldwide.";

/**
 * ServicesHero — the interactive frosted-glass globe centrepiece. Hovering an
 * office marker swaps the grey title word for the city and the supporting line
 * for that location's copy, and turns the crosshair cursor blue.
 */
export default function ServicesHero() {
  const [active, setActive] = useState<number | null>(null);
  const [near, setNear] = useState(false);
  const office = active !== null ? OFFICES[active] : null;

  return (
    <section
      className={`services-hero${near ? " is-near" : ""}`}
      aria-label="Services"
    >
      <div className="services-hero__head">
        <h1 className="services-hero__title">
          Services
          <br />
          <BlurSwap
            className="services-hero__title-grey"
            value={office ? office.city : "Borderless"}
          />
        </h1>
        <div className="services-hero__cta">
          <Button href="/contact">Contact Us</Button>
        </div>
      </div>

      <Container width="wide" className="services-hero__inner">
        <div className="services-hero__globe">
          <Globe
            offices={OFFICES}
            onState={(s) => {
              setActive(s.active);
              setNear(s.near);
            }}
          />
        </div>
      </Container>

      <p className="services-hero__sub">
        <BlurSwap value={office ? office.copy : DEFAULT_SUB} />
      </p>

      <HeroCursor />
    </section>
  );
}
