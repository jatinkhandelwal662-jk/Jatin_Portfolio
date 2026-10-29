"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type FormFields = {
  name: string;
  email: string;
  phone: string;
  description: string;
  website: string;
};

const initialForm: FormFields = {
  name: "",
  email: "",
  phone: "",
  description: "",
  website: "",
};

function ConversationIllustration() {
  return (
    <svg
      viewBox="0 0 480 250"
      fill="none"
      role="img"
      aria-labelledby="conversation-illustration-title"
      className="h-auto w-full max-w-[440px]"
    >
      <title id="conversation-illustration-title">
        Two people sharing ideas
      </title>
      <path
        d="M142 188c46-41 145-44 198-1"
        stroke="#df755d"
        strokeLinecap="round"
        strokeWidth="15"
        opacity=".35"
      />
      <path
        d="M142 179c46-41 145-44 198-1"
        stroke="#df755d"
        strokeLinecap="round"
        strokeWidth="9"
      />
      <path
        d="M76 90h135v56h-67l-20 20v-20H76V90Z"
        fill="#d9ff43"
        stroke="#171512"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <circle cx="112" cy="118" r="4" fill="#171512" />
      <circle cx="144" cy="118" r="4" fill="#171512" />
      <circle cx="176" cy="118" r="4" fill="#171512" />
      <path
        d="M269 77h139v57h-66l-20 19v-19h-53V77Z"
        fill="#fffdf8"
        stroke="#171512"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="m317 106 14 14 29-31"
        stroke="#df755d"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
      <circle cx="143" cy="189" r="32" fill="#fffdf8" stroke="#171512" strokeWidth="3" />
      <path
        d="M128 193c8 8 22 8 30 0M81 246c5-39 28-57 62-57s57 18 62 57"
        stroke="#171512"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <circle cx="339" cy="189" r="32" fill="#df755d" stroke="#171512" strokeWidth="3" />
      <path
        d="M324 193c8 8 22 8 30 0M277 246c5-39 28-57 62-57s57 18 62 57"
        stroke="#171512"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

export function InquiryForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: keyof FormFields, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error || "Your enquiry could not be sent. Please try again.");
        setIsSending(false);
        return;
      }

      setHasSent(true);
      window.setTimeout(() => {
        setHasSent(false);
        setForm(initialForm);
        setIsSending(false);
        router.replace("/#contact");
      }, 2200);
    } catch {
      setError("We couldn't connect to the enquiry service. Please try again.");
      setIsSending(false);
    }
  };

  const inputClassName =
    "w-full border-0 border-b border-[#171512]/15 bg-transparent px-0 py-3 text-[15px] text-[#171512] outline-none transition-colors placeholder:text-[#a19a8c] focus:border-[#df755d] focus:ring-0";
  const labelClassName =
    "mb-1 block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5f5a52]";

  return (
    <main
      className="min-h-screen bg-[#f4f2ee] px-5 pb-12 pt-7 text-[#171512] sm:px-8 sm:pt-9"
      style={{
        backgroundImage:
          "linear-gradient(rgba(23,21,18,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(23,21,18,0.035) 1px, transparent 1px)",
        backgroundSize: "38px 38px",
      }}
    >
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/"
          className="inline-flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5f5a52] transition-colors hover:text-[#df755d]"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ←
          </span>
          Back to portfolio
        </Link>

        <div className="mx-auto mt-12 grid max-w-[1180px] items-center gap-12 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <section className="py-2 lg:py-12">
            <p className="mb-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#df755d]">
              A new conversation / 01
            </p>
            <h1 className="max-w-[680px] text-[clamp(3.2rem,6vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.075em]">
              Let&apos;s start with
              <br className="hidden sm:block" />{" "}
              <span className="text-[#df755d]">your idea.</span>
            </h1>
            <p className="mt-7 max-w-[490px] text-base leading-7 text-[#77756f] sm:text-lg">
              Tell me what you&apos;re building, solving, or exploring. I&apos;ll
              get back to you with a thoughtful response.
            </p>
            <div className="mt-10 hidden sm:block lg:mt-14">
              <ConversationIllustration />
            </div>
          </section>

          <section
            aria-label="Send an enquiry"
            className="relative border border-[#171512] bg-[#fffdf8] p-6 shadow-[10px_10px_0_0_#df755d] sm:p-9 lg:p-10"
          >
            <div className="mb-8 flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full bg-[#d9ff43] ring-4 ring-[#d9ff43]/20"
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-[#5f5a52]">
                Conversation channel open
              </span>
            </div>

            {hasSent ? (
              <div
                className="flex min-h-[410px] flex-col justify-center"
                role="status"
                aria-live="polite"
              >
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#d9ff43] text-2xl">
                  ✓
                </span>
                <h2 className="text-3xl font-bold tracking-[-0.05em]">
                  Message sent.
                </h2>
                <p className="mt-3 max-w-sm leading-7 text-[#77756f]">
                  Thanks for reaching out. A confirmation is on its way to your
                  inbox. Taking you back to the portfolio…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="inquiry-name" className={labelClassName}>
                    Your name
                  </label>
                  <input
                    id="inquiry-name"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="How should I address you?"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-email" className={labelClassName}>
                    Email address
                  </label>
                  <input
                    id="inquiry-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="you@example.com"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-phone" className={labelClassName}>
                    Contact number
                  </label>
                  <input
                    id="inquiry-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    maxLength={32}
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="+91 00000 00000"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="inquiry-description"
                    className={labelClassName}
                  >
                    What would you like to discuss?
                  </label>
                  <textarea
                    id="inquiry-description"
                    name="description"
                    required
                    minLength={10}
                    maxLength={4000}
                    rows={4}
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Share the problem, project, or collaboration you have in mind."
                    className={`${inputClassName} min-h-28 resize-y`}
                  />
                </div>

                <div
                  aria-hidden="true"
                  className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
                >
                  <label htmlFor="inquiry-website">Leave this field empty</label>
                  <input
                    id="inquiry-website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(event) => updateField("website", event.target.value)}
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="flex min-h-14 w-full items-center justify-between bg-[#171512] px-5 text-left font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#fffdf8] transition-colors hover:bg-[#df755d] disabled:cursor-wait disabled:opacity-70"
                >
                  <span>{isSending ? "Sending enquiry…" : "Send enquiry"}</span>
                  <span aria-hidden="true" className="text-lg">
                    →
                  </span>
                </button>
                <p className="font-mono text-[9px] uppercase leading-5 tracking-[0.06em] text-[#8a847a]">
                  Your details will be delivered directly to my inbox.
                </p>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
