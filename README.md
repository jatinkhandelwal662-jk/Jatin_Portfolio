# Jatin Khandelwal — Personal Portfolio

A production-ready personal portfolio built for **Jatin Khandelwal** (Full Stack Developer & B.Tech Industrial IoT Student at USAR GGSIPU, Delhi).

Engineered to the visual standards of an Awwwards "Site of the Day", but quiet: **white, black, and grays only** (with official brand-colored logos and soft glows).

---

## 1. Quick Start & Run Commands

### Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- Python 3.10+ (for video build pipeline with ffmpeg & numpy)

### Installation & Development
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
# Build production bundle
npm run build

# Start production server
npm start
```

---

## 2. Sections Table

| Order | Section | Component | Description & Key Animations |
| :--- | :--- | :--- | :--- |
| **00** | **Navigation** | `Navigation.tsx` | Fixed header, initials mark (turns solid after 40px scroll & spins 360°), frosted glass pill, sliding active indicator, 2px top scroll-progress bar, full-screen mobile paper overlay with clip-path. |
| **01** | **Hero** | `Hero.tsx` | Centered seamless looping video (`mix-blend-mode: multiply`), giant outlined ghost word (`JATIN`), role title, sound toggle (▶ / ❚❚) with blocked autoplay ping ring, pause on <35% visibility. |
| **02** | **About** | `About.tsx` | 3-column layout. Center column features a hanging lanyard ID card with damped pendulum swing physics on mouse velocity, idle sway, and 3D backface flip. Left and right columns display verbatim résumé summary and quick facts. |
| **03** | **Skills** | `Skills.tsx` | "The periodic table of my stack" (8-col desktop, 4-col mobile) with diagonal wave entrance, category filtering chips, and a sticky 320px inspector panel showing official 150px brand logos with pop animation and project citations. |
| **04** | **Work** | `Work.tsx` | Expanding accordion gallery (`min(78svh, 600px)`). Active project expands to flex 8, showing kicker, description, 2-column features, tech badges, and an Illustrative grayscale mini-UI (voice waveform & satellite graph). |
| **05** | **Certifications** | `Certifications.tsx` | Ink-flood index on a white band. Left sticky heading ("Always learning."), right numbered rows that flood with ink left-to-right (`scaleX 0→1`) on hover/focus while text turns white and arrow ↗ slides in. |
| **06** | **Experience** | `Experience.tsx` | Combined chronological path (Class X → Class XII → B.Tech IIoT → ACTS-EDC → Tradophile). Active drawing spine scaled by section scroll progress; stops light up upon reach. Ends with "Next — Your team?". |
| **07** | **Achievements** | `Achievements.tsx` | Pinned horizontal gallery (`position: sticky; height: 100svh`). Progress bar in header; cards slide left on scroll. 72px platform logo tiles with soft brand glows, `easeOutQuart` number count-ups over 1.4s, and center card 12px lift. |
| **08** | **Contact & Footer**| `Contact.tsx` | Interactive hopping headline ("Let's build something together"), large email with interactive "Copied ✓" chip (`aria-live`), direct phone, verified GitHub/LinkedIn links, spinning "say hello" badge, and back-to-top trigger. |

---

## 3. How to Rebuild the Hero Video Pipeline

The video pipeline script is located in `scripts/build-hero-assets.py`. It uses `ffmpeg` and `numpy` to generate a seamless, sample-accurate loop.

### What the script executes:
1. **Centering & Crop**: Crops tightly around the subject head-to-toe (`crop=800:1000:560:50`) and scales to 768×960.
2. **Backdrop Whitening**: Uses `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98` so the backdrop turns pure `#ffffff` and disappears seamlessly into the `#f4f2ee` paper using `mix-blend-mode: multiply`.
3. **Seamless Looping**:
   - Takes the first 10.0 seconds of the video.
   - Cross-fades the last 0.5s into the first 0.5s using FFmpeg `xfade`.
   - Cross-fades the audio sample-accurately in NumPy across 24,000 samples (48,000 Hz) to avoid audio drops or clicks.
4. **Export Formats**:
   - `public/hero/hero.mp4`: H.264 `yuv420p` (CRF 24, `-preset slow`, AAC 96k, `+faststart`).
   - `public/hero/hero.webm`: VP9 (CRF 36, Opus 80k).
5. **Stills & OG Image**:
   - `public/portrait-bust.webp`: 480×600 head-to-shirt crop for the ID card.
   - `public/og.jpg`: 1200×630 OpenGraph card.

### Rebuilding command:
```bash
python scripts/build-hero-assets.py
```

---

## 4. Credits & Licences for Brand Logos

All brand logos are official SVGs stored locally in `public/logos/`. No external CDNs or runtime scripts are used.

| Brand / Platform | Source | Licence | File Location |
| :--- | :--- | :--- | :--- |
| **C++, JavaScript, Python, HTML5, CSS3, Node.js, Express.js, FastAPI, PyTorch, Git, GitHub, Docker, Cisco** | [Devicon](https://github.com/devicons/devicon) | MIT License | `public/logos/DEVICON-LICENSE.txt` |
| **Chart.js, Leaflet.js, Render, Vercel, LeetCode, CodeChef, GeeksforGeeks, HackerRank** | [Simple Icons](https://github.com/simple-icons/simple-icons) | CC0 1.0 Universal | `public/logos/SIMPLE-ICONS-LICENSE.md` |
| **Twilio** | Official SVG | Wikimedia / Twilio Brand Guidelines | `public/logos/twilio.svg` |

---

## 5. Non-Negotiable Rules Compliance

- **Never Fabricate**: 100% of names, credentials, dates, numbers, links, and projects are extracted verbatim or paraphrased directly from `Jatin_Khandelwal_Resume (2).pdf`.
- **Zero Accent Colors**: Only pure white (`#ffffff`), paper (`#f4f2ee`), ink blacks (`#0d0d0d`, `#3a3a3a`), and grays (`#77756f`, `#a9a6a0`, `#e9e6e0`).
- **No Curtains or Loaders**: Page loads directly into the Hero view with a calm, continuous scroll.
- **No 3D / WebGL Libraries**: Zero Three.js or GSAP; pure CSS transforms, IntersectionObserver, and lightweight `requestAnimationFrame` loops.
- **Lenis Smooth Scroll**: Only Lenis is used for smooth scroll, disabled automatically if `prefers-reduced-motion` is detected.
