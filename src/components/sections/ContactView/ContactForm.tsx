"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import "./contactForm.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = "name" | "email" | "company" | "message";
type FormState = Record<Fields, string>;
type Errors = Partial<Record<Fields, string>>;

const EMPTY: FormState = { name: "", email: "", company: "", message: "" };

/**
 * ContactForm — lean contact form (BeBawa-style) in our style. Client-side
 * validation, then composes a mailto to info@pvlinkenergy.com (no backend yet).
 */
export default function ContactForm() {
  const [data, setData] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (key: Fields, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!data.name.trim()) e.name = "Please enter your name.";
    if (!data.email.trim()) e.email = "Please enter your email.";
    else if (!EMAIL_RE.test(data.email.trim())) e.email = "Enter a valid email.";
    if (!data.message.trim()) e.message = "Please add a short message.";
    return e;
  };

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const subject = encodeURIComponent(`Enquiry from ${data.name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${data.name.trim()}\n` +
        `Email: ${data.email.trim()}\n` +
        `Company: ${data.company.trim() || "—"}\n\n` +
        `${data.message.trim()}`
    );
    window.location.href = `mailto:info@pvlinkenergy.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name ? <span className="contact-form__error">{errors.name}</span> : null}
        </div>

        <div className="contact-form__field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email ? <span className="contact-form__error">{errors.email}</span> : null}
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="cf-company">Company (optional)</label>
        <input
          id="cf-company"
          type="text"
          autoComplete="organization"
          value={data.company}
          onChange={(e) => set("company", e.target.value)}
        />
      </div>

      <div className="contact-form__field">
        <label htmlFor="cf-message">What do you need moved?</label>
        <textarea
          id="cf-message"
          rows={5}
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
        />
        {errors.message ? <span className="contact-form__error">{errors.message}</span> : null}
      </div>

      <div className="contact-form__actions">
        <Button type="submit">Send message</Button>
        {sent ? (
          <p className="contact-form__sent" role="status">
            Thanks — your email client should open. If it doesn&rsquo;t, write to{" "}
            <a href="mailto:info@pvlinkenergy.com">info@pvlinkenergy.com</a>.
          </p>
        ) : null}
      </div>
    </form>
  );
}
