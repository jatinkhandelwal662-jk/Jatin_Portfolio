"use client";

import React, { useRef, useState, useEffect } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [soundUnlocked, setSoundUnlocked] = useState(false);

  // Autoplay attempt with fallback & user gesture listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try play with sound first
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
          setSoundUnlocked(true);
        })
        .catch(() => {
          // Autoplay with sound was blocked; fallback to muted autoplay
          video.muted = true;
          video.play().then(() => {
            setIsPlaying(true);
            setIsMuted(true);
          });
        });
    }

    // Unlock sound on first user interaction anywhere
    const unlockSound = () => {
      if (videoRef.current && !soundUnlocked) {
        videoRef.current.muted = false;
        setIsMuted(false);
        setSoundUnlocked(true);
      }
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
      window.removeEventListener("touchend", unlockSound);
    };

    window.addEventListener("pointerdown", unlockSound, { once: true });
    window.addEventListener("keydown", unlockSound, { once: true });
    window.addEventListener("touchend", unlockSound, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
      window.removeEventListener("touchend", unlockSound);
    };
  }, [soundUnlocked]);

  // IntersectionObserver pauses video when less than 35% visible
  useEffect(() => {
    const el = sectionRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.35) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      {
        threshold: [0, 0.35, 0.5, 1.0],
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      setSoundUnlocked(true);
      if (video.paused) video.play();
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden bg-[#f4f2ee] pt-24 pb-8 md:py-16 select-none"
    >
      {/* Giant outlined ghost word behind person */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <span
          className="font-extrabold uppercase tracking-[-0.06em] text-[clamp(110px,24vw,340px)] leading-none text-transparent"
          style={{
            WebkitTextStroke: "1.5px rgba(13, 13, 13, 0.08)",
          }}
        >
          {PROFILE.firstName}
        </span>
      </div>

      {/* Main hero center content with video */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center section-container w-full">
        <div className="relative flex items-center justify-center w-full max-w-3xl mx-auto">
          {/* Hero looping video */}
          <div className="relative w-full flex items-center justify-center">
            <video
              ref={videoRef}
              loop
              playsInline
              preload="auto"
              muted={isMuted}
              className="w-auto max-w-full h-[52svh] md:h-[min(64svh,680px)] object-contain mix-blend-multiply"
              style={{
                aspectRatio: "768 / 960",
              }}
            >
              <source src="/hero/hero.webm" type="video/webm" />
              <source src="/hero/hero.mp4" type="video/mp4" />
            </video>

            {/* Sound control button (46px, solid ink) */}
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20">
              <div className="relative">
                {isMuted && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping bg-[#0d0d0d]/20 pointer-events-none"
                    aria-hidden="true"
                  />
                )}
                <button
                  type="button"
                  onClick={toggleSound}
                  className="relative w-[46px] h-[46px] rounded-full bg-[#0d0d0d] text-[#f4f2ee] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                >
                  {isMuted ? (
                    /* Play triangle (sound off) */
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 ml-0.5"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    /* Two bars (sound on) */
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Role Heading & CTAs */}
        <div className="relative z-20 text-center max-w-3xl mx-auto mt-4 md:mt-2">
          <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#0d0d0d] tracking-[-0.045em] leading-[1.05]">
            {PROFILE.role}
            <span className="serif-italic font-normal text-[#77756f]">.</span>
          </h1>

          <p className="mt-3 text-[#77756f] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {PROFILE.subLine}
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#work");
              }}
              className="btn-pill-primary"
            >
              Explore work
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#contact");
              }}
              className="btn-pill-secondary"
            >
              Let&apos;s talk
            </a>

            <a
              href={PROFILE.resumePath}
              download="Jatin_Khandelwal_Resume.pdf"
              className="btn-pill-secondary flex items-center gap-1.5"
            >
              <span>Résumé</span>
              <span className="text-xs">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
