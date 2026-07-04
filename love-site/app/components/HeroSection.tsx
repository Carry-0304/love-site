"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ---- CONFIG: Replace these ----
const GIRLFRIEND_NAME = "胡鑫玥";
const TOGETHER_SINCE = new Date("2026-06-15"); // 我们在一起的日期
// ------------------------------

export default function HeroSection() {
  const [time, setTime] = useState(new Date());
  const [daysTogether, setDaysTogether] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      const diff = now.getTime() - TOGETHER_SINCE.getTime();
      setDaysTogether(Math.floor(diff / (1000 * 60 * 60 * 24)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    const s = date.getSeconds().toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatDate = (date: Date) => {
    const days = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${days[date.getDay()]}`;
  };

  // Animate each character of a headline
  const headlineChars = "送给全世界最可爱最聪明的~".split("");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Ambient glow behind name — larger and warmer */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "700px",
          height: "700px",
          background:
            "radial-gradient(circle, rgba(255,182,193,0.35) 0%, rgba(255,228,225,0.18) 35%, rgba(255,218,185,0.08) 55%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Secondary glow behind the counter */}
      <div
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "400px",
          height: "200px",
          background:
            "radial-gradient(ellipse, rgba(212,165,116,0.2) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* ──── Real-time clock ──── */}
      <motion.div
        className="glass-strong px-8 py-4 mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.p className="text-sm text-rose-dried/70 tracking-[0.2em] font-sans mb-1">
          {formatDate(time)}
        </motion.p>
        <motion.p className="text-5xl md:text-6xl font-light text-rose-deep tracking-[0.1em] tabular-nums font-serif">
          {formatTime(time)}
        </motion.p>
      </motion.div>

      {/* ──── Poetic headline ──── */}
      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="flex flex-wrap justify-center gap-x-[0.05em]">
          {headlineChars.map((char, i) => (
            <motion.span
              key={i}
              className={`inline-block text-lg md:text-2xl font-serif ${
                char === "宇宙" || char === "引力" ? "" : ""
              }`}
              style={{
                color: (char === "宇" || char === "宙" || char === "引" || char === "力")
                  ? "#B56576"
                  : "#C48B8B",
                fontWeight: (char === "宇" || char === "宙" || char === "引" || char === "力")
                  ? 600
                  : 400,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.6 + i * 0.06,
                type: "spring",
                damping: 15,
              }}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* ──── Name Art ──── */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, type: "spring" }}
      >
        <motion.h1
          className="text-6xl md:text-8xl lg:text-9xl font-script text-gradient-love mb-4 drop-shadow-lg"
          animate={{
            textShadow: [
              "0 2px 20px rgba(181, 101, 118, 0.2)",
              "0 2px 40px rgba(255, 107, 138, 0.4)",
              "0 2px 20px rgba(181, 101, 118, 0.2)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {GIRLFRIEND_NAME}
        </motion.h1>

        {/* Ornamental divider with diamond */}
        <motion.div className="flex items-center justify-center gap-4 my-5">
          <div
            className="w-16 h-[1px]"
            style={{
              background: "linear-gradient(90deg, transparent, #D4A574)",
            }}
          />
          <motion.span
            className="text-xl"
            style={{ color: "#D4A574" }}
            animate={{ rotate: [0, 180] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            ◆
          </motion.span>
          <div
            className="w-16 h-[1px]"
            style={{
              background: "linear-gradient(90deg, #D4A574, transparent)",
            }}
          />
        </motion.div>

        {/* Follow-up line */}
        <motion.p
          className="text-base md:text-lg text-rose-dried/70 font-serif italic max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          你是我每天醒来第一个想见的人 💫
        </motion.p>
      </motion.div>

      {/* ──── Days Counter ──── */}
      <motion.div
        className="glass px-10 py-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 20px 60px rgba(181, 101, 118, 0.2)",
        }}
      >
        <p className="text-sm text-rose-dried/60 tracking-widest mb-2 font-sans">
          我们在一起
        </p>
        <motion.p
          className="text-6xl md:text-7xl font-light text-rose-deep tabular-nums font-serif"
          key={daysTogether}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {daysTogether.toLocaleString()}
        </motion.p>
        <p className="text-sm text-rose-dried/60 tracking-widest mt-2 font-sans">
          天 ❤️
        </p>
      </motion.div>

      {/* ──── Scroll indicator ──── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-xs text-rose-dried/50 tracking-wider font-sans text-center max-w-xs leading-relaxed">
          计时器没有骗人<br />
          但它的算法错了——<br />
          我想我们相爱了无数个时间线
        </p>
        <div className="w-5 h-8 rounded-full border border-rose-dried/30 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-1.5 rounded-full bg-rose-dried/50"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
