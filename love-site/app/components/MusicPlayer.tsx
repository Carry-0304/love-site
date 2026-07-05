"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import LYRICS from "./lyrics";

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

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [textVisible, setTextVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("prelude");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inited = useRef(false);
  const lyricIdxRef = useRef(0);
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
    setTextVisible(false);
    fadeTimerRef.current = setTimeout(() => {
      setDisplayText(text);
      requestAnimationFrame(() => setTextVisible(true));
    }, 300);
  }, []);

  useEffect(() => {
    setDisplayText(LYRICS[0]?.text || "");
    setTimeout(() => setTextVisible(true), 100);
  }, []);

  // ---- Lyrics sync ----
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
        transitionToText(LYRICS[i]?.text || "");
      }
    };
    a.addEventListener("timeupdate", tick);
    return () => a.removeEventListener("timeupdate", tick);
  }, [transitionToText]);

  // ---- Phase-dependent text style ----
  const hueByPhase: Record<Phase, string> = {
    prelude: "rgba(255,143,171,0.4)",
    verse1: "#FF6B8A",
    rising: "#E8A87C",
    chorus: "#FF4088",
    bridge: "#de50e7",
    outro: "#FF8FAB",
  };

  return (
    <>
      <audio ref={audioRef} src="/love-site/audio/bg-music.mp3" preload="auto" loop />

      {/* ──── Lyrics center screen ──── */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9998, pointerEvents: "none",
      }}>
        <div style={{
          position: "relative", width: 380, height: 180,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 20px",
        }}>
          {/* Ambient glow behind text */}
          <div style={{
            position: "absolute", width: 280, height: 80,
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, ${hueByPhase[phase]}22 0%, transparent 70%)`,
            filter: "blur(20px)",
            animation: "ambientPulse 3s ease-in-out infinite",
          }} />
          <p style={{
            position: "relative",
            fontFamily: '"SimHei","Heiti SC","Microsoft YaHei","PingFang SC",sans-serif',
            fontWeight: 900,
            fontSize: phase === "prelude" ? 16 : phase === "chorus" ? 24 : phase === "outro" ? 20 : 22,
            fontStyle: phase === "chorus" ? "italic" : "normal",
            textAlign: "center" as const,
            lineHeight: 1.4,
            margin: 0,
            letterSpacing: "0.08em",
            // Gradient sweep left→right
            background: `linear-gradient(90deg, ${hueByPhase[phase]} 0%, ${hueByPhase[phase]} 35%, #ffffff 50%, ${hueByPhase[phase]} 65%, ${hueByPhase[phase]} 100%)`,
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            animation: "sweepGlow 4s ease-in-out infinite",
          } as React.CSSProperties}>
            {displayText || " "}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes sweepGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes ambientPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
      `}</style>

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
