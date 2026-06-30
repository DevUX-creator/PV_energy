import type { Metadata } from "next";
import Legal from "@/components/sections/Legal";
import { OFFICES } from "@/components/sections/Offices/config";

export const metadata: Metadata = {
  title: "Imprint",
  description: "Legal notice and company information for PV Link Energy.",
  alternates: { canonical: "/imprint" },
};

export default function ImprintPage() {
  return (
    <main id="main-content">
      <Legal eyebrow="Legal" title="Imprint">
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
          Email: <a href="mailto:info@pvlinkenergy.com">info@pvlinkenergy.com</a>
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
          accept no liability for the accuracy, completeness or timeliness of the
          information provided. This site may contain links to external websites
          over whose content we have no control and for which we accept no
          responsibility.
        </p>

        <h2>Copyright</h2>
        <p>
          © {2026} PV Link Energy. All rights reserved. All content, trademarks
          and materials on this site are the property of PV Link Energy unless
          otherwise stated and may not be reproduced without permission.
        </p>
      </Legal>
    </main>
  );
}
