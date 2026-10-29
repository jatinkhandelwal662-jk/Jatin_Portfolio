"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ProjectMediaWindowProps {
  images: string[];
  title: string;
  badge?: string;
  bottomLeft?: string;
  bottomRight?: string;
}

export function ProjectMediaWindow({
  images,
  title,
  badge = "ILLUSTRATIVE UI",
  bottomLeft = "PIPELINE VERIFIED",
  bottomRight = "RESUME DATA COMPLIANT",
}: ProjectMediaWindowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="rounded-2xl bg-[#0a0a0a] flex flex-col overflow-hidden h-full border border-white/[0.06]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] shrink-0">
        {/* Traffic-light dots */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>

        {/* Badge */}
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#6b6966] border border-white/[0.12] rounded px-1.5 py-0.5">
          {badge}
        </span>
      </div>

      {/* Carousel area */}
      <div className="relative flex-1 min-h-0 bg-[#111]">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${title} project preview ${i + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover transition-opacity duration-700 ease-in-out select-none ${
              i === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0}
            draggable={false}
          />
        ))}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.08] shrink-0">
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#4a4845]">
          {bottomLeft}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#4a4845]">
          {bottomRight}
        </span>
      </div>
    </div>
  );
}
