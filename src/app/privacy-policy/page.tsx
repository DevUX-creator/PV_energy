import type { Metadata } from "next";
import Legal from "@/components/sections/Legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How PV Link Energy collects, uses and protects personal data, in line with the GDPR and applicable laws.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content">
      <Legal eyebrow="Legal" title="Privacy Policy" updated="15 December 2025">
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
          As a global business, we may transfer personal data across borders. Where
          we do, we apply appropriate safeguards consistent with the GDPR and
          applicable laws.
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
      </Legal>
    </main>
  );
}
