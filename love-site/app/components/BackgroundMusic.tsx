"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Props {
  src: string;
}

export default function BackgroundMusic({ src }: Props) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {
        // Browser blocked autoplay — user needs to interact again
        setPlaying(false);
      });
    }
  }, [playing]);

  // Attempt autoplay on first user interaction with the page
  const tryAutoPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || playing) return;
    audio.volume = 0.35;
    audio.loop = true;
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }, [playing]);

  return (
    <>
      {/* Invisible audio element */}
      <audio ref={audioRef} src={src} preload="auto" loop />

      {/* First-interaction autoplay trigger */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        onClick={tryAutoPlay}
        onTouchStart={tryAutoPlay}
        style={{ zIndex: -1 }}
      />

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
