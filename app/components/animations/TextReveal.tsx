'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface TextRevealProps {
  text: string;
  type?: 'char' | 'word';
  stagger?: number;
  delay?: number;
  className?: string;
  fromY?: number;
}

const TextReveal: React.FC<TextRevealProps> = ({
  text,
  type = 'word',
  stagger = 0.05,
  delay = 0,
  className = '',
  fromY = 100,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    ctxRef.current = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      const splitText = (str: string, mode: 'char' | 'word') => {
        if (mode === 'word') {
          return str
            .split(' ')
            .map(
              (word) =>
                `<span class="inline-block overflow-hidden"><span class="inline-block reveal-word">${word}&nbsp;</span></span>`
            )
            .join('');
        } else {
          return str
            .split('')
            .map(
              (char) =>
                `<span class="inline-block overflow-hidden"><span class="inline-block reveal-char">${char === ' ' ? '&nbsp;' : char}</span></span>`
            )
            .join('');
        }
      };

      container.innerHTML = splitText(text, type);

      const targets =
        type === 'word'
          ? container.querySelectorAll('.reveal-word')
          : container.querySelectorAll('.reveal-char');

      gsap.set(targets, { y: fromY, opacity: 0, rotationX: -90 });

      gsap.to(targets, {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        stagger: stagger,
        delay: delay,
        ease: 'back.out(1.7)',
      });
    }, containerRef);

    return () => {
      ctxRef.current?.revert();
    };
  }, [text, type, stagger, delay, fromY]);

  return <div ref={containerRef} className={className} />;
};

export default TextReveal;
