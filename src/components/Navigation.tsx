"use client";

import React, { useState, useEffect, useRef } from "react";
import { PROFILE, NAV } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import { useScrollProgress } from "@/lib/hooks";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("about");
  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = useScrollProgress();

  const navContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  // Scroll threshold detection for 40px
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver with rootMargin: -45% 0px -50% 0px
  useEffect(() => {
    const sectionIds = NAV.map((item) => item.href.replace("#", ""));
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Update sliding indicator position
  useEffect(() => {
    if (!navContainerRef.current) return;
    const activeLink = navContainerRef.current.querySelector<HTMLAnchorElement>(
      `a[data-section="${activeSection}"]`
    );

    if (activeLink) {
      const containerRect = navContainerRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    }
  }, [activeSection, scrolled]);

  // Lock scroll when mobile menu is open & handle Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    scrollToTarget(href, { offset: -30 });
  };

  return (
    <>
      {/* 2px ink scroll-progress bar along top */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-[#0d0d0d] z-[70] transition-[width] duration-75 ease-out pointer-events-none"
        style={{ width: `${Math.round(progress * 100)}%` }}
        aria-hidden="true"
      />

      {/* Main fixed top navigation */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <div className="section-container flex items-center justify-between">
          {/* Left: Initials mark + Name */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="group flex items-center gap-3 select-none no-underline outline-none"
            aria-label="Jatin Khandelwal — Back to Hero"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                scrolled
                  ? "bg-[#0d0d0d] text-[#f4f2ee] shadow-sm"
                  : "border border-[#0d0d0d]/30 text-[#0d0d0d] bg-transparent"
              } group-hover:rotate-[360deg] duration-700`}
            >
              JK
            </div>

            <span
              className={`font-semibold text-sm tracking-tight text-[#0d0d0d] transition-all duration-300 ${
                scrolled
                  ? "opacity-0 -translate-x-2 pointer-events-none"
                  : "opacity-100 translate-x-0"
              }`}
            >
              {PROFILE.name}
            </span>
          </a>

          {/* Center/Right: Desktop navigation pill */}
          <nav
            ref={navContainerRef}
            className={`hidden md:flex items-center relative p-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              scrolled
                ? "bg-white/80 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(13,13,13,0.08),0_8px_32px_-6px_rgba(13,13,13,0.08)]"
                : "bg-white/40 backdrop-blur-sm shadow-[inset_0_0_0_1px_rgba(13,13,13,0.05)]"
            }`}
            aria-label="Primary Navigation"
          >
            {/* Sliding ink indicator */}
            <div
              className="absolute top-1.5 bottom-1.5 bg-[#0d0d0d] rounded-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />

            {NAV.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.name}
                  href={item.href}
                  data-section={item.href.replace("#", "")}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative z-10 px-4 py-1.5 text-xs font-medium tracking-tight rounded-full transition-colors duration-300 ${
                    isActive
                      ? "text-[#f4f2ee]"
                      : "text-[#77756f] hover:text-[#0d0d0d]"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Mobile "Menu" button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(13,13,13,0.1)] text-xs font-medium text-[#0d0d0d] shadow-sm active:scale-95 transition-transform"
            aria-label="Open navigation menu"
          >
            <span>Menu</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d]" />
          </button>
        </div>
      </header>

      {/* Full-screen Mobile Paper Overlay */}
      <div
        className={`fixed inset-0 z-[65] bg-[#f4f2ee] flex flex-col justify-between p-8 md:hidden transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen
            ? "[clip-path:circle(150%_at_calc(100%-40px)_40px)] pointer-events-auto"
            : "[clip-path:circle(0%_at_calc(100%-40px)_40px)] pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-[#0d0d0d] text-[#f4f2ee] flex items-center justify-center font-bold text-xs">
            JK
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="w-10 h-10 rounded-full border border-[rgba(13,13,13,0.15)] flex items-center justify-center text-sm font-medium text-[#0d0d0d] active:scale-95 transition-transform"
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-5 my-auto" aria-label="Mobile Navigation">
          {NAV.map((item, idx) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="group flex items-baseline gap-4 no-underline text-3xl font-bold text-[#0d0d0d] tracking-tight hover:text-[#77756f] transition-colors"
              style={{
                transitionDelay: `${mobileOpen ? (idx + 1) * 60 : 0}ms`,
              }}
            >
              <span className="mono-label text-sm text-[#77756f] group-hover:text-[#0d0d0d]">
                {item.index}
              </span>
              <span>{item.name}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-between pt-6 border-t border-[rgba(13,13,13,0.08)] text-xs text-[#77756f]">
          <span>{PROFILE.location}</span>
          <span>{PROFILE.email}</span>
        </div>
      </div>
    </>
  );
}
