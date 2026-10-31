"use client";

import React from "react";
import Link from "next/link";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

function HoppingText({ text }: { text: string }) {
  return (
    <span className="inline-block">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-3 cursor-default"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export function Contact() {
  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget("#hero");
  };

  return (
    <footer id="contact" className="bg-[#f4f2ee] pt-24 pb-12 relative overflow-hidden border-t border-[rgba(13,13,13,0.08)]">
      <div className="section-container">
        {/* Top Tag */}
        <div className="rv inline-flex items-center gap-2 mb-8" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="mono-label text-[11px] text-[#77756f] px-3 py-1 rounded-full bg-white border border-[rgba(13,13,13,0.06)]">
            07 — Direct Contact
          </span>
        </div>

        {/* Huge hopping heading with spinning say-hello badge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="rv-mask max-w-4xl" style={{ "--i": 1 } as React.CSSProperties}>
            <h2 className="heading-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#0d0d0d] tracking-[-0.05em] leading-[1.02]">
              <HoppingText text="Let's build" />
              <br />
              <span className="serif-italic font-normal text-[#77756f]">
                <HoppingText text="something" />
              </span>{" "}
              <HoppingText text="together." />
            </h2>
          </div>

          {/* Circular Spinning "say hello" text badge */}
          <div className="rv shrink-0 self-start lg:self-center" style={{ "--i": 2 } as React.CSSProperties}>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full animate-[spin_18s_linear_infinite]"
              >
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[8.5px] font-mono tracking-[0.18em] fill-[#0d0d0d] uppercase">
                  <textPath href="#circlePath" startOffset="0%">
                    SAY HELLO · GET IN TOUCH · COLLABORATE ·
                  </textPath>
                </text>
              </svg>
              <div className="w-10 h-10 rounded-full bg-[#0d0d0d] text-[#f4f2ee] flex items-center justify-center font-bold text-sm">
                ↗
              </div>
            </div>
          </div>
        </div>

        {/* Conversation call to action */}
        <div className="rv py-8 border-y border-[rgba(13,13,13,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ "--i": 3 } as React.CSSProperties}>
          <div>
            <p className="text-lg font-semibold text-[#0d0d0d]">
              Have a project or idea in mind?
            </p>
            <p className="mt-1 text-sm text-[#77756f]">
              Share a few details and I&apos;ll get back to you.
            </p>
          </div>
          <Link
            href="/inquiry"
            data-nova-cta="contact"
            className="inline-flex min-h-14 items-center justify-between gap-8 rounded-xl bg-[#0d0d0d] px-6 py-4 text-sm font-semibold text-[#f4f2ee] transition-colors hover:bg-[#df755d] hover:text-white"
          >
            <span>Start a conversation</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {/* Contact links: Phone, GitHub, LinkedIn */}
        <div className="rv py-10 grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ "--i": 4 } as React.CSSProperties}>
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-[rgba(13,13,13,0.05)]">
            <span className="mono-label text-[10px] text-[#77756f] block mb-1">
              Source Repositories
            </span>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-sm text-[#0d0d0d] hover:underline flex items-center justify-between"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow-sm border border-[rgba(13,13,13,0.05)]">
            <span className="mono-label text-[10px] text-[#77756f] block mb-1">
              Professional Network
            </span>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-sm text-[#0d0d0d] hover:underline flex items-center justify-between"
            >
              <span>LinkedIn</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 border-t border-[rgba(13,13,13,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77756f]">
          <div>
            © 2026 {PROFILE.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Built with Next.js 15 & React 19</span>
            <a
              href="#hero"
              onClick={handleBackToTop}
              className="font-semibold text-[#0d0d0d] hover:underline"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
