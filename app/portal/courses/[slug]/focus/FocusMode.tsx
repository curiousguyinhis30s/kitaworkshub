'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
}

interface FocusModeProps {
  lessons: Lesson[];
  currentLessonIndex: number;
  onComplete: () => void;
  onExit: () => void;
  onNavigate?: (index: number) => void;
}

const FocusMode: React.FC<FocusModeProps> = ({
  lessons,
  currentLessonIndex,
  onComplete,
  onExit,
  onNavigate,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const progressPercentage = ((currentLessonIndex + 1) / lessons.length) * 100;
  const currentLesson = lessons[currentLessonIndex];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        animateOut(onExit);
      }
      if (e.key === 'ArrowRight' && currentLessonIndex < lessons.length - 1) {
        onNavigate?.(currentLessonIndex + 1);
      }
      if (e.key === 'ArrowLeft' && currentLessonIndex > 0) {
        onNavigate?.(currentLessonIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLessonIndex, lessons.length, onExit, onNavigate]);

  // Entry animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
        .fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
        .fromTo(contentRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .fromTo(footerRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  const animateOut = (callback: () => void) => {
    const tl = gsap.timeline({ onComplete: callback });

    tl.to(headerRef.current, { y: -20, opacity: 0, duration: 0.3 })
      .to(contentRef.current, { scale: 0.95, opacity: 0, duration: 0.3 }, '-=0.2')
      .to(footerRef.current, { y: 20, opacity: 0, duration: 0.3 }, '-=0.2')
      .to(overlayRef.current, { opacity: 0, duration: 0.3 }, '-=0.1');
  };

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      onNavigate?.(currentLessonIndex + 1);
    } else {
      onComplete();
      animateOut(onExit);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      onNavigate?.(currentLessonIndex - 1);
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex flex-col bg-neutral-950 text-white font-sans overflow-hidden"
    >
      {/* Header */}
      <header
        ref={headerRef}
        className="flex-none px-6 py-4 border-b border-white/10 bg-neutral-900/50 backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-neutral-400 truncate pr-4">
            {currentLesson.title}
          </h2>
          <button
            onClick={() => animateOut(onExit)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            aria-label="Exit Focus Mode"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary-600 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main
        ref={contentRef}
        className="flex-1 relative flex items-center justify-center p-6 lg:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-4xl mx-auto">
          {currentLesson.videoUrl ? (
            <div className="aspect-video bg-black rounded-lg shadow-2xl overflow-hidden border border-white/5">
              <video
                src={currentLesson.videoUrl}
                controls
                className="w-full h-full"
                autoPlay
              />
            </div>
          ) : (
            <div className="prose prose-invert prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: currentLesson.content || '<p>Lesson content goes here...</p>',
                }}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="flex-none px-6 py-4 border-t border-white/10 bg-neutral-900/50 backdrop-blur-md"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-sm font-medium text-neutral-500">
            Lesson {currentLessonIndex + 1} of {lessons.length}
          </div>

          <div className="flex items-center gap-4">
            {currentLessonIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20 transition-all transform hover:scale-105 active:scale-95"
            >
              {currentLessonIndex === lessons.length - 1 ? 'Finish' : 'Next Lesson'}
              {currentLessonIndex < lessons.length - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FocusMode;
