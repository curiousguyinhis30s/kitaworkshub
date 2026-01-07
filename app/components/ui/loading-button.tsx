"use client";

import { forwardRef } from 'react';
import { Loader2, ArrowRight, LucideIcon } from 'lucide-react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({
    isLoading = false,
    loadingText = 'Loading...',
    icon: Icon = ArrowRight,
    iconPosition = 'right',
    children,
    disabled,
    className,
    ...props
  }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn("disabled:opacity-50", className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            {iconPosition === 'left' && Icon && <Icon className="mr-2 w-5 h-5" />}
            {children}
            {iconPosition === 'right' && Icon && <Icon className="ml-2 w-5 h-5" />}
          </>
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';
