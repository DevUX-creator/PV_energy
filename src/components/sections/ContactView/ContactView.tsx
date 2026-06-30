import Section from "@/components/ui/Section";
import RevealText from "@/animations/RevealText";
import { OFFICES } from "@/components/sections/Offices/config";
import ContactForm from "./ContactForm";
import "./contactView.css";

/**
 * ContactView — the /contact page: heading + lead, a "talk to us" column
 * (email / phone CTA) and an offices column, in the site's light style.
 */
export default function ContactView() {
  return (
    <Section ariaLabel="Contact" className="contact-view" width="wide">
      <div className="contact-view__head">
        <RevealText split="none">
          <p className="eyebrow">Get in touch</p>
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
      </div>

      <div className="contact-view__grid">
        <div className="contact-view__form-col">
          <h2 className="contact-view__col-title">Send us a message</h2>
          <ContactForm />
        </div>

        <aside className="contact-view__aside">
          <div className="contact-view__talk">
            <h2 className="contact-view__col-title">Talk to us</h2>
            <a className="contact-view__email" href="mailto:info@pvlinkenergy.com">
              info@pvlinkenergy.com
            </a>
            <a className="contact-view__phone" href="tel:+97145775989">
              +971 4 577 5989
            </a>
          </div>

          <div className="contact-view__offices">
            <h2 className="contact-view__col-title">Our offices</h2>
            <ul className="contact-view__office-list">
              {OFFICES.map((o) => (
                <li className="contact-view__office" key={o.id}>
                  <span className="contact-view__office-city">
                    {o.city}, {o.country}
                  </span>
                  <address>
                    {o.address}
                    {o.phone ? (
                      <>
                        <br />
                        <a href={`tel:${o.phone.replace(/\s+/g, "")}`}>{o.phone}</a>
                      </>
                    ) : null}
                    {o.email ? (
                      <>
                        <br />
                        <a href={`mailto:${o.email}`}>{o.email}</a>
                      </>
                    ) : null}
                  </address>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
}
