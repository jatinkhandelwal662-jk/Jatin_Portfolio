"use client";

import React, { useState } from "react";
import { SKILLS, SKILL_GROUPS, SkillItem } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechLogo, BRAND_MAP } from "@/components/ui/TechLogo";

export function Skills() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(SKILLS[0]);

  return (
    <section id="skills" className="section-pad bg-[#f4f2ee] relative">
      <div className="section-container">
        <SectionHeader
          tagIndex="02"
          tagLabel="Technical Competencies"
          headingMain="The periodic table of my"
          italicWord="stack."
          description="A snapshot of the languages, frameworks, databases, design tools, and core disciplines in my stack."
        />

        {/* Filter Chips */}
        <div className="rv flex flex-wrap items-center gap-2 mb-8" style={{ "--i": 1 } as React.CSSProperties}>
          {SKILL_GROUPS.map((group) => {
            const isActive = activeFilter === group;
            return (
              <button
                key={group}
                type="button"
                onClick={() => setActiveFilter(group)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#0d0d0d] text-[#f4f2ee] shadow-sm"
                    : "bg-white/80 hover:bg-white text-[#77756f] hover:text-[#0d0d0d] border border-[rgba(13,13,13,0.06)]"
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>

        {/* Layout: Grid + Sticky Inspector Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Periodic Table Grid: 8 columns desktop, 4 mobile */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {SKILLS.map((skill, index) => {
              const row = Math.floor(index / 8);
              const col = index % 8;
              const delay = (row + col) * 40;
              const matchesFilter = activeFilter === "All" || skill.family === activeFilter;
              const isSelected = selectedSkill.id === skill.id;

              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => setSelectedSkill(skill)}
                  onMouseEnter={() => setSelectedSkill(skill)}
                  onFocus={() => setSelectedSkill(skill)}
                  tabIndex={0}
                  style={{
                    animationDelay: `${delay}ms`,
                  }}
                  className={`group relative p-2.5 sm:p-3 rounded-2xl flex flex-col justify-between aspect-square text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] ${
                    matchesFilter
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-25 scale-95 pointer-events-none"
                  } ${
                    isSelected
                      ? "bg-white shadow-[0_12px_28px_-6px_rgba(13,13,13,0.12),inset_0_0_0_1.5px_#0d0d0d] -translate-y-1"
                      : "bg-white/70 hover:bg-white hover:-translate-y-1 hover:shadow-md shadow-[inset_0_0_0_1px_rgba(13,13,13,0.06)]"
                  }`}
                  aria-label={`${skill.name}, ${skill.family}`}
                >
                  {/* Top row: Atomic number & symbol */}
                  <div className="flex items-start justify-between w-full">
                    <span className="mono-label text-[10px] text-[#a9a6a0]">
                      {skill.atomicNumber.toString().padStart(2, "0")}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#0d0d0d]">
                      {skill.symbol}
                    </span>
                  </div>

                  {/* Center small logo icon */}
                  <div className="my-auto self-center">
                    <TechLogo
                      name={skill.iconType === "brand" ? skill.iconName : skill.iconName}
                      size={24}
                    />
                  </div>

                  {/* Bottom: Skill name truncated */}
                  <div className="w-full">
                    <span className="block text-[11px] font-semibold text-[#0d0d0d] truncate leading-tight">
                      {skill.name}
                    </span>
                    <span className="block text-[9px] text-[#77756f] truncate mt-0.5">
                      {skill.family}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sticky Inspector Panel (320px desktop, sits below grid on mobile) */}
          <div className="sticky top-24 lg:w-[320px] rounded-[28px] bg-white p-6 md:p-8 shadow-[inset_0_0_0_1px_rgba(13,13,13,0.08),0_12px_36px_-8px_rgba(13,13,13,0.06)]">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(13,13,13,0.06)]">
              <span className="mono-label text-[11px] text-[#77756f]">
                ELEMENT #{selectedSkill.atomicNumber.toString().padStart(2, "0")}
              </span>
              <span className="mono-label text-[10px] px-2.5 py-0.5 rounded-full bg-[#f4f2ee] text-[#0d0d0d] border border-[rgba(13,13,13,0.06)]">
                {selectedSkill.family}
              </span>
            </div>

            {/* Large 150px Logo with soft brand tint glow and pop animation */}
            <div className="py-8 flex flex-col items-center justify-center relative">
              {/* Soft brand glow */}
              <div
                className="absolute w-36 h-36 rounded-full blur-2xl opacity-20 pointer-events-none transition-colors duration-500"
                style={{
                  backgroundColor:
                    BRAND_MAP[selectedSkill.iconName.toLowerCase()]?.color || "#0d0d0d",
                }}
              />

              {/* 150px Icon */}
              <div
                key={selectedSkill.id}
                className="relative z-10 animate-[pop_0.35s_cubic-bezier(0.16,1,0.3,1)_both]"
              >
                <TechLogo
                  name={selectedSkill.iconType === "brand" ? selectedSkill.iconName : selectedSkill.iconName}
                  size={120}
                />
              </div>
            </div>

            {/* Title & Info */}
            <div className="text-center pt-2">
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl font-bold text-[#0d0d0d]">
                  {selectedSkill.symbol}
                </span>
                <h3 className="heading-display text-2xl text-[#0d0d0d]">
                  {selectedSkill.name}
                </h3>
              </div>
              <p className="mono-label text-xs text-[#77756f] mt-1">
                Family · {selectedSkill.family}
              </p>
            </div>

            {/* Verified Project Usage from Résumé */}
            <div className="mt-6 pt-5 border-t border-[rgba(13,13,13,0.06)]">
              <span className="mono-label text-[10px] text-[#77756f] block mb-2.5">
                Applied in Résumé Projects
              </span>
              <ul className="space-y-1.5">
                {selectedSkill.projects.map((proj, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-xs font-medium text-[#0d0d0d] bg-[#f4f2ee]/70 px-3 py-1.5 rounded-lg border border-[rgba(13,13,13,0.04)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d]" />
                    <span className="truncate">{proj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
