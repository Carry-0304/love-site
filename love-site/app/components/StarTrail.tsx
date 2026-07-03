"use client";

import { useEffect, useRef } from "react";

interface TrailParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
}

export default function StarTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef({ x: -100, y: -100 });
  const prevRef = useRef({ x: -100, y: -100 });
  const trailsRef = useRef<TrailParticle[]>([]);

  useEffect(() => {
    // Don't show custom cursor on mobile
    if (window.innerWidth < 768) return;

    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      prevRef.current = { ...cursorRef.current };
      cursorRef.current = { x: e.clientX, y: e.clientY };

      // Add trail particles between previous and current position
      const dx = cursorRef.current.x - prevRef.current.x;
      const dy = cursorRef.current.y - prevRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 2 && dist < 100) {
        const steps = Math.floor(dist / 3);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          trailsRef.current.push({
            x: prevRef.current.x + dx * t + (Math.random() - 0.5) * 6,
            y: prevRef.current.y + dy * t + (Math.random() - 0.5) * 6,
            size: 1 + Math.random() * 2.5,
            alpha: 0.7 + Math.random() * 0.3,
            life: 0,
            maxLife: 15 + Math.random() * 30,
            color: Math.random() > 0.5 ? "#FFB6C1" : "#FFDAB9",
          });
        }
      }
    };
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw trails
      trailsRef.current = trailsRef.current.filter((p) => {
        p.life++;
        p.alpha = Math.max(0, p.alpha * 0.94);
        p.size *= 0.97;

        if (p.life >= p.maxLife || p.alpha < 0.02) return false;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // Draw tiny star shape
        drawStar(ctx, p.x, p.y, p.size);

        ctx.restore();
        return true;
      });

      // Limit trails
      if (trailsRef.current.length > 200) {
        trailsRef.current = trailsRef.current.slice(-200);
      }

      // Draw cursor ring
      const { x, y } = cursorRef.current;
      if (x > 0 && y > 0) {
        // Outer ring
        ctx.strokeStyle = "rgba(181, 101, 118, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.stroke();

        // Inner glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        gradient.addColorStop(0, "rgba(255, 182, 193, 0.3)");
        gradient.addColorStop(1, "rgba(255, 182, 193, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  function drawStar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) {
    const spikes = 4;
    const outerRadius = size;
    const innerRadius = size * 0.4;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none hidden md:block"
      style={{ zIndex: 50 }}
    />
  );
}
