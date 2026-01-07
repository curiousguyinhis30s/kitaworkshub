"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { TreeLogo } from './icons/TreeLogo';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Courses', href: '/courses' },
    { name: 'Events', href: '/events' },
    { name: 'Community', href: '/community' },
    { name: 'Contact', href: '/contact' },
  ];

  const portalLinks = [
    { name: 'Client Portal', href: '/portal' },
    { name: 'Admin', href: '/admin' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-surface'
            : 'bg-background/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="KitaWorksHub home"
            >
              <TreeLogo size={40} className="text-sage-500 group-hover:text-sage-600 transition-colors" />
              <div>
                <span className="text-xl md:text-2xl font-semibold text-text tracking-tight font-heading">KitaWorksHub</span>
                <p className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-medium">Where Leaders Grow Deep</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-sage-700 bg-sage-50'
                      : 'text-text-muted hover:text-text hover:bg-surface'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="w-px h-6 bg-surface mx-2" />
              {portalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-sage-700 bg-sage-50 dark:text-sage-300 dark:bg-sage-800'
                      : 'text-text-muted hover:text-text hover:bg-surface dark:hover:bg-sage-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="w-px h-6 bg-surface mx-2" />
              <ThemeToggle />
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-lg hover:bg-surface transition-colors relative z-[60]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="relative w-6 h-6">
                <Menu className={`w-6 h-6 text-text absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
                <X className={`w-6 h-6 text-text absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-out ${
          mobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Backdrop - Sage tinted */}
        <div
          className="absolute inset-0 bg-sage-900/95 backdrop-blur-md"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Content - Centered */}
        <nav
          className="relative h-full flex flex-col items-center justify-center px-8"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col items-center gap-2 w-full max-w-xs">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`w-full text-center py-3 px-6 rounded-xl text-lg font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? 'bg-white text-sage-900'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
                style={{
                  transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                  opacity: mobileMenuOpen ? 1 : 0,
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                }}
              >
                {link.name}
              </Link>
            ))}

            <div className="w-16 h-px bg-white/20 my-4" />

            {portalLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`w-full text-center py-3 px-6 rounded-xl text-lg font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? 'bg-white text-sage-900'
                    : 'text-peach-300 hover:bg-white/10'
                }`}
                style={{
                  transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                  opacity: mobileMenuOpen ? 1 : 0,
                  transitionDelay: mobileMenuOpen ? `${(navLinks.length + index) * 50}ms` : '0ms',
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Close hint */}
          <p className="absolute bottom-8 text-white/50 text-sm">
            Tap anywhere or press ESC to close
          </p>
        </nav>
      </div>
    </>
  );
}
