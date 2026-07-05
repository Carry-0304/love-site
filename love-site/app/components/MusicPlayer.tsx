"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import LYRICS from "./lyrics";

// ---- Types ----
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number; hue: number;
  life: number; maxLife: number;
}

interface Petal {
  x: number; y: number;
  size: number;
  speedY: number; speedX: number;
  rotation: number; rotSpeed: number;
  alpha: number;
  swayAmp: number; swayPhase: number;
}

// ---- Config ----
const PETAL_COUNT = 20;
const PARTICLE_COUNT = 150;

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [lyricIdx, setLyricIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(true); // safe default
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef(0);
  const initDoneRef = useRef(false);

  // ---- Detect mobile ----
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ---- Audio init ----
  const initAndPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!initDoneRef.current) {
      audio.volume = 0.35;
      audio.loop = true;
      initDoneRef.current = true;
    }
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      initAndPlay();
    }
  }, [playing, initAndPlay]);

  // Auto-init on first interaction anywhere on page
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

  // ---- Lyrics sync with audio ----
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      const t = audio.currentTime;
      let idx = 0;
      for (let i = LYRICS.length - 1; i >= 0; i--) {
        if (t >= LYRICS[i].time) { idx = i; break; }
      }
      setLyricIdx(idx);
    };
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, []);

  // ---- Init petals ----
  useEffect(() => {
    const w = isMobile ? 260 : 340;
    const h = isMobile ? 120 : 160;
    petalsRef.current = Array.from({ length: PETAL_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 4 + Math.random() * 7,
      speedY: 0.15 + Math.random() * 0.45,
      speedX: -0.2 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      alpha: 0.3 + Math.random() * 0.5,
      swayAmp: 0.2 + Math.random() * 0.5,
      swayPhase: Math.random() * Math.PI * 2,
    }));
  }, [isMobile]);

  // ---- Init floating particles ----
  useEffect(() => {
    const w = isMobile ? 260 : 340;
    const h = isMobile ? 120 : 160;
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 - 0.1,
      size: 1 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.5,
      hue: 330 + Math.random() * 30,
      life: Math.random() * 300,
      maxLife: 200 + Math.random() * 300,
    }));
  }, [isMobile]);

  // ---- Canvas animation: petals + floating stardust ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = isMobile ? 260 : 340;
    const h = isMobile ? 120 : 160;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // ---- Floating stardust particles ----
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(p.y * 0.02) * 0.2;
        p.y += p.vy + Math.cos(p.x * 0.02) * 0.1;
        p.life--;

        if (p.life <= 0) {
          p.x = Math.random() * w;
          p.y = h + 10;
          p.life = p.maxLife;
          p.alpha = 0.2 + Math.random() * 0.5;
        }
        if (p.y < -15) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -15) p.x = w + 15;
        if (p.x > w + 15) p.x = -15;

        const fade = p.life < 30 ? p.life / 30 : p.life > p.maxLife - 30 ? (p.maxLife - p.life) / 30 : 1;
        const alpha = p.alpha * Math.max(0, Math.min(1, fade));
        if (alpha < 0.02) continue;

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 85%, ${alpha})`);
        grad.addColorStop(0.5, `hsla(${p.hue}, 90%, 70%, ${alpha * 0.4})`);
        grad.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsla(${p.hue}, 100%, 92%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- Cherry blossom petals falling ----
      const petals = petalsRef.current;
      for (let i = 0; i < petals.length; i++) {
        const pt = petals[i];
        pt.y += pt.speedY;
        pt.x += pt.speedX + Math.sin(pt.y * 0.03 + pt.swayPhase) * pt.swayAmp;
        pt.rotation += pt.rotSpeed;

        if (pt.y > h + 20) { pt.y = -15; pt.x = Math.random() * w; }
        if (pt.x < -15) pt.x = w + 15;
        if (pt.x > w + 15) pt.x = -15;

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rotation);
        ctx.globalAlpha = pt.alpha;

        // Petal
        ctx.fillStyle = "#FFB6C1";
        ctx.beginPath();
        ctx.ellipse(0, 0, pt.size, pt.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Vein
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(0, -pt.size * 0.35);
        ctx.lineTo(0, pt.size * 0.35);
        ctx.stroke();

        ctx.restore();
      }

      // Vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.75);
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(255,182,193,0.05)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isMobile]);

  // ---- Derived ----
  const lyricText = LYRICS[lyricIdx]?.text || "";
  const w = isMobile ? 260 : 340;
  const h = isMobile ? 120 : 160;

  return (
    <>
      <audio ref={audioRef} src="/love-site/audio/bg-music.mp3" preload="auto" loop />

      {/* ──── Lyrics display ──── */}
      <div
        className="fixed z-[9998]"
        style={{ bottom: isMobile ? "78px" : "88px", right: isMobile ? "8px" : "20px" }}
      >
        <div
          className="relative rounded-2xl overflow-hidden border border-rose-dried/20"
          style={{
            width: w,
            height: h,
            background: "radial-gradient(ellipse at center, rgba(255,182,193,0.1) 0%, rgba(181,101,118,0.05) 40%, rgba(20,10,20,0.3) 100%)",
            boxShadow: "0 8px 40px rgba(181,101,118,0.15), inset 0 0 80px rgba(255,182,193,0.08)",
          }}
        >
          {/* Background canvas: particles + petals */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ width: "100%", height: "100%" }}
          />

          {/* Foreground text: readable lyrics */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <p
              className="font-script text-center leading-relaxed select-none pointer-events-none"
              style={{
                fontSize: isMobile ? "18px" : "24px",
                color: "#FFB6C1",
                textShadow:
                  "0 0 20px rgba(255,107,138,0.6), 0 0 40px rgba(255,107,138,0.3), 0 0 80px rgba(255,107,138,0.15), 0 2px 4px rgba(181,101,118,0.3)",
                filter: "drop-shadow(0 0 8px rgba(255,182,193,0.5))",
              }}
            >
              {lyricText}
            </p>
          </div>
        </div>
      </div>

      {/* ──── Play/Pause button ──── */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border-2 border-rose-dried/30 flex items-center justify-center text-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300"
        style={{ boxShadow: "0 4px 30px rgba(181,101,118,0.25)" }}
        title={playing ? "暂停音乐 🎵" : "播放音乐 🎵"}
      >
        <span
          className={playing ? "animate-spin" : ""}
          style={{ display: "inline-block", animationDuration: playing ? "3s" : "0s" }}
        >
          {playing ? "🎵" : "🎶"}
        </span>
      </button>
    </>
  );
}
