"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import LYRICS from "./lyrics";

// ---- Config ----
const CARD_W = 300;
const CARD_H = 150;
const PETAL_COUNT = 22;
const DUST_COUNT = 100;

// ---- Types ----
interface Petal {
  x: number; y: number;
  size: number;
  sy: number; sx: number;
  rot: number; rs: number;
  alpha: number;
  sw: number; sp: number;
}
interface Dust {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number; hue: number;
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [prevText, setPrevText] = useState("");
  const [fade, setFade] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const dustRef = useRef<Dust[]>([]);
  const animRef = useRef(0);
  const inited = useRef(false);

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

  // ---- Lyrics sync with fade transition ----
  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const tick = () => {
      const t = a.currentTime;
      let i = 0;
      for (let j = LYRICS.length - 1; j >= 0; j--) {
        if (t >= LYRICS[j].time) { i = j; break; }
      }
      setIdx((prev) => {
        if (i !== prev) {
          setPrevText(LYRICS[prev]?.text || "");
          setFade(false);
          requestAnimationFrame(() => requestAnimationFrame(() => setFade(true)));
        }
        return i;
      });
    };
    a.addEventListener("timeupdate", tick);
    return () => a.removeEventListener("timeupdate", tick);
  }, []);

  // ---- Canvas: petals + stardust ----
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CARD_W * dpr; canvas.height = CARD_H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Init petals
    petalsRef.current = Array.from({ length: PETAL_COUNT }, () => ({
      x: Math.random() * CARD_W, y: Math.random() * CARD_H,
      size: 4 + Math.random() * 7,
      sy: 0.12 + Math.random() * 0.45,
      sx: -0.2 + Math.random() * 0.4,
      rot: Math.random() * 360,
      rs: (Math.random() - 0.5) * 1.5,
      alpha: 0.3 + Math.random() * 0.45,
      sw: 0.2 + Math.random() * 0.5,
      sp: Math.random() * Math.PI * 2,
    }));

    // Init stardust
    dustRef.current = Array.from({ length: DUST_COUNT }, () => ({
      x: Math.random() * CARD_W, y: Math.random() * CARD_H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.08 + Math.random() * 0.35),
      size: 1 + Math.random() * 2.5,
      alpha: 0.15 + Math.random() * 0.5,
      hue: 335 + Math.random() * 25,
    }));

    let rot = 0;
    const animate = () => {
      ctx.clearRect(0, 0, CARD_W, CARD_H);
      rot += 0.004;

      // Stardust
      for (const d of dustRef.current) {
        d.x += d.vx + Math.sin(d.y * 0.02 + rot) * 0.15;
        d.y += d.vy;
        if (d.y < -15) { d.y = CARD_H + 15; d.x = Math.random() * CARD_W; }
        if (d.x < -15) d.x = CARD_W + 15; if (d.x > CARD_W + 15) d.x = -15;

        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size * 3);
        g.addColorStop(0, `hsla(${d.hue},100%,85%,${d.alpha})`);
        g.addColorStop(0.5, `hsla(${d.hue},90%,70%,${d.alpha * 0.35})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * 3, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = `hsla(${d.hue},100%,92%,${d.alpha})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.size * 0.5, 0, Math.PI * 2); ctx.fill();
      }

      // Petals
      for (const p of petalsRef.current) {
        p.y += p.sy; p.x += p.sx + Math.sin(p.y * 0.03 + p.sp) * p.sw;
        p.rot += p.rs;
        if (p.y > CARD_H + 20) { p.y = -15; p.x = Math.random() * CARD_W; }
        if (p.x < -15) p.x = CARD_W + 15; if (p.x > CARD_W + 15) p.x = -15;

        ctx.save(); ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180); ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "#FFB6C1"; ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2); ctx.fill();

        ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 0.3;
        ctx.beginPath(); ctx.moveTo(0, -p.size * 0.35); ctx.lineTo(0, p.size * 0.35); ctx.stroke();
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const text = LYRICS[idx]?.text || "🎵";

  return (
    <>
      <audio ref={audioRef} src="/love-site/audio/bg-music.mp3" preload="auto" loop />

      {/* ──── Lyrics card ──── */}
      <div style={{ position:"fixed", bottom:88, right:20, zIndex:9998 }}>
        <div style={{
          position:"relative", width:CARD_W, height:CARD_H,
          borderRadius:18, overflow:"hidden",
          background:"linear-gradient(135deg, rgba(255,210,220,0.25) 0%, rgba(255,240,245,0.20) 40%, rgba(255,182,193,0.12) 100%)",
          backdropFilter:"blur(16px)",
          border:"1.5px solid rgba(181,101,118,0.28)",
          boxShadow:"0 8px 50px rgba(181,101,118,0.18), 0 0 80px rgba(255,182,193,0.06) inset",
        }}>
          {/* Petal + stardust canvas */}
          <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:CARD_W, height:CARD_H }} />

          {/* Glossy highlight */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"40%",
            background:"linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
            pointerEvents:"none",
          }} />

          {/* Lyrics text */}
          <div style={{
            position:"absolute", inset:0, display:"flex",
            alignItems:"center", justifyContent:"center", padding:"0 20px",
          }}>
            <p style={{
              fontFamily:'"Dancing Script","Noto Serif SC",serif',
              fontSize:22, color:"#B56576",
              textAlign:"center", lineHeight:1.5, margin:0,
              textShadow:"0 1px 3px rgba(255,182,193,0.5), 0 0 15px rgba(255,107,138,0.25)",
              opacity: fade ? 1 : 0,
              transform: fade ? "translateY(0)" : "translateY(6px)",
              transition:"opacity 0.45s ease, transform 0.45s ease",
            } as React.CSSProperties}>
              {text}
            </p>
          </div>

          {/* Top label */}
          <div style={{
            position:"absolute", top:8, left:0, right:0,
            textAlign:"center", fontSize:10,
            color:"rgba(181,101,118,0.45)", letterSpacing:"0.25em",
            fontFamily:"sans-serif",
          }}>
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
