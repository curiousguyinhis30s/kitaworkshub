"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FolderOpen,
  Award,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const STORAGE_KEY = "portal-sidebar-collapsed";

const navItems = [
  { name: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/portal/courses", icon: BookOpen },
  { name: "Events", href: "/portal/events", icon: Calendar },
  { name: "Resources", href: "/portal/resources", icon: FolderOpen },
  { name: "Certificates", href: "/portal/certificates", icon: Award },
];

interface PortalLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function PortalLayout({ title, subtitle, children }: PortalLayoutProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true" && !isMobile) {
      setIsCollapsed(true);
    }

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem(STORAGE_KEY, isCollapsed.toString());
    }
  }, [isCollapsed, isMobile]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-sage-950">
      {/* Desktop Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full bg-sage-900 dark:bg-sage-950 text-sage-50
          transition-all duration-300 ease-in-out
          hidden lg:flex flex-col justify-between
          ${isCollapsed ? "w-16" : "w-64"}
        `}
      >
        <div>
          <div className="flex items-center justify-between h-16 px-4 border-b border-sage-700 dark:border-sage-800">
            {!isCollapsed && (
              <span className="text-xl font-bold tracking-wider text-white font-heading">PORTAL</span>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 rounded-full bg-sage-700 flex items-center justify-center text-white font-bold mx-auto">
                P
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-sage-700 text-sage-100 transition-colors focus:outline-none"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <nav className="mt-6 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-2 py-3 rounded-lg transition-colors relative group
                    ${isActive ? "bg-sage-700 text-white shadow-inner" : "text-sage-200 hover:bg-sage-800 hover:text-white"}
                  `}
                >
                  <div className="min-w-[32px] flex justify-center">
                    <Icon size={20} />
                  </div>
                  {!isCollapsed && (
                    <span className="ml-3 whitespace-nowrap font-medium">{item.name}</span>
                  )}

                  {isCollapsed && (
                    <div className="absolute left-14 bg-sage-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-lg">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-2 border-t border-sage-700 dark:border-sage-800 space-y-2">
          <div className={`flex items-center rounded-lg p-2 transition-colors cursor-pointer hover:bg-sage-700 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="min-w-[32px] flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white font-semibold shadow-sm">
                JD
              </div>
            </div>
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">John Doe</p>
                <p className="text-xs text-sage-300 truncate">Student</p>
              </div>
            )}
          </div>
          <Link
            href="/"
            className={`flex items-center px-2 py-2 rounded-lg transition-colors text-sage-200 hover:bg-red-900/50 hover:text-red-200 ${isCollapsed ? "justify-center" : ""}`}
          >
            <div className="min-w-[32px] flex justify-center">
              <LogOut size={18} />
            </div>
            {!isCollapsed && (
              <span className="ml-3 whitespace-nowrap text-sm">Sign Out</span>
            )}
          </Link>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Bottom Sheet */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-sage-900 dark:bg-sage-950 text-sage-50
          rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out
          flex flex-col max-h-[50vh]
          ${isMobileMenuOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="flex justify-between items-center p-4 border-b border-sage-700 dark:border-sage-800">
          <span className="font-bold text-white font-heading">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-sage-200">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center px-4 py-4 rounded-xl transition-colors
                  ${isActive ? "bg-sage-700 text-white shadow-md" : "text-sage-200 hover:bg-sage-800 hover:text-white"}
                `}
              >
                <div className="mr-4">
                  <Icon size={20} />
                </div>
                <span className="text-lg font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-sage-300" />
                )}
              </Link>
            );
          })}

          <div className="mt-6 pt-6 border-t border-sage-700 space-y-4">
            <div className="flex items-center px-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">John Doe</p>
                <p className="text-xs text-sage-300">Student</p>
              </div>
            </div>
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-4 py-3 rounded-xl text-red-300 hover:bg-red-900/30 transition-colors"
            >
              <LogOut size={20} className="mr-4" />
              <span className="text-lg font-medium">Sign Out</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile FAB - Hidden when menu is open */}
      {!isMobileMenuOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 bg-sage-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-sage-800 active:scale-95 transition-all"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Main Content Area */}
      <main
        className={`
          transition-all duration-300 ease-in-out pt-6 pb-20 px-6 min-h-screen
          ${isMobile ? "ml-0" : (isCollapsed ? "lg:ml-16" : "lg:ml-64")}
        `}
      >
        {title && (
          <header className="mb-6">
            <h1 className="text-xl lg:text-2xl font-bold text-text dark:text-sage-100 font-heading">{title}</h1>
            {subtitle && <p className="text-text-muted dark:text-sage-400 text-sm mt-1">{subtitle}</p>}
          </header>
        )}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
