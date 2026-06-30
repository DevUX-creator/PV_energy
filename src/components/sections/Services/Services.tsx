import Link from "next/link";
import Section from "@/components/ui/Section";
import RevealSection from "@/animations/RevealSection";
import { SERVICES } from "./config";
import "./services.css";

/**
 * Services — STUB. The 6 core services as a simple numbered grid.
 * Cards / process steps / animation come during section polish.
 */
export default function Services() {
  return (
    <Section id="services" ariaLabel="Services">
      <RevealSection>
        <p className="eyebrow">Services</p>
        <h2 className="services__title">Across the energy &amp; commodities supply chain</h2>
        <p className="services__lead">
          Comprehensive oil and gas services that span every stage of the energy
          lifecycle — from sourcing through delivery.
        </p>
      </RevealSection>

      <ul className="services__grid">
        {SERVICES.map((service, i) => (
          <li key={service.id} className="services__item">
            <span className="services__num">{String(i + 1).padStart(2, "0")}</span>
            <Link href={service.href} className="services__link">
              {service.name}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
