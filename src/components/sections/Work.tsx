"use client";

import React, { useState } from "react";
import { PROJECTS, ProjectItem } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechLogo } from "@/components/ui/TechLogo";
import { ProjectMediaWindow } from "@/components/ui/ProjectMediaWindow";

// Per-project image sets (photos live in /public/photos/)
const PROJECT_IMAGES: Record<string, string[]> = {
  "delhi-sudarshan": ["/photos/ds.jpg", "/photos/ds-1.jpg", "/photos/ds-2.jpg"],
  "project-setu": ["/photos/ps.jpg", "/photos/ps-1.jpg", "/photos/ps-2.jpg"],
  "jk-music-academy": [
    "/photos/music-academy-guitar.jpg",
    "/photos/music-academy-piano.jpg",
    "/photos/music-academy-production.jpg",
  ],
  "genai-course-assistant": [
    "/photos/rag-1.png",
    "/photos/rag-2.png",
    "/photos/rag-3.png",
  ],
};

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
          description="Production applications, AI tools, and national hackathon solutions spanning civic technology, geospatial AI, and interactive web experiences."
        />

        {/* Desktop Expanding Accordion Gallery (height: min(78svh, 620px)), Mobile Vertical Accordion */}
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
                data-nova-cta="project"
                onClick={() => setActiveProjectId(project.id)}
                onFocus={() => setActiveProjectId(project.id)}
                className={`relative rounded-[28px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] ${
                  isOpen
                    ? "flex-[8] bg-white shadow-[inset_0_0_0_1px_rgba(13,13,13,0.08),0_20px_50px_-12px_rgba(13,13,13,0.1)] p-6"
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
                  <div className="h-full grid grid-cols-[1.1fr_1fr] gap-6 items-stretch animate-[fadeIn_0.5s_ease-out]">
                    {/* Left Column: Info & Tech */}
                    <div className="flex min-h-0 flex-col overflow-hidden pr-2">
                      <div className="min-h-0 flex-1 overflow-y-auto">
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
                        {/* 2-column feature list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 pt-3 border-t border-[rgba(13,13,13,0.06)]">
                          {project.features.map((feat, idx) => (
                            <div
                              key={idx}
                              className="text-xs text-[#3a3a3a] flex items-start gap-2 bg-[#fbfaf8] p-2 rounded-xl border border-[rgba(13,13,13,0.04)]"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d] mt-1 shrink-0" />
                              <span className="leading-snug">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech chips + Actions */}
                      <div className="shrink-0 pt-3 border-t border-[rgba(13,13,13,0.06)] mt-3">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
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

                    {/* Right Column: Photo Slideshow Window */}
                    <ProjectMediaWindow
                      images={PROJECT_IMAGES[project.id] ?? []}
                      title={project.title}
                      {...(project.id === "jk-music-academy"
                        ? {
                            badge: "MUSIC ACADEMY",
                            bottomLeft: "COURSE CATALOG",
                            bottomRight: "RESPONSIVE EXPERIENCE",
                          }
                        : project.id === "genai-course-assistant"
                          ? {
                              badge: "RAG COURSE ASSISTANT",
                              bottomLeft: "SEMANTIC RETRIEVAL",
                              bottomRight: "GROUNDED ANSWERS",
                            }
                        : {})}
                    />
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
                  data-nova-cta="project"
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
