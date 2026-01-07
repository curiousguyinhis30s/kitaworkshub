'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertVariants = {
  error: 'bg-red-50 border-red-500 text-red-700',
  success: 'bg-green-50 border-green-500 text-green-700',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-700',
  info: 'bg-blue-50 border-blue-500 text-blue-700',
};

const iconMap = {
  error: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'error' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
}

export function Alert({
  className,
  variant = 'info',
  children,
  ...props
}: AlertProps) {
  const Icon = iconMap[variant];

  const isAlert = variant === 'error' || variant === 'warning';
  const role = isAlert ? 'alert' : 'status';
  const ariaLive = isAlert ? 'assertive' : 'polite';

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={cn(
        'relative w-full rounded-lg border p-4 flex items-start gap-3',
        alertVariants[variant],
        className
      )}
      {...props}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 text-sm font-medium leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default Alert;
