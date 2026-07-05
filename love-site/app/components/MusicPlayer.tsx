"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import LYRICS from "./lyrics";

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [lyricIdx, setLyricIdx] = useState(0);
  const [show, setShow] = useState(true); // always visible
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initDoneRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef(0);

  // ---- Audio ----
  const initAndPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!initDoneRef.current) {
      audio.volume = 0.35;
      audio.loop = true;
      initDoneRef.current = true;
    }
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else initAndPlay();
  }, [playing, initAndPlay]);

  useEffect(() => {
    const h = () => { if (!initDoneRef.current || !playing) initAndPlay(); };
    document.addEventListener("click", h, { once: true });
    document.addEventListener("touchstart", h, { once: true });
    return () => {
      document.removeEventListener("click", h);
      document.removeEventListener("touchstart", h);
    };
  }, [initAndPlay, playing]);

  // ---- Lyrics sync ----
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const u = () => {
      const t = audio.currentTime;
      let i = 0;
      for (let j = LYRICS.length - 1; j >= 0; j--) {
        if (t >= LYRICS[j].time) { i = j; break; }
      }
      setLyricIdx(i);
    };
    audio.addEventListener("timeupdate", u);
    return () => audio.removeEventListener("timeupdate", u);
  }, []);

  // ---- Petal canvas background ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = 300, h = 150, dpr = 2;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Generate petals
    const petals = Array.from({ length: 18 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      size: 4 + Math.random() * 6,
      sy: 0.2 + Math.random() * 0.4,
      sx: -0.15 + Math.random() * 0.3,
      rot: Math.random() * 360, rs: (Math.random() - 0.5) * 1.2,
      alpha: 0.3 + Math.random() * 0.4,
      sw: 0.2 + Math.random() * 0.5, sp: Math.random() * Math.PI * 2,
    }));

    // Generate stardust
    const dust = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4, vy: -(0.1 + Math.random() * 0.3),
      size: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.5,
      hue: 335 + Math.random() * 20,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Stardust
      for (const d of dust) {
        d.x += d.vx + Math.sin(d.y * 0.02) * 0.15;
        d.y += d.vy;
        if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w; }
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size * 3);
        g.addColorStop(0, `hsla(${d.hue}, 100%, 85%, ${d.alpha})`);
        g.addColorStop(0.5, `hsla(${d.hue}, 90%, 70%, ${d.alpha * 0.3})`);
        g.addColorStop(1, `hsla(${d.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.size * 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `hsla(${d.hue}, 100%, 92%, ${d.alpha})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.size * 0.5, 0, Math.PI * 2); ctx.fill();
      }

      // Petals
      for (const p of petals) {
        p.y += p.sy;
        p.x += p.sx + Math.sin(p.y * 0.03 + p.sp) * p.sw;
        p.rot += p.rs;
        if (p.y > h + 20) { p.y = -15; p.x = Math.random() * w; }
        if (p.x < -15) p.x = w + 15;
        if (p.x > w + 15) p.x = -15;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "#FFB6C1";
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const current = LYRICS[lyricIdx]?.text || "🎵  ~  ♪  ~";

  return (
    <>
      <audio ref={audioRef} src="/love-site/audio/bg-music.mp3" preload="auto" loop />

      {/* ── Lyrics card ── */}
      <div
        className="fixed z-[9998]"
        style={{ bottom: 88, right: 20 }}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            width: 300, height: 150,
            background: "linear-gradient(135deg, rgba(255,192,203,0.12) 0%, rgba(181,101,118,0.08) 50%, rgba(255,182,193,0.06) 100%)",
            border: "1px solid rgba(181,101,118,0.2)",
            boxShadow: "0 8px 40px rgba(181,101,118,0.12), inset 0 0 60px rgba(255,182,193,0.04)",
          }}
        >
          {/* Petal canvas */}
          <canvas ref={canvasRef} className="absolute inset-0" style={{ width: 300, height: 150 }} />

          {/* Lyrics text */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <p
              style={{
                fontFamily: '"Dancing Script", "Noto Serif SC", serif',
                fontSize: 24,
                color: "#FFB6C1",
                textAlign: "center",
                textShadow: "0 0 25px rgba(255,107,138,0.7), 0 0 50px rgba(255,107,138,0.3), 0 0 80px rgba(255,107,138,0.15)",
                lineHeight: 1.5,
              }}
            >
              {current}
            </p>
          </div>
        </div>
      </div>

      {/* ── Play button ── */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border-2 border-rose-dried/30 flex items-center justify-center text-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300"
        style={{ boxShadow: "0 4px 30px rgba(181,101,118,0.25)" }}
        title={playing ? "暂停 🎵" : "播放 🎵"}
      >
        <span className={playing ? "animate-spin" : ""} style={{ display: "inline-block", animationDuration: playing ? "3s" : "0s" }}>
          {playing ? "🎵" : "🎶"}
        </span>
      </button>
    </>
  );
}
