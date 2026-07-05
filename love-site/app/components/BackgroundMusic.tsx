"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  src: string;
}

export default function BackgroundMusic({ src }: Props) {
  const [playing, setPlaying] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on first user interaction anywhere on the page
  useEffect(() => {
    const initAudio = () => {
      if (initialized) return;
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = 0.35;
      audio.loop = true;
      setInitialized(true);
      // Try to play
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };

    document.addEventListener("click", initAudio, { once: true });
    document.addEventListener("touchstart", initAudio, { once: true });

    return () => {
      document.removeEventListener("click", initAudio);
      document.removeEventListener("touchstart", initAudio);
    };
  }, [initialized]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      // Init if not yet
      if (!initialized) {
        audio.volume = 0.35;
        audio.loop = true;
        setInitialized(true);
      }
      audio.play().then(() => setPlaying(true)).catch(() => {
        setPlaying(false);
      });
    }
  }, [playing, initialized]);

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" loop />

      {/* Floating music button */}
      <motion.button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/70 backdrop-blur-md border border-rose-dried/20 shadow-lg shadow-rose-dried/10 flex items-center justify-center text-xl cursor-pointer hover:shadow-xl hover:shadow-rose-dried/20 hover:scale-105 transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        title={playing ? "暂停音乐" : "播放音乐"}
      >
        <motion.span
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={
            playing
              ? { duration: 3, repeat: Infinity, ease: "linear" }
              : { duration: 0.3 }
          }
          style={{ display: "inline-block" }}
        >
          {playing ? "🎵" : "🔇"}
        </motion.span>
      </motion.button>
    </>
  );
}
