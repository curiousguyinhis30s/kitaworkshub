"use client";

import React, { useState, useEffect } from 'react';
import {
  Database,
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Settings,
  Shield,
  Bell,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Code,
  Smartphone,
  Fingerprint,
  Palette,
  Mail,
  ArrowRight,
  Play,
  Globe,
  Lock,
  FileText,
  Zap,
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';

// --- Data ---

const techStack = [
  { name: "Next.js 16", desc: "Turbopack", icon: Globe },
  { name: "React 19", desc: "Latest", icon: Code },
  { name: "TypeScript", desc: "Type-safe", icon: FileText },
  { name: "Tailwind CSS", desc: "Utility-first", icon: Palette },
  { name: "PocketBase", desc: "Auth + DB", icon: Database },
  { name: "Stripe", desc: "FPX Payments", icon: CreditCard },
  { name: "Recharts", desc: "Analytics", icon: BarChart3 },
  { name: "Resend", desc: "Email", icon: Mail },
];

const userRoles = [
  {
    role: "Student",
    icon: GraduationCap,
    gradient: "from-blue-500 to-cyan-500",
    description: "Access courses, track progress, earn certificates",
    features: [
      "Enroll in courses with Stripe/FPX payment",
      "Track real-time learning progress",
      "Download digital certificates",
      "Register for workshops & events",
      "Access learning resources & materials"
    ]
  },
  {
    role: "Instructor",
    icon: BookOpen,
    gradient: "from-purple-500 to-pink-500",
    description: "Create and manage training content",
    features: [
      "Create courses with modules & lessons",
      "Upload materials (PDF, video, slides)",
      "View student enrollments & progress",
      "Manage event schedules",
      "Track completion rates"
    ]
  },
  {
    role: "Admin",
    icon: Shield,
    gradient: "from-emerald-500 to-teal-500",
    description: "Full system control and oversight",
    features: [
      "Complete dashboard analytics",
      "User management (CRUD)",
      "Financial reports & revenue tracking",
      "Audit logs with full activity history",
      "System configuration"
    ]
  }
];

const modules = [
  {
    title: "Course Management",
    icon: BookOpen,
    desc: "Full CRUD for courses, modules, lessons with rich content support.",
    features: ["Module hierarchy", "Lesson ordering", "Progress tracking", "Materials upload"]
  },
  {
    title: "Event Management",
    icon: Calendar,
    desc: "Organize workshops, seminars, and live training sessions.",
    features: ["Registration flow", "Capacity limits", "Calendar integration", "Confirmation emails"]
  },
  {
    title: "User Portal",
    icon: Users,
    desc: "Personalized dashboard with learning progress and achievements.",
    features: ["Progress dashboard", "Certificate gallery", "Event registrations", "Profile management"]
  },
  {
    title: "Payment System",
    icon: CreditCard,
    desc: "Stripe integration with FPX support for Malaysian banks.",
    features: ["Credit/Debit cards", "FPX bank transfer", "Invoice generation", "Refund handling"]
  },
  {
    title: "Analytics Dashboard",
    icon: BarChart3,
    desc: "Visualize revenue, enrollments, and learning trends.",
    features: ["Revenue charts", "Enrollment metrics", "Top courses", "User activity"]
  },
  {
    title: "Admin Panel",
    icon: Settings,
    desc: "Centralized control for users, content, and settings.",
    features: ["User management", "Content moderation", "System settings", "Bulk operations"]
  },
  {
    title: "Authentication",
    icon: Fingerprint,
    desc: "Complete auth flow with email verification.",
    features: ["Login/Register", "Password reset", "Email verification", "Session management"]
  },
  {
    title: "Notifications",
    icon: Bell,
    desc: "Toast notifications and transactional emails.",
    features: ["Toast alerts", "Email via Resend", "Activity notifications", "System alerts"]
  },
];

const features = [
  { name: "Role-based Access Control (RBAC)", icon: Lock },
  { name: "Real-time Progress Tracking", icon: TrendingUp },
  { name: "Certificate Generation", icon: Award },
  { name: "Calendar Integration (Google, ICS)", icon: Calendar },
  { name: "Responsive Mobile-first Design", icon: Smartphone },
  { name: "Dark Admin Theme", icon: Palette },
  { name: "Malaysian Ringgit (RM) Pricing", icon: CreditCard },
  { name: "FPX Bank Payments", icon: Database },
  { name: "Comprehensive Audit Logging", icon: FileText },
  { name: "API-first Architecture", icon: Code },
  { name: "Email Transactional System", icon: Mail },
  { name: "Performance Optimized", icon: Zap },
];

const inventorySections = [
  {
    title: "Marketing Pages",
    count: 8,
    items: ["Homepage", "Courses Listing", "Events Calendar", "Services", "Community", "Contact", "Privacy Policy", "Terms of Service"]
  },
  {
    title: "Portal Pages",
    count: 7,
    items: ["Dashboard", "My Courses", "My Events", "Certificates", "Resources", "Profile Settings", "Password Reset"]
  },
  {
    title: "Admin Pages",
    count: 6,
    items: ["Admin Dashboard", "User Management", "Course Management", "Event Management", "Financial Reports", "Audit Logs"]
  },
  {
    title: "API Endpoints",
    count: 22,
    items: ["Auth (6)", "Courses (2)", "Events (2)", "Enrollments", "Registrations", "Payments (3)", "Portal (3)", "Admin (3)", "Analytics (2)", "Contact"]
  }
];

const collections = [
  { name: "users", desc: "User accounts with roles" },
  { name: "courses", desc: "Course definitions" },
  { name: "modules", desc: "Course sections" },
  { name: "lessons", desc: "Lesson content" },
  { name: "enrollments", desc: "User-course relations" },
  { name: "lesson_progress", desc: "Completion tracking" },
  { name: "events", desc: "Workshops & seminars" },
  { name: "event_registrations", desc: "Event signups" },
  { name: "payments", desc: "Transaction records" },
  { name: "invoices", desc: "Invoice documents" },
  { name: "certificates", desc: "Earned credentials" },
  { name: "audit_logs", desc: "System activity" },
  { name: "activity_logs", desc: "User actions" },
  { name: "resources", desc: "Downloadable files" },
];

// --- Components ---

const StatCard = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) => (
  <div className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-teal-500/30 transition-all group">
    <Icon className="w-6 h-6 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 font-serif mb-1">
      {value}
    </span>
    <span className="text-sm text-gray-400 uppercase tracking-wider font-medium">{label}</span>
  </div>
);

const Collapsible = ({ title, count, items }: { title: string; count: number; items: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden transition-all duration-300 hover:border-white/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></div>
          <span className="font-semibold text-white text-lg">{title}</span>
          <span className="text-sm text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full font-medium">{count} items</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm border-t border-white/5 pt-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="w-4 h-4 text-teal-500 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ShowcasePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-[#030303] text-white min-h-screen font-sans selection:bg-teal-500/30 selection:text-teal-200">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030303]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-xl flex items-center justify-center font-bold text-black text-lg font-serif shadow-lg shadow-teal-500/20">K</div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white">KitaWorksHub</span>
              <span className="text-xs text-teal-400 ml-2 font-medium">LMS</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#modules" className="hover:text-teal-400 transition-colors">Modules</a>
            <a href="#roles" className="hover:text-teal-400 transition-colors">User Roles</a>
            <a href="#tech" className="hover:text-teal-400 transition-colors">Tech Stack</a>
            <a href="#inventory" className="hover:text-teal-400 transition-colors">Inventory</a>
          </div>
          <a
            href="/contact"
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-teal-500/25 transition-all text-sm"
          >
            Contact Us
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/15 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-40 left-20 w-[200px] h-[200px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className={`max-w-7xl mx-auto px-6 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Enterprise-Grade Learning Management System
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 font-serif leading-tight">
            KitaWorksHub
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400">LMS Platform</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            A comprehensive Learning Management System built for Malaysian corporate training.
            Complete with course management, payment processing, user portals, and admin dashboards.
            <span className="text-teal-400 font-medium"> Production-ready.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <a
              href="/portal/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl font-bold text-white shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] transition-all flex items-center gap-3"
            >
              <Play className="w-5 h-5 fill-current" />
              View Live Demo
            </a>
            <a
              href="/contact"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white hover:bg-white/10 transition-all flex items-center gap-3"
            >
              Contact for Licensing
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <StatCard label="Pages" value="29+" icon={LayoutDashboard} />
            <StatCard label="API Routes" value="22" icon={Code} />
            <StatCard label="Collections" value="14" icon={Database} />
            <StatCard label="User Roles" value="3" icon={Users} />
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech" className="py-24 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Modern Tech Stack</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Built with the latest technologies for performance, scalability, and developer experience.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-teal-500/30 hover:bg-white/10 transition-all group"
              >
                <tech.icon className="w-10 h-10 text-gray-400 group-hover:text-teal-400 transition-colors" />
                <span className="font-semibold text-white text-lg">{tech.name}</span>
                <span className="text-sm text-gray-500">{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section id="roles" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Role-Based Access Control</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Three distinct user roles with tailored permissions and experiences.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userRoles.map((role, idx) => (
              <div
                key={idx}
                className="relative p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all group overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${role.gradient} opacity-10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-6 shadow-xl`}>
                  <role.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-2">{role.role}</h3>
                <p className="text-gray-400 text-sm mb-6">{role.description}</p>

                <ul className="space-y-3">
                  {role.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section id="modules" className="py-24 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Core Modules</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything needed to run a world-class corporate training platform.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-teal-500/20 transition-all cursor-default group"
              >
                <mod.icon className="w-10 h-10 text-gray-500 mb-4 group-hover:text-teal-400 transition-colors" />
                <h4 className="font-bold text-lg mb-2 text-white">{mod.title}</h4>
                <p className="text-sm text-gray-500 mb-4">{mod.desc}</p>
                <ul className="space-y-1.5">
                  {mod.features.map((f, i) => (
                    <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-teal-500"></div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Key Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Built with Malaysian context in mind - from FPX payments to Ringgit pricing.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-teal-500/20 transition-all">
                <f.icon className="w-5 h-5 text-teal-500 shrink-0" />
                <span className="text-sm text-gray-300">{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Database Collections */}
      <section className="py-24 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">Complete Database Schema</h2>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                14 PocketBase collections with proper relations, validation rules, and API permissions.
                Ready for production deployment.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Database className="w-5 h-5 text-teal-500" />
                  <span>PocketBase SQLite backend</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Lock className="w-5 h-5 text-teal-500" />
                  <span>Row-level security rules</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Code className="w-5 h-5 text-teal-500" />
                  <span>Type-safe API access</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-xs text-gray-500 font-mono ml-auto">pb_schema.json</span>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono text-sm">
                {collections.map((col, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-teal-400">{col.name}</span>
                    <span className="text-xs text-gray-600">{col.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page Inventory */}
      <section id="inventory" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">Complete System Inventory</h2>
            <p className="text-gray-400">Full breakdown of all pages and endpoints included.</p>
          </div>

          <div className="space-y-4">
            {inventorySections.map((section, idx) => (
              <Collapsible key={idx} title={section.title} count={section.count} items={section.items} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#080808] to-[#030303]">
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Ready to Deploy?</h2>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Get the complete source code, database schema, and documentation.
            <br className="hidden md:block" />
            Launch your corporate training platform in days, not months.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-xl"
            >
              Contact for Licensing
            </a>
            <a
              href="/portal/dashboard"
              className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors"
            >
              View Live Demo
            </a>
          </div>
          <p className="mt-8 text-sm text-gray-600">Full source code • Documentation • Support included</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} KitaWorksHub LMS. Built for Malaysian Corporate Excellence.
        </p>
      </footer>
    </div>
  );
}
