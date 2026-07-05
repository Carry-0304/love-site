"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import LYRICS from "./lyrics";

// ---- Config ----
const CARD_W = 320;
const CARD_H = 160;
const PARTICLE_N = 800;

// ---- Phase detection ----
type Phase = "prelude" | "verse1" | "rising" | "chorus" | "bridge" | "outro";
function getPhase(t: number): Phase {
  if (t < 13) return "prelude";
  if (t < 35) return "verse1";
  if (t < 84) return "rising";
  if (t < 119) return "chorus";
  if (t < 138) return "bridge";
  return "outro";
}

// ---- Particle ----
interface Particle {
  x: number; y: number;
  tx: number; ty: number;
  vx: number; vy: number;
  size: number; alpha: number;
  hue: number; sat: number; light: number;
}

// ---- Text pixel sampler ----
function sampleText(
  offCtx: CanvasRenderingContext2D, offW: number, offH: number,
  text: string, fontSize: number, italic: boolean
) {
  offCtx.clearRect(0, 0, offW, offH);
  offCtx.font = `${italic ? "italic " : ""}bold ${fontSize}px "SimHei","Heiti SC","Microsoft YaHei","PingFang SC",sans-serif`;
  offCtx.fillStyle = "#fff";
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillText(text, offW / 2, offH / 2);

  const img = offCtx.getImageData(0, 0, offW, offH);
  const pixels: { x: number; y: number }[] = [];
  for (let y = 0; y < offH; y += 3) {
    for (let x = 0; x < offW; x += 3) {
      if (img.data[(y * offW + x) * 4 + 3] > 50) {
        pixels.push({ x: x / 2, y: y / 2 });
      }
    }
  }
  return pixels;
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [textVisible, setTextVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("prelude");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef(0);
  const inited = useRef(false);
  const lyricIdxRef = useRef(0);
  const scatterRef = useRef(0);
  const flashRef = useRef(0);
  const rippleRef = useRef<{ x: number; y: number; r: number; alpha: number }[]>([]);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // ---- Smooth text transition ----
  const transitionToText = useCallback((text: string) => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    // Fade out
    setTextVisible(false);
    fadeTimerRef.current = setTimeout(() => {
      setDisplayText(text);
      // Fade in
      requestAnimationFrame(() => {
        setTextVisible(true);
      });
    }, 300);
  }, []);

  // Init display
  useEffect(() => {
    setDisplayText(LYRICS[0]?.text || "");
    setTimeout(() => setTextVisible(true), 100);
  }, []);

  // ---- Lyrics sync + phase + scatter ----
  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const tick = () => {
      const t = a.currentTime;
      setPhase(getPhase(t));

      let i = 0;
      for (let j = LYRICS.length - 1; j >= 0; j--) {
        if (t >= LYRICS[j].time) { i = j; break; }
      }
      if (i !== lyricIdxRef.current) {
        lyricIdxRef.current = i;
        const newText = LYRICS[i]?.text || "";
        transitionToText(newText);
        scatterRef.current = 28;
        if (getPhase(t) === "verse1" || getPhase(t) === "chorus") {
          flashRef.current = 10;
        }
      }
    };
    a.addEventListener("timeupdate", tick);
    return () => a.removeEventListener("timeupdate", tick);
  }, [transitionToText]);

  // ---- Particle canvas ----
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CARD_W * dpr; canvas.height = CARD_H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const off = document.createElement("canvas");
    off.width = CARD_W * 2; off.height = CARD_H * 2;
    const offCtx = off.getContext("2d")!;

    particlesRef.current = Array.from({ length: PARTICLE_N }, () => ({
      x: Math.random() * CARD_W,
      y: Math.random() * CARD_H,
      tx: Math.random() * CARD_W,
      ty: Math.random() * CARD_H,
      vx: 0, vy: 0,
      size: 0.6 + Math.random() * 1.8,
      alpha: 0.25 + Math.random() * 0.5,
      hue: 345, sat: 90, light: 80,
    }));

    let frame = 0;
    let targetPositions: { x: number; y: number }[] = [];

    const updateTargets = (text: string, p: Phase) => {
      const italic = p === "chorus";
      const fs = text.length > 15 ? 24 : text.length > 8 ? 28 : 34;
      targetPositions = sampleText(offCtx, off.width, off.height, text, fs, italic);
      if (targetPositions.length === 0) return;
      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const tp = targetPositions[i % targetPositions.length];
        ps[i].tx = tp.x + (Math.random() - 0.5) * 1.5;
        ps[i].ty = tp.y + (Math.random() - 0.5) * 1.5;
      }
    };

    updateTargets(LYRICS[0]?.text || "", "prelude");

    const animate = () => {
      ctx.clearRect(0, 0, CARD_W, CARD_H);
      frame++;

      if (flashRef.current > 0) {
        flashRef.current--;
        ctx.fillStyle = `rgba(255,220,235,${flashRef.current * 0.06})`;
        ctx.fillRect(0, 0, CARD_W, CARD_H);
      }

      if (scatterRef.current > 0) scatterRef.current--;
      if (scatterRef.current === 15) {
        const ps = particlesRef.current;
        for (const p of ps) {
          const cx = CARD_W / 2, cy = CARD_H / 2;
          p.tx = p.x + (p.x - cx) * 1.8 + (Math.random() - 0.5) * 60;
          p.ty = p.y + (p.y - cy) * 1.8 + (Math.random() - 0.5) * 60;
          p.vx = (Math.random() - 0.5) * 2.5;
          p.vy = (Math.random() - 0.5) * 2.5;
        }
      } else if (scatterRef.current === 1) {
        updateTargets(LYRICS[lyricIdxRef.current]?.text || "", getPhase(
          audioRef.current?.currentTime || 0
        ));
      }

      const inScatter = scatterRef.current > 0;
      const ps = particlesRef.current;

      for (const p of ps) {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const spring = inScatter ? 0.018 : 0.07;
        const damp = inScatter ? 0.87 : 0.83;
        p.vx += dx * spring;
        p.vy += dy * spring;
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx;
        p.y += p.vy;

        const ph = getPhase(audioRef.current?.currentTime || 0);
        if (!inScatter) {
          switch (ph) {
            case "prelude":
              p.x += Math.sin(frame * 0.02 + p.y * 0.01) * 0.08;
              p.y += Math.cos(frame * 0.02 + p.x * 0.01) * 0.05;
              p.alpha = 0.15 + Math.sin(frame * 0.03) * 0.08;
              p.hue = 345; p.sat = 60; p.light = 70;
              break;
            case "verse1":
              p.x += (Math.random() - 0.5) * 0.2;
              p.y += (Math.random() - 0.5) * 0.15 - 0.05;
              p.hue = 340; p.sat = 95; p.light = 82;
              break;
            case "rising":
              p.x += Math.sin(p.y * 0.05 + frame * 0.04) * 0.25;
              p.y += Math.cos(p.x * 0.04 + frame * 0.03) * 0.15;
              p.hue = 20 + Math.sin(frame * 0.01) * 10;
              p.sat = 85; p.light = 80;
              break;
            case "chorus":
              p.x += Math.sin(p.y * 0.06 + frame * 0.06) * 0.35;
              p.y += Math.cos(p.x * 0.05 + frame * 0.05) * 0.25;
              p.hue = 330 + Math.sin(frame * 0.05) * 15;
              p.sat = 100; p.light = 88;
              break;
            case "bridge":
              p.vy -= 0.01;
              p.x += Math.sin(frame * 0.015 + p.y * 0.01) * 0.1;
              p.hue = 0; p.sat = 0; p.light = 95;
              p.alpha *= 0.998;
              break;
            case "outro":
              p.vy -= 0.02;
              p.x += (Math.random() - 0.5) * 0.15;
              p.alpha *= 0.994;
              p.hue = 20 + Math.random() * 20;
              p.sat = 90; p.light = 60 + Math.random() * 20;
              break;
          }
        }

        if (p.x < -15) p.x = -15; if (p.x > CARD_W + 15) p.x = CARD_W + 15;
        if (p.y < -15) p.y = -15; if (p.y > CARD_H + 15) p.y = CARD_H + 15;

        const alpha = p.alpha * (inScatter ? 0.55 : 1);
        if (alpha < 0.015) continue;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grad.addColorStop(0, `hsla(${p.hue},${p.sat}%,${p.light}%,${alpha})`);
        grad.addColorStop(0.4, `hsla(${p.hue},${p.sat-10}%,${p.light-10}%,${alpha*0.5})`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${Math.min(100,p.light+10)}%,${alpha})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2); ctx.fill();
      }

      // Petals
      const petalN = phase === "prelude" ? 8 : phase === "chorus" ? 15 : phase === "bridge" ? 2 : 6;
      for (let i = 0; i < petalN; i++) {
        const py = ((frame * (0.3 + i * 0.09) + i * 71) % (CARD_H + 30)) - 15;
        const px = ((i * 103 + Math.sin(frame * 0.025 + i) * 35) % (CARD_W + 30)) - 15;
        ctx.save(); ctx.translate(px, py); ctx.rotate(frame * 0.006 + i);
        ctx.globalAlpha = phase === "bridge" ? 0.15 : 0.3;
        ctx.fillStyle = phase === "bridge" ? "#fff" : "#FFB6C1";
        ctx.beginPath(); ctx.ellipse(0, 0, 2.5 + (i%4)*2, (2.5+(i%4)*2)*0.5, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // ---- Phase-dependent text style ----
  const hueByPhase: Record<Phase, string> = {
    prelude: "rgba(255,143,171,0.35)",
    verse1: "#FF6B8A",
    rising: "#E8A87C",
    chorus: "#FF4088",
    bridge: "#FFF0F5",
    outro: "#FF8FAB",
  };

  const shadowByPhase: Record<Phase, string> = {
    prelude: "0 0 8px rgba(255,143,171,0.2)",
    verse1: "0 0 25px rgba(255,107,138,0.7), 0 0 50px rgba(255,80,120,0.35)",
    rising: "0 0 20px rgba(232,168,124,0.5), 0 0 40px rgba(255,200,150,0.25)",
    chorus: "0 0 30px rgba(255,64,136,0.8), 0 0 60px rgba(255,0,100,0.4)",
    bridge: "0 0 15px rgba(255,255,255,0.4), 0 0 30px rgba(200,200,220,0.2)",
    outro: "0 0 10px rgba(255,143,171,0.3)",
  };

  return (
    <>
      <audio ref={audioRef} src="/love-site/audio/bg-music.mp3" preload="auto" loop />

      {/* ──── Lyrics window: transparent, no border ──── */}
      <div style={{ position: "fixed", bottom: 88, right: 20, zIndex: 9998 }}>
        <div style={{
          position: "relative", width: CARD_W, height: CARD_H,
          borderRadius: 18, overflow: "hidden",
          background: "transparent",
          border: "none",
          boxShadow: "none",
        }}>
          {/* Particle canvas */}
          <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: CARD_W, height: CARD_H }} />

          {/* Text overlay with fade + slide transition */}
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            padding: "0 16px", pointerEvents: "none",
          }}>
            <p style={{
              fontFamily: '"SimHei","Heiti SC","Microsoft YaHei","PingFang SC",sans-serif',
              fontWeight: 900,
              fontSize: phase === "prelude" ? 16 : phase === "chorus" ? 24 : phase === "outro" ? 20 : 22,
              fontStyle: phase === "chorus" ? "italic" : "normal",
              color: hueByPhase[phase],
              textAlign: "center" as const,
              lineHeight: 1.4,
              margin: 0,
              textShadow: shadowByPhase[phase],
              // Smooth fade + slide transition
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}>
              {displayText || " "}
            </p>
          </div>
        </div>
      </div>

      {/* ──── Play button ──── */}
      <button onClick={toggle} style={{
        position: "fixed", bottom: 24, right: 20, zIndex: 9999,
        width: 56, height: 56, borderRadius: "50%",
        background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)",
        border: "2px solid rgba(181,101,118,0.32)",
        boxShadow: "0 4px 30px rgba(181,101,118,0.22)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 35px rgba(181,101,118,0.35)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 30px rgba(181,101,118,0.22)"; }}
        title={playing ? "暂停 🎵" : "播放 🎵"}
      >
        <span style={{ display: "inline-block", animation: playing ? "spin 3s linear infinite" : "none" }}>
          {playing ? "🎵" : "🎶"}
        </span>
      </button>
    </>
  );
}
