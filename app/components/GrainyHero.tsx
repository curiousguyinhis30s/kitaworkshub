'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface GrainyHeroProps {
  children: React.ReactNode;
  className?: string;
}

export default function GrainyHero({ children, className = '' }: GrainyHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Floating orb animations with GSAP for smoother 60fps performance
    if (orb1Ref.current) {
      gsap.to(orb1Ref.current, {
        x: 80,
        y: -40,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, {
        x: -60,
        y: 30,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    if (orb3Ref.current) {
      gsap.to(orb3Ref.current, {
        scale: 1.15,
        x: 25,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className={`relative min-h-[700px] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Dark Gradient Background - Using primary palette */}
      <div
        className="absolute inset-0 animate-gradient-pan"
        style={{
          background: 'linear-gradient(135deg, #07160c 0%, #0f2b18 25%, #1e3a28 50%, #0a1f10 75%, #163020 100%)',
          backgroundSize: '300% 300%',
        }}
      />

      {/* Grain Texture Overlay */}
      <div
        className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
        style={{ filter: 'url(#noiseFilter)' }}
      />

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30" />

      {/* GSAP Animated Floating Orbs for depth */}
      <div
        ref={orb1Ref}
        className="absolute top-10 left-5 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(15, 43, 24, 0.6)' }}
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-10 right-5 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(30, 58, 40, 0.5)' }}
      />
      {/* Subtle gold accent orb */}
      <div
        ref={orb3Ref}
        className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(201, 169, 98, 0.08)' }}
      />

      {/* SVG Noise Filter */}
      <svg className="hidden">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
