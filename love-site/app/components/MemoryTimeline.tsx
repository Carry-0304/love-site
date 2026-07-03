"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- CONFIG: Replace with your real memories ----
interface Memory {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  imageUrl?: string;
}

const memories: Memory[] = [
  {
    id: "first-meet",
    date: "2023.06.15",
    title: "初遇",
    subtitle: "那天阳光正好",
    description:
      "六月的阳光穿过梧桐叶的缝隙，在你发梢上跳舞。你推开咖啡馆的门，风铃响了——那一刻我还不知道，这扇门推开的是我整个余生。",
    emoji: "☀️",
  },
  {
    id: "heartbeat",
    date: "2023.08.20",
    title: "心动",
    subtitle: "你笑起来真好看",
    description:
      "你回头冲我笑的那一秒，周围的喧嚣全部静音了。你的眼睛弯成两道月牙，里面有星星在闪。从那一刻起，我就知道——我完了，彻底沦陷了。",
    emoji: "💓",
  },
  {
    id: "first-date",
    date: "2023.09.14",
    title: "第一次约会",
    subtitle: "手心全是汗",
    description:
      "江边的晚风温柔得不像话，我们坐在长椅上，中间隔着两杯奶茶的距离。你忽然靠过来指着天上的星星，而我全程只看得见你侧脸的轮廓映在月光里。",
    emoji: "🌙",
  },
  {
    id: "confession",
    date: "2023.10.01",
    title: "告白",
    subtitle: "最勇敢的一天",
    description:
      "烟花在头顶炸开的时候，我用尽全部勇气说了那四个字。你愣了一下，然后红着脸轻轻点头。漫天的烟花都不及你那一刻万分之一的美。",
    emoji: "💌",
  },
  {
    id: "together",
    date: "2024.01.01",
    title: "相守",
    subtitle: "从遇见你的第一次心跳算起",
    description:
      "新年的第一缕阳光照进房间时，我握紧了你的手。此后的每一个日出日落，我都只想和你一起看。从初遇到心动，从牵手到白头，我们的故事，才刚开始写第一章。",
    emoji: "💍",
  },
];
// ----------------------------------------

export default function MemoryTimeline() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef(0);

  const handleMemoryClick = (memory: Memory) => {
    if (Math.abs(scrollRef.current?.scrollLeft ?? 0 - dragStartRef.current) < 10) {
      setSelectedMemory(memory);
    }
  };

  const handleDragStart = () => {
    if (scrollRef.current) {
      dragStartRef.current = scrollRef.current.scrollLeft;
    }
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Section title */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-script text-gradient-love mb-3">
          我们的时光轴
        </h2>
        <p className="text-sm text-rose-dried/60 tracking-widest font-sans">
          每一个瞬间，都值得被铭记
        </p>
      </motion.div>

      {/* Horizontal draggable timeline */}
      <motion.div
        className="relative max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Timeline line */}
        <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-dried/40 to-transparent -translate-y-1/2" />

        {/* Decorative dots along the line */}
        <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-rose-dried/30" />
        <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-rose-dried/30" />
        <div className="absolute top-1/2 left-[55%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-rose-dried/30" />
        <div className="absolute top-1/2 left-[75%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-rose-dried/30" />
        <div className="absolute top-1/2 left-[90%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-rose-dried/30" />

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-12 md:gap-20 overflow-x-auto pb-8 px-8 scroll-smooth cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              className="flex-shrink-0 flex flex-col items-center gap-4 cursor-pointer group"
              style={{ width: "160px" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              onClick={() => handleMemoryClick(memory)}
            >
              {/* Top content (alternating) */}
              {index % 2 === 0 ? (
                <>
                  <div className="text-center order-1">
                    <p className="text-xs text-rose-dried/50 font-sans mb-1 tracking-wide">
                      {memory.date}
                    </p>
                    <p className="text-xl font-script text-rose-deep group-hover:text-rose-deep/90 transition-colors">
                      {memory.title}
                    </p>
                  </div>
                  <div className="order-2 relative">
                    <motion.div
                      className="w-16 h-16 rounded-full glass-strong flex items-center justify-center text-3xl relative z-10"
                      whileHover={{
                        scale: 1.25,
                        boxShadow: "0 0 35px rgba(255,107,138,0.45)",
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {memory.emoji}
                    </motion.div>
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-rose-dried/20"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </div>
                  <div className="order-3 h-8" />
                </>
              ) : (
                <>
                  <div className="order-1 h-8" />
                  <div className="order-2 relative">
                    <motion.div
                      className="w-16 h-16 rounded-full glass-strong flex items-center justify-center text-3xl relative z-10"
                      whileHover={{
                        scale: 1.25,
                        boxShadow: "0 0 35px rgba(255,107,138,0.45)",
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {memory.emoji}
                    </motion.div>
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-rose-dried/20"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-center order-3">
                    <p className="text-xs text-rose-dried/50 font-sans mb-1 tracking-wide">
                      {memory.date}
                    </p>
                    <p className="text-xl font-script text-rose-deep group-hover:text-rose-deep/90 transition-colors">
                      {memory.title}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Fade edges for scroll hint */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#FFE4E1]/80 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FFE4E1]/80 to-transparent pointer-events-none" />
      </motion.div>

      {/* ──── Detail Modal ──── */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedMemory(null)}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal content */}
            <motion.div
              className="relative glass-strong max-w-lg w-full p-8 md:p-10 text-center z-10"
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Emoji with glow */}
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {selectedMemory.emoji}
              </motion.div>

              {/* Date */}
              <p className="text-xs text-rose-dried/50 tracking-[0.2em] font-sans mb-2">
                {selectedMemory.date}
              </p>

              {/* Title */}
              <h3 className="text-3xl font-script text-gradient-love mb-1">
                {selectedMemory.title}
              </h3>

              {/* Subtitle */}
              <p className="text-sm text-rose-dried/60 mb-6 font-sans">
                {selectedMemory.subtitle}
              </p>

              {/* Ornament divider */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-rose-dried/20" />
                <span className="text-rose-dried/25 text-xs">❤</span>
                <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-rose-dried/20" />
              </div>

              {/* Description — the love letter */}
              <p className="text-base text-rose-deep/80 leading-relaxed font-serif italic mb-8 px-2">
                "{selectedMemory.description}"
              </p>

              {/* Photo placeholder */}
              <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-rose-soft via-rose-warm to-rose-peach flex items-center justify-center mb-6 border border-white/30 overflow-hidden">
                {selectedMemory.imageUrl ? (
                  <img
                    src={selectedMemory.imageUrl}
                    alt={selectedMemory.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-rose-dried/30">
                    <motion.div
                      className="text-5xl mb-2"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      📸
                    </motion.div>
                    <p className="text-xs font-sans">放一张你们的照片在这里</p>
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedMemory(null)}
                className="px-8 py-2.5 rounded-full border border-rose-dried/30 text-rose-dried/70 text-sm font-sans hover:bg-rose-dried/10 hover:border-rose-dried/50 transition-all"
              >
                合上回忆 💫
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
