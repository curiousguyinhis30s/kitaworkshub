'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface ProgressAnimationProps {
  value: number;
  max: number;
  duration?: number;
  color?: string;
  height?: string;
  className?: string;
  showLabel?: boolean;
}

const ProgressAnimation: React.FC<ProgressAnimationProps> = ({
  value,
  max,
  duration = 1.5,
  color = '#0a3d21',
  height = '10px',
  className = '',
  showLabel = false,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    if (!barRef.current) return;

    gsap.fromTo(
      barRef.current,
      { width: '0%' },
      {
        width: `${percentage}%`,
        duration,
        ease: 'power2.out',
      }
    );

    if (showLabel && textRef.current) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: Math.round(value),
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          if (textRef.current) {
            textRef.current.textContent = String(Math.round(obj.val));
          }
        },
      });
    }
  }, [value, max, duration, showLabel, percentage]);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-end mb-1">
        {showLabel && (
          <span ref={textRef} className="text-sm font-bold" style={{ color }}>
            0
          </span>
        )}
        <span className="text-xs text-gray-500">
          {value} / {max}
        </span>
      </div>
      <div
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          ref={barRef}
          className="h-full rounded-full shadow-sm"
          style={{ backgroundColor: color, width: '0%' }}
        />
      </div>
    </div>
  );
};

export default ProgressAnimation;
