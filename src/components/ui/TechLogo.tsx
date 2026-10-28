"use client";

import React from "react";
import Image from "next/image";

export const BRAND_MAP: Record<string, { src: string; alt: string; color: string }> = {
  cplusplus: { src: "/logos/cplusplus.svg", alt: "C++", color: "#00599C" },
  javascript: { src: "/logos/javascript.svg", alt: "JavaScript", color: "#F7DF1E" },
  python: { src: "/logos/python.svg", alt: "Python", color: "#3776AB" },
  html5: { src: "/logos/html5.svg", alt: "HTML5", color: "#E34F26" },
  css3: { src: "/logos/css3.svg", alt: "CSS3", color: "#1572B6" },
  nodejs: { src: "/logos/nodejs.svg", alt: "Node.js", color: "#5FA04E" },
  express: { src: "/logos/express.svg", alt: "Express.js", color: "#000000" },
  fastapi: { src: "/logos/fastapi.svg", alt: "FastAPI", color: "#009688" },
  chartjs: { src: "/logos/chartjs.svg", alt: "Chart.js", color: "#FF6384" },
  leaflet: { src: "/logos/leaflet.svg", alt: "Leaflet.js", color: "#199900" },
  twilio: { src: "/logos/twilio.svg", alt: "Twilio", color: "#F22F46" },
  pytorch: { src: "/logos/pytorch.svg", alt: "PyTorch", color: "#EE4C2C" },
  git: { src: "/logos/git.svg", alt: "Git", color: "#F05032" },
  github: { src: "/logos/github.svg", alt: "GitHub", color: "#181717" },
  docker: { src: "/logos/docker.svg", alt: "Docker", color: "#2496ED" },
  vercel: { src: "/logos/vercel.svg", alt: "Vercel", color: "#000000" },
  render: { src: "/logos/render.svg", alt: "Render", color: "#46E3B7" },
  cisco: { src: "/logos/cisco.svg", alt: "Cisco", color: "#049FD9" },
  leetcode: { src: "/logos/leetcode.svg", alt: "LeetCode", color: "#FFA116" },
  codechef: { src: "/logos/codechef.svg", alt: "CodeChef", color: "#5B4638" },
  geeksforgeeks: { src: "/logos/geeksforgeeks.svg", alt: "GeeksforGeeks", color: "#2F8D46" },
  hackerrank: { src: "/logos/hackerrank.svg", alt: "HackerRank", color: "#00EA64" },
};

export const CONCEPT_MAP: Record<string, string> = {
  api: "REST API Endpoint",
  network: "Network Architecture",
  tree: "Data Structures & Graph",
  graph: "Topology & Centrality",
  security: "Stateless Security",
};

export function isBrand(name: string): boolean {
  return name.toLowerCase() in BRAND_MAP;
}

interface TechLogoProps {
  name: string;
  size?: number;
  className?: string;
}

export function TechLogo({ name, size = 24, className = "" }: TechLogoProps) {
  const lower = name.toLowerCase();
  const brand = BRAND_MAP[lower];

  if (brand) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={brand.src}
          alt={brand.alt}
          width={size}
          height={size}
          className="object-contain w-full h-full"
        />
      </div>
    );
  }

  // Fallback concept line icons
  return (
    <div
      className={`inline-flex items-center justify-center text-[#0d0d0d] ${className}`}
      style={{ width: size, height: size }}
    >
      {lower === "api" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
          <circle cx="8" cy="7" r="2" fill="currentColor" />
          <circle cx="16" cy="12" r="2" fill="currentColor" />
          <circle cx="10" cy="17" r="2" fill="currentColor" />
        </svg>
      ) : lower === "tree" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
        >
          <circle cx="12" cy="5" r="3" />
          <circle cx="6" cy="19" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M12 8v4m-6 4l6-4 6 4" />
        </svg>
      ) : lower === "graph" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
        >
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="8" r="3" />
          <circle cx="14" cy="18" r="3" />
          <path d="M8.5 7.5l7 1.5M7.5 8.5l5 7M16 10l-1 5" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
        >
          <rect x="3" y="3" width="6" height="6" rx="1" />
          <rect x="15" y="3" width="6" height="6" rx="1" />
          <rect x="9" y="15" width="6" height="6" rx="1" />
          <path d="M6 9v3a3 3 0 003 3h3m6-6v3a3 3 0 01-3 3h-3" />
        </svg>
      )}
    </div>
  );
}
