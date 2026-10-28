"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Certifications } from "@/components/sections/Certifications";
import { Experience } from "@/components/sections/Experience";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";

export function App() {
  return (
    <div className="relative min-h-screen bg-[#f4f2ee] text-[#0d0d0d]">
      <RevealObserver />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Achievements />
      </main>
      <Contact />
    </div>
  );
}
