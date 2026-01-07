"use client";

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  variant?: 'primary' | 'accent' | 'emerald' | 'amber' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  primary: 'bg-gradient-to-br from-primary-600 to-primary-700 text-white',
  accent: 'bg-gradient-to-br from-accent-500 to-accent-600 text-white',
  emerald: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white',
  amber: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white',
  white: 'bg-white border border-primary-100 text-primary-900 shadow-sm',
};

const sizeStyles = {
  sm: { container: 'p-4 rounded-xl', icon: 20, value: 'text-2xl' },
  md: { container: 'p-6 rounded-2xl', icon: 28, value: 'text-4xl' },
  lg: { container: 'p-8 rounded-2xl', icon: 32, value: 'text-5xl' },
};

export function StatCard({
  icon: Icon,
  value,
  label,
  variant = 'primary',
  size = 'md',
  className,
}: StatCardProps) {
  const styles = sizeStyles[size];
  const isWhite = variant === 'white';

  return (
    <div className={cn(variantStyles[variant], styles.container, className)}>
      <div className="flex items-center justify-between mb-2">
        <Icon
          size={styles.icon}
          className={isWhite ? 'text-primary-600' : 'text-white/80'}
        />
        <span className={cn('font-bold', styles.value)}>{value}</span>
      </div>
      <p className={cn(
        'text-sm',
        isWhite ? 'text-muted-foreground' : 'text-white/80'
      )}>
        {label}
      </p>
    </div>
  );
}

interface StatCardsGridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}

export function StatCardsGrid({ children, cols = 4, className }: StatCardsGridProps) {
  const colsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn(
      'grid gap-4 lg:gap-6 mb-8',
      colsClass[cols],
      className
    )}>
      {children}
    </div>
  );
}
