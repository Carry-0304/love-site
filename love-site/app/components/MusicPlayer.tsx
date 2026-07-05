"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import LYRICS from "./lyrics";

// ---- Config ----
const CARD_W = 320;
const CARD_H = 160;
const PARTICLE_N = 1000; // total particles in pool
const FONT_SIZE = 36;

// ---- Types ----
interface Particle {
  x: number; y: number;   // current
  tx: number; ty: number; // target
  vx: number; vy: number;
  size: number;
  alpha: number;
  hue: number;
}

// ---- Helpers ----
// Sample text pixels from offscreen canvas, return display-canvas coords
function sampleText(offCtx: CanvasRenderingContext2D, offW: number, offH: number, text: string) {
  offCtx.clearRect(0, 0, offW, offH);
  offCtx.font = `bold ${FONT_SIZE}px "SimHei","Heiti SC","Microsoft YaHei","PingFang SC",sans-serif`;
  offCtx.fillStyle = "#fff";
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillText(text, offW / 2, offH / 2);

  const img = offCtx.getImageData(0, 0, offW, offH);
  const pixels: { x: number; y: number }[] = [];
  const step = 3; // sample density — higher = fewer pixels
  for (let y = 0; y < offH; y += step) {
    for (let x = 0; x < offW; x += step) {
      if (img.data[(y * offW + x) * 4 + 3] > 60) {
        pixels.push({ x: x / 2, y: y / 2 }); // scale back to display
      }
    }
  }
  return pixels;
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef(0);
  const inited = useRef(false);
  const lyricIdxRef = useRef(0);
  const scatterRef = useRef(0); // scatter timer

  // ---- Audio ----
  const initAndPlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || inited.current) return;
    a.volume = 0.35; a.loop = true; inited.current = true;
    a.play().then(() => setPlaying(true)).catch(() => {});
  }, []);

  useEffect(() => {
    document.addEventListener("click", initAndPlay, { once: true });
    document.addEventListener("touchstart", initAndPlay, { once: true });
    return () => {
      document.removeEventListener("click", initAndPlay);
      document.removeEventListener("touchstart", initAndPlay);
    };
  }, [initAndPlay]);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const a = audioRef.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else {
      if (!inited.current) { a.volume = 0.35; a.loop = true; inited.current = true; }
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  // ---- Lyrics sync → sets scatter on change ----
  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const tick = () => {
      const t = a.currentTime;
      let i = 0;
      for (let j = LYRICS.length - 1; j >= 0; j--) {
        if (t >= LYRICS[j].time) { i = j; break; }
      }
      if (i !== lyricIdxRef.current) {
        lyricIdxRef.current = i;
        scatterRef.current = 30; // ~0.5s scatter phase at 60fps
      }
    };
    a.addEventListener("timeupdate", tick);
    return () => a.removeEventListener("timeupdate", tick);
  }, []);

  // ---- Particle canvas: deconstruct / reconstruct / flow ----
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CARD_W * dpr; canvas.height = CARD_H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Offscreen canvas for text sampling
    const off = document.createElement("canvas");
    off.width = CARD_W * 2; off.height = CARD_H * 2;
    offscreenRef.current = off;
    const offCtx = off.getContext("2d")!;

    // Init particles randomly across canvas
    particlesRef.current = Array.from({ length: PARTICLE_N }, () => ({
      x: Math.random() * CARD_W,
      y: Math.random() * CARD_H,
      tx: Math.random() * CARD_W,
      ty: Math.random() * CARD_H,
      vx: 0, vy: 0,
      size: 0.6 + Math.random() * 1.8,
      alpha: 0.35 + Math.random() * 0.65,
      hue: 340 + Math.random() * 20, // pink range
    }));

    let targetPositions: { x: number; y: number }[] = [];
    let frame = 0;

    const updateTargets = () => {
      const text = LYRICS[lyricIdxRef.current]?.text || "";
      if (!text) return;
      targetPositions = sampleText(offCtx, off.width, off.height, text);
      if (targetPositions.length === 0) return;

      // Map particles to text positions (cycling if fewer particles than pixels)
      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const tp = targetPositions[i % targetPositions.length];
        // Add micro-jitter for organic feel
        ps[i].tx = tp.x + (Math.random() - 0.5) * 1.5;
        ps[i].ty = tp.y + (Math.random() - 0.5) * 1.5;
      }
    };

    // Initial targets
    updateTargets();

    const animate = () => {
      ctx.clearRect(0, 0, CARD_W, CARD_H);
      frame++;

      // Decrement scatter timer
      if (scatterRef.current > 0) scatterRef.current--;

      // Update targets when scatter ends (reconstruct phase)
      if (scatterRef.current === 15) {
        // Just started scatter → expand particles outward
        const ps = particlesRef.current;
        for (const p of ps) {
          const cx = CARD_W / 2, cy = CARD_H / 2;
          p.tx = p.x + (p.x - cx) * 4 + (Math.random() - 0.5) * 100;
          p.ty = p.y + (p.y - cy) * 4 + (Math.random() - 0.5) * 100;
          p.vx = (Math.random() - 0.5) * 6;
          p.vy = (Math.random() - 0.5) * 6;
        }
      } else if (scatterRef.current === 1) {
        // Last scatter frame → reconstruct
        updateTargets();
      }

      const inScatter = scatterRef.current > 0;
      const ps = particlesRef.current;

      for (const p of ps) {
        // Spring toward target
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const spring = inScatter ? 0.015 : 0.06;
        const damp = inScatter ? 0.88 : 0.84;
        p.vx += dx * spring;
        p.vy += dy * spring;
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx;
        p.y += p.vy;

        // Flow: gentle orbit around target in stable phase
        if (!inScatter) {
          p.x += Math.sin(p.y * 0.04 + frame * 0.03) * 0.25;
          p.y += Math.cos(p.x * 0.04 + frame * 0.03) * 0.25;
        }

        // Clamp to card
        if (p.x < -10) p.x = -10; if (p.x > CARD_W + 10) p.x = CARD_W + 10;
        if (p.y < -10) p.y = -10; if (p.y > CARD_H + 10) p.y = CARD_H + 10;

        // Draw glow + core
        const alpha = p.alpha * (inScatter ? 0.6 : 1);
        if (alpha < 0.02) continue;

        // Outer glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grad.addColorStop(0, `hsla(${p.hue},100%,85%,${alpha})`);
        grad.addColorStop(0.35, `hsla(${p.hue},95%,75%,${alpha * 0.5})`);
        grad.addColorStop(0.7, `hsla(${p.hue},90%,65%,${alpha * 0.15})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsla(${p.hue},100%,90%,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cherry blossom petals
      for (let i = 0; i < 12; i++) {
        const py = ((frame * (0.4 + i * 0.08) + i * 73) % (CARD_H + 40)) - 20;
        const px = ((i * 97 + Math.sin(frame * 0.02 + i) * 40) % (CARD_W + 40)) - 20;
        const sz = 3 + (i % 4) * 2;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(frame * 0.008 + i);
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#FFB6C1";
        ctx.beginPath();
        ctx.ellipse(0, 0, sz, sz * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/love-site/audio/bg-music.mp3" preload="auto" loop />

      {/* ──── Lyrics card ──── */}
      <div style={{ position:"fixed", bottom:88, right:20, zIndex:9998 }}>
        <div style={{
          position:"relative", width:CARD_W, height:CARD_H,
          borderRadius:18, overflow:"hidden",
          background:"linear-gradient(135deg, rgba(255,210,220,0.22) 0%, rgba(255,240,245,0.18) 40%, rgba(255,182,193,0.10) 100%)",
          backdropFilter:"blur(16px)",
          border:"1.5px solid rgba(181,101,118,0.28)",
          boxShadow:"0 8px 50px rgba(181,101,118,0.18), 0 0 80px rgba(255,182,193,0.06) inset",
        }}>
          {/* Particle lyrics canvas */}
          <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:CARD_W, height:CARD_H }} />

          {/* Glossy highlight */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"35%",
            background:"linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
            pointerEvents:"none" }} />

          {/* Top label */}
          <div style={{ position:"absolute", top:8, left:0, right:0, textAlign:"center",
            fontSize:10, color:"rgba(181,101,118,0.4)", letterSpacing:"0.25em",
            fontFamily:"sans-serif" }}>
            ♪ 实时歌词 ♪
          </div>
        </div>
      </div>

      {/* ──── Play button ──── */}
      <button onClick={toggle} style={{
        position:"fixed", bottom:24, right:20, zIndex:9999,
        width:56, height:56, borderRadius:"50%",
        background:"rgba(255,255,255,0.82)", backdropFilter:"blur(12px)",
        border:"2px solid rgba(181,101,118,0.32)",
        boxShadow:"0 4px 30px rgba(181,101,118,0.22)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:28, cursor:"pointer",
        transition:"transform 0.2s, box-shadow 0.2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 35px rgba(181,101,118,0.35)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 30px rgba(181,101,118,0.22)"; }}
        title={playing ? "暂停 🎵" : "播放 🎵"}
      >
        <span style={{ display:"inline-block", animation: playing ? "spin 3s linear infinite" : "none" }}>
          {playing ? "🎵" : "🎶"}
        </span>
      </button>
    </>
  );
}
