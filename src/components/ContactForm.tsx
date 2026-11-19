"use client";

import { useId, useState } from "react";

// Shared input styling: slate border like the other panels, sky-blue focus
// ring, red border once the visitor has interacted with an invalid field.
const FIELD =
  "w-full rounded-md border border-slate-300 bg-white px-3.5 text-[15px] text-neutral-950 transition-colors outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 user-invalid:border-red-500 user-invalid:focus:ring-red-500/20";

function Field({
  label,
  optional,
  className,
  children,
  htmlFor,
}: {
  label: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-neutral-800">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-slate-500">(optional)</span>
        ) : (
          <span aria-hidden="true" className="ml-0.5 text-sky-600">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

// Contact form in a white, bordered panel. First/last name and email/phone sit
// in pairs when the panel is wide enough (448px+), otherwise one per row.
// Every field except the phone number and company name is required; the browser checks them
// (including the email format) before submitting.
// NOTE: sending isn't connected to anything yet; a valid submit only shows a
// notice. Hook up the delivery (email service / API route) in `onSubmit`.
export default function ContactForm({ className }: { className?: string }) {
  const id = useId();
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      aria-label="Contact form"
      className={`@container rounded-lg border border-slate-300 bg-white p-5 md:p-6 lg:p-8 ${className ?? ""}`}
    >
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 @[28rem]:grid-cols-2">
        <Field label="First Name" htmlFor={`${id}-first`}>
          <input id={`${id}-first`} name="firstName" type="text" autoComplete="given-name" required className={`${FIELD} h-11`} />
        </Field>
        <Field label="Last Name" htmlFor={`${id}-last`}>
          <input id={`${id}-last`} name="lastName" type="text" autoComplete="family-name" required className={`${FIELD} h-11`} />
        </Field>
        <Field label="Email Address" htmlFor={`${id}-email`}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.co.nz"
            required
            className={`${FIELD} h-11`}
          />
        </Field>
        <Field label="Phone Number" optional htmlFor={`${id}-phone`}>
          <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" className={`${FIELD} h-11`} />
        </Field>
        <Field label="Company Name" optional htmlFor={`${id}-company`} className="@[28rem]:col-span-2">
          <input id={`${id}-company`} name="company" type="text" autoComplete="organization" className={`${FIELD} h-11`} />
        </Field>
        <Field label="Message" htmlFor={`${id}-message`} className="@[28rem]:col-span-2">
          <textarea
            id={`${id}-message`}
            name="message"
            rows={11}
            required
            placeholder="Tell us about your enquiry or requirements"
            className={`${FIELD} block min-h-48 resize-y py-3 leading-relaxed`}
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-col gap-3 @[28rem]:flex-row @[28rem]:items-center @[28rem]:justify-between">
        <p className="text-sm text-slate-500">
          <span aria-hidden="true" className="text-sky-600">
            *
          </span>{" "}
          Required fields
        </p>
        <button
          type="submit"
          className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#0b1f45] px-7 text-[15px] font-semibold text-white transition-colors outline-none hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
        >
          Send message
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <p role="status" className="mt-4 text-sm text-slate-600 empty:hidden">
        {submitted ? "Online sending isn't set up yet, so your message has not been sent." : ""}
      </p>
    </form>
  );
}
