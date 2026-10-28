"use client";

import React, { useState } from "react";
import { PROJECTS, ProjectItem } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechLogo } from "@/components/ui/TechLogo";

export function Work() {
  const [activeProjectId, setActiveProjectId] = useState<string>(PROJECTS[0].id);

  return (
    <section id="work" className="section-pad bg-[#f4f2ee] relative">
      <div className="section-container">
        <SectionHeader
          tagIndex="03"
          tagLabel="Selected Work"
          headingMain="Things I've"
          italicWord="built."
          description="Production systems and national hackathon solutions backed by working GitHub repositories and live deployments."
        />

        {/* Desktop Expanding Accordion Gallery (height: min(78svh, 600px)), Mobile Vertical Accordion */}
        <div className="hidden lg:flex gap-4 h-[min(78svh,620px)] items-stretch">
          {PROJECTS.map((project) => {
            const isOpen = activeProjectId === project.id;
            return (
              <div
                key={project.id}
                tabIndex={0}
                role="button"
                aria-expanded={isOpen}
                aria-label={`Project: ${project.title}`}
                onClick={() => setActiveProjectId(project.id)}
                onFocus={() => setActiveProjectId(project.id)}
                className={`relative rounded-[28px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] ${
                  isOpen
                    ? "flex-[8] bg-white shadow-[inset_0_0_0_1px_rgba(13,13,13,0.08),0_20px_50px_-12px_rgba(13,13,13,0.1)] p-8"
                    : "flex-[1.2] max-w-[90px] bg-white/70 hover:bg-white cursor-pointer shadow-[inset_0_0_0_1px_rgba(13,13,13,0.06)] p-6"
                }`}
              >
                {!isOpen ? (
                  /* Folded Slim Spine */
                  <div className="h-full flex flex-col justify-between items-center py-2 select-none">
                    <span className="mono-label text-xs font-bold text-[#77756f]">
                      {project.index}
                    </span>

                    {/* Vertical Title */}
                    <div className="[writing-mode:vertical-rl] rotate-180 font-bold text-lg tracking-tight text-[#0d0d0d] whitespace-nowrap">
                      {project.title}
                    </div>

                    {/* Plus icon that rotates on hover */}
                    <div className="w-8 h-8 rounded-full border border-[rgba(13,13,13,0.12)] flex items-center justify-center text-sm font-semibold text-[#0d0d0d] transition-transform duration-300 group-hover:rotate-90">
                      +
                    </div>
                  </div>
                ) : (
                  /* Expanded Open Panel */
                  <div className="h-full grid grid-cols-[1.1fr_1fr] gap-8 items-stretch animate-[fadeIn_0.5s_ease-out]">
                    {/* Left Column: Info & Tech */}
                    <div className="flex flex-col justify-between overflow-y-auto pr-2">
                      <div>
                        {/* Kicker & Index */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="mono-label text-xs text-[#77756f]">
                            {project.index}
                          </span>
                          <span className="mono-label text-[11px] text-[#77756f] px-2.5 py-0.5 rounded-full bg-[#f4f2ee]">
                            {project.kicker}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="heading-display text-3xl sm:text-4xl text-[#0d0d0d] mt-2 mb-3">
                          {project.title}
                        </h3>

                        {/* Descriptions */}
                        <p className="text-[#3a3a3a] text-sm leading-relaxed mb-3">
                          {project.description}
                        </p>
                        <p className="text-[#77756f] text-xs leading-relaxed mb-5">
                          {project.subDescription}
                        </p>

                        {/* 2-column feature list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4 pt-4 border-t border-[rgba(13,13,13,0.06)]">
                          {project.features.map((feat, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-[#3a3a3a] flex items-start gap-2 bg-[#fbfaf8] p-2.5 rounded-xl border border-[rgba(13,13,13,0.04)]"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d] mt-1 shrink-0" />
                              <span className="leading-snug">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech chips + Actions */}
                      <div className="pt-4 border-t border-[rgba(13,13,13,0.06)] mt-4">
                        <div className="flex flex-wrap items-center gap-2 mb-5">
                          {project.tech.map((t) => (
                            <div
                              key={t}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f4f2ee] border border-[rgba(13,13,13,0.06)] text-[11px] font-medium text-[#0d0d0d]"
                            >
                              <TechLogo name={t} size={14} />
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-3">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-pill-primary text-xs !py-2.5 !px-5"
                            >
                              View on GitHub ↗
                            </a>
                          )}
                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-pill-secondary text-xs !py-2.5 !px-5"
                            >
                              Live App ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Illustrative Grayscale Mini-UI */}
                    <div className="rounded-2xl bg-[#0d0d0d] text-[#f4f2ee] p-5 flex flex-col justify-between overflow-hidden relative shadow-inner">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                          <span className="mono-label text-[10px] text-[#a9a6a0] ml-2">
                            {project.title.toLowerCase().replace(/[\s.]+/g, "-")}.internal
                          </span>
                        </div>
                        <span className="mono-label text-[9px] px-2 py-0.5 rounded bg-white/10 text-[#a9a6a0]">
                          Illustrative UI
                        </span>
                      </div>

                      {/* Project-specific Grayscale UI Mockup */}
                      {project.id === "delhi-sudarshan" ? (
                        <div className="my-auto py-4 space-y-4">
                          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between text-xs text-[#a9a6a0] mb-2 font-mono">
                              <span>VOICE GATEWAY</span>
                              <span className="text-white">Active · 0 UI</span>
                            </div>
                            {/* Soundwave animation representation */}
                            <div className="flex items-center justify-center gap-1.5 h-12">
                              {[12, 28, 44, 20, 36, 48, 24, 16, 40, 32, 18, 44, 30].map(
                                (h, i) => (
                                  <span
                                    key={i}
                                    className="w-1 bg-[#f4f2ee] rounded-full animate-pulse"
                                    style={{
                                      height: `${h}px`,
                                      animationDelay: `${i * 90}ms`,
                                    }}
                                  />
                                )
                              )}
                            </div>
                          </div>

                          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/10">
                            <span className="mono-label text-[10px] text-[#a9a6a0] block mb-2">
                              Department Resolution Rates (Chart.js)
                            </span>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-[11px] mb-1">
                                  <span>Water Works</span>
                                  <span>94%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-white w-[94%]" />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-[11px] mb-1">
                                  <span>Sanitation</span>
                                  <span>88%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-white/80 w-[88%]" />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-[11px] mb-1">
                                  <span>Roadway & Infrastructure</span>
                                  <span>82%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-white/60 w-[82%]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="my-auto py-4 space-y-4">
                          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between text-xs text-[#a9a6a0] mb-3 font-mono">
                              <span>HYBRID TRANSUNET</span>
                              <span className="text-white">CANOPY SEGMENTATION</span>
                            </div>
                            {/* Geospatial grid simulation */}
                            <div className="relative h-28 bg-[#141414] rounded-lg overflow-hidden border border-white/5 flex items-center justify-center">
                              {/* Grid overlay */}
                              <div className="absolute inset-0 bg-[radial-gradient(#3a3a3a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                              {/* Reconstructed road vector path */}
                              <svg
                                viewBox="0 0 200 80"
                                className="w-full h-full p-2 stroke-white fill-none stroke-[2] z-10"
                              >
                                <path
                                  d="M10 70 Q 50 10, 100 45 T 190 20"
                                  strokeDasharray="4 2"
                                />
                                <circle cx="10" cy="70" r="3" fill="white" />
                                <circle cx="100" cy="45" r="3" fill="white" />
                                <circle cx="190" cy="20" r="3" fill="white" />
                              </svg>
                            </div>
                          </div>

                          <div className="bg-[#1a1a1a] rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs">
                            <span className="mono-label text-[10px] text-[#a9a6a0]">
                              TOPOLOGY HEALING
                            </span>
                            <span className="font-mono text-white">
                              MST + Union-Find Confirmed
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-[#a9a6a0] font-mono">
                        <span>PIPELINE VERIFIED</span>
                        <span>RESUME DATA COMPLIANT</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Accordion */}
        <div className="lg:hidden flex flex-col gap-5">
          {PROJECTS.map((project) => {
            const isOpen = activeProjectId === project.id;
            return (
              <div
                key={project.id}
                className="rounded-[24px] bg-white border border-[rgba(13,13,13,0.08)] overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveProjectId(project.id)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="mono-label text-xs text-[#77756f]">
                      {project.index}
                    </span>
                    <h3 className="heading-display text-xl text-[#0d0d0d]">
                      {project.title}
                    </h3>
                  </div>
                  <span
                    className={`w-7 h-7 rounded-full border border-[rgba(13,13,13,0.15)] flex items-center justify-center text-xs transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[rgba(13,13,13,0.06)] animate-[fadeIn_0.3s_ease-out]">
                    <span className="mono-label text-[10px] text-[#77756f] block mb-2">
                      {project.kicker}
                    </span>
                    <p className="text-sm text-[#3a3a3a] leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="space-y-2 mb-5">
                      {project.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-[#3a3a3a] flex items-start gap-2 bg-[#fbfaf8] p-2.5 rounded-lg border border-[rgba(13,13,13,0.04)]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d] mt-1 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tech.map((t) => (
                        <div
                          key={t}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f4f2ee] text-[10px] font-medium"
                        >
                          <TechLogo name={t} size={12} />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill-primary text-xs !py-2 !px-4"
                        >
                          GitHub ↗
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill-secondary text-xs !py-2 !px-4"
                        >
                          Live App ↗
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
