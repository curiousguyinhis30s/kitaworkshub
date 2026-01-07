'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calendar, Award, User, type LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/portal', icon: Home },
  { label: 'Courses', href: '/portal/courses', icon: BookOpen },
  { label: 'Events', href: '/portal/events', icon: Calendar },
  { label: 'Certificates', href: '/portal/certificates', icon: Award },
  { label: 'Profile', href: '/portal/profile', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full group relative"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Indicator */}
              {isActive && (
                <span className="absolute top-0 w-12 h-1 bg-primary-600 rounded-b-full" />
              )}

              {/* Icon */}
              <div
                className={`mb-1 transition-transform duration-200 group-active:scale-95 ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                {isActive ? (
                  <Icon size={24} className="fill-primary-600/20" strokeWidth={2.5} />
                ) : (
                  <Icon size={24} strokeWidth={2} />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 group-hover:text-gray-700'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
