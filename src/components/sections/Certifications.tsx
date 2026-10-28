"use client";

import React from "react";
import { CERTIFICATIONS } from "@/lib/data";

export function Certifications() {
  return (
    <section
      id="certifications"
      className="bg-white border-y border-[rgba(13,13,13,0.08)] py-20 md:py-28 relative overflow-hidden"
    >
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 items-start">
          {/* Left: Sticky Heading & Count line */}
          <div className="lg:sticky lg:top-32">
            <div className="rv inline-flex items-center gap-2 mb-4" style={{ "--i": 0 } as React.CSSProperties}>
              <span className="mono-label text-[11px] text-[#77756f] px-3 py-1 rounded-full bg-[#f4f2ee] border border-[rgba(13,13,13,0.06)]">
                04 — Accreditations
              </span>
            </div>

            <div className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl text-[#0d0d0d] tracking-[-0.045em] leading-[1.05]">
                Always{" "}
                <span className="serif-italic font-normal text-[#77756f]">
                  learning.
                </span>
              </h2>
            </div>

            <p
              className="rv mt-4 text-[#77756f] text-sm md:text-base font-mono"
              style={{ "--i": 2 } as React.CSSProperties}
            >
              01 Industry Certification · Cisco
            </p>
          </div>

          {/* Right: Numbered Ink-flood Rows */}
          <div className="divide-y divide-[rgba(13,13,13,0.08)] border-y border-[rgba(13,13,13,0.08)]">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                tabIndex={0}
                className="group relative px-6 py-8 sm:py-10 flex items-center justify-between cursor-pointer overflow-hidden transition-colors duration-500 outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d]"
              >
                {/* Ink flood background (scaleX 0 -> 1 on ::before) */}
                <div
                  className="absolute inset-0 bg-[#0d0d0d] origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                  aria-hidden="true"
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                  <span className="font-mono text-sm sm:text-base font-bold text-[#77756f] group-hover:text-[#a9a6a0] group-focus-visible:text-[#a9a6a0] transition-colors">
                    {cert.index}
                  </span>
                  <div>
                    <h3 className="font-bold text-xl sm:text-2xl text-[#0d0d0d] group-hover:text-[#f4f2ee] group-focus-visible:text-[#f4f2ee] transition-colors tracking-tight">
                      {cert.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#77756f] group-hover:text-[#a9a6a0] group-focus-visible:text-[#a9a6a0] transition-colors mt-1">
                      Issuer: {cert.issuer} · {cert.date}
                    </p>
                  </div>
                </div>

                {/* Sliding Arrow ↗ */}
                <div className="relative z-10 w-10 h-10 rounded-full border border-[rgba(13,13,13,0.12)] group-hover:border-white/20 group-focus-visible:border-white/20 flex items-center justify-center text-sm font-semibold text-[#0d0d0d] group-hover:text-[#f4f2ee] group-focus-visible:text-[#f4f2ee] -translate-x-2 opacity-60 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  ↗
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
