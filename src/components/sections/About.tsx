"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PROFILE } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function About() {
  const [flipped, setFlipped] = useState(false);
  const cardAreaRef = useRef<HTMLDivElement>(null);
  const [swingAngle, setSwingAngle] = useState(0);

  // Pendulum swing physics with pointer velocity & idle sway
  useEffect(() => {
    let angle = 0;
    let velocity = 0;
    const damping = 0.94;
    const spring = 0.04;
    let lastX = 0;
    let lastTime = performance.now();
    let isHovered = false;
    let rafId: number;

    const onPointerMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      lastTime = now;

      if (isHovered) {
        // Impart impulse based on mouse velocity
        const impulse = (dx / dt) * 1.8;
        velocity += Math.max(-12, Math.min(12, impulse));
      }
    };

    const container = cardAreaRef.current;
    if (container) {
      container.addEventListener("mouseenter", () => {
        isHovered = true;
      });
      container.addEventListener("mouseleave", () => {
        isHovered = false;
      });
    }
    window.addEventListener("mousemove", onPointerMove);

    const animate = (time: number) => {
      // Idle sway when stationary
      const idle = Math.sin(time * 0.0018) * 1.8;

      // Spring force returning to center (plus idle sway)
      const force = -spring * (angle - idle);
      velocity = (velocity + force) * damping;
      angle += velocity;

      setSwingAngle(angle);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((prev) => !prev);
    }
  };

  return (
    <section id="about" className="section-pad bg-[#f4f2ee] relative overflow-hidden">
      <div className="section-container">
        <SectionHeader
          tagIndex="01"
          tagLabel="Profile & Identity"
          headingMain="Engineering robust systems"
          italicWord="quietly."
          description="A snapshot of background, academic standing, and developer credentials."
        />

        {/* Three-column grid: minmax(0,1fr) 320px minmax(0,1fr) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)] gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Summary & Links */}
          <div className="rv flex flex-col justify-between p-8 rounded-[28px] bg-white shadow-[inset_0_0_0_1px_rgba(13,13,13,0.08),0_4px_24px_-4px_rgba(13,13,13,0.04)]" style={{ "--i": 1 } as React.CSSProperties}>
            <div>
              <span className="mono-label text-xs text-[#77756f]">Introduction</span>
              <h3 className="heading-display text-2xl sm:text-3xl text-[#0d0d0d] mt-2 mb-4">
                Hi, I&apos;m {PROFILE.name}.
              </h3>
              <p className="text-[#3a3a3a] text-sm sm:text-base leading-relaxed">
                {PROFILE.resumeSummary}
              </p>
              <p className="mt-4 text-[#77756f] text-sm leading-relaxed">
                {PROFILE.subLine}
              </p>
            </div>

            <div className="pt-8 border-t border-[rgba(13,13,13,0.08)] mt-6">
              <span className="mono-label text-[11px] text-[#77756f] block mb-3">
                Verified Links
              </span>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={PROFILE.resumePath}
                  download="Jatin_Khandelwal_Resume.pdf"
                  className="btn-pill-primary text-xs !py-2 !px-4"
                >
                  Résumé ↓
                </a>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-secondary text-xs !py-2 !px-4"
                >
                  GitHub ↗
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-secondary text-xs !py-2 !px-4"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>

          {/* Centre Column: Hanging Lanyard ID Card */}
          <div
            ref={cardAreaRef}
            className="rv relative flex flex-col items-center justify-start min-h-[520px] select-none"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {/* Lanyard Top Strap & Metal Clip */}
            <div
              className="origin-top flex flex-col items-center transition-transform duration-75 ease-out"
              style={{
                transform: `rotate(${swingAngle}deg)`,
              }}
            >
              {/* Strap: 30x56 px with scrolling text */}
              <div className="w-[30px] h-[56px] bg-[#1a1a1a] rounded-t-sm relative overflow-hidden flex items-center justify-center shadow-md">
                <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#262626,#262626_2px,#141414_2px,#141414_4px)]" />
                <span className="text-[7px] font-mono tracking-widest text-[#a9a6a0] uppercase whitespace-nowrap rotate-90 select-none">
                  DEVELOPER
                </span>
              </div>

              {/* Metal Clip & Loop */}
              <div className="w-[14px] h-[10px] bg-[#a9a6a0] border border-[#77756f] rounded-b-sm shadow-sm -mt-0.5" />
              <div className="w-[20px] h-[14px] border-2 border-[#77756f] rounded-full -mt-1 bg-transparent" />

              {/* Interactive 3D Hanging ID Card Container */}
              <div
                tabIndex={0}
                role="button"
                aria-label="Developer ID card, press Enter or click to flip"
                onClick={() => setFlipped((prev) => !prev)}
                onMouseEnter={() => setFlipped(true)}
                onMouseLeave={() => setFlipped(false)}
                onKeyDown={handleKeyDown}
                className="w-[300px] h-[404px] mt-2 relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] rounded-[24px]"
                style={{ perspective: 1000 }}
              >
                <div
                  className="w-full h-full relative rounded-[24px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_45px_-12px_rgba(13,13,13,0.18),inset_0_0_0_1px_rgba(13,13,13,0.12)]"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT SIDE */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-[24px] bg-white flex flex-col overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    {/* Black top band */}
                    <div className="h-10 bg-[#0d0d0d] text-[#f4f2ee] flex items-center justify-between px-4">
                      <span className="mono-label text-[10px] tracking-widest font-bold">
                        DEVELOPER ID
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#f4f2ee]/40" />
                        <span className="mono-label text-[9px] text-[#a9a6a0]">
                          {PROFILE.validTill}
                        </span>
                      </div>
                    </div>

                    {/* Photo Container */}
                    <div className="flex flex-col items-center pt-5 pb-3">
                      <div className="relative group/photo w-[128px] h-[156px] rounded-2xl overflow-hidden p-1 bg-gradient-to-b from-[#e9e6e0] to-[#ffffff] shadow-[0_4px_16px_rgba(13,13,13,0.08),inset_0_0_0_1px_rgba(13,13,13,0.1)]">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-[#f4f2ee] relative">
                          <Image
                            src="/portrait-bust.webp"
                            alt={PROFILE.name}
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover/photo:scale-105"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Details rows */}
                    <div className="px-5 text-center flex-1">
                      <h4 className="font-bold text-base text-[#0d0d0d] tracking-tight">
                        {PROFILE.name}
                      </h4>
                      <p className="text-xs text-[#77756f] mt-0.5">{PROFILE.role}</p>

                      <div className="mt-3.5 space-y-1.5 text-left pt-2 border-t border-[rgba(13,13,13,0.06)]">
                        <div className="flex justify-between items-baseline text-[11px]">
                          <span className="mono-label text-[#77756f]">ID No.</span>
                          <span className="font-mono text-[#0d0d0d] font-medium">
                            {PROFILE.idNo}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-[11px]">
                          <span className="mono-label text-[#77756f]">Dept.</span>
                          <span className="text-[#0d0d0d] font-medium text-right truncate max-w-[170px]">
                            {PROFILE.dept}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline text-[11px]">
                          <span className="mono-label text-[#77756f]">Valid till</span>
                          <span className="font-mono text-[#0d0d0d] font-medium">
                            {PROFILE.validTill}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Barcode & Hologram sticker in grays */}
                    <div className="px-5 py-3 border-t border-[rgba(13,13,13,0.08)] bg-[#fbfaf8] flex items-center justify-between">
                      {/* Barcode representation */}
                      <div className="flex items-center gap-[2px] h-6 opacity-70">
                        {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1].map((w, i) => (
                          <span
                            key={i}
                            className="h-full bg-[#0d0d0d] inline-block"
                            style={{ width: `${w}px` }}
                          />
                        ))}
                      </div>

                      {/* Gray holographic chip */}
                      <div className="w-8 h-6 rounded border border-[rgba(13,13,13,0.15)] bg-gradient-to-tr from-[#e9e6e0] via-[#ffffff] to-[#d6d3cc] shadow-inner flex items-center justify-center">
                        <span className="text-[7px] font-mono text-[#77756f]">SEC</span>
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-[24px] bg-[#0d0d0d] text-[#f4f2ee] p-6 flex flex-col justify-between overflow-hidden"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <span className="mono-label text-[10px] text-[#a9a6a0]">
                          WHAT I AM
                        </span>
                        <span className="mono-label text-[10px] text-[#a9a6a0]">
                          VERIFIED
                        </span>
                      </div>

                      <div className="mt-4 space-y-2.5 text-xs text-[#e9e6e0] leading-relaxed">
                        <div className="flex items-start gap-2">
                          <span className="text-[#a9a6a0] font-mono">01</span>
                          <span>{PROFILE.role} & B.Tech IIoT Student</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[#a9a6a0] font-mono">02</span>
                          <span>USAR GGSIPU · First Year CGPA 9.0 / 10</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[#a9a6a0] font-mono">03</span>
                          <span>Voice-first zero-UI platforms & stateless tunneling</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[#a9a6a0] font-mono">04</span>
                          <span>Geospatial ML: Hybrid TransUNet road healing (ISRO BAH)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[#a9a6a0] font-mono">05</span>
                          <span>1st Place Ideate-it-Up, Top 30 Hack4Delhi, Top 21 DarkCode</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="font-serif italic text-base text-[#f4f2ee]/90 mb-1">
                        Jatin Khandelwal
                      </div>
                      <div className="text-[10px] text-[#a9a6a0] font-mono">
                        If found, say hello · {PROFILE.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Facts & Quote */}
          <div className="rv flex flex-col justify-between p-8 rounded-[28px] bg-white shadow-[inset_0_0_0_1px_rgba(13,13,13,0.08),0_4px_24px_-4px_rgba(13,13,13,0.04)]" style={{ "--i": 3 } as React.CSSProperties}>
            <div>
              <span className="mono-label text-xs text-[#77756f]">Quick Facts</span>
              <div className="mt-4 divide-y divide-[rgba(13,13,13,0.06)]">
                <div className="py-3 flex flex-col">
                  <span className="mono-label text-[11px] text-[#77756f]">Location</span>
                  <span className="font-semibold text-sm text-[#0d0d0d] mt-0.5">
                    {PROFILE.location}
                  </span>
                </div>
                <div className="py-3 flex flex-col">
                  <span className="mono-label text-[11px] text-[#77756f]">Education</span>
                  <span className="font-semibold text-sm text-[#0d0d0d] mt-0.5">
                    B.Tech (IIoT), USAR GGSIPU
                  </span>
                  <span className="text-xs text-[#77756f]">CGPA 9.0 / 10 · 2025–2029</span>
                </div>
                <div className="py-3 flex flex-col">
                  <span className="mono-label text-[11px] text-[#77756f]">Leadership & Teams</span>
                  <span className="font-semibold text-sm text-[#0d0d0d] mt-0.5">
                    ACTS-EDC & Tradophile
                  </span>
                  <span className="text-xs text-[#77756f]">GGSIPU East Campus</span>
                </div>
                <div className="py-3 flex flex-col">
                  <span className="mono-label text-[11px] text-[#77756f]">Contact Channel</span>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="font-mono text-xs text-[#0d0d0d] hover:underline mt-0.5 break-all"
                  >
                    {PROFILE.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[rgba(13,13,13,0.08)] mt-6">
              <span className="mono-label text-[11px] text-[#77756f] block mb-2">Philosophy</span>
              <p className="text-sm font-medium text-[#3a3a3a] italic leading-snug">
                &ldquo;{PROFILE.quote}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
