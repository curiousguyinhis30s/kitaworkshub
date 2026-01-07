/**
 * PocketBase Schema Definitions for KitaWorksHub
 * Located at: /Users/samiullah/kitaworkshub/lib/db/schema.ts
 */

import { RecordModel } from 'pocketbase';

/* =========================================
   1. Base & Utility Types
   ========================================= */

/**
 * Standard system fields managed by PocketBase
 */
export interface SystemFields {
    id: string;
    collectionId: string;
    collectionName: string;
    created: string;
    updated: string;
}

/**
 * Expandable relation helper type
 */
export type Relation<T> = string | (T & SystemFields);

/* =========================================
   2. Collection Definitions (Input Types)
   These interfaces represent the data structure
   used when creating or updating records.
   ========================================= */

export interface UsersData {
    email: string;
    name: string;
    avatar?: string; // File upload
    role: 'student' | 'instructor' | 'admin';
    xp_points?: number;
    level?: number;
    // password, passwordConfirm, and oldPassword are handled by PB Auth
}

export interface CoursesData {
    title: string;
    slug?: string;
    description: string;
    price: number;
    instructor: string; // Relation to users (ID)
    thumbnail?: string; // File upload
    category?: string;
    duration_hours?: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    published: boolean;
}

export interface ModulesData {
    course: string; // Relation to courses (ID)
    title: string;
    order: number;
    description?: string;
}

export interface LessonsData {
    module: string; // Relation to modules (ID)
    title: string;
    type: 'video' | 'text' | 'quiz' | 'live';
    content?: string; // HTML or JSON content
    video_url?: string;
    duration_minutes?: number;
    order: number;
}

export interface EnrollmentsData {
    user: string; // Relation to users (ID)
    course: string; // Relation to courses (ID)
    enrolled_at?: string; // ISO Date
    completed_at?: string; // ISO Date
    progress_percent?: number; // 0-100
}

export interface ProgressData {
    enrollment: string; // Relation to enrollments (ID)
    lesson: string; // Relation to lessons (ID)
    started_at?: string; // ISO Date
    completed_at?: string; // ISO Date
    video_position_sec?: number;
    time_spent_sec?: number;
}

export interface EventsData {
    title: string;
    slug?: string;
    description?: string;
    date: string; // ISO Date
    time: string; // HH:MM format
    location?: string;
    capacity?: number;
    price: number;
    host: string; // Relation to users (ID)
    thumbnail?: string;
    published: boolean;
}

export interface RegistrationsData {
    user: string; // Relation to users (ID)
    event: string; // Relation to events (ID)
    registered_at?: string; // ISO Date
    attended: boolean;
}

export interface CertificatesData {
    enrollment: string; // Relation to enrollments (ID)
    issued_at?: string; // ISO Date
    credential_id: string; // Unique UUID
    pdf_url?: string;
    verified: boolean;
}

export interface PaymentsData {
    user: string; // Relation to users (ID)
    course?: string; // Relation to courses (ID) - Optional if event is set
    event?: string; // Relation to events (ID) - Optional if course is set
    amount: number;
    currency: string; // e.g., 'MYR', 'USD'
    stripe_session_id?: string;
    status: 'pending' | 'paid' | 'failed';
}

export interface BadgesData {
    name: string;
    description?: string;
    icon?: string; // File upload or URL
    xp_reward?: number;
    criteria?: string; // Text description of how to earn
}

export interface UserBadgesData {
    user: string; // Relation to users (ID)
    badge: string; // Relation to badges (ID)
    earned_at?: string; // ISO Date
}

/* =========================================
   3. Collection Response Types (Output)
   These interfaces represent the data structure
   returned by PocketBase, including system fields.
   ========================================= */

export type UsersResponse = SystemFields & UsersData;

export type CoursesResponse = SystemFields & CoursesData & {
    expand?: { instructor?: UsersResponse };
};

export type ModulesResponse = SystemFields & ModulesData & {
    expand?: { course?: CoursesResponse };
};

export type LessonsResponse = SystemFields & LessonsData & {
    expand?: { module?: ModulesResponse };
};

export type EnrollmentsResponse = SystemFields & EnrollmentsData & {
    expand?: { user?: UsersResponse; course?: CoursesResponse };
};

export type ProgressResponse = SystemFields & ProgressData & {
    expand?: { enrollment?: EnrollmentsResponse; lesson?: LessonsResponse };
};

export type EventsResponse = SystemFields & EventsData & {
    expand?: { host?: UsersResponse };
};

export type RegistrationsResponse = SystemFields & RegistrationsData & {
    expand?: { user?: UsersResponse; event?: EventsResponse };
};

export type CertificatesResponse = SystemFields & CertificatesData & {
    expand?: { enrollment?: EnrollmentsResponse };
};

export type PaymentsResponse = SystemFields & PaymentsData & {
    expand?: { user?: UsersResponse; course?: CoursesResponse; event?: EventsResponse };
};

export type BadgesResponse = SystemFields & BadgesData;

export type UserBadgesResponse = SystemFields & UserBadgesData & {
    expand?: { user?: UsersResponse; badge?: BadgesResponse };
};

/* =========================================
   4. PocketBase SDK Record Model Mapping
   ========================================= */

export const collections = {
    users: "users" as const,
    courses: "courses" as const,
    modules: "modules" as const,
    lessons: "lessons" as const,
    enrollments: "enrollments" as const,
    progress: "progress" as const,
    events: "events" as const,
    registrations: "registrations" as const,
    certificates: "certificates" as const,
    payments: "payments" as const,
    badges: "badges" as const,
    user_badges: "user_badges" as const,
};

// Type-safe record types (use Response types for API usage)
export type UsersRecord = RecordModel & UsersData;
export type CoursesRecord = RecordModel & CoursesData;
export type ModulesRecord = RecordModel & ModulesData;
export type LessonsRecord = RecordModel & LessonsData;
export type EnrollmentsRecord = RecordModel & EnrollmentsData;
export type ProgressRecord = RecordModel & ProgressData;
export type EventsRecord = RecordModel & EventsData;
export type RegistrationsRecord = RecordModel & RegistrationsData;
export type CertificatesRecord = RecordModel & CertificatesData;
export type PaymentsRecord = RecordModel & PaymentsData;
export type BadgesRecord = RecordModel & BadgesData;
export type UserBadgesRecord = RecordModel & UserBadgesData;
