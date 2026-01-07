"use client";

import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface FormAlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  className?: string;
}

const alertStyles = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: CheckCircle2,
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: AlertCircle,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: AlertTriangle,
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Info,
  },
};

export function FormAlert({ type, message, title, className }: FormAlertProps) {
  const styles = alertStyles[type];
  const Icon = styles.icon;

  return (
    <div className={cn(
      "p-4 rounded-lg border flex items-start gap-3",
      styles.container,
      className
    )}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        {title && <p className="font-medium">{title}</p>}
        <p className={cn("text-sm", title && "mt-1")}>{message}</p>
      </div>
    </div>
  );
}

interface FormSuccessStateProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
  className?: string;
}

export function FormSuccessState({
  title,
  message,
  buttonText,
  onButtonClick,
  className,
}: FormSuccessStateProps) {
  return (
    <div className={cn("text-center py-8", className)}>
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-primary-900 mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      <Button onClick={onButtonClick} variant="outline">
        {buttonText}
      </Button>
    </div>
  );
}
