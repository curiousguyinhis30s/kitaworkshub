"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  BookOpen,
  Calendar,
  Contact,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  Menu,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Contacts", href: "/admin/contacts", icon: Contact },
];

interface AdminLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AdminLayout({ title, subtitle, children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedState = localStorage.getItem("admin-sidebar-collapsed");
    if (storedState !== null) {
      setIsCollapsed(JSON.parse(storedState));
    }
  }, []);

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

  // Get current page name from navigation
  const currentPage = navigation.find(item =>
    pathname === item.href || pathname.startsWith(item.href + '/')
  )?.label || 'Dashboard';

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(newState));
  };

  const sidebarWidth = isCollapsed ? "72px" : "280px";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header - Distinctive Admin Indicator */}
      <header className="lg:hidden fixed top-0 w-full z-40 bg-gradient-to-r from-slate-900 to-indigo-900 border-b border-indigo-500/30 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Admin Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/30 border border-indigo-500/50 rounded-lg">
              <Shield className="w-5 h-5 text-indigo-300" />
              <span className="text-sm font-bold text-white tracking-wide">ADMIN</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <span className="text-sm font-medium text-indigo-200">{currentPage}</span>
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="relative w-6 h-6">
              <Menu className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex fixed top-0 left-0 h-full flex-col justify-between border-r border-slate-800/20 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl z-30 transition-all duration-300 ease-in-out overflow-hidden"
        style={{ width: sidebarWidth }}
      >
        <div className="flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
            {!isCollapsed && (
              <span className="font-bold text-lg tracking-wide">ADMIN</span>
            )}
            <button
              onClick={toggleSidebar}
              className="ml-auto p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={`group flex items-center w-full p-2.5 rounded-lg transition-all duration-200 relative ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                      : "text-slate-400 hover:bg-white/10 hover:text-slate-100"
                  }`}
                >
                  <div className={`shrink-0 ${isCollapsed ? "mx-auto" : ""}`}>
                    <Icon size={22} className={isActive ? "text-indigo-100" : ""} />
                  </div>

                  <span
                    className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>

                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-slate-700 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-white/10 shrink-0">
          <div
            className={`flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold shadow-lg">
                AD
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-800 rounded-full"></div>
            </div>

            <div
              className={`ml-3 overflow-hidden transition-all duration-300 ${
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              <p className="text-sm font-medium text-slate-200 truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">admin@example.com</p>
            </div>
          </div>

          <div className={`mt-3 flex flex-col gap-1 ${isCollapsed ? "items-center" : ""}`}>
            <Link
              href="/admin/settings"
              className={`flex items-center p-2 w-full rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Settings" : undefined}
            >
              <Settings size={20} />
              <span className={`ml-3 text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
                Settings
              </span>
            </Link>
            <Link
              href="/"
              className={`flex items-center p-2 w-full rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut size={20} />
              <span className={`ml-3 text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
                Logout
              </span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Sheet */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-3xl shadow-2xl max-h-[60vh] flex flex-col transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
              <span className="font-bold text-slate-800">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              <nav className="grid grid-cols-2 gap-3">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                        isActive
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={24} className="mb-2" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link
                  href="/admin/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center p-3 rounded-lg hover:bg-slate-50 text-slate-600 mb-2"
                >
                  <Settings size={20} className="mr-3 text-slate-400" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center w-full p-3 rounded-lg hover:bg-red-50 text-red-600"
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>

      {/* Main Content Area */}
      <main
        className={`transition-all duration-300 pt-16 lg:pt-0 min-h-screen ${
          isCollapsed ? "lg:pl-[72px]" : "lg:pl-[280px]"
        }`}
      >
        {title && (
          <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 lg:top-0 z-20">
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
          </header>
        )}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
