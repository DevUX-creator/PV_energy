"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import "./contactForm.css";

/* -------------------------------------------------------------------------
 * Validation rules. Kept here so the form is self-documenting and easy for
 * developers to extend / wire to a real backend (see SUBMIT below).
 * ---------------------------------------------------------------------- */
const NAME_MIN = 2;
const SUBJECT_MIN = 2;
const MESSAGE_MIN = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^[\p{L}][\p{L}\s'.-]*$/u; // letters, spaces, apostrophes, hyphens

type Field = "name" | "email" | "subject" | "message";
type FormData = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const EMPTY: FormData = { name: "", email: "", subject: "", message: "" };
const FIELD_ORDER: Field[] = ["name", "email", "subject", "message"];

function validateField(name: Field, value: string): string | undefined {
  const v = value.trim();
  switch (name) {
    case "name":
      if (!v) return "Name is required.";
      if (v.length < NAME_MIN) return `Name must be at least ${NAME_MIN} characters.`;
      if (!NAME_RE.test(v)) return "Name contains invalid characters.";
      return undefined;
    case "email":
      if (!v) return "Email is required.";
      if (!EMAIL_RE.test(v)) return "Please enter a valid email address.";
      return undefined;
    case "subject":
      if (!v) return "Subject is required.";
      if (v.length < SUBJECT_MIN) return `Subject must be at least ${SUBJECT_MIN} characters.`;
      return undefined;
    case "message":
      if (!v) return "Please add a short message.";
      if (v.length < MESSAGE_MIN) return `Message must be at least ${MESSAGE_MIN} characters.`;
      return undefined;
    default:
      return undefined;
  }
}

/**
 * ContactForm — a simple Name / Email / Subject / Message enquiry form.
 * Per-field validation, validate-on-blur + on-change-after-touch, focus the
 * first error on submit, and a submit button that stays disabled until valid.
 * Submission is a mailto fallback today — developers should replace the SUBMIT
 * step with a POST to the CRM / form endpoint.
 */
export default function ContactForm() {
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = useMemo(
    () => FIELD_ORDER.every((f) => !validateField(f, data[f])),
    [data]
  );

  const handleChange = useCallback(
    (name: Field) => (value: string) => {
      setData((d) => ({ ...d, [name]: value }));
      setErrors((e) =>
        touched[name] ? { ...e, [name]: validateField(name, value) } : e
      );
    },
    [touched]
  );

  const handleBlur = useCallback(
    (name: Field) => () => {
      setTouched((t) => ({ ...t, [name]: true }));
      setErrors((e) => ({ ...e, [name]: validateField(name, data[name]) }));
    },
    [data]
  );

  const handleSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();

      const nextErrors: Errors = {};
      FIELD_ORDER.forEach((f) => {
        const err = validateField(f, data[f]);
        if (err) nextErrors[f] = err;
      });
      setErrors(nextErrors);
      setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));

      const firstInvalid = FIELD_ORDER.find((f) => nextErrors[f]);
      if (firstInvalid) {
        const el = document.getElementById(`cf-${firstInvalid}`);
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      setSubmitting(true);
      // TODO (developers): replace this mailto fallback with a POST to your
      // CRM / form endpoint (e.g. HubSpot, your API) and handle the response.
      const subject = encodeURIComponent(data.subject.trim());
      const body = encodeURIComponent(
        `Name: ${data.name.trim()}\n` +
          `Email: ${data.email.trim()}\n\n` +
          `${data.message.trim()}`
      );
      window.location.href = `mailto:info@pvlinkenergy.com?subject=${subject}&body=${body}`;
      setSubmitting(false);
      setSubmitted(true);
    },
    [data]
  );

  if (submitted) {
    return (
      <div className="contact-form__done" role="status" aria-live="polite">
        <h3 className="contact-form__done-title">Thank you.</h3>
        <p className="contact-form__done-text">
          We&rsquo;ve prepared your message — your email client should open. If
          it doesn&rsquo;t, write to{" "}
          <a href="mailto:info@pvlinkenergy.com">info@pvlinkenergy.com</a> and
          we&rsquo;ll respond within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <Text
          id="name"
          label="Name"
          value={data.name}
          error={touched.name ? errors.name : undefined}
          autoComplete="name"
          onChange={handleChange("name")}
          onBlur={handleBlur("name")}
        />
        <Text
          id="email"
          label="Email"
          type="email"
          value={data.email}
          error={touched.email ? errors.email : undefined}
          autoComplete="email"
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
        />
      </div>

      <Text
        id="subject"
        label="Subject"
        value={data.subject}
        error={touched.subject ? errors.subject : undefined}
        onChange={handleChange("subject")}
        onBlur={handleBlur("subject")}
      />

      <div className="contact-form__field">
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          rows={5}
          value={data.message}
          aria-invalid={!!(touched.message && errors.message)}
          onChange={(e) => handleChange("message")(e.target.value)}
          onBlur={handleBlur("message")}
        />
        {touched.message && errors.message ? (
          <span className="contact-form__error">{errors.message}</span>
        ) : null}
      </div>

      <div className="contact-form__actions">
        <Button type="submit" disabled={!isValid || submitting}>
          {submitting ? "Sending…" : "Send message"}
        </Button>
        <p className="contact-form__policy">
          By submitting this form you accept our{" "}
          <a href="/legal#privacy-policy">policy</a>.
        </p>
      </div>
    </form>
  );
}

/* Small labelled text input (kept local — not worth a shared component). */
function Text({
  id,
  label,
  value,
  error,
  type = "text",
  autoComplete,
  onChange,
  onBlur,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <div className="contact-form__field">
      <label htmlFor={`cf-${id}`}>{label}</label>
      <input
        id={`cf-${id}`}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error ? <span className="contact-form__error">{error}</span> : null}
    </div>
  );
}
