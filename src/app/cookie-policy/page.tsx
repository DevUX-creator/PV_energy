import type { Metadata } from "next";
import Legal from "@/components/sections/Legal";
import { CookieSettingsButton } from "@/components/ui/CookieConsent";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How PV Link Energy uses cookies and similar technologies, and how you can manage your choices.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <main id="main-content">
      <Legal eyebrow="Legal" title="Cookie Policy" updated="1 July 2026">
        <p>
          This Cookie Policy explains how PV Link Energy (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) uses cookies and similar technologies on this
          website, and the choices you have. It should be read together with our{" "}
          <a href="/privacy-policy">Privacy Policy</a>.
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
            loading, remembering your preferences, and security. These are always
            active and cannot be switched off.
          </li>
          <li>
            <strong>Analytics.</strong> Help us understand how the site is used
            (which pages are useful) so we can improve it. The data is anonymous
            and is not used to identify you or track you across other sites. These
            run only with your consent.
          </li>
          <li>
            <strong>Marketing.</strong> Used to measure campaigns and show
            relevant content if you arrive via a partner site. Off by default and
            set only with your consent.
          </li>
        </ul>

        <h2>Consent</h2>
        <p>
          When you first visit, we ask for your consent to non-essential cookies.
          Essential cookies are set automatically because the site cannot work
          without them. You can accept all, reject all, or choose by category, and
          you can change your choice at any time using the button below or the
          &ldquo;Cookie settings&rdquo; link in the footer.
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
          In addition to our cookie settings, you can control cookies through your
          browser — blocking or deleting them at any time. Note that blocking
          essential cookies may stop parts of the site from working. Browser help
          pages explain how to manage cookies for your specific browser.
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
      </Legal>
    </main>
  );
}
