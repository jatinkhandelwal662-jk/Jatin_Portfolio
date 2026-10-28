"use client";

import React, { useRef, useState, useEffect } from "react";
import { EDUCATION_EXPERIENCE_TIMELINE } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Chronological list (earliest to latest), ending with "Next — Your team?"
  const items = [...EDUCATION_EXPERIENCE_TIMELINE].reverse();

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = rect.height;
      const current = windowHeight * 0.7 - rect.top;
      const prog = Math.min(1, Math.max(0, current / totalDist));
      setScrollProgress(prog);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="experience" className="section-pad bg-[#f4f2ee] relative">
      <div className="section-container">
        <SectionHeader
          tagIndex="05"
          tagLabel="Chronological Pathway"
          headingMain="Education & experience as one"
          italicWord="path."
          description="Academic foundation, hackathon management, and campus leadership milestones."
        />

        {/* Timeline Container with animated spine */}
        <div ref={containerRef} className="relative max-w-3xl mx-auto pt-6 pb-12">
          {/* Background Spine Guide */}
          <div className="absolute left-[19px] md:left-[27px] top-6 bottom-12 w-[2px] bg-[rgba(13,13,13,0.1)] rounded-full" />

          {/* Active Drawing Spine */}
          <div
            className="absolute left-[19px] md:left-[27px] top-6 w-[2px] bg-[#0d0d0d] rounded-full transition-all duration-150 ease-out pointer-events-none"
            style={{
              height: `${Math.round(scrollProgress * 100)}%`,
            }}
          />

          {/* Timeline Nodes */}
          <div className="space-y-10 md:space-y-12">
            {items.map((item, idx) => {
              const nodeThreshold = (idx + 0.5) / (items.length + 1);
              const isLit = scrollProgress >= nodeThreshold;

              return (
                <div
                  key={item.id}
                  className={`relative pl-12 md:pl-16 transition-all duration-500 ${
                    isLit ? "opacity-100 translate-y-0" : "opacity-40 translate-y-2"
                  }`}
                >
                  {/* Indicator Dot */}
                  <div
                    className={`absolute left-[12px] md:left-[20px] top-4 w-4 h-4 rounded-full border-2 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isLit
                        ? "bg-[#0d0d0d] border-[#0d0d0d] scale-110 shadow-sm"
                        : "bg-[#f4f2ee] border-[rgba(13,13,13,0.3)] scale-90"
                    }`}
                  />

                  {/* Card Content */}
                  <div
                    className={`p-6 sm:p-7 rounded-[24px] bg-white transition-all duration-400 ${
                      isLit
                        ? "shadow-[inset_0_0_0_1px_rgba(13,13,13,0.1),0_12px_32px_-6px_rgba(13,13,13,0.06)]"
                        : "shadow-[inset_0_0_0_1px_rgba(13,13,13,0.04)]"
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <span className="mono-label text-xs font-bold text-[#0d0d0d]">
                        {item.year}
                      </span>
                      <span className="mono-label text-[10px] px-2.5 py-0.5 rounded-full bg-[#f4f2ee] text-[#77756f]">
                        {item.type.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="heading-display text-xl sm:text-2xl text-[#0d0d0d] mt-1">
                      {item.title}
                    </h3>
                    <div className="text-xs sm:text-sm text-[#77756f] mt-1 mb-3">
                      {item.place} {item.score ? `· ${item.score}` : ""}
                    </div>

                    <p className="text-xs sm:text-sm text-[#3a3a3a] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Ending Dashed Card: Next — Your team? */}
            <div className="relative pl-12 md:pl-16">
              <div className="absolute left-[12px] md:left-[20px] top-6 w-4 h-4 rounded-full border-2 border-dashed border-[#0d0d0d] bg-white" />

              <div className="p-6 sm:p-8 rounded-[24px] border-2 border-dashed border-[rgba(13,13,13,0.18)] bg-white/40 hover:bg-white transition-colors duration-300">
                <span className="mono-label text-xs text-[#77756f]">Forward Horizon</span>
                <h3 className="heading-display text-2xl text-[#0d0d0d] mt-1 mb-2">
                  Next — Your team?
                </h3>
                <p className="text-xs sm:text-sm text-[#77756f] leading-relaxed mb-4">
                  Actively seeking high-impact software engineering internships and collaborative full-stack projects.
                </p>
                <a
                  href="#contact"
                  className="btn-pill-primary text-xs !py-2 !px-4 inline-flex"
                >
                  Start Conversation →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
