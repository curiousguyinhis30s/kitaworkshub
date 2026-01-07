'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Zap, TrendingUp } from 'lucide-react';

interface XPBarProps {
  currentXP: number;
  level: number;
  title: string;
  nextLevelXP: number;
  progress: number;
  className?: string;
}

const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  level,
  title,
  nextLevelXP,
  progress,
  className = '',
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const xpRef = useRef<HTMLSpanElement>(null);
  const [animatedXP, setAnimatedXP] = useState(0);

  useEffect(() => {
    if (!barRef.current) return;

    // Animate progress bar
    gsap.to(barRef.current, {
      width: `${progress}%`,
      duration: 1.5,
      ease: 'power2.out',
    });

    // Animate XP counter
    const obj = { val: animatedXP };
    gsap.to(obj, {
      val: currentXP,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        setAnimatedXP(Math.round(obj.val));
      },
    });
  }, [currentXP, progress, animatedXP]);

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Level {level}</span>
              <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-medium">
                {title}
              </span>
            </div>
            <span ref={xpRef} className="text-xs text-gray-500">
              {animatedXP.toLocaleString()} XP
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-medium">
              {(nextLevelXP - currentXP).toLocaleString()} to next level
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
          style={{ width: '0%' }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">
          Level {level}
        </span>
        <span className="text-[10px] text-gray-400">
          Level {level + 1}
        </span>
      </div>
    </div>
  );
};

export default XPBar;
