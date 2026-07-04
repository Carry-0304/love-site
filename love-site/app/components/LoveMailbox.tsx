"use client";

import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- CONFIG ----
const GIRLFRIEND_NAME = "胡鑫玥";
const PASSWORD = "1229"; // Her birthday MMDD format
const PASSWORD_HINT = "提示：密码是你的生日 (A B C D格式) ";
// Voice message URLs — replace with your real audio files
const VOICE_MESSAGES = [
  { id: "1", title: "早安，宝贝 ☀️", src: "", duration: "0:15" },
  { id: "2", title: "想你的时候 🌙", src: "", duration: "0:20" },
  { id: "3", title: "睡前悄悄话 💤", src: "", duration: "0:18" },
];
// -----------------

// ============================================================
//  Text Rain Effect Canvas
// ============================================================
function TextRain({ isActive, name }: { isActive: boolean; name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -500, y: -500 });
  const dropsRef = useRef<
    Array<{
      x: number;
      y: number;
      speed: number;
      size: number;
      opacity: number;
      text: string;
    }>
  >([]);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Warm love phrases for the rain
    const phrases = [
      "我爱你", "I ❤️ U", "想你", "宝贝", "honey",
      "❤️", "miss you", "forever", "我的唯一",
      "love you", "你是光", "心动", "💕","QRK是爹", "hxy小宝贝儿"

  ];

    // Initialize with scattered drops
    dropsRef.current = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.25 + Math.random() * 1.1,
      size: 12 + Math.random() * 18,
      opacity: 0.12 + Math.random() * 0.38,
      text: phrases[Math.floor(Math.random() * phrases.length)],
    }));

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const handleTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      }
    };
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("touchmove", handleTouch);

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isMouseOnCanvas = mx > 0 && my > 0;

      dropsRef.current.forEach((drop) => {
        drop.y += drop.speed;

        // Mouse attraction —凝聚成名字
        if (isMouseOnCanvas) {
          const dx = mx - drop.x;
          const dy = my - drop.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            // Magnetic pull
            drop.x += dx * 0.04;
            drop.y += dy * 0.04;
            drop.text = name;
            drop.opacity = Math.min(0.92, drop.opacity + 0.025);
            drop.size = Math.min(34, drop.size + 0.15);
          } else if (drop.text === name && dist > 150) {
            // Release back to random phrase
            drop.text = phrases[Math.floor(Math.random() * phrases.length)];
            drop.size = 12 + Math.random() * 18;
            drop.opacity = 0.15 + Math.random() * 0.35;
          }
        }

        // Reset when off screen
        if (drop.y > canvas.height + 40) {
          drop.y = -40;
          drop.x = Math.random() * canvas.width;
          drop.opacity = 0.12 + Math.random() * 0.38;
        }
        if (drop.x < -40) drop.x = canvas.width + 40;
        if (drop.x > canvas.width + 40) drop.x = -40;

        ctx.save();
        ctx.globalAlpha = drop.opacity;

        // Name gets the deep rose color; others are softer
        const isName = drop.text === name;
        ctx.font = `${drop.size}px var(--font-script), "Dancing Script", "Noto Serif SC", serif`;
        ctx.fillStyle = isName ? "#B56576" : "#C48B8B";

        // Name text gets a subtle glow
        if (isName) {
          ctx.shadowColor = "rgba(255, 107, 138, 0.4)";
          ctx.shadowBlur = 10;
        }

        ctx.fillText(drop.text, drop.x, drop.y);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("touchmove", handleTouch);
    };
  }, [isActive, name]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1, opacity: 0.7 }}
    />
  );
}

// ============================================================
//  Typing animation for the welcome letter
// ============================================================
function Typewriter({ text, delay = 30 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay, started]);

  return <span>{displayed}</span>;
}

// ============================================================
//  Main Mailbox Component
// ============================================================
export default function LoveMailbox() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsUnlocked(true);
      setError("");
      setTimeout(() => setShowWelcome(true), 600);
    } else {
      setAttempts((a) => a + 1);
      if (attempts >= 2) {
        setError("宝贝，再想想……那个只属于你的日子 💕");
      } else if (attempts >= 1) {
        setError("差一点点～你一定能想起来的 ✨");
      } else {
        setError("密码不对哦～再猜猜看？ 💫");
      }
      setPassword("");
    }
  };

  const resetAll = () => {
    setIsUnlocked(false);
    setShowWelcome(false);
    setPassword("");
    setError("");
    setAttempts(0);
  };

  return (
    <section className="relative py-24 px-4 min-h-screen">
      {/* Section title */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-script text-gradient-love mb-3">
          QRK 💞 hxy的秘密空间
        </h2>
        <p className="text-sm text-rose-dried/60 tracking-widest font-sans">
          只有你能打开的秘密空间
        </p>
      </motion.div>

      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* ======== LOCKED STATE ======== */
            <motion.div
              key="locked"
              className="glass-strong p-10 text-center relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
            >
              {/* Subtle ambient glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 30%, rgba(255,182,193,0.15) 0%, transparent 60%)",
                }}
              />

              <div className="relative z-10">
                {/* Lock icon with gentle sway */}
                <motion.div
                  className="text-7xl mb-6"
                  animate={{
                    rotate: [0, -3, 3, -3, 0],
                    scale: [1, 1.03, 1, 1.03, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                  }}
                >
                  🔒
                </motion.div>

                <h3 className="text-2xl font-script text-rose-deep mb-2">
                  这是只属于你的秘密空间
                </h3>
                <p className="text-xs text-rose-dried/50 font-sans mb-8 tracking-wide">
                  除了你，谁也进不来
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="输入密码解锁..."
                      maxLength={6}
                      className="w-full px-5 py-3 rounded-full bg-white/50 border border-rose-dried/20 text-center text-rose-deep placeholder-rose-dried/40 outline-none focus:border-rose-dried/50 focus:ring-2 focus:ring-rose-dried/10 transition-all font-sans"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <motion.p
                      className="text-sm text-rose-deep/70 font-sans"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={error}
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-rose-dried via-rose-deep to-rose-dried text-white font-sans text-sm tracking-wider hover:shadow-lg hover:shadow-rose-dried/30 transition-all active:scale-95"
                  >
                    打开信箱 💌
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-rose-dried/40 hover:text-rose-dried/60 transition-colors font-sans underline underline-offset-4"
                  >
                    {showHint ? "隐藏提示" : "忘记密码？"}
                  </button>

                  <AnimatePresence>
                    {showHint && (
                      <motion.p
                        className="text-xs text-rose-dried/50 font-sans"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {PASSWORD_HINT}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          ) : (
            /* ======== UNLOCKED STATE ======== */
            <motion.div
              key="unlocked"
              className="glass-strong p-8 md:p-10 text-center relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ minHeight: "450px" }}
            >
              {/* Text Rain background */}
              <TextRain isActive={isUnlocked} name={GIRLFRIEND_NAME} />

              {/* Content */}
              <div className="relative z-10">
                {/* ──── Welcome Letter ──── */}
                <AnimatePresence>
                  {showWelcome && (
                    <motion.div
                      className="mb-10"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                      {/* Seal stamp */}
                      <motion.div
                        className="text-5xl mb-3"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.2,
                          type: "spring",
                          damping: 10,
                        }}
                      >
                        💝
                      </motion.div>

                      <h3 className="text-2xl md:text-3xl font-script text-gradient-love mb-4">
                        欢迎回来，{GIRLFRIEND_NAME}
                      </h3>

                      {/* Decorative seal line */}
                      <div className="flex items-center justify-center gap-3 mb-5">
                        <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-rose-dried/30" />
                        <span className="text-rose-dried/25 text-[10px] tracking-[0.3em] font-sans">
                          TOP SECRET
                        </span>
                        <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-rose-dried/30" />
                      </div>

                      {/* The letter */}
                      <motion.div
                        className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 mx-auto max-w-sm border border-white/50 text-left"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <p className="text-sm text-rose-deep/80 leading-relaxed font-sans">
                          <Typewriter
                            text={`嘿，你终于来了。\n\n这个网站只允许你一个人登录，密码是你在我心里的位置——那个最重要的日子。\n\n别人猜不到，也进不来。这是你的专属领地，我做的一切，都只想给你一个人看。\n\n所以，戴上耳机，听听我给你留的悄悄话吧。💕`}
                            delay={28}
                          />
                        </p>
                        <motion.p
                          className="text-right text-xs text-rose-dried/50 mt-4 font-script"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 3 }}
                        >
                          —— 你的专属管理员
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ──── Voice Messages ──── */}
                <div className="space-y-3">
                  <p className="text-xs text-rose-dried/50 tracking-widest font-sans mb-4">
                    🎧 我留给你的悄悄话
                  </p>

                  {VOICE_MESSAGES.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
                        playingId === msg.id
                          ? "bg-rose-dried/15 border border-rose-dried/30 shadow-inner"
                          : "bg-white/30 border border-transparent hover:bg-white/50 hover:shadow-md"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (msg.src) {
                          setPlayingId(playingId === msg.id ? null : msg.id);
                          // TODO: integrate real audio playback
                        }
                      }}
                    >
                      {/* Play button */}
                      <motion.div
                        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                          playingId === msg.id
                            ? "bg-rose-deep text-white shadow-md"
                            : "bg-rose-dried/12 text-rose-deep"
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {playingId === msg.id ? "⏸" : "▶"}
                      </motion.div>

                      <div className="flex-1 text-left">
                        <p className="text-sm font-sans text-rose-deep font-medium">
                          {msg.title}
                        </p>
                        <p className="text-xs text-rose-dried/50 font-sans">
                          {msg.src ? `点击播放 · ${msg.duration}` : `即将上传 · ${msg.duration}`}
                        </p>
                      </div>

                      {/* Sound wave animation when playing */}
                      {playingId === msg.id && (
                        <div className="flex items-end gap-[2px] h-6">
                          {[3, 6, 2, 8, 4, 7, 5].map((h, i) => (
                            <motion.div
                              key={i}
                              className="w-[3px] rounded-full bg-rose-deep/60"
                              animate={{
                                height: [`${h * 2}px`, `${h * 3}px`, `${h * 2}px`],
                              }}
                              transition={{
                                duration: 0.5 + i * 0.08,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Empty state: upload hint */}
                  {VOICE_MESSAGES.every((m) => !m.src) && (
                    <motion.p
                      className="text-xs text-rose-dried/40 font-sans mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      把音频文件放到 public/audio/ 目录下，<br />
                      然后在这里设置 src 路径就可以播放啦 🎵
                    </motion.p>
                  )}
                </div>

                {/* Lock again */}
                <button
                  onClick={resetAll}
                  className="mt-8 text-xs text-rose-dried/40 hover:text-rose-dried/60 transition-colors font-sans"
                >
                  🔒 重新锁上
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
