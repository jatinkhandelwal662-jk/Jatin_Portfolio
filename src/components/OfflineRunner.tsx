'use client';

/**
 * OfflineRunner.tsx
 * A Chrome-Dino-style endless runner for Next.js (App Router or Pages Router).
 *
 * Drop <OfflineRunner /> once in your root layout. It will:
 *  - open full-screen automatically when the browser goes offline
 *  - show a small banner (with a Play button) on slow connections
 *  - expose a nearly invisible Easter-egg button (bottom-left) to open it any time
 *
 * Avatar: place your sprite at /public/photos/avatar-runner.png (transparent PNG,
 * facing right). Optionally pass `duckSrc` for a dedicated ducking sprite.
 * If the image is missing, a drawn fallback character is used.
 */

import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const VIEW_H = 220;
const GROUND_Y = 180;
const PLAYER_X = 56;
const STAND = { w: 44, h: 52 };
const DUCK = { w: 58, h: 32 };

const GRAVITY = 2400; // px/s²
const FAST_FALL = 3.2; // gravity multiplier while ArrowDown held in the air
const JUMP_V = 700; // px/s
const START_SPEED = 340; // px/s
const MAX_SPEED = 900;
const ACCEL = 9; // px/s per second
const SCORE_PER_PX = 0.025;
const BIRD_UNLOCK_SCORE = 120;
const HI_KEY = 'offline-runner:hi';

const PALETTES = {
  light: { bg: '#f7f7f7', ink: '#535353', mute: '#8a8a8a' },
  dark: { bg: '#202124', ink: '#d6d6d6', mute: '#8d8d8d' },
} as const;

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Status = 'ready' | 'running' | 'over';
type Reason = 'offline' | 'slow' | 'manual';

interface Obstacle {
  kind: 'cactus' | 'bird';
  x: number;
  y: number; // top edge
  w: number;
  h: number;
  units: number;
}
interface Particle {
  x: number;
  y: number;
  w: number;
}
interface Cloud {
  x: number;
  y: number;
}
interface Engine {
  lift: number; // height of the character's feet above the ground
  vy: number; // upward velocity
  speed: number;
  distance: number;
  ducking: boolean;
  obstacles: Obstacle[];
  sinceSpawn: number;
  nextGap: number;
  particles: Particle[];
  clouds: Cloud[];
  runClock: number;
}
interface Sprite {
  img: HTMLImageElement | null;
  ok: boolean;
}
type NetInfo = EventTarget & { effectiveType?: string; rtt?: number };
type NavigatorWithConnection = Navigator & { connection?: NetInfo };

export interface OfflineRunnerProps {
  /** Path to your avatar sprite (transparent PNG facing right). */
  avatarSrc?: string;
  /** Optional dedicated ducking sprite. Falls back to a squashed avatar. */
  duckSrc?: string;
  theme?: 'light' | 'dark';
  /** Open the game full-screen on slow connections too (default: banner only). */
  autoOpenOnSlow?: boolean;
}

/* ------------------------------------------------------------------ */
/* Engine helpers                                                      */
/* ------------------------------------------------------------------ */

const scoreOf = (e: Engine) => Math.floor(e.distance * SCORE_PER_PX);

function makeEngine(width: number): Engine {
  return {
    lift: 0,
    vy: 0,
    speed: START_SPEED,
    distance: 0,
    ducking: false,
    obstacles: [],
    sinceSpawn: 0,
    nextGap: 300,
    runClock: 0,
    particles: Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: GROUND_Y + 6 + Math.random() * 22,
      w: 1 + Math.random() * 3,
    })),
    clouds: Array.from({ length: 3 }, (_, i) => ({
      x: ((i + 0.3) * width) / 3 + Math.random() * 60,
      y: 28 + Math.random() * 50,
    })),
  };
}

function spawn(e: Engine, width: number) {
  const birdsAllowed = scoreOf(e) >= BIRD_UNLOCK_SCORE;
  if (birdsAllowed && Math.random() < 0.35) {
    // Low bird: duck (or jump). High bird: just run underneath.
    const high = Math.random() < 0.5;
    const h = 26;
    const bottom = high ? GROUND_Y - 70 : GROUND_Y - 38;
    e.obstacles.push({ kind: 'bird', x: width + 20, y: bottom - h, w: 34, h, units: 1 });
  } else {
    const units = 1 + Math.floor(Math.random() * 3);
    const h = 34 + Math.random() * 20;
    e.obstacles.push({
      kind: 'cactus',
      x: width + 20,
      y: GROUND_Y - h,
      w: units * 20 - 2,
      h,
      units,
    });
  }
}

/** Advance the simulation. Returns true on collision. */
function step(e: Engine, dt: number, width: number): boolean {
  e.speed = Math.min(MAX_SPEED, e.speed + ACCEL * dt);
  e.distance += e.speed * dt;
  e.runClock += dt;

  // Jump / fall physics
  if (e.lift > 0 || e.vy > 0) {
    e.vy -= GRAVITY * (e.ducking ? FAST_FALL : 1) * dt;
    e.lift += e.vy * dt;
    if (e.lift <= 0) {
      e.lift = 0;
      e.vy = 0;
    }
  }

  // Scrolling
  const dx = e.speed * dt;
  for (const o of e.obstacles) o.x -= dx;
  e.obstacles = e.obstacles.filter((o) => o.x + o.w > -10);
  for (const p of e.particles) {
    p.x -= dx;
    if (p.x < -4) {
      p.x = width + Math.random() * 40;
      p.y = GROUND_Y + 6 + Math.random() * 22;
      p.w = 1 + Math.random() * 3;
    }
  }
  for (const c of e.clouds) {
    c.x -= dx * 0.15;
    if (c.x < -60) {
      c.x = width + Math.random() * 80;
      c.y = 28 + Math.random() * 50;
    }
  }

  // Spawning: random gap that always leaves time to land and re-jump
  e.sinceSpawn += dx;
  if (e.sinceSpawn >= e.nextGap) {
    spawn(e, width);
    e.sinceSpawn = 0;
    e.nextGap = e.speed * (0.75 + Math.random() * 0.95) + 140;
  }

  return collides(e);
}

/** AABB collision with a small forgiving inset on both boxes. */
function collides(e: Engine): boolean {
  const d = e.ducking && e.lift === 0 ? DUCK : STAND;
  const inset = 6;
  const px = PLAYER_X + inset;
  const py = GROUND_Y - e.lift - d.h + inset;
  const pw = d.w - inset * 2;
  const ph = d.h - inset * 2;
  return e.obstacles.some((o) => {
    const ox = o.x + 3;
    const oy = o.y + 3;
    const ow = o.w - 6;
    const oh = o.h - 6;
    return px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy;
  });
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

function loadSprite(src?: string): Sprite {
  const s: Sprite = { img: null, ok: false };
  if (!src) return s;
  const img = new Image();
  img.onload = () => {
    s.ok = img.naturalWidth > 0;
  };
  img.onerror = () => {
    s.ok = false;
  };
  img.src = src;
  s.img = img;
  return s;
}

function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const s = Math.min(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.drawImage(img, x + (w - dw) / 2, y + h - dh, dw, dh);
}

function drawFigure(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  duck: boolean,
  frame: number,
  ink: string,
) {
  ctx.fillStyle = ink;
  ctx.beginPath();
  if (duck) {
    ctx.arc(w - 14, 12, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(6, 14, w - 24, 14);
    ctx.fillRect(10, 28, 6, h - 28);
    ctx.fillRect(w - 28, 28, 6, h - 28 - (frame ? 0 : 3));
  } else {
    ctx.arc(w / 2, 10, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w / 2 - 8, 19, 16, 18);
    ctx.fillRect(w / 2 - 7, 37, 6, h - 37 - (frame ? 0 : 4));
    ctx.fillRect(w / 2 + 2, 37, 6, h - 37 - (frame ? 4 : 0));
  }
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  e: Engine,
  status: Status,
  sprites: { avatar: Sprite; duck: Sprite },
  ink: string,
) {
  const airborne = e.lift > 0;
  const duck = e.ducking && !airborne;
  const d = duck ? DUCK : STAND;
  const top = GROUND_Y - e.lift - d.h;
  const running = status === 'running' && !airborne;
  const frame = running ? Math.floor(e.runClock / 0.11) % 2 : 0;

  ctx.save();
  // Pivot around the feet so the run cycle rocks the character, not the ground.
  ctx.translate(PLAYER_X + d.w / 2, top + d.h);
  if (running) {
    ctx.translate(0, frame ? -2 : 0);
    ctx.rotate(frame ? 0.05 : -0.05);
  } else if (airborne) {
    ctx.rotate(-0.06);
  }
  ctx.translate(-d.w / 2, -d.h);

  const { avatar, duck: duckSprite } = sprites;
  if (duck && duckSprite.ok && duckSprite.img) {
    drawContain(ctx, duckSprite.img, 0, 0, d.w, d.h);
  } else if (avatar.ok && avatar.img) {
    if (duck) {
      // No duck sprite: squash the avatar into a crouch.
      ctx.translate(0, d.h);
      ctx.rotate(0.12);
      ctx.scale(1.15, 0.62);
      drawContain(ctx, avatar.img, 0, -STAND.h, STAND.w, STAND.h);
    } else {
      drawContain(ctx, avatar.img, 0, 0, d.w, d.h);
    }
  } else {
    drawFigure(ctx, d.w, d.h, duck, frame, ink);
  }
  ctx.restore();
}

function drawCactus(ctx: CanvasRenderingContext2D, o: Obstacle) {
  for (let u = 0; u < o.units; u++) {
    const ux = o.x + u * 20;
    ctx.fillRect(ux + 5, o.y, 8, o.h); // trunk
    const armY = o.y + o.h * 0.4;
    ctx.fillRect(ux, armY, 6, 4); // left arm
    ctx.fillRect(ux, armY - 10, 4, 14);
    ctx.fillRect(ux + 12, armY + 6, 6, 4); // right arm
    ctx.fillRect(ux + 14, armY - 4, 4, 14);
  }
}

function drawBird(ctx: CanvasRenderingContext2D, o: Obstacle, clock: number) {
  const up = Math.floor(clock / 0.14) % 2 === 0;
  ctx.fillRect(o.x + 8, o.y + 10, 22, 8); // body
  ctx.fillRect(o.x, o.y + 9, 9, 5); // beak
  ctx.fillRect(o.x + 26, o.y + 8, 8, 4); // tail
  ctx.beginPath(); // wing
  if (up) {
    ctx.moveTo(o.x + 12, o.y + 10);
    ctx.lineTo(o.x + 24, o.y + 10);
    ctx.lineTo(o.x + 18, o.y);
  } else {
    ctx.moveTo(o.x + 12, o.y + 18);
    ctx.lineTo(o.x + 24, o.y + 18);
    ctx.lineTo(o.x + 18, o.y + 26);
  }
  ctx.closePath();
  ctx.fill();
}

function draw(
  ctx: CanvasRenderingContext2D,
  e: Engine,
  status: Status,
  width: number,
  hi: number,
  sprites: { avatar: Sprite; duck: Sprite },
  pal: { ink: string; mute: string },
) {
  ctx.clearRect(0, 0, width, VIEW_H);

  // Clouds
  ctx.fillStyle = pal.mute;
  ctx.globalAlpha = 0.25;
  for (const c of e.clouds) {
    ctx.fillRect(c.x, c.y, 46, 10);
    ctx.fillRect(c.x + 10, c.y - 6, 24, 8);
  }
  ctx.globalAlpha = 1;

  // Ground + particles
  ctx.fillStyle = pal.ink;
  ctx.fillRect(0, GROUND_Y, width, 2);
  ctx.globalAlpha = 0.45;
  for (const p of e.particles) ctx.fillRect(p.x, p.y, p.w, 2);
  ctx.globalAlpha = 1;

  // Obstacles
  ctx.fillStyle = pal.ink;
  for (const o of e.obstacles) {
    if (o.kind === 'cactus') drawCactus(ctx, o);
    else drawBird(ctx, o, e.runClock);
  }

  drawPlayer(ctx, e, status, sprites, pal.ink);

  // HUD (top right): HI 00000  00000
  ctx.font = `16px ${MONO}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  const cur = String(scoreOf(e)).padStart(5, '0');
  const best = `HI ${String(hi).padStart(5, '0')}`;
  ctx.fillStyle = pal.ink;
  ctx.fillText(cur, width - 16, 28);
  const curW = ctx.measureText(cur).width;
  ctx.globalAlpha = 0.55;
  ctx.fillText(best, width - 16 - curW - 18, 28);
  ctx.globalAlpha = 1;

  // Centre messages
  ctx.textAlign = 'center';
  ctx.fillStyle = pal.ink;
  if (status === 'ready') {
    ctx.font = `14px ${MONO}`;
    ctx.fillText('Press Space or tap to start', width / 2, 96);
  } else if (status === 'over') {
    ctx.font = `bold 22px ${MONO}`;
    ctx.fillText('GAME OVER', width / 2, 84);
    ctx.font = `14px ${MONO}`;
    ctx.fillText('Press Space to Restart', width / 2, 112);
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function OfflineRunner({
  avatarSrc = '/photos/avatar-runner.png',
  duckSrc,
  theme = 'light',
  autoOpenOnSlow = false,
}: OfflineRunnerProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<Reason>('manual');
  const [online, setOnline] = useState(true);
  const [slow, setSlow] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [status, setStatus] = useState<Status>('ready');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<Status>('ready');
  const duckRef = useRef(false);
  const pressRef = useRef<() => void>(() => {});

  const pal = PALETTES[theme];

  /* ---- Network detection (offline / online / slow) ---- */
  useEffect(() => {
    const conn = (navigator as NavigatorWithConnection).connection;
    const readSlow = () =>
      !!conn &&
      (conn.effectiveType === 'slow-2g' ||
        conn.effectiveType === '2g' ||
        (conn.rtt ?? 0) > 1500);

    const goOffline = () => {
      setOnline(false);
      setReason('offline');
      setBannerDismissed(false);
      setOpen(true);
    };
    const goOnline = () => {
      setOnline(true);
      setBannerDismissed(false);
    };
    const onConnChange = () => {
      const s = readSlow();
      setSlow(s);
      setBannerDismissed(false);
      if (s && autoOpenOnSlow && navigator.onLine) {
        setReason('slow');
        setOpen(true);
      }
    };

    const initialSync = window.setTimeout(() => {
      setOnline(navigator.onLine);
      onConnChange();
      if (!navigator.onLine) goOffline();
    }, 0);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    conn?.addEventListener('change', onConnChange);
    return () => {
      window.clearTimeout(initialSync);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
      conn?.removeEventListener('change', onConnChange);
    };
  }, [autoOpenOnSlow]);

  /* ---- Focus management + scroll lock while open ---- */
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open]);

  /* ---- Game loop, input, resize ---- */
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !wrap || !ctx) return;

    const palette = PALETTES[theme];
    const sprites = { avatar: loadSprite(avatarSrc), duck: loadSprite(duckSrc) };

    let hi = 0;
    try {
      hi = Number(localStorage.getItem(HI_KEY)) || 0;
    } catch {
      /* storage unavailable (private mode etc.) */
    }

    let width = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = Math.max(280, Math.min(wrap.clientWidth, 900));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(VIEW_H * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${VIEW_H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let engine = makeEngine(width);
    let diedAt = 0;
    const changeStatus = (s: Status) => {
      statusRef.current = s;
      setStatus(s);
    };
    changeStatus('ready');

    const press = () => {
      const s = statusRef.current;
      if (s === 'over') {
        if (performance.now() - diedAt < 350) return; // avoid instant accidental restart
        engine = makeEngine(width);
        changeStatus('running');
      } else if (s === 'ready') {
        changeStatus('running');
      }
      if (engine.lift === 0 && engine.vy === 0) engine.vy = JUMP_V;
    };
    pressRef.current = press;

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      engine.ducking = duckRef.current;

      if (statusRef.current === 'running' && step(engine, dt, width)) {
        diedAt = now;
        const sc = scoreOf(engine);
        if (sc > hi) {
          hi = sc;
          try {
            localStorage.setItem(HI_KEY, String(hi));
          } catch {
            /* ignore */
          }
        }
        changeStatus('over');
      }

      draw(ctx, engine, statusRef.current, width, hi, sprites, palette);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.code === 'Space' || ev.code === 'ArrowUp') {
        ev.preventDefault();
        press();
      } else if (ev.code === 'ArrowDown') {
        ev.preventDefault();
        duckRef.current = true;
      } else if (ev.code === 'Escape') {
        setOpen(false);
      }
    };
    const onKeyUp = (ev: KeyboardEvent) => {
      if (ev.code === 'ArrowDown') duckRef.current = false;
      // Stops a focused button from being "clicked" by the Space key-up.
      if (ev.code === 'Space' || ev.code === 'ArrowUp' || ev.code === 'ArrowDown') {
        ev.preventDefault();
      }
    };
    const onBlur = () => {
      duckRef.current = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', resize);
    window.addEventListener('blur', onBlur);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', resize);
      window.removeEventListener('blur', onBlur);
      pressRef.current = () => {};
      duckRef.current = false;
      for (const s of [sprites.avatar, sprites.duck]) {
        if (s.img) {
          s.img.onload = null;
          s.img.onerror = null;
        }
      }
    };
  }, [open, avatarSrc, duckSrc, theme]);

  const openManually = () => {
    setReason('manual');
    setOpen(true);
  };

  const heading = !online
    ? 'Connection lost. Press Space to run!'
    : reason === 'offline'
      ? "You're back online. Keep running or close this."
      : reason === 'slow'
        ? 'Slow connection. Press Space to run!'
        : 'Take a break. Press Space to run!';

  const cssVars = {
    '--ofr-bg': pal.bg,
    '--ofr-ink': pal.ink,
    '--ofr-mute': pal.mute,
  } as React.CSSProperties;

  return (
    <>
      <style>{CSS}</style>

      {!open && (
        <button
          type="button"
          className="ofr-egg"
          onClick={openManually}
          aria-label="Play the hidden runner game"
          title="Psst. Want to play?"
        >
          🏃
        </button>
      )}

      {!open && (!online || slow) && !bannerDismissed && (
        <div className="ofr-banner" role="status" style={cssVars}>
          <span>{!online ? "You're offline." : 'Slow connection detected.'}</span>
          <button type="button" onClick={openManually}>
            Play while you wait
          </button>
          <button
            type="button"
            className="ofr-banner-x"
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {open && (
        <div
          ref={dialogRef}
          className="ofr-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Offline runner game"
          tabIndex={-1}
          style={cssVars}
        >
          <button type="button" className="ofr-close" onClick={() => setOpen(false)}>
            Close (Esc)
          </button>

          <h2 className="ofr-title" aria-live="polite">
            {heading}
          </h2>

          <div
            ref={wrapRef}
            className="ofr-stage"
            onPointerDown={() => pressRef.current()}
          >
            <canvas
              ref={canvasRef}
              aria-label={
                status === 'over' ? 'Game over. Press Space to restart.' : 'Runner game canvas'
              }
            />
          </div>

          <p className="ofr-hint">Space / ↑ jump · ↓ duck · tap to jump</p>

          <button
            type="button"
            className="ofr-duck"
            onPointerDown={(e) => {
              e.stopPropagation();
              duckRef.current = true;
            }}
            onPointerUp={() => (duckRef.current = false)}
            onPointerLeave={() => (duckRef.current = false)}
            onPointerCancel={() => (duckRef.current = false)}
          >
            Hold to duck
          </button>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const CSS = `
.ofr-egg{position:fixed;left:10px;bottom:10px;z-index:9990;width:28px;height:28px;border:0;border-radius:50%;background:transparent;font-size:15px;line-height:1;cursor:pointer;opacity:.12;transition:opacity .2s}
.ofr-egg:hover,.ofr-egg:focus-visible{opacity:1}
.ofr-banner{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:9998;display:flex;align-items:center;gap:12px;max-width:calc(100vw - 24px);padding:8px 8px 8px 14px;border:1px solid var(--ofr-mute);border-radius:8px;background:var(--ofr-bg);color:var(--ofr-ink);font:14px/1.3 ${MONO}}
.ofr-banner button{font:inherit;color:inherit;background:transparent;border:1px solid var(--ofr-ink);border-radius:6px;padding:4px 10px;cursor:pointer}
.ofr-banner .ofr-banner-x{border-color:transparent;padding:4px 8px}
.ofr-overlay{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px 16px;background:var(--ofr-bg);color:var(--ofr-ink);font-family:${MONO};outline:none}
.ofr-title{margin:0;max-width:90vw;text-align:center;font:500 clamp(18px,3.2vw,26px)/1.3 ${MONO}}
.ofr-stage{width:100%;max-width:900px;touch-action:manipulation;user-select:none;-webkit-user-select:none;cursor:pointer}
.ofr-stage canvas{display:block;margin:0 auto}
.ofr-hint{margin:0;font-size:13px;color:var(--ofr-mute)}
.ofr-close{position:absolute;top:14px;right:14px;font:13px ${MONO};color:var(--ofr-ink);background:transparent;border:1px solid var(--ofr-mute);border-radius:6px;padding:6px 12px;cursor:pointer}
.ofr-close:focus-visible,.ofr-duck:focus-visible,.ofr-banner button:focus-visible,.ofr-egg:focus-visible{outline:2px solid var(--ofr-ink);outline-offset:2px}
.ofr-duck{display:none;font:14px ${MONO};color:var(--ofr-ink);background:transparent;border:1px solid var(--ofr-ink);border-radius:8px;padding:12px 22px;touch-action:none;user-select:none;-webkit-user-select:none}
@media (pointer:coarse){.ofr-duck{display:inline-block}}
`;