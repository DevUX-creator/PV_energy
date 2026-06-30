import type { ReactNode } from "react";
import Section from "@/components/ui/Section";
import "./legal.css";

type LegalProps = {
  eyebrow: string;
  title: string;
  updated?: string;
  children: ReactNode;
};

/**
 * Legal — shared prose shell for the imprint / privacy / policy pages: a
 * narrow readable column with consistent heading + body styling.
 */
export default function Legal({ eyebrow, title, updated, children }: LegalProps) {
  return (
    <Section width="text" ariaLabel={title} className="legal-section">
      <div className="legal">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="legal__title">{title}</h1>
        {updated ? <p className="legal__updated">Last updated: {updated}</p> : null}
        <div className="legal__body">{children}</div>
      </div>
    </Section>
  );
}
