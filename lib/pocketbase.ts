import PocketBase from 'pocketbase';

// PocketBase instance
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Disable auto-cancellation for server-side requests
pb.autoCancellation(false);

export default pb;

// Type-safe collection helpers
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  phone?: string;
  company?: string;
  avatar?: string;
  created: string;
  updated: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category?: string;
  duration?: number; // minutes
  price: number; // RM in cents
  instructor?: string; // relation to users
  thumbnail?: string;
  features?: string[];
  published: boolean;
  created: string;
  updated: string;
  expand?: {
    instructor?: User;
    modules?: Module[];
  };
};

export type Module = {
  id: string;
  course: string; // relation
  title: string;
  description?: string;
  order: number;
  created: string;
  expand?: {
    lessons?: Lesson[];
  };
};

export type Lesson = {
  id: string;
  module: string; // relation
  title: string;
  description?: string;
  type: 'video' | 'text' | 'quiz' | 'live_class';
  content?: string;
  duration_minutes?: number;
  video_url?: string;
  order: number;
  created: string;
  expand?: {
    materials?: Material[];
  };
};

export type Material = {
  id: string;
  lesson: string; // relation
  title: string;
  type: 'pdf' | 'slides' | 'worksheet' | 'template';
  file: string; // file field
  created: string;
};

export type Enrollment = {
  id: string;
  user: string; // relation
  course: string; // relation
  status: 'active' | 'completed' | 'expired';
  enrolled_at: string;
  completed_at?: string;
  expand?: {
    user?: User;
    course?: Course;
  };
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  type: 'workshop' | 'seminar' | 'webinar';
  date: string;
  time: string;
  duration: number; // minutes
  location?: string;
  price: number; // RM in cents
  capacity: number;
  registered_count: number;
  created: string;
};

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  created: string;
};

export type Certificate = {
  id: string;
  user: string; // relation
  course: string; // relation
  credential_id: string;
  issued_at: string;
  expires_at?: string;
  score?: number;
  skills?: string[];
  pdf_url?: string;
  created: string;
  expand?: {
    user?: User;
    course?: Course;
  };
};

export type LessonProgress = {
  id: string;
  user: string; // relation
  lesson: string; // relation
  completed: boolean;
  completed_at?: string;
  time_spent_seconds: number;
  created: string;
  expand?: {
    lesson?: Lesson;
  };
};

export type EventRegistration = {
  id: string;
  user: string; // relation
  event: string; // relation
  name: string;
  email: string;
  phone?: string;
  company?: string;
  dietary_requirements?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  confirmation_code: string;
  registered_at: string;
  attended?: boolean;
  expand?: {
    user?: User;
    event?: Event;
  };
};

export type UserProfile = {
  id: string;
  user: string; // relation
  bio?: string;
  linkedin?: string;
  department?: string;
  position?: string;
  skills?: string[];
  avatar?: string; // file field
  member_type: 'standard' | 'premium';
  member_until?: string;
  notification_email: boolean;
  notification_courses: boolean;
  notification_events: boolean;
  created: string;
  updated: string;
  expand?: {
    user?: User;
  };
};

// Helper function to get file URL
export function getFileUrl(record: { id: string; collectionId: string; collectionName?: string }, filename: string): string {
  return `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${filename}`;
}
