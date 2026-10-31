'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';

type GameMode = 'ready' | 'playing' | 'gameover';
type RewardType = 'bonus' | 'shield';

type Pipe = {
  x: number;
  gapTop: number;
  gapHeight: number;
  passed: boolean;
};

type Badge = {
  x: number;
  y: number;
  label: 'React' | 'Python' | 'C++' | 'Next.js';
  reward: RewardType;
  collected: boolean;
  phase: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  ttl: number;
  color: string;
  size: number;
};

type GameToast = {
  text: string;
  expiresAt: number;
  color: string;
};

type NetworkInfo = EventTarget & { effectiveType?: string; rtt?: number };
type NavigatorWithConnection = Navigator & { connection?: NetworkInfo };

type GameState = {
  width: number;
  height: number;
  mode: GameMode;
  bird: { x: number; y: number; vy: number };
  pipes: Pipe[];
  badges: Badge[];
  particles: Particle[];
  score: number;
  shieldUntil: number;
  shieldCharges: number;
  invulnerableUntil: number;
  toast: GameToast | null;
  achievements: Set<number>;
  lastFrame: number;
  lastHudUpdate: number;
};

const STORAGE_KEY = 'portfolio-flappy:hi';
const PIPE_WIDTH = 78;
const BIRD_SIZE = 25;
const GRAVITY = 880;
const JUMP_VELOCITY = -315;
const PIPE_SPEED = 152;
const GROUND_HEIGHT = 22;
const CYAN = '#00f3ff';
const LIME = '#c8f537';
const BADGE_LABELS: Badge['label'][] = ['React', 'Python', 'C++', 'Next.js'];
const ACHIEVEMENTS = [
  { score: 10, text: 'Delhi Sudarshan Engine Sync!' },
  { score: 25, text: 'S.E.T.U. Pipeline Activated!' },
  { score: 50, text: 'Full Stack Architecture Mastered!' },
] as const;

function randomBetween(min: number, max: number): number {
  return min + Math.random() * Math.max(0, max - min);
}

function createGame(width = 0, height = 0): GameState {
  return {
    width,
    height,
    mode: 'ready',
    bird: { x: width * 0.26, y: height * 0.48, vy: 0 },
    pipes: [],
    badges: [],
    particles: [],
    score: 0,
    shieldUntil: 0,
    shieldCharges: 0,
    invulnerableUntil: 0,
    toast: null,
    achievements: new Set<number>(),
    lastFrame: 0,
    lastHudUpdate: 0,
  };
}

function createPipe(width: number, height: number, x: number): Pipe {
  const groundY = height - GROUND_HEIGHT;
  const gapHeight = Math.min(166, Math.max(110, height * 0.38));
  const minTop = 30;
  const maxTop = Math.max(minTop, groundY - gapHeight - 30);
  return {
    x,
    gapTop: randomBetween(minTop, maxTop),
    gapHeight,
    passed: false,
  };
}

function jumpGame(current: GameState): GameState {
  let game = current;
  if (current.mode !== 'playing') {
    game = createGame(current.width, current.height);
    game.mode = 'playing';
    game.bird.x = game.width * 0.26;
    game.bird.y = game.height * 0.48;
    if (game.width > 0 && game.height > 0) {
      const firstPipeX = Math.max(game.width * 0.82, game.bird.x + 170);
      const firstPipe = createPipe(game.width, game.height, firstPipeX);
      game.pipes.push(firstPipe);
      if (Math.random() < 0.78) {
        game.badges.push({
          x: firstPipe.x + PIPE_WIDTH / 2,
          y: randomBetween(
            firstPipe.gapTop + 25,
            firstPipe.gapTop + firstPipe.gapHeight - 25,
          ),
          label: BADGE_LABELS[Math.floor(Math.random() * BADGE_LABELS.length)],
          reward: Math.random() < 0.65 ? 'bonus' : 'shield',
          collected: false,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  game.bird.vy = JUMP_VELOCITY;
  game.mode = 'playing';
  return game;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function showToast(
  game: GameState,
  text: string,
  now: number,
  color = LIME,
  duration = 2100,
): void {
  game.toast = { text, expiresAt: now + duration, color };
}

function addBurst(game: GameState, x: number, y: number, count = 12): void {
  const colors = [CYAN, LIME, '#ffffff', '#7c83ff'];
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(45, 210);
    const ttl = randomBetween(0.35, 0.9);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: ttl,
      ttl,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: randomBetween(2, 4.5),
    });
  }
}

function addConfetti(game: GameState): void {
  const colors = [CYAN, LIME, '#ffffff', '#7c83ff', '#ff6bd6'];
  const originX = game.width / 2;
  const originY = Math.max(24, game.height * 0.18);
  for (let i = 0; i < 76; i += 1) {
    const ttl = randomBetween(0.9, 1.7);
    game.particles.push({
      x: originX + randomBetween(-game.width * 0.28, game.width * 0.28),
      y: originY + randomBetween(-20, 28),
      vx: randomBetween(-190, 190),
      vy: randomBetween(-290, -65),
      life: ttl,
      ttl,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: randomBetween(3, 6),
    });
  }
}

function drawPillar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  isTop: boolean,
): void {
  if (height <= 1) return;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 243, 255, 0.35)';
  ctx.shadowBlur = 13;
  ctx.fillStyle = '#111923';
  ctx.fillRect(x, y, width, height);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.95)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 0.75, y + 0.75, width - 1.5, Math.max(0, height - 1.5));

  // Circuit-like rack separators make each obstacle feel like a compiler/server block.
  ctx.strokeStyle = 'rgba(200, 245, 55, 0.42)';
  ctx.lineWidth = 1;
  for (let lineY = y + 42; lineY < y + height - 16; lineY += 42) {
    ctx.beginPath();
    ctx.moveTo(x + 8, lineY);
    ctx.lineTo(x + width - 8, lineY);
    ctx.stroke();
    ctx.fillStyle = CYAN;
    ctx.fillRect(x + 8, lineY - 2, 4, 4);
    ctx.fillStyle = LIME;
    ctx.fillRect(x + width - 12, lineY - 2, 4, 4);
  }

  const capY = isTop ? y + height - 13 : y;
  const capHeight = Math.min(13, height);
  ctx.fillStyle = '#182531';
  ctx.fillRect(x - 3, capY, width + 6, capHeight);
  ctx.strokeStyle = LIME;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 3, capY, width + 6, capHeight);

  if (height > 62) {
    const labelY = isTop ? y + height - 28 : y + 31;
    ctx.fillStyle = '#091116';
    ctx.fillRect(x + 4, labelY - 12, width - 8, 17);
    ctx.fillStyle = LIME;
    ctx.font = 'bold 8px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + width / 2, labelY - 3, width - 12);
  }

  ctx.restore();
}

function drawBadge(ctx: CanvasRenderingContext2D, badge: Badge, now: number): void {
  if (badge.collected) return;
  const bob = Math.sin(now / 230 + badge.phase) * 3;
  const labelWidths: Record<Badge['label'], number> = {
    React: 45,
    Python: 50,
    'C++': 38,
    'Next.js': 54,
  };
  const width = labelWidths[badge.label];
  const x = badge.x - width / 2;
  const y = badge.y + bob - 11;

  ctx.save();
  ctx.shadowColor = badge.reward === 'shield' ? LIME : CYAN;
  ctx.shadowBlur = 12;
  roundedRect(ctx, x, y, width, 22, 7);
  ctx.fillStyle = '#0a121a';
  ctx.fill();
  ctx.strokeStyle = badge.reward === 'shield' ? LIME : CYAN;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#f5fbff';
  ctx.font = 'bold 9px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(badge.label, badge.x, badge.y + bob, width - 6);
  ctx.restore();
}

function drawBird(
  ctx: CanvasRenderingContext2D,
  game: GameState,
  avatar: HTMLImageElement,
  now: number,
): void {
  const { x, y } = game.bird;
  const isInvulnerable = now < game.invulnerableUntil;
  const shieldActive = game.shieldCharges > 0 && now < game.shieldUntil;

  ctx.save();
  if (isInvulnerable && Math.floor(now / 90) % 2 === 0) ctx.globalAlpha = 0.42;

  if (shieldActive) {
    ctx.beginPath();
    ctx.arc(x, y, 22 + Math.sin(now / 80) * 2, 0, Math.PI * 2);
    ctx.strokeStyle = LIME;
    ctx.lineWidth = 2;
    ctx.shadowColor = LIME;
    ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Short motion trails keep the avatar readable against the dark grid.
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.7)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(x - 17 - i * 5, y + 3 + i * 4);
    ctx.lineTo(x - 8 - i * 5, y + 3 + i * 4);
    ctx.stroke();
  }

  if (avatar.complete && avatar.naturalWidth > 0) {
    ctx.shadowColor = CYAN;
    ctx.shadowBlur = 13;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(avatar, x - 15, y - 15, 30, 30);
  } else {
    const glow = ctx.createRadialGradient(x - 4, y - 5, 2, x, y, 19);
    glow.addColorStop(0, '#e8ffff');
    glow.addColorStop(0.48, CYAN);
    glow.addColorStop(1, '#116b7a');
    ctx.shadowColor = CYAN;
    ctx.shadowBlur = 15;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#dfffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(x + 3, y - 4, 3, 3);
    ctx.fillRect(x + 8, y - 4, 3, 3);
    ctx.fillStyle = LIME;
    ctx.fillRect(x + 4, y + 4, 7, 2);
  }
  ctx.restore();
}

function drawToast(ctx: CanvasRenderingContext2D, toast: GameToast, width: number, now: number): void {
  if (now >= toast.expiresAt) return;
  const remaining = toast.expiresAt - now;
  const alpha = Math.min(1, remaining / 260, (2100 - remaining) / 220 + 1);
  ctx.save();
  ctx.globalAlpha = Math.max(0.15, Math.min(1, alpha));
  ctx.font = 'bold 12px ui-monospace, SFMono-Regular, Menlo, monospace';
  const boxWidth = Math.min(width - 24, Math.max(220, ctx.measureText(toast.text).width + 34));
  const boxX = (width - boxWidth) / 2;
  roundedRect(ctx, boxX, 14, boxWidth, 36, 9);
  ctx.fillStyle = 'rgba(5, 13, 19, 0.94)';
  ctx.fill();
  ctx.strokeStyle = toast.color;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = toast.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(toast.text, width / 2, 32, boxWidth - 18);
  ctx.restore();
}

function drawGame(
  ctx: CanvasRenderingContext2D,
  game: GameState,
  avatar: HTMLImageElement,
  now: number,
): void {
  const { width, height } = game;
  if (!width || !height) return;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.075)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  game.pipes.forEach((pipe, index) => {
    const topLabel = ['502 BAD', '404 MISS', 'NULL PTR', 'BUILD ERR'][index % 4];
    const bottomLabel = ['</>', '{ }', 'RETRY', 'COMPILE'][index % 4];
    drawPillar(ctx, pipe.x, 0, PIPE_WIDTH, pipe.gapTop, topLabel, true);
    drawPillar(
      ctx,
      pipe.x,
      pipe.gapTop + pipe.gapHeight,
      PIPE_WIDTH,
      height - GROUND_HEIGHT - (pipe.gapTop + pipe.gapHeight),
      bottomLabel,
      false,
    );
  });

  game.badges.forEach((badge) => drawBadge(ctx, badge, now));

  const groundY = height - GROUND_HEIGHT;
  ctx.fillStyle = '#121d26';
  ctx.fillRect(0, groundY, width, GROUND_HEIGHT);
  ctx.fillStyle = CYAN;
  ctx.fillRect(0, groundY, width, 2);
  ctx.fillStyle = 'rgba(200, 245, 55, 0.45)';
  for (let x = -((now / 8) % 28); x < width; x += 28) {
    ctx.fillRect(x, groundY + 8, 13, 2);
  }

  drawBird(ctx, game, avatar, now);

  game.particles.forEach((particle) => {
    const alpha = Math.max(0, Math.min(1, particle.life / particle.ttl));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 8;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size * 1.4);
    ctx.restore();
  });

  if (game.mode === 'ready') {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(4, 11, 17, 0.66)';
    roundedRect(ctx, width / 2 - Math.min(170, width * 0.38), height * 0.39, Math.min(340, width * 0.76), 78, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.55)';
    ctx.stroke();
    ctx.fillStyle = LIME;
    ctx.font = 'bold 13px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText('OFFLINE MODE // READY', width / 2, height * 0.39 + 26);
    ctx.fillStyle = '#e6f7ff';
    ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText('SPACE / ↑ / TAP TO BOOT', width / 2, height * 0.39 + 51);
    ctx.restore();
  } else if (game.mode === 'gameover') {
    ctx.save();
    ctx.fillStyle = 'rgba(4, 8, 13, 0.72)';
    ctx.fillRect(0, 0, width, height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ff6b8a';
    ctx.font = 'bold 23px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText('PROCESS CRASHED', width / 2, height * 0.41);
    ctx.fillStyle = '#e7f5fb';
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText('TAP / SPACE TO RESTART', width / 2, height * 0.41 + 34);
    ctx.restore();
  }

  if (game.toast) drawToast(ctx, game.toast, width, now);
}

export default function FlappyPortfolio() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shieldText, setShieldText] = useState('');
  const [online, setOnline] = useState(true);
  const [slow, setSlow] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<GameState>(createGame());
  const isOpenRef = useRef(false);
  const highScoreRef = useRef(0);
  const restoreTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearRestoreTimers = useCallback(() => {
    if (restoreTimerRef.current !== null) {
      window.clearTimeout(restoreTimerRef.current);
      restoreTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const resetGame = useCallback(() => {
    const current = gameRef.current;
    gameRef.current = createGame(current.width, current.height);
    setScore(0);
    setShieldText('');
  }, []);

  const closeGame = useCallback(() => {
    clearRestoreTimers();
    isOpenRef.current = false;
    setIsOpen(false);
    setIsClosing(false);
    setIsRestoring(false);
    setShieldText('');
    document.body.style.overflow = 'unset';
  }, [clearRestoreTimers]);

  const openGame = useCallback(() => {
    clearRestoreTimers();
    resetGame();
    try {
      const stored = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
      const safeScore = Number.isFinite(stored) && stored >= 0 ? Math.floor(stored) : 0;
      highScoreRef.current = safeScore;
      setHighScore(safeScore);
    } catch {
      // Storage can be disabled; the game remains playable for this session.
    }
    isOpenRef.current = true;
    setIsClosing(false);
    setIsRestoring(false);
    setIsOpen(true);
  }, [clearRestoreTimers, resetGame]);

  const jumpOrRestart = useCallback(() => {
    if (!isOpenRef.current) return;

    const current = gameRef.current;
    const game = jumpGame(current);
    if (game !== current) {
      gameRef.current = game;
      setScore(0);
      setShieldText('');
    }
  }, []);

  const handleCanvasPointerDown = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      event.preventDefault();
      jumpOrRestart();
    },
    [jumpOrRestart],
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isOpenRef.current) return;
      if (event.code === 'Escape') {
        event.preventDefault();
        closeGame();
        return;
      }
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        if (!event.repeat) jumpOrRestart();
      }
    };

    const onOffline = () => {
      setOnline(false);
      setBannerDismissed(false);
      if (!isOpenRef.current) openGame();
    };

    const onOnline = () => {
      setOnline(true);
      setBannerDismissed(false);
      if (!isOpenRef.current) return;
      clearRestoreTimers();
      setIsRestoring(true);
      setIsClosing(false);
      const game = gameRef.current;
      addConfetti(game);
      showToast(game, 'CONNECTION RESTORED // SYNCING', performance.now(), CYAN, 1500);

      restoreTimerRef.current = window.setTimeout(() => {
        setIsClosing(true);
        closeTimerRef.current = window.setTimeout(() => {
          isOpenRef.current = false;
          setIsOpen(false);
          setIsClosing(false);
          setIsRestoring(false);
          setShieldText('');
          document.body.style.overflow = 'unset';
          restoreTimerRef.current = null;
          closeTimerRef.current = null;
        }, 350);
      }, 1150);
    };

    const connection = (navigator as NavigatorWithConnection).connection;
    const readSlow = () =>
      !!connection &&
      (connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        (connection.rtt ?? 0) > 1500);
    const onConnectionChange = () => {
      const isSlow = readSlow();
      setSlow(isSlow);
      setBannerDismissed(false);
      if (isSlow && navigator.onLine && !isOpenRef.current) openGame();
    };
    const initialSync = window.setTimeout(() => {
      setOnline(navigator.onLine);
      onConnectionChange();
      if (!navigator.onLine) onOffline();
    }, 0);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    connection?.addEventListener('change', onConnectionChange);

    return () => {
      window.clearTimeout(initialSync);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
      connection?.removeEventListener('change', onConnectionChange);
      clearRestoreTimers();
    };
  }, [clearRestoreTimers, closeGame, jumpOrRestart, openGame]);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let frameId = 0;
    let disposed = false;
    const avatar = new Image();
    avatar.src = '/photos/avatar-runner.png';

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const game = gameRef.current;
      if (!game.width || !game.height) {
        game.width = rect.width;
        game.height = rect.height;
        game.bird.x = rect.width * 0.26;
        game.bird.y = rect.height * 0.48;
        return;
      }
      const scaleX = rect.width / game.width;
      const scaleY = rect.height / game.height;
      game.bird.x *= scaleX;
      game.bird.y *= scaleY;
      game.pipes.forEach((pipe) => {
        pipe.x *= scaleX;
        pipe.gapTop *= scaleY;
        pipe.gapHeight *= scaleY;
      });
      game.badges.forEach((badge) => {
        badge.x *= scaleX;
        badge.y *= scaleY;
      });
      game.particles.forEach((particle) => {
        particle.x *= scaleX;
        particle.y *= scaleY;
      });
      game.width = rect.width;
      game.height = rect.height;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('resize', resize);

    const recordScore = (game: GameState, nextScore: number, now: number) => {
      const previousScore = game.score;
      game.score = nextScore;
      setScore(nextScore);

      if (nextScore > highScoreRef.current) {
        highScoreRef.current = nextScore;
        setHighScore(nextScore);
        try {
          window.localStorage.setItem(STORAGE_KEY, String(nextScore));
        } catch {
          // Ignore storage quota/privacy errors; current score still works.
        }
      }

      for (const achievement of ACHIEVEMENTS) {
        if (
          previousScore < achievement.score &&
          nextScore >= achievement.score &&
          !game.achievements.has(achievement.score)
        ) {
          game.achievements.add(achievement.score);
          showToast(game, achievement.text, now, LIME, 2400);
        }
      }
    };

    const spawnBadgeForPipe = (game: GameState, pipe: Pipe) => {
      if (Math.random() > 0.72) return;
      game.badges.push({
        x: pipe.x + PIPE_WIDTH / 2,
        y: randomBetween(pipe.gapTop + 25, pipe.gapTop + pipe.gapHeight - 25),
        label: BADGE_LABELS[Math.floor(Math.random() * BADGE_LABELS.length)],
        reward: Math.random() < 0.65 ? 'bonus' : 'shield',
        collected: false,
        phase: Math.random() * Math.PI * 2,
      });
    };

    const endGame = (game: GameState) => {
      game.mode = 'gameover';
      setShieldText('');
    };

    const frame = (now: number) => {
      if (disposed) return;
      const game = gameRef.current;
      const dt = game.lastFrame ? Math.min((now - game.lastFrame) / 1000, 0.033) : 1 / 60;
      game.lastFrame = now;

      if (game.mode === 'playing') {
        const groundY = game.height - GROUND_HEIGHT;
        game.bird.vy += GRAVITY * dt;
        game.bird.y += game.bird.vy * dt;

        const spacing = Math.max(230, game.width * 0.62);
        const lastPipe = game.pipes[game.pipes.length - 1];
        if (!lastPipe || lastPipe.x < game.width - spacing) {
          const nextX = lastPipe ? lastPipe.x + spacing : game.width * 0.82;
          const nextPipe = createPipe(game.width, game.height, nextX);
          game.pipes.push(nextPipe);
          spawnBadgeForPipe(game, nextPipe);
        }

        game.pipes.forEach((pipe) => {
          pipe.x -= PIPE_SPEED * dt;
          if (!pipe.passed && pipe.x + PIPE_WIDTH < game.bird.x - BIRD_SIZE / 2) {
            pipe.passed = true;
            recordScore(game, game.score + 1, now);
          }
        });
        game.pipes = game.pipes.filter((pipe) => pipe.x + PIPE_WIDTH > -10);

        game.badges.forEach((badge) => {
          badge.x -= PIPE_SPEED * dt;
          if (badge.collected) return;
          const bob = Math.sin(now / 230 + badge.phase) * 3;
          const left = game.bird.x - BIRD_SIZE / 2;
          const right = game.bird.x + BIRD_SIZE / 2;
          const top = game.bird.y - BIRD_SIZE / 2;
          const bottom = game.bird.y + BIRD_SIZE / 2;
          const nearestX = Math.max(left, Math.min(badge.x, right));
          const nearestY = Math.max(top, Math.min(badge.y + bob, bottom));
          const dx = badge.x - nearestX;
          const dy = badge.y + bob - nearestY;
          if (dx * dx + dy * dy <= 15 * 15) {
            badge.collected = true;
            addBurst(game, badge.x, badge.y, 10);
            if (badge.reward === 'bonus') {
              recordScore(game, game.score + 5, now);
              showToast(game, `${badge.label.toUpperCase()} // +5 BONUS`, now, CYAN, 1500);
            } else {
              game.shieldUntil = now + 5000;
              game.shieldCharges = 1;
              setShieldText('5.0s · 1 HIT');
              showToast(game, `${badge.label.toUpperCase()} // 5s SHIELD`, now, LIME, 1600);
            }
          }
        });
        game.badges = game.badges.filter((badge) => !badge.collected && badge.x > -70);

        const birdLeft = game.bird.x - BIRD_SIZE / 2;
        const birdRight = game.bird.x + BIRD_SIZE / 2;
        const birdTop = game.bird.y - BIRD_SIZE / 2;
        const birdBottom = game.bird.y + BIRD_SIZE / 2;
        let collided = birdTop < 0 || birdBottom >= groundY;
        let collidedPipe: Pipe | null = null;

        for (const pipe of game.pipes) {
          const overlapsX = birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH;
          if (!overlapsX) continue;
          const hitsTop = birdTop < pipe.gapTop;
          const hitsBottom = birdBottom > pipe.gapTop + pipe.gapHeight;
          if (hitsTop || hitsBottom) {
            collided = true;
            collidedPipe = pipe;
            break;
          }
        }

        if (collided && now >= game.invulnerableUntil) {
          if (game.shieldCharges > 0 && now < game.shieldUntil) {
            game.shieldCharges = 0;
            game.invulnerableUntil = now + 900;
            if (birdTop < 0) game.bird.vy = 220;
            else if (birdBottom >= groundY) game.bird.vy = -260;
            else if (collidedPipe) {
              const gapCenter = collidedPipe.gapTop + collidedPipe.gapHeight / 2;
              game.bird.vy = game.bird.y < gapCenter ? 250 : -260;
            }
            addBurst(game, game.bird.x, game.bird.y, 20);
            showToast(game, 'SHIELD ABSORBED 1 HIT', now, LIME, 1600);
            setShieldText('SHIELD USED');
          } else {
            endGame(game);
          }
        }

        if (now - game.lastHudUpdate > 100) {
          game.lastHudUpdate = now;
          if (game.shieldCharges > 0 && now < game.shieldUntil) {
            setShieldText(`${Math.max(0, (game.shieldUntil - now) / 1000).toFixed(1)}s · 1 HIT`);
          } else if (game.shieldCharges === 0 && now >= game.shieldUntil) {
            setShieldText('');
          }
        }
      } else if (game.mode === 'ready') {
        game.bird.x = game.width * 0.26;
        game.bird.y = game.height * 0.48 + Math.sin(now / 420) * 5;
      }

      game.particles.forEach((particle) => {
        particle.life -= dt;
        particle.vy += 250 * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
      });
      game.particles = game.particles.filter((particle) => particle.life > 0);
      if (game.toast && now >= game.toast.expiresAt) game.toast = null;

      drawGame(ctx, game, avatar, now);
      frameId = window.requestAnimationFrame(frame);
    };

    frameId = window.requestAnimationFrame(frame);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      avatar.onload = null;
      avatar.onerror = null;
    };
  }, [isOpen]);

  return (
    <>
      {!isOpen && (!online || slow) && !bannerDismissed && (
        <div className="fixed left-1/2 top-3 z-[9998] flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-3 rounded-lg border border-slate-400 bg-[#f7f7f7] px-3 py-2 text-sm text-[#202124] shadow-lg" role="status">
          <span>{!online ? "You're offline." : 'Slow connection detected.'}</span>
          <button
            type="button"
            onClick={openGame}
            className="whitespace-nowrap rounded-md border border-[#202124] px-2 py-1"
          >
            Play while you wait
          </button>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            className="px-1"
            aria-label="Dismiss game notice"
          >
            ×
          </button>
        </div>
      )}
      {!isOpen && (
        <button
          type="button"
          onClick={openGame}
          className="fixed bottom-2 left-2 z-[9990] grid size-8 place-items-center rounded-full bg-[#0d1117]/80 text-sm opacity-25 transition hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          aria-label="Play Flappy Portfolio"
          title="Play Flappy Portfolio"
        >
          <span aria-hidden="true">🎮</span>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
            isClosing ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="flappy-portfolio-title"
        >
          <section className="relative flex h-full w-full max-w-none flex-col overflow-hidden border-0 bg-[#0d1117]">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
              <div>
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300/80">
                  Portfolio // Arcade
                </p>
                <h2 id="flappy-portfolio-title" className="text-base font-semibold text-white sm:text-xl">
                  Flap past compiler errors. Keep the build alive!
                </h2>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Dodge compiler errors, collect tech badges, and keep the build alive.
                </p>
              </div>
              <button
                type="button"
                onClick={closeGame}
                className="shrink-0 rounded-lg border border-white/15 px-3 py-2 font-mono text-xs text-slate-300 transition hover:border-cyan-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
                aria-label="Close Flappy Portfolio game"
              >
                ESC / CLOSE
              </button>
            </div>

            {isRestoring && (
              <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full border border-lime-300/60 bg-[#0d1117]/95 px-4 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-wide text-lime-200 shadow-[0_0_24px_rgba(200,245,55,0.22)] sm:text-xs">
                Connection Restored! Syncing session...
              </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col px-3 py-2 sm:px-5 sm:py-3">
              <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div className="flex items-center gap-4">
                  <span className="text-slate-400">SCORE <strong className="ml-1 text-lg text-white">{score}</strong></span>
                  <span className="text-slate-400">BEST <strong className="ml-1 text-lg text-lime-300">{highScore}</strong></span>
                </div>
                {shieldText && (
                  <span className="rounded-md border border-lime-300/40 bg-lime-300/10 px-2 py-1 text-lime-200">
                    {shieldText}
                  </span>
                )}
              </div>

              <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-cyan-300/20 bg-[#0d1117]">
                <canvas
                  ref={canvasRef}
                  onPointerDown={handleCanvasPointerDown}
                  className="block h-full w-full touch-none select-none"
                  aria-label="Flappy Portfolio game. Tap, press Space, or press Arrow Up to jump."
                />
                <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center font-mono text-[10px] font-bold tracking-[0.22em] text-cyan-100/80 md:hidden">
                  TAP TO JUMP
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 font-mono text-[10px] text-slate-500 sm:px-6 sm:py-4 sm:text-xs">
              <span>SPACE / ↑ / TAP: FLAP</span>
              <span>TECH BADGE: +5 OR 5s SHIELD</span>
              <span>ESC: CLOSE</span>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
