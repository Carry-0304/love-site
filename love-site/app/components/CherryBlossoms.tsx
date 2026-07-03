"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  swaySpeed: number;
  swayAmount: number;
  opacity: number;
  color: string;
  phase: number;
}

interface HeartBurst {
  id: number;
  x: number;
  y: number;
}

export default function CherryBlossoms() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number>(0);
  const [heartBursts, setHeartBursts] = useState<HeartBurst[]>([]);
  const nextBurstId = useRef(0);

  const spawnHeart = useCallback((x: number, y: number) => {
    const id = nextBurstId.current++;
    setHeartBursts((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setHeartBursts((prev) => prev.filter((b) => b.id !== id));
    }, 1200);
  }, []);

  const initPetals = useCallback(() => {
    if (!canvasRef.current) return;
    const w = canvasRef.current.width;
    const colors = [
      "rgba(255, 182, 193, ",
      "rgba(255, 192, 203, ",
      "rgba(255, 218, 185, ",
      "rgba(255, 228, 225, ",
      "rgba(255, 240, 245, ",
    ];

    petalsRef.current = Array.from({ length: 45 }, () => ({
      x: Math.random() * w,
      y: Math.random() * window.innerHeight,
      size: 8 + Math.random() * 18,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      fallSpeed: 0.4 + Math.random() * 1.2,
      swaySpeed: 0.01 + Math.random() * 0.03,
      swayAmount: 20 + Math.random() * 60,
      opacity: 0.3 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  // Petal animation
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPetals();
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petalsRef.current.forEach((p) => {
        p.y += p.fallSpeed;
        p.rotation += p.rotationSpeed;
        p.x += Math.sin(p.phase + performance.now() * p.swaySpeed) * p.swayAmount * 0.01;

        if (p.y > canvas.height + 30) {
          p.y = -30;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        // Draw sakura petal
        ctx.fillStyle = p.color + "0.8)";
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Center vein
        ctx.strokeStyle = p.color + "0.4)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.25);
        ctx.lineTo(0, p.size * 0.25);
        ctx.stroke();

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initPetals]);

  // Global click handler — spawn hearts on click (skips interactive elements)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't spawn hearts when clicking buttons, inputs, links, or modals
      if (
        target.closest("button") ||
        target.closest("input") ||
        target.closest("a") ||
        target.closest("textarea") ||
        target.closest("select") ||
        target.closest("[data-no-heart]")
      ) {
        return;
      }
      spawnHeart(e.clientX, e.clientY);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [spawnHeart]);

  return (
    <>
      {/* Petal rendering canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Heart burst overlays */}
      <AnimatePresence>
        {heartBursts.map((burst) => (
          <motion.div
            key={burst.id}
            className="fixed pointer-events-none flex items-center justify-center"
            style={{
              left: burst.x,
              top: burst.y,
              transform: "translate(-50%, -50%)",
              zIndex: 4,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const distance = 40 + Math.random() * 60;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ fontSize: `${12 + Math.random() * 16}px` }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance - 30,
                    opacity: 0,
                    scale: 1.3,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {["💕", "💖", "💗", "💝", "✨", "🌸", "💓", "🩷"][i]}
                </motion.div>
              );
            })}
            <motion.div
              className="text-4xl"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.4, 1] }}
              transition={{ duration: 0.4 }}
            >
              ❤️
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
