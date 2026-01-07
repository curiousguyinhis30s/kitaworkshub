// ============================================
// Core Data Types for KitaWorksHub
// ============================================

// User & Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  memberType: 'standard' | 'premium';
  status: 'active' | 'inactive';
  joinedAt: string;
  enrolledCourses: number;
  eventsAttended: number;
  certificates: number;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

// Courses
export interface Course {
  id: string | number;
  title: string;
  slug?: string;
  description: string;
  category: 'PMO Fundamentals' | 'Leadership Development' | 'Agile Practices';
  duration: string;
  instructor: string;
  price: number;
  priceFormatted?: string;
  features: string[];
  modules?: CourseModule[];
  status: 'draft' | 'published';
  enrollments: number;
  rating: number;
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseModule {
  id: string | number;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string | number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'workshop' | 'exam';
  duration?: string;
  completed?: boolean;
}

export interface CourseProgress {
  courseId: string | number;
  userId: string;
  progress: number;
  completedModules: number;
  totalModules: number;
  nextLesson?: string;
  lastAccessedAt?: string;
}

// Events
export interface Event {
  id: string | number;
  title: string;
  slug?: string;
  type: 'Workshop' | 'Seminar' | 'Networking' | 'Conference';
  date: string;
  month?: string;
  time: string;
  location: string;
  capacity: number;
  registrations: number;
  price: number | 'Free';
  priceFormatted?: string;
  description: string;
  speaker: string;
  highlights: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string | number;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  dietaryRequirements?: string;
  registeredAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Contact & Inquiries
export interface ContactInquiry {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  type: 'inquiry' | 'partnership' | 'speaking' | 'feedback';
  status: 'new' | 'replied' | 'resolved';
  submittedAt: string;
  repliedAt?: string;
}

// Certificates
export interface Certificate {
  id: string;
  userId: string;
  courseId: string | number;
  courseName: string;
  issuedAt: string;
  expiresAt?: string;
  credentialId: string;
  pdfUrl?: string;
}

// Resources
export interface Resource {
  id: string | number;
  title: string;
  description: string;
  type: 'PDF' | 'ZIP' | 'XLSX' | 'DOC' | 'VIDEO';
  size: string;
  downloadUrl?: string;
  downloads: number;
  category?: string;
  createdAt?: string;
}

// Blog & Community
export interface BlogPost {
  id: string | number;
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
  imageUrl?: string;
}

export interface Discussion {
  id: string | number;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastActive: string;
  category: string;
}

// Services
export interface Service {
  id: string | number;
  title: string;
  category: string;
  description: string;
  priceMin: number;
  priceMax: number;
  features: string[];
  deliverables: string[];
  isPremium?: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  activeCourses: number;
  totalRevenue: number;
  upcomingEvents: number;
  newEnrollments?: number;
  newContacts?: number;
}

// Form Types
export interface EnrollmentFormData {
  name: string;
  email: string;
  phone?: string;
  courseId: string | number;
  message?: string;
}

export interface EventRegistrationFormData {
  name: string;
  email: string;
  phone?: string;
  eventId: string | number;
  company?: string;
  dietaryRequirements?: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Navigation
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
}

// Activity Log
export interface ActivityLog {
  id: string | number;
  action: string;
  detail: string;
  time: string;
  type: 'lesson' | 'certificate' | 'event' | 'resource' | 'enrollment';
}
