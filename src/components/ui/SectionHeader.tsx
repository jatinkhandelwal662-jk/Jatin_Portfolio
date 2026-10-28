"use client";

import React from "react";

interface SectionHeaderProps {
  tagIndex: string;
  tagLabel: string;
  headingMain: string;
  italicWord: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  tagIndex,
  tagLabel,
  headingMain,
  italicWord,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 md:mb-16 ${className}`}>
      <div className="rv inline-flex items-center gap-2 mb-4" style={{ "--i": 0 } as React.CSSProperties}>
        <span className="mono-label text-[11px] md:text-xs tracking-wider text-[#77756f] px-3 py-1 rounded-full bg-[#e9e6e0]/60 border border-[rgba(13,13,13,0.06)]">
          {tagIndex} — {tagLabel}
        </span>
      </div>

      <div className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
        <h2 className="heading-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#0d0d0d] tracking-[-0.045em] leading-[1.05]">
          {headingMain}{" "}
          <span className="serif-italic font-normal tracking-normal text-[#77756f]">
            {italicWord}
          </span>
        </h2>
      </div>

      {description && (
        <p
          className="rv mt-4 text-[#77756f] text-base md:text-lg max-w-2xl leading-relaxed"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {description}
        </p>
      )}
    </div>
  );
}
