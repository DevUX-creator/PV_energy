import RevealText from "@/animations/RevealText";
import { OFFICES } from "@/components/sections/Offices/config";
import ContactForm from "./ContactForm";
import "./contactView.css";

/**
 * ContactView — the /contact page. BeBawa "open account" layout rebuilt in our
 * style: a dark full-bleed band split two-up — a sticky header column (eyebrow,
 * title, lead, direct contact + offices) on the left and a glass card holding
 * the request form on the right.
 */
export default function ContactView() {
  return (
    <section className="contact-view" aria-label="Contact">
      <div className="contact-view__inner">
        {/* Left — sticky intro + direct contact details */}
        <header className="contact-view__header">
          <RevealText split="none">
            <p className="eyebrow contact-view__eyebrow">[ Get in touch ]</p>
          </RevealText>
          <RevealText delay={0.06}>
            <h1 className="contact-view__title">Let&apos;s move energy together.</h1>
          </RevealText>
          <RevealText split="none" delay={0.12}>
            <p className="contact-view__lead">
              Tell us what you need moved. Our team responds with a tailored
              proposal across trading, supply, shipping and risk management —
              reliably, transparently, and on schedule.
            </p>
          </RevealText>

          <div className="contact-view__direct">
            <a className="contact-view__email" href="mailto:info@pvlinkenergy.com">
              info@pvlinkenergy.com
            </a>
            <a className="contact-view__phone" href="tel:+97145775989">
              +971 4 577 5989
            </a>
          </div>

          <ul className="contact-view__offices">
            {OFFICES.map((o) => (
              <li className="contact-view__office" key={o.id}>
                <span className="contact-view__office-city">
                  {o.city}, {o.country}
                </span>
                <address>{o.address}</address>
              </li>
            ))}
          </ul>
        </header>

        {/* Right — glass card form */}
        <div className="contact-view__card">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
