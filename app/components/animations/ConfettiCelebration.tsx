'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ConfettiCelebrationProps {
  trigger?: boolean;
  duration?: number;
  colors?: string[];
  particleCount?: number;
}

interface Particle {
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
}

const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  trigger = false,
  duration = 3,
  colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F7FFF7'],
  particleCount = 100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!trigger || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: centerX,
      y: centerY,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: gsap.utils.random(0.5, 1.5),
    }));

    particlesRef.current.forEach((p) => {
      const destX = p.x + gsap.utils.random(-300, 300);
      const destY = p.y + gsap.utils.random(-400, -100);

      gsap.to(p, {
        x: destX + gsap.utils.random(-100, 100),
        y: destY + 600,
        rotation: p.rotation + gsap.utils.random(-720, 720),
        duration: duration + gsap.utils.random(0, 1),
        ease: 'power1.out',
        delay: gsap.utils.random(0, 0.2),
      });
    });

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(p.scale, p.scale);
        ctx.fillStyle = p.color;
        ctx.fillRect(-5, -5, 10, 10);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [trigger, duration, colors, particleCount]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
};

export default ConfettiCelebration;
