'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseProgressProps {
  enrollmentId: string;
  lessonId: string;
  initialTime?: number;
}

export const useProgress = ({ enrollmentId, lessonId, initialTime = 0 }: UseProgressProps) => {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const timeSpentRef = useRef(0);
  const lastSaveTimeRef = useRef(Date.now());
  const localStorageKey = `kita_progress_${enrollmentId}_${lessonId}`;

  // Load initial progress
  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Try localStorage first
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem(localStorageKey);
          if (saved) {
            const data = JSON.parse(saved);
            setCurrentTime(data.videoPosition || 0);
            setIsCompleted(data.completed || false);
          }
        }

        // Then fetch from API
        const response = await fetch(
          `/api/progress?enrollmentId=${enrollmentId}&lessonId=${lessonId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.video_position_sec) {
            setCurrentTime(data.video_position_sec);
          }
          if (data.completed_at) {
            setIsCompleted(true);
          }
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [enrollmentId, lessonId, localStorageKey]);

  // Save progress function
  const saveProgress = useCallback(async () => {
    const dataToSave = {
      videoPosition: currentTime,
      timeSpent: timeSpentRef.current,
      completed: isCompleted,
    };

    // Save to localStorage immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem(localStorageKey, JSON.stringify(dataToSave));
    }

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          lessonId,
          ...dataToSave,
        }),
      });
    } catch (error) {
      console.warn('Failed to sync progress to server:', error);
    }
  }, [currentTime, isCompleted, enrollmentId, lessonId, localStorageKey]);

  // Auto-save every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastSaveTimeRef.current) / 1000;

      timeSpentRef.current += 1;

      if (delta >= 10) {
        saveProgress();
        lastSaveTimeRef.current = now;
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      saveProgress();
    };
  }, [saveProgress]);

  // Complete lesson
  const handleCompleteLesson = useCallback(async () => {
    setIsCompleted(true);

    if (typeof window !== 'undefined') {
      const data = {
        videoPosition: currentTime,
        timeSpent: timeSpentRef.current,
        completed: true,
      };
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    }

    try {
      await fetch(`/api/progress/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      });
    } catch (error) {
      console.error('Failed to mark complete:', error);
    }
  }, [currentTime, enrollmentId, lessonId, localStorageKey]);

  // Update time
  const updateTime = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  return {
    currentTime,
    setCurrentTime: updateTime,
    loading,
    isCompleted,
    handleCompleteLesson,
    saveProgress,
  };
};

export default useProgress;
