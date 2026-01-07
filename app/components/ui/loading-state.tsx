'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center space-y-4 p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" aria-hidden="true" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
      <span className="sr-only">{message}</span>
    </div>
  );
}

export default LoadingState;
