"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";

interface ScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: { offset?: number; immediate?: boolean }) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (target: string | HTMLElement, options?: { offset?: number; immediate?: boolean }) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? -20,
        immediate: options?.immediate ?? false,
      });
    } else {
      let el: HTMLElement | null = null;
      if (typeof target === "string") {
        el = document.querySelector(target);
      } else {
        el = target;
      }
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? -20);
        window.scrollTo({
          top,
          behavior: options?.immediate ? "auto" : "smooth",
        });
      }
    }
  };

  return (
    <ScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  return useContext(ScrollContext);
}

export function scrollToTarget(
  target: string | HTMLElement,
  options?: { offset?: number; immediate?: boolean }
) {
  let el: HTMLElement | null = null;
  if (typeof target === "string") {
    el = document.querySelector(target);
  } else {
    el = target;
  }
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? -20);
    window.scrollTo({
      top,
      behavior: options?.immediate ? "auto" : "smooth",
    });
  }
}
