"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  baseY: number;
  speed: number;
  amplitude: number;
  phase: number;
  opacity: number;
  color: string;
  glowSize: number;
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const colors = [
        "rgba(255, 182, 193, ",
        "rgba(255, 218, 185, ",
        "rgba(255, 228, 225, ",
        "rgba(240, 217, 181, ",
        "rgba(255, 192, 203, ",
      ];
      particlesRef.current = Array.from({ length: 35 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1.5 + Math.random() * 4,
        baseY: Math.random() * canvas.height,
        speed: 0.002 + Math.random() * 0.008,
        amplitude: 20 + Math.random() * 60,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.2 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        glowSize: 10 + Math.random() * 25,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: mx, y: my } = mouseRef.current;

      particlesRef.current.forEach((p) => {
        // Gentle floating motion
        p.y = p.baseY + Math.sin(frame * p.speed + p.phase) * p.amplitude;
        p.x += Math.cos(frame * p.speed * 0.7 + p.phase) * 0.3;

        // Slight attraction to mouse
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.5;
          p.x += dx * force * 0.02;
          p.y += dy * force * 0.02;
        }

        // Wrap around edges
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        // Draw glowing particle
        ctx.save();

        // Outer glow
        const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowSize);
        glowGradient.addColorStop(0, p.color + (p.opacity + 0.3) + ")");
        glowGradient.addColorStop(0.3, p.color + p.opacity * 0.5 + ")");
        glowGradient.addColorStop(1, p.color + "0)");
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = p.color + Math.min(1, p.opacity + 0.2) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
