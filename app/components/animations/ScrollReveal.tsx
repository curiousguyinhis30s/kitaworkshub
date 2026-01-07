'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  threshold?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  className = '',
  threshold = 0.1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const getInitialPos = () => {
      switch (direction) {
        case 'up':
          return { y: 50, opacity: 0 };
        case 'down':
          return { y: -50, opacity: 0 };
        case 'left':
          return { x: 50, opacity: 0 };
        case 'right':
          return { x: -50, opacity: 0 };
        default:
          return { y: 50, opacity: 0 };
      }
    };

    gsap.set(element, getInitialPos());

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);

          gsap.to(element, {
            x: 0,
            y: 0,
            opacity: 1,
            duration,
            delay,
            ease: 'power3.out',
          });

          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delay, duration, direction, threshold, isVisible]);

  return (
    <div ref={containerRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

export default ScrollReveal;
