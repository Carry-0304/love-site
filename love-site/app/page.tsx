"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingHeart from "./components/LoadingHeart";
import HeroSection from "./components/HeroSection";
import MemoryTimeline from "./components/MemoryTimeline";
import PhotoWall from "./components/PhotoWall";
import LoveMailbox from "./components/LoveMailbox";
import CherryBlossoms from "./components/CherryBlossoms";
import FloatingParticles from "./components/FloatingParticles";
import StarTrail from "./components/StarTrail";
import ToastNotification from "./components/ToastNotification";
import BackgroundMusic from "./components/BackgroundMusic";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {/* ============ LOADING SCREEN ============ */}
      <AnimatePresence>
        {!isLoaded && <LoadingHeart onComplete={handleLoadComplete} />}
      </AnimatePresence>

      {/* ============ MAIN CONTENT ============ */}
      {isLoaded && (
        <motion.main
          className="relative min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* --- Background ambient effects --- */}
          <FloatingParticles />
          <CherryBlossoms />

          {/* --- Background music --- */}
          <BackgroundMusic src="/love-site/audio/bg-music.mp3" />

          {/* --- Cursor star trail (desktop only) --- */}
          <StarTrail />

          {/* --- Mobile toast notifications --- */}
          <ToastNotification />

          {/* --- Custom cursor elements (CSS fallback) --- */}
          <div className="custom-cursor hidden md:block" id="custom-cursor" />
          <div className="custom-cursor-dot hidden md:block" id="custom-cursor-dot" />

          {/* ======== SECTIONS ======== */}

          {/* Hero — name, clock, days counter */}
          <HeroSection />

          {/* Decorative divider */}
          <div className="flex justify-center py-4">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-rose-dried/30" />
              <span className="text-rose-dried/30 text-lg">❦</span>
              <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-rose-dried/30" />
            </motion.div>
          </div>

          {/* Memory Timeline */}
          <MemoryTimeline />

          {/* Decorative divider */}
          <div className="flex justify-center py-4">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-rose-dried/30" />
              <span className="text-rose-dried/30 text-lg">🌸</span>
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-rose-dried/30" />
            </motion.div>
          </div>

          {/* Photo Wall */}
          <PhotoWall />

          {/* Decorative divider */}
          <div className="flex justify-center py-4">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-rose-dried/30" />
              <span className="text-rose-dried/30 text-lg">💌</span>
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-rose-dried/30" />
            </motion.div>
          </div>

          {/* Love Mailbox */}
          <LoveMailbox />

          {/* ======== FOOTER ======== */}
          <footer className="py-16 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <p className="font-script text-3xl md:text-4xl text-gradient-love mb-4">
                胡鑫玥，我爱你
              </p>
              <p className="text-xs text-rose-dried/40 tracking-[0.3em] font-sans">
                FOREVER & ALWAYS
              </p>
              <div className="flex justify-center gap-1 mt-4 text-rose-dried/20 text-sm">
                <span>❤️</span>
                <span>💕</span>
                <span>💗</span>
                <span>💖</span>
                <span>💝</span>
              </div>
            </motion.div>
          </footer>
        </motion.main>
      )}
    </>
  );
}
