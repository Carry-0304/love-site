"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- CONFIG ----
const SWEET_MESSAGES = [
  "你今天真好看 💕",
  "你是我见过最美的风景 ✨",
  "有你在的每一天都是晴天 ☀️",
  "你的笑容让我心跳加速 💓",
  "遇见你，花光了我所有运气 🍀",
  "你是我的小确幸 🌸",
  "全世界我最喜欢你 🥰",
  "想和你一起看遍所有日落 🌅",
  "你的眼睛里有星星 ⭐",
  "做我的小公主吧 👑",
  "今天也想你了一百遍 💭",
  "你是我宇宙的中心 🌍",
  "抱住你就不想松开 🤗",
  "你的声音是世界上最好听的音乐 🎵",
  "每天醒来第一个想到的就是你 💤",
  "你一笑，天都亮了 🌤️",
  "只要有你在，去哪里都可以 🚗",
  "你的名字是我听过最短的情诗 📝",
  "下辈子也要找到你 🔍",
  "你是我的软肋，也是我的铠甲 🛡️",
];
// --------------

interface Toast {
  id: number;
  message: string;
  x: number;
  y: number;
}

export default function ToastNotification() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const lastTapRef = useRef(0);
  const toastHistoryRef = useRef<Set<string>>(new Set());

  const addToast = useCallback((x: number, y: number) => {
    const id = nextId.current++;

    // Pick a message different from recent ones
    const available = SWEET_MESSAGES.filter(
      (m) => !toastHistoryRef.current.has(m)
    );
    if (available.length === 0) {
      // Reset history if we've used all messages
      toastHistoryRef.current.clear();
    }
    const pool = available.length > 0 ? available : SWEET_MESSAGES;
    const message = pool[Math.floor(Math.random() * pool.length)];

    // Track recent messages to avoid repeats
    toastHistoryRef.current.add(message);
    if (toastHistoryRef.current.size > 8) {
      const first = toastHistoryRef.current.values().next().value;
      if (first) toastHistoryRef.current.delete(first);
    }

    setToasts((prev) => {
      // Keep max 5 toasts on screen
      const active = prev.slice(-4);
      return [...active, { id, message, x, y }];
    });

    // Auto remove after 2.8 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  // ──── Vibration + Toast on touch (mobile) ────
  useEffect(() => {
    const handleTouchEnd = (e: TouchEvent) => {
      // Only on mobile/tablet sized screens
      if (window.innerWidth > 1024) return;

      // Skip interactive elements
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("input") ||
        target.closest("a") ||
        target.closest("textarea") ||
        target.closest("select")
      ) {
        return;
      }

      const now = Date.now();
      // Debounce: 400ms between toasts
      if (now - lastTapRef.current < 400) return;
      lastTapRef.current = now;

      // Vibration API — gentle pattern
      if (navigator.vibrate) {
        try {
          // A gentle "heartbeat" pattern: short-short-pause-short
          navigator.vibrate([25, 60, 25]);
        } catch {
          // Vibration not available
        }
      }

      const touch = e.changedTouches[0];
      if (touch) {
        addToast(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => window.removeEventListener("touchend", handleTouchEnd);
  }, [addToast]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{ overflow: "hidden" }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          // Clamp toast position to keep it fully on screen
          const clampedX = Math.min(
            Math.max(toast.x, 140),
            window.innerWidth - 140
          );
          const clampedY = Math.min(
            Math.max(toast.y - 80, 50),
            window.innerHeight - 80
          );

          return (
            <motion.div
              key={toast.id}
              className="absolute glass-strong px-4 py-2.5 text-center"
              style={{
                left: clampedX,
                top: clampedY,
                borderRadius: "20px",
                maxWidth: "240px",
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, y: 20, scale: 0.6, rotate: -5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -40, scale: 0.5, rotate: 5 }}
              transition={{
                type: "spring",
                damping: 22,
                stiffness: 350,
              }}
            >
              <p className="text-sm md:text-base font-script text-rose-deep leading-relaxed text-center">
                {toast.message}
              </p>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Floating heart on each toast — decorative */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={`heart-${toast.id}`}
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              left: toast.x,
              top: toast.y - 20,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0, y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Mini particle hearts */}
            {["💕", "💖", "💗", "✨"].map((em, i) => {
              const angle = (i / 4) * Math.PI * 2;
              const dist = 30;
              return (
                <motion.span
                  key={i}
                  className="absolute text-sm"
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist - 20,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  {em}
                </motion.span>
              );
            })}
            <motion.span
              className="text-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 0.8] }}
              transition={{ duration: 0.4 }}
            >
              ❤️
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
