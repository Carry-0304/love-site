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
    date: "2026.05.14",
    title: "初遇",
    subtitle: "GOD!你让我等太久了！！！",
    description:
      "茫茫歌海里千千万万首歌，我唯独在那个夜晚点开了和你相遇的契机。素未谋面的两个人，靠着一首首喜欢的歌慢慢靠近。感谢网易云那晚的奇妙相遇，我对你非常感兴趣！",
    emoji: "💫",
    imageUrl: "/chuyu.jpg",
  },
  {
    id: "heartbeat",
    date: "2026.05.15~06.15",
    title: "暧昧",
    subtitle: "我跟你聊天从来不是为了聊天，我是为了让你习惯我的存在，        直到你离不开~",
    description:
      "那段暧昧，你以为是你情我愿的试探？\n" +
        "不。是我设的局，你心甘情愿跳了进来。\n" +
        "而现在——你永远别想出去了。",
    emoji: "💓",
    imageUrl: "/aimei.jpg",
  },
  {
    id: "first-date",
    date: "2026.06.14",
    title: "第一次约会",
    subtitle: "我心里只有一个声音：这个女人，我要定了",
    description:
      "江边的晚风温柔得不像话，我们坐在江边上，中间隔着一张纸的距离。我们喝着酒听着歌，聊了很久很久，我看着你的侧脸你的眼睛，心里面在盘算得到你。",
    emoji: "🌙",
    imageUrl: "/jiangbian.jpg",
  },
  {
    id: "confession",
    date: "2026.06.15",
    title: "告白",
    subtitle: "最幸福的一天",
    description:
      "你问过我为什么选那天表白，因为那天你的发丝的香气，你的笑很认真，而我再也不想用“朋友”的身份和你相处。说出口的那一刻，手在抖，心却在说：终于，I catch u!",
    emoji: "💌",
    imageUrl: "/yiwei.jpg",
  },
  {
    id: "together",
    date: "henceforth",
    title: "相爱",
    subtitle: "从这一天起",
    description:
      "重庆很好玩，你这个导游我很满意！什么都比不上我们相拥热吻那一刻。从这一天起，我不再是一个人了——我们的故事，正式开始。往后的每一个春夏秋冬，都想和你一起慢慢走。",
    emoji: "💍",
    imageUrl: "/jiangbian.jpg",
  },
];
// ----------------------------------------

export default function MemoryTimeline() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef(0);

  const clickFlag = useRef(false);

  const handleDown = () => {
    clickFlag.current = true;
    if (scrollRef.current) {
      dragStartRef.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMove = () => {
    if (clickFlag.current && scrollRef.current) {
      const moved = Math.abs(scrollRef.current.scrollLeft - dragStartRef.current);
      if (moved > 5) clickFlag.current = false;
    }
  };

  const handleMemoryClick = (memory: Memory) => {
    if (clickFlag.current) {
      setSelectedMemory(memory);
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
          onMouseDown={handleDown}
          onTouchStart={handleDown}
          onTouchMove={handleMove}
          onScroll={handleMove}
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
