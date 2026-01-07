"use client";

import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  dark?: boolean;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  dark = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(
      align === 'center' ? 'text-center' : 'text-left',
      "mb-12 md:mb-16",
      className
    )}>
      {badge && (
        <span className={cn(
          "inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4",
          dark
            ? "bg-white/10 text-accent-100"
            : "bg-primary-100 text-primary-700"
        )}>
          {badge}
        </span>
      )}
      <h2 className={cn(
        "text-4xl md:text-5xl font-bold font-serif mb-4 md:mb-6",
        dark ? "text-white" : "text-primary-900"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "text-lg md:text-xl max-w-3xl",
          align === 'center' && "mx-auto",
          dark ? "text-primary-100" : "text-muted-foreground"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
