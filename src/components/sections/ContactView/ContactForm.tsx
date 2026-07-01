"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { COUNTRIES } from "./constants";
import "./contactForm.css";

/* -------------------------------------------------------------------------
 * Validation rules. Kept here so the form is self-documenting and easy for
 * developers to extend / wire to a real backend (see SUBMIT below).
 * ---------------------------------------------------------------------- */
const NAME_MIN = 2;
const COMPANY_MIN = 2;
const MESSAGE_MIN = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^[\p{L}][\p{L}\s'.-]*$/u; // letters, spaces, apostrophes, hyphens

type Field = "firstName" | "lastName" | "email" | "company" | "country" | "message";
type FormData = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const EMPTY: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  country: "",
  message: "",
};

const FIELD_ORDER: Field[] = [
  "firstName",
  "lastName",
  "email",
  "company",
  "country",
  "message",
];

function validateField(name: Field, value: string): string | undefined {
  const v = value.trim();
  switch (name) {
    case "firstName":
    case "lastName": {
      const label = name === "firstName" ? "First name" : "Last name";
      if (!v) return `${label} is required.`;
      if (v.length < NAME_MIN) return `${label} must be at least ${NAME_MIN} characters.`;
      if (!NAME_RE.test(v)) return `${label} contains invalid characters.`;
      return undefined;
    }
    case "email":
      if (!v) return "Email is required.";
      if (!EMAIL_RE.test(v)) return "Please enter a valid email address.";
      return undefined;
    case "company":
      if (!v) return "Company is required.";
      if (v.length < COMPANY_MIN) return `Company must be at least ${COMPANY_MIN} characters.`;
      return undefined;
    case "country":
      if (!v) return "Please select a country.";
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
 * ContactForm — BeBawa-style request form rebuilt in our style. Realistic
 * per-field validation, validate-on-blur + on-change-after-touch, focus the
 * first error on submit, and a submit button that stays disabled until the
 * form is valid. Submission is a mailto fallback today — developers should
 * replace the SUBMIT step with a POST to the CRM / form endpoint.
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
      const subject = encodeURIComponent(
        `Enquiry from ${data.firstName.trim()} ${data.lastName.trim()}`
      );
      const body = encodeURIComponent(
        `Name: ${data.firstName.trim()} ${data.lastName.trim()}\n` +
          `Email: ${data.email.trim()}\n` +
          `Company: ${data.company.trim()}\n` +
          `Country: ${data.country}\n\n` +
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
          id="firstName"
          label="First name"
          value={data.firstName}
          error={touched.firstName ? errors.firstName : undefined}
          autoComplete="given-name"
          onChange={handleChange("firstName")}
          onBlur={handleBlur("firstName")}
        />
        <Text
          id="lastName"
          label="Last name"
          value={data.lastName}
          error={touched.lastName ? errors.lastName : undefined}
          autoComplete="family-name"
          onChange={handleChange("lastName")}
          onBlur={handleBlur("lastName")}
        />
      </div>

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

      <div className="contact-form__row">
        <Text
          id="company"
          label="Company"
          value={data.company}
          error={touched.company ? errors.company : undefined}
          autoComplete="organization"
          onChange={handleChange("company")}
          onBlur={handleBlur("company")}
        />
        <div className="contact-form__field">
          <label htmlFor="cf-country">Country</label>
          <div className="contact-form__select-wrap">
            <select
              id="cf-country"
              className="contact-form__select"
              value={data.country}
              aria-invalid={!!(touched.country && errors.country)}
              onChange={(e) => handleChange("country")(e.target.value)}
              onBlur={handleBlur("country")}
            >
              <option value="" disabled>
                Select…
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <svg className="contact-form__select-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="square" />
            </svg>
          </div>
          {touched.country && errors.country ? (
            <span className="contact-form__error">{errors.country}</span>
          ) : null}
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="cf-message">What do you need moved?</label>
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
        <p className="contact-form__hint">
          We review every enquiry and respond within 1–2 business days.
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
