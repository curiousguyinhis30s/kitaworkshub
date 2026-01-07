'use client';

import React from 'react';
import Image from 'next/image';

interface WarmHeroProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'sage' | 'subtle' | 'split';
  imageSrc?: string;
  imageAlt?: string;
}

/**
 * WarmHero - A calm, human-centric hero section
 * Follows the KitaWorksHub brand: warm off-white backgrounds with subtle accent blobs
 */
export default function WarmHero({
  children,
  className = '',
  variant = 'default',
  imageSrc,
  imageAlt = 'Hero image'
}: WarmHeroProps) {

  // Split layout variant with image on the side
  if (variant === 'split' && imageSrc) {
    return (
      <section className={`relative min-h-[600px] overflow-hidden bg-background ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Content side */}
            <div className="relative z-10 py-16 lg:py-24">
              {children}
            </div>

            {/* Image side - visible on large screens */}
            <div className="relative hero-image-container">
              <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-sage-900/20 to-transparent" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-peach-200 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-sage-200 rounded-full -z-10" />
            </div>
          </div>
        </div>

        {/* Background blobs */}
        <div
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, var(--color-sage-100) 0%, transparent 70%)',
          }}
        />
      </section>
    );
  }

  return (
    <section
      className={`relative min-h-[600px] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Warm Off-White Background */}
      <div className="absolute inset-0 bg-background" />

      {/* Optional background image */}
      {imageSrc && (
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>
      )}

      {/* Subtle decorative blobs - gentle, not distracting */}
      {variant === 'default' && (
        <>
          {/* Top-right sage blob */}
          <div
            className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full opacity-40 animate-gentle-pulse pointer-events-none"
            style={{
              background: 'radial-gradient(circle, var(--color-sage-100) 0%, transparent 70%)',
            }}
          />
          {/* Bottom-left peach blob */}
          <div
            className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, var(--color-peach-100) 0%, transparent 70%)',
              animationDelay: '2s',
            }}
          />
        </>
      )}

      {variant === 'sage' && (
        <>
          {/* Full sage-tinted background */}
          <div className="absolute inset-0 bg-sage-50" />
          {/* Subtle white gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(255,255,255,0.3) 100%)',
            }}
          />
        </>
      )}

      {variant === 'subtle' && (
        <>
          {/* Very minimal decoration */}
          <div
            className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, var(--color-sage-50), transparent)',
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
}
