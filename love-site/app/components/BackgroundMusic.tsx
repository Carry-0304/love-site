"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Props {
  src: string;
}

export default function BackgroundMusic({ src }: Props) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initDoneRef = useRef(false);

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
      setError(false);
    }).catch((e) => {
      console.warn("Audio play failed:", e.message);
      setPlaying(false);
      setError(true);
    });
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

  // Auto-init on first user interaction
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

  // Handle audio load error
  const handleError = useCallback(() => {
    setError(true);
    setPlaying(false);
  }, []);

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" onError={handleError} />

      {/* Floating music button */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border-2 border-rose-dried/30 shadow-xl flex items-center justify-center text-2xl cursor-pointer hover:scale-110 active:scale-95 hover:shadow-2xl hover:border-rose-deep/50 transition-all duration-300"
        style={{ boxShadow: "0 4px 30px rgba(181,101,118,0.25)" }}
        title={error ? "音频加载失败" : playing ? "暂停音乐 🎵" : "播放音乐 🎵"}
      >
        <span
          className={playing ? "animate-spin" : ""}
          style={{
            display: "inline-block",
            animationDuration: playing ? "3s" : "0s",
            opacity: error ? 0.4 : 1,
          }}
        >
          {error ? "🚫" : playing ? "🎵" : "🎶"}
        </span>
      </button>
    </>
  );
}
