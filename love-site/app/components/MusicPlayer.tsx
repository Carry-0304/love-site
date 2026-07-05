"use client";

import { useState, useRef, useEffect } from "react";

// Inline lyrics data — no file import to eliminate that variable
const LYRICS = [
  { time: 0, text: "🎵  ~  ♪  ~" },
  { time: 5, text: "想把你写成一首歌" },
  { time: 10, text: "用最温柔的旋律" },
  { time: 15, text: "每个音符都在诉说" },
  { time: 20, text: "我有多爱你" },
  { time: 26, text: "想养一只猫" },
  { time: 31, text: "想和你有个家" },
  { time: 36, text: "在每一个清晨醒来" },
  { time: 42, text: "身边都是你" },
  { time: 48, text: "你是我所有的温柔" },
  { time: 54, text: "是我不变的守候" },
  { time: 60, text: "不管世界怎么变" },
  { time: 66, text: "我都在你左右" },
  { time: 72, text: "从日出到日落" },
  { time: 78, text: "从春夏到秋冬" },
  { time: 84, text: "我的故事里" },
  { time: 90, text: "全是你" },
  { time: 100, text: "想和你一起看星星" },
  { time: 110, text: "直到我们都老去" },
  { time: 120, text: "依然牵着你的手" },
  { time: 130, text: "你是我的光" },
  { time: 140, text: "这一生有你就足够" },
  { time: 150, text: "我爱你 💕" },
];

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inited = useRef(false);

  // Audio init
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const init = () => {
      if (inited.current) return;
      audio.volume = 0.35;
      audio.loop = true;
      inited.current = true;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };
    document.addEventListener("click", init, { once: true });
    document.addEventListener("touchstart", init, { once: true });
    return () => {
      document.removeEventListener("click", init);
      document.removeEventListener("touchstart", init);
    };
  }, []);

  // Lyrics sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const tick = () => {
      const t = audio.currentTime;
      let i = 0;
      for (let j = LYRICS.length - 1; j >= 0; j--) {
        if (t >= LYRICS[j].time) { i = j; break; }
      }
      setIdx(i);
    };
    audio.addEventListener("timeupdate", tick);
    return () => audio.removeEventListener("timeupdate", tick);
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else {
      if (!inited.current) { a.volume = 0.35; a.loop = true; inited.current = true; }
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/love-site/audio/bg-music.mp3" preload="auto" loop />

      {/* Lyrics text */}
      <div
        style={{
          position: "fixed",
          bottom: 88,
          right: 20,
          zIndex: 9998,
          width: 300,
          height: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          border: "2px solid rgba(181,101,118,0.4)",
          boxShadow: "0 8px 40px rgba(181,101,118,0.25)",
          padding: "0 24px",
        }}
      >
        <p
          style={{
            fontFamily: '"Dancing Script", "Noto Serif SC", serif',
            fontSize: 22,
            color: "#B56576",
            textAlign: "center" as const,
            lineHeight: 1.5,
            margin: 0,
            fontWeight: 500,
          }}
        >
          {LYRICS[idx]?.text || "🎵"}
        </p>
      </div>

      {/* Play button */}
      <button
        onClick={toggle}
        style={{
          position: "fixed",
          bottom: 24,
          right: 20,
          zIndex: 9999,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          border: "2px solid rgba(181,101,118,0.3)",
          boxShadow: "0 4px 30px rgba(181,101,118,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          cursor: "pointer",
        }}
      >
        {playing ? "🎵" : "🎶"}
      </button>
    </>
  );
}
