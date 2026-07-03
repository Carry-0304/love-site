"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function LoadingHeart({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExploding, setIsExploding] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    // Start explosion after 2.5 seconds
    const timer = setTimeout(() => {
      setIsExploding(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isExploding || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create heart particles
    const colors = [
      "#FF6B8A", "#FF8FA6", "#FFB3C6", "#FFD1DC",
      "#FFE4E1", "#FFC0CB", "#FF85A2", "#D4A574",
      "#F0D9B5", "#FFB7B2",
    ];

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: cy + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 2 + Math.random() * 8,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 60 + Math.random() * 80,
      });
    }

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.vx *= 0.99;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // Draw heart shape for some particles
        if (Math.random() > 0.5 && p.size > 4) {
          drawMiniHeart(ctx, p.x, p.y, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // Add sparkle particles occasionally
      if (frame % 5 === 0 && frame < 80) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push({
            x: cx + (Math.random() - 0.5) * 100,
            y: cy + (Math.random() - 0.5) * 100,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 3,
            size: 1 + Math.random() * 3,
            alpha: 1,
            color: "#FFF",
            life: 0,
            maxLife: 20 + Math.random() * 20,
          });
        }
      }

      if (frame < 120) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Fade out canvas and trigger onComplete
        setIsVisible(false);
        setTimeout(onComplete, 500);
      }
    };

    animate();

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isExploding, onComplete]);

  function drawMiniHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    const s = size * 0.6;
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s * 0.3);
    ctx.bezierCurveTo(x - s, y + s * 0.8, x, y + s * 1.2, x, y + s * 1.5);
    ctx.bezierCurveTo(x, y + s * 1.2, x + s, y + s * 0.8, x + s, y + s * 0.3);
    ctx.bezierCurveTo(x + s, y, x, y, x, y + s * 0.3);
    ctx.fill();
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #FFE4E1 0%, #FFF0F5 40%, #FFDAB9 100%)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 3D Beating Heart */}
          {!isExploding && (
            <motion.div
              className="relative flex flex-col items-center gap-6"
              initial={{ scale: 0, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              {/* Heart shape using CSS */}
              <motion.div
                className="relative w-32 h-32"
                animate={{
                  scale: [1, 1.15, 1, 1.15, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  filter: "drop-shadow(0 0 30px rgba(255, 107, 138, 0.6)) drop-shadow(0 0 60px rgba(255, 107, 138, 0.3))",
                }}
              >
                {/* Left lobe */}
                <div
                  className="absolute"
                  style={{
                    width: "50px",
                    height: "80px",
                    background: "linear-gradient(180deg, #FF6B8A 0%, #FF3D6E 100%)",
                    borderRadius: "50px 50px 0 0",
                    left: "32px",
                    top: "0",
                    transform: "rotate(-45deg)",
                    transformOrigin: "0 100%",
                  }}
                />
                {/* Right lobe */}
                <div
                  className="absolute"
                  style={{
                    width: "50px",
                    height: "80px",
                    background: "linear-gradient(180deg, #FF6B8A 0%, #FF3D6E 100%)",
                    borderRadius: "50px 50px 0 0",
                    left: "50px",
                    top: "0",
                    transform: "rotate(45deg)",
                    transformOrigin: "100% 100%",
                  }}
                />
                {/* Bottom point */}
                <div
                  className="absolute"
                  style={{
                    width: "0",
                    height: "0",
                    borderLeft: "25px solid transparent",
                    borderRight: "25px solid transparent",
                    borderTop: "30px solid #FF3D6E",
                    left: "39px",
                    top: "62px",
                  }}
                />
                {/* Glow overlay */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
                    filter: "blur(10px)",
                  }}
                />
              </motion.div>

              <motion.p
                className="text-xl font-script text-rose-deep"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                正在为你准备惊喜...
              </motion.p>
            </motion.div>
          )}

          {/* Particle explosion canvas */}
          {isExploding && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0"
              style={{ pointerEvents: "none" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
