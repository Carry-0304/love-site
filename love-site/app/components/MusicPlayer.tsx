"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import LYRICS from "./lyrics";

// ---- Types ----
interface Particle {
  x: number;
  y: number;
  tx: number; // target x (on text)
  ty: number; // target y (on text)
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number; // color variation
  life: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  alpha: number;
  swayAmp: number;
  swayPhase: number;
}

// ---- Config ----
const CANVAS_W = 340;
const CANVAS_H = 180;
const PARTICLE_COUNT = 600;
const PETAL_COUNT = 25;

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [lyricIdx, setLyricIdx] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const petalsRef = useRef<Petal[]>([]);
  const rotationRef = useRef(0);
  const animRef = useRef(0);
  const initDoneRef = useRef(false);

  // ---- Audio init ----
  const initAndPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!initDoneRef.current) {
      audio.volume = 0.35;
      audio.loop = true;
      initDoneRef.current = true;
    }
    audio.play().then(() => {
      setPlaying(true);
      setShowLyrics(true);
    }).catch(() => setPlaying(false));
  }, []);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      initAndPlay();
    }
  }, [playing, initAndPlay]);

  // Auto-init on first interaction
  useEffect(() => {
    const handler = () => {
      if (initDoneRef.current && playing) return;
      initAndPlay();
    };
    document.addEventListener("click", handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true });
    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [initAndPlay, playing]);

  // ---- Lyrics sync ----
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      const t = audio.currentTime;
      let idx = 0;
      for (let i = LYRICS.length - 1; i >= 0; i--) {
        if (t >= LYRICS[i].time) {
          idx = i;
          break;
        }
      }
      setLyricIdx(idx);
    };
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, []);

  // ---- Create offscreen canvas for text sampling ----
  useEffect(() => {
    const off = document.createElement("canvas");
    off.width = CANVAS_W * 2;
    off.height = CANVAS_H * 2;
    offscreenRef.current = off;
    return () => { offscreenRef.current = null; };
  }, []);

  // ---- Initialize petals ----
  useEffect(() => {
    petalsRef.current = Array.from({ length: PETAL_COUNT }, () => ({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      size: 4 + Math.random() * 6,
      speedY: 0.2 + Math.random() * 0.5,
      speedX: -0.15 + Math.random() * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      alpha: 0.35 + Math.random() * 0.45,
      swayAmp: 0.3 + Math.random() * 0.6,
      swayPhase: Math.random() * Math.PI * 2,
    }));
  }, []);

  // ---- Main animation loop ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    // Offscreen for text sampling
    const off = offscreenRef.current;
    if (!off) return;
    const offCtx = off.getContext("2d")!;

    const sampleTextPixels = (): { x: number; y: number }[] => {
      offCtx.clearRect(0, 0, off.width, off.height);
      offCtx.font = `bold 40px "Dancing Script", "Noto Serif SC", serif`;
      offCtx.fillStyle = "#FFB6C1";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";

      // Draw with thick stroke for outline
      const lyric = LYRICS[lyricIdx]?.text || "";
      offCtx.strokeStyle = "#FFB6C1";
      offCtx.lineWidth = 3;
      offCtx.strokeText(lyric, off.width / 2, off.height / 2);
      offCtx.fillText(lyric, off.width / 2, off.height / 2);

      const imageData = offCtx.getImageData(0, 0, off.width, off.height);
      const pixels: { x: number; y: number }[] = [];
      const step = 4; // sample every N pixels
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          const idx = (y * off.width + x) * 4;
          if (imageData.data[idx + 3] > 40) {
            pixels.push({
              x: x / 2, // scale back to display canvas
              y: y / 2,
            });
          }
        }
      }
      return pixels;
    };

    // Rebuild particles when lyrics change
    let rebuildTimer = 0;
    const rebuildParticles = () => {
      const pixels = sampleTextPixels();
      if (pixels.length === 0) return;
      const current = particlesRef.current;

      // Keep existing particles, assign new targets
      pixels.forEach((p, i) => {
        if (i < current.length) {
          current[i].tx = p.x;
          current[i].ty = p.y;
        }
      });

      // Fill remaining with new particles
      const needed = Math.min(PARTICLE_COUNT, pixels.length);
      while (current.length < needed) {
        const rp = pixels[Math.floor(Math.random() * pixels.length)];
        current.push({
          x: rp.x + (Math.random() - 0.5) * 80,
          y: rp.y + (Math.random() - 0.5) * 80,
          tx: rp.x,
          ty: rp.y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: 0.8 + Math.random() * 2.2,
          alpha: 0.3 + Math.random() * 0.7,
          hue: 330 + Math.random() * 30, // pink range
          life: 60 + Math.random() * 240,
        });
      }

      // Trim excess
      while (current.length > needed) current.pop();
    };

    const animate = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Slow 360 rotation (full rotation every ~20 seconds)
      rotationRef.current += 0.003;
      const rot = rotationRef.current;

      ctx.save();
      ctx.translate(CANVAS_W / 2, CANVAS_H / 2);
      ctx.rotate(Math.sin(rot) * 0.08); // gentle sway, not full 360

      // ---- Draw particles ----
      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        // Spring toward target
        const dx = p.tx - CANVAS_W / 2 - p.x;
        const dy = p.ty - CANVAS_H / 2 - p.y;
        p.vx += dx * 0.003;
        p.vy += dy * 0.003;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        // Subtle orbit flow
        p.x += Math.sin(p.y * 0.02 + rot * 2) * 0.3;
        p.y += Math.cos(p.x * 0.02 + rot * 2) * 0.3;

        // Lifecycle
        p.life--;
        if (p.life <= 0) {
          p.life = 60 + Math.random() * 240;
          p.vx = (Math.random() - 0.5) * 0.8;
          p.vy = (Math.random() - 0.5) * 0.8;
        }

        // Glow
        const fade = Math.min(1, p.life / 30);
        const alpha = p.alpha * fade;
        if (alpha < 0.03) continue;

        // Outer glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 80%, ${alpha})`);
        grad.addColorStop(0.4, `hsla(${p.hue}, 90%, 70%, ${alpha * 0.5})`);
        grad.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // ---- Draw cherry blossom petals ----
      const pls = petalsRef.current;
      for (let i = 0; i < pls.length; i++) {
        const pt = pls[i];
        pt.y += pt.speedY;
        pt.x += pt.speedX + Math.sin(pt.y * 0.03 + pt.swayPhase) * pt.swayAmp;
        pt.rotation += pt.rotSpeed;

        if (pt.y > CANVAS_H + 20) {
          pt.y = -15;
          pt.x = Math.random() * CANVAS_W;
          pt.alpha = 0.35 + Math.random() * 0.45;
        }
        if (pt.x < -15) pt.x = CANVAS_W + 15;
        if (pt.x > CANVAS_W + 15) pt.x = -15;

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rotation);
        ctx.globalAlpha = pt.alpha;

        // Draw petal shape
        ctx.fillStyle = "#FFB6C1";
        ctx.beginPath();
        ctx.ellipse(0, 0, pt.size, pt.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Petal vein
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(0, -pt.size * 0.4);
        ctx.lineTo(0, pt.size * 0.4);
        ctx.stroke();

        ctx.restore();
      }

      // ---- Soft vignette ----
      const vignette = ctx.createRadialGradient(
        CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.35,
        CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.8
      );
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(255,182,193,0.06)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Rebuild particles periodically
      rebuildTimer++;
      if (rebuildTimer % 120 === 0) rebuildParticles();

      animRef.current = requestAnimationFrame(animate);
    };

    // Initial particle build
    rebuildParticles();
    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, [lyricIdx]);

  // ---- Handle window resize for mobile ----
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <audio
        ref={audioRef}
        src="/love-site/audio/bg-music.mp3"
        preload="auto"
        loop
      />

      {/* Lyrics canvas */}
      <div
        className={`fixed z-[9998] transition-all duration-700 ${
          showLyrics ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{
          bottom: isMobile ? "80px" : "90px",
          right: isMobile ? "8px" : "20px",
        }}
      >
        <div className="relative rounded-2xl overflow-hidden border border-rose-dried/15 backdrop-blur-sm"
          style={{
            width: isMobile ? "260px" : `${CANVAS_W}px`,
            height: isMobile ? "140px" : `${CANVAS_H}px`,
            background: "radial-gradient(ellipse at center, rgba(255,182,193,0.08) 0%, rgba(181,101,118,0.04) 50%, transparent 70%)",
            boxShadow: "0 8px 40px rgba(181,101,118,0.12), inset 0 0 60px rgba(255,182,193,0.06)",
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      {/* Play/Pause button */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border-2 border-rose-dried/30 shadow-xl flex items-center justify-center text-2xl cursor-pointer hover:scale-110 active:scale-95 hover:shadow-2xl hover:border-rose-deep/50 transition-all duration-300"
        style={{ boxShadow: "0 4px 30px rgba(181,101,118,0.25)" }}
        title={playing ? "暂停音乐 🎵" : "播放音乐 🎵"}
      >
        <span
          className={playing ? "animate-spin" : ""}
          style={{
            display: "inline-block",
            animationDuration: playing ? "3s" : "0s",
          }}
        >
          {playing ? "🎵" : "🎶"}
        </span>
      </button>
    </>
  );
}
