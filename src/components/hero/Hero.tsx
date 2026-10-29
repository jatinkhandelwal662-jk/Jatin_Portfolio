"use client";

import React, { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const firstName = PROFILE.name.split(" ")[0];
  const [isMuted, setIsMuted] = useState(true);
  const [soundUnlocked, setSoundUnlocked] = useState(false);
  const [hasTransparentVideo, setHasTransparentVideo] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
          setSoundUnlocked(true);
        })
        .catch(() => {
          video.muted = true;
          video
            .play()
            .then(() => setIsMuted(true))
            .catch(() => {});
        });
    }

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

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.35) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.35, 0.5, 1] }
    );

    observer.observe(section);
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
      className="relative min-h-[100svh] overflow-hidden bg-[#faf4df] pb-10 pt-24 text-[#171512] md:pt-28"
    >
      <div
        className="pointer-events-none absolute -right-[18vw] top-[14%] h-[72vw] max-h-[780px] w-[72vw] max-w-[780px] rounded-full border border-[#d98870]/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-[3%] top-[24%] h-2 w-2 rounded-full bg-[#df755d]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[8%] top-[22%] h-3 w-3 rounded-full border border-[#df755d]/50"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-[20%] z-0 flex justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <span
          className="whitespace-nowrap font-extrabold text-[clamp(150px,28vw,390px)] leading-none tracking-[-0.09em] text-transparent opacity-60"
          style={{ WebkitTextStroke: "1px rgba(116, 87, 67, 0.1)" }}
        >
          {PROFILE.firstName}
        </span>
      </div>

      <div className="section-container relative z-10 grid min-h-[calc(100svh-8rem)] w-full items-center gap-2 lg:grid-cols-[1.02fr_0.98fr] lg:gap-0">
        <div className="relative z-20 py-8 text-center lg:py-0 lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#171512]/10 bg-white/45 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#77756f] sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#df755d]" />
            New Delhi, India <span className="text-[#c2b9a2]">/</span> Industrial IoT student
          </div>

          <p className="mb-1 font-serif text-lg italic text-[#d66d55] sm:text-xl">
            Hi there, I&apos;m
          </p>
          <h1 className="heading-display text-[clamp(4.5rem,11vw,9rem)] leading-[0.83] tracking-[-0.075em] text-[#171512]">
            {firstName}
            <span className="text-[#df755d]">.</span>
          </h1>

          <p className="mt-6 text-xl font-semibold tracking-tight text-[#3a342f] sm:text-2xl">
            {PROFILE.role}
            <span className="serif-italic ml-1 text-[#d66d55]">with purpose.</span>
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#77756f] sm:text-base lg:mx-0">
            {PROFILE.subLine}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#6d675e] lg:justify-start">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#df755d]" />
              GGSIPU · {PROFILE.dept}
            </span>
            <span className="hidden h-4 w-px bg-[#171512]/15 sm:block" />
            <span>Building voice-first civic tech</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#work"
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget("#work");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#df755d] px-6 py-3 text-sm font-medium text-white shadow-[0_8px_24px_-10px_rgba(181,83,61,0.65)] transition-all hover:-translate-y-0.5 hover:bg-[#ca634c]"
            >
              Explore my work <span aria-hidden="true">↗</span>
            </a>
            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget("#contact");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[#171512]/15 bg-white/35 px-6 py-3 text-sm font-medium text-[#302c27] transition-all hover:-translate-y-0.5 hover:bg-white/70"
            >
              Let&apos;s talk
            </a>
            <a
              href={PROFILE.resumePath}
              download="Jatin_Khandelwal_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-2 py-3 text-sm font-medium text-[#77756f] transition-colors hover:text-[#d66d55]"
            >
              Résumé <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-6 border-t border-[#171512]/10 pt-5 text-left lg:mx-0 lg:justify-start">
            <div>
              <span className="mono-label block text-[9px] text-[#a19a8c]">
                Currently
              </span>
              <span className="mt-1 block text-xs font-medium text-[#3a342f]">
                B.Tech · GGSIPU USAR
              </span>
            </div>
            <span className="h-8 w-px bg-[#171512]/10" />
            <div>
              <span className="mono-label block text-[9px] text-[#a19a8c]">
                Focus
              </span>
              <span className="mt-1 block text-xs font-medium text-[#3a342f]">
                Full-stack &amp; geospatial AI
              </span>
            </div>
          </div>
        </div>

        <div className="relative isolate mx-auto flex h-[min(56svh,560px)] w-full max-w-[540px] items-center justify-center sm:h-[min(66svh,660px)] lg:h-[min(78svh,740px)]">
          <div
            className="absolute bottom-[8%] left-[12%] z-0 aspect-square w-[18%] rounded-full bg-[#f0c85c]"
            aria-hidden="true"
          />
          <div
            className="absolute right-[8%] top-[13%] z-0 aspect-square w-[12%] rounded-full border border-[#df755d]/40"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-[4%] z-[5] mx-auto h-[92%] w-full rounded-full bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.36)_38%,transparent_72%)]"
            aria-hidden="true"
          />

          <div className="absolute left-[3%] top-[16%] z-20 hidden -rotate-6 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-[0_12px_30px_-18px_rgba(54,41,28,0.4)] backdrop-blur sm:block">
            <span className="mono-label block text-[9px] text-[#a19a8c]">
              Building
            </span>
            <span className="mt-1 block text-xs font-semibold text-[#302c27]">
              People-first technology
            </span>
          </div>

          <video
            ref={videoRef}
            loop
            playsInline
            preload="auto"
            muted={isMuted}
            onLoadedData={(event) =>
              setHasTransparentVideo(
                event.currentTarget.currentSrc.endsWith(".webm")
              )
            }
            aria-label="Animated portrait of Jatin Khandelwal"
            className="relative z-10 h-[92%] max-h-full max-w-[94%] object-contain"
            style={{
              aspectRatio: "768 / 960",
              maskImage: hasTransparentVideo
                ? undefined
                : "url('/hero/hero-mask.png')",
              maskSize: "100% 100%",
              maskRepeat: "no-repeat",
              WebkitMaskImage: hasTransparentVideo
                ? undefined
                : "url('/hero/hero-mask.png')",
              WebkitMaskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              filter: hasTransparentVideo
                ? "drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.8)) drop-shadow(0 18px 28px rgba(60, 42, 32, 0.22))"
                : undefined,
            }}
          >
            <source src="/hero/hero-transparent.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>

          <div className="absolute bottom-5 left-5 z-20">
            <div className="relative">
              {isMuted && (
                <span
                  className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#171512]/15"
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                onClick={toggleSound}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#171512] text-[#faf4df] shadow-lg transition-transform hover:scale-105 active:scale-95"
                aria-label={isMuted ? "Unmute portrait video" : "Mute portrait video"}
              >
                {isMuted ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="ml-0.5 h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
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
    </section>
  );
}
