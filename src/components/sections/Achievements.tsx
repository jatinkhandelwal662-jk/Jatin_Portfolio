"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ACHIEVEMENTS, AchievementItem } from "@/lib/data";

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

function CounterCard({
  item,
  isNearestCenter,
  hasEntered,
}: {
  item: AchievementItem;
  isNearestCenter: boolean;
  hasEntered: boolean;
}) {
  const [displayVal, setDisplayVal] = useState<string>("0");

  useEffect(() => {
    if (!hasEntered) return;

    let start = performance.now();
    const duration = 1400; // 1.4s easeOutQuart

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(progress);
      const current = eased * item.number;

      if (item.isDecimal) {
        setDisplayVal(current.toFixed(1));
      } else {
        setDisplayVal(Math.round(current).toString());
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [hasEntered, item.number, item.isDecimal]);

  return (
    <div
      data-card-item
      className={`shrink-0 w-[min(540px,calc(100vw-48px))] h-[clamp(290px,40vh,330px)] sm:w-[clamp(340px,40vw,540px)] sm:h-[clamp(260px,36vh,310px)] rounded-[28px] bg-white p-7 sm:p-8 flex flex-col justify-between relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isNearestCenter
          ? "-translate-y-3 shadow-[0_28px_60px_-14px_rgba(13,13,13,0.16),inset_0_0_0_1px_rgba(13,13,13,0.08)]"
          : "translate-y-0 shadow-[0_10px_30px_-8px_rgba(13,13,13,0.06),inset_0_0_0_1px_rgba(13,13,13,0.05)] opacity-85"
      }`}
    >
      {/* Soft brand-tint glow behind tile */}
      <div
        className="absolute -top-6 -left-6 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity duration-500"
        style={{
          backgroundColor: item.brandColor,
          opacity: isNearestCenter ? 0.22 : 0.08,
        }}
      />

      {/* Top: 72px Logo Tile + Index */}
      <div className="flex items-center justify-between relative z-10">
        <div
          className="w-[72px] h-[72px] rounded-2xl bg-[#f4f2ee] p-3 flex items-center justify-center border border-[rgba(13,13,13,0.05)] shadow-sm"
          style={{
            boxShadow: `0 4px 18px ${item.glow}`,
          }}
        >
          <Image
            src={item.logo}
            alt={item.platform}
            width={48}
            height={48}
            className="w-10 h-10 object-contain"
          />
        </div>

        <span className="mono-label text-xs font-bold text-[#77756f]">
          {item.index}
        </span>
      </div>

      {/* Bottom Content: Bottom-left info, Bottom-right huge number */}
      <div className="flex flex-col items-stretch gap-3 relative z-10 pt-4 border-t border-[rgba(13,13,13,0.05)] sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="w-full sm:max-w-[55%]">
          <span className="mono-label text-[10px] text-[#77756f] block mb-1">
            {item.label}
          </span>
          <h4 className="line-clamp-3 font-bold text-base sm:text-lg text-[#0d0d0d] leading-snug tracking-tight sm:line-clamp-none">
            {item.caption}
          </h4>
          <p className="text-xs text-[#77756f] mt-1 line-clamp-2 leading-relaxed">
            {item.detail}
          </p>
        </div>

        {/* Bottom-right huge number counting up */}
        <div className="w-full text-right shrink-0 sm:w-auto">
          <div className="heading-display text-[clamp(1.75rem,8vw,2.25rem)] sm:text-5xl md:text-6xl text-[#0d0d0d] tracking-[-0.05em] leading-none">
            {item.prefix || ""}
            {displayVal}
            <span className="text-2xl sm:text-3xl text-[#77756f] font-normal">
              {item.suffix || ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Achievements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [nearestIndex, setNearestIndex] = useState(0);
  const [hasStartedAnimation, setHasStartedAnimation] = useState(false);

  useEffect(() => {
    let rafId: number;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        const rect = container.getBoundingClientRect();
        const totalTravel = rect.height - window.innerHeight;
        if (totalTravel <= 0) return;

        const current = -rect.top;
        const prog = Math.min(1, Math.max(0, current / totalTravel));
        setScrollProgress(prog);

        if (prog > 0.05 && !hasStartedAnimation) {
          setHasStartedAnimation(true);
        }

        // Horizontal translation
        const maxScrollWidth = track.scrollWidth - window.innerWidth + 80;
        const tx = Math.max(0, prog * maxScrollWidth);
        track.style.transform = `translateX(-${tx}px)`;

        // Calculate card closest to center of viewport
        const cards = track.querySelectorAll<HTMLDivElement>("[data-card-item]");
        const viewportCenter = window.innerWidth / 2;
        let minDiff = Infinity;
        let closestIdx = 0;

        cards.forEach((card, idx) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const diff = Math.abs(cardCenter - viewportCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });

        setNearestIndex(closestIdx);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [hasStartedAnimation]);

  return (
    <section
      id="achievements"
      ref={containerRef}
      className="relative bg-[#f4f2ee] h-[280vh]"
    >
      {/* Sticky Full-Viewport Container */}
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-between py-12 md:py-16">
        {/* Header with Title & Thin Progress Bar */}
        <div className="section-container w-full">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <span className="mono-label text-xs text-[#77756f]">
                06 — Honors & Ranks
              </span>
              <h2 className="heading-display text-2xl sm:text-3xl text-[#0d0d0d]">
                Achievements &{" "}
                <span className="serif-italic font-normal text-[#77756f]">
                  metrics.
                </span>
              </h2>
            </div>

            {/* Index counter */}
            <span className="mono-label text-xs text-[#77756f] hidden sm:inline-block">
              {(nearestIndex + 1).toString().padStart(2, "0")} /{" "}
              {ACHIEVEMENTS.length.toString().padStart(2, "0")}
            </span>
          </div>

          {/* Thin progress bar in header */}
          <div className="w-full h-[2px] bg-[rgba(13,13,13,0.08)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0d0d0d] transition-[width] duration-75 ease-out"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
        </div>

        {/* Horizontal Card Track */}
        <div className="w-full my-auto overflow-visible pl-[var(--gutter)]">
          <div
            ref={trackRef}
            className="flex items-center gap-6 sm:gap-8 will-change-transform pr-24"
            style={{ transition: "transform 0.05s linear" }}
          >
            {ACHIEVEMENTS.map((item, idx) => (
              <CounterCard
                key={item.id}
                item={item}
                isNearestCenter={nearestIndex === idx}
                hasEntered={hasStartedAnimation}
              />
            ))}

            {/* Track Ending Card: and counting → */}
            <div className="shrink-0 w-[240px] h-[clamp(260px,36vh,310px)] rounded-[28px] border-2 border-dashed border-[rgba(13,13,13,0.15)] flex flex-col items-center justify-center p-6 text-center text-[#77756f]">
              <span className="serif-italic text-2xl text-[#0d0d0d] mb-2">
                and counting →
              </span>
              <span className="mono-label text-[10px] text-[#a9a6a0]">
                Continuous competition & research
              </span>
            </div>
          </div>
        </div>

        {/* Bottom indicator hint */}
        <div className="section-container w-full flex items-center justify-between text-xs text-[#77756f] mono-label">
          <span>Horizontal travel locked to scroll</span>
          <span>Only verified résumé achievements</span>
        </div>
      </div>
    </section>
  );
}
