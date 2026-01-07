'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type ReactNode, useRef } from 'react';

// Register plugins globally
gsap.registerPlugin(ScrollTrigger);

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider = ({ children }: AnimationProviderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Global GSAP defaults for consistent, smooth animations
    gsap.defaults({
      ease: 'power3.out',
      overwrite: 'auto'
    });

    // ScrollTrigger config for responsive handling
    ScrollTrigger.config({
      ignoreMobileResize: true
    });

    // Refresh on route changes for Next.js
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: containerRef });

  return <div ref={containerRef}>{children}</div>;
};

export default AnimationProvider;
