# KitaWorksHub - Project Summary

## Overview

**KitaWorksHub** is a professional learning management and consulting platform for a Malaysian company focused on project management training, PMO consulting, and leadership development.

**Domain:** kitaworkshub.com.my (planned)
**Tech Stack:** Next.js 16.1.1, React, TypeScript, Tailwind CSS v4, PocketBase, GSAP

---

## What Was Built

### 1. Public Marketing Website

| Page | Route | Status |
|------|-------|--------|
| Home | `/` | Complete |
| Services | `/services` | Complete |
| Courses | `/courses` | Complete |
| Events | `/events` | Complete |
| Community | `/community` | Complete |
| Contact | `/contact` | Complete |
| Privacy Policy | `/privacy` | Complete |
| Terms of Service | `/terms` | Complete |

**Features:**
- GSAP-powered smooth animations
- Responsive design (mobile, tablet, desktop)
- Dark gradient hero with floating orbs
- Contact form with PocketBase integration
- Course enrollment form
- Event registration form

### 2. Client Portal (`/portal/*`)

| Page | Route | Status |
|------|-------|--------|
| Portal Home | `/portal` | Complete (redirects to dashboard) |
| Dashboard | `/portal/dashboard` | Complete |
| My Courses | `/portal/courses` | Complete |
| Certificates | `/portal/certificates` | Complete (with generator) |
| Events | `/portal/events` | Complete |
| Resources | `/portal/resources` | Complete |
| Profile | `/portal/profile` | Complete |

**Features:**
- Sidebar navigation with mobile responsive drawer
- Certificate generator with PNG download (html2canvas)
- LinkedIn share integration
- Demo user profile for testing
- API integration with fallback demo data

### 3. Admin Portal (`/admin/*`)

| Page | Route | Status |
|------|-------|--------|
| Admin Home | `/admin` | Complete (redirects to dashboard) |
| Dashboard | `/admin/dashboard` | Complete |
| Analytics | `/admin/analytics` | Complete |
| Users | `/admin/users` | Complete |
| Courses | `/admin/courses` | Complete |
| Course Create | `/admin/courses/create` | Complete |
| Events | `/admin/events` | Complete |
| Contacts | `/admin/contacts` | Complete |

**Features:**
- Full analytics dashboard with charts
- User management table
- Course CRUD operations
- Event management
- Contact inquiry management
- Demo data fallback

### 4. Backend API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/register` | POST | User registration |
| `/api/auth/me` | GET | Current user |
| `/api/contact` | POST | Contact form submission |
| `/api/courses` | GET/POST | Course listing/creation |
| `/api/enrollments` | POST | Course enrollment |
| `/api/events` | GET/POST | Event listing/creation |
| `/api/event-registrations` | POST | Event registration |
| `/api/portal/dashboard` | GET | Portal dashboard data |
| `/api/portal/certificates` | GET/POST | Certificates |
| `/api/portal/profile` | GET/PATCH | User profile |
| `/api/analytics/track` | POST | Track events |
| `/api/analytics/dashboard` | GET | Analytics data |

---

## Technical Architecture

### Frontend
- **Framework:** Next.js 16.1.1 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4 with custom design system
- **Animations:** GSAP with @gsap/react hooks
- **Icons:** Custom SVG icon components
- **Forms:** Custom hooks with validation

### Backend
- **Database:** PocketBase (SQLite-based)
- **Auth:** JWT tokens via PocketBase
- **File Storage:** PocketBase file handling

### Key Libraries
```json
{
  "next": "16.1.1",
  "react": "^19.0.0",
  "gsap": "^3.12.5",
  "@gsap/react": "^2.1.1",
  "tailwindcss": "^4.0.6",
  "pocketbase": "^0.21.4",
  "html2canvas": "^1.4.1"
}
```

---

## Design System

### Colors
```css
/* Primary (Forest Green) */
--primary-50: #f0fdf4
--primary-600: #16a34a
--primary-900: #052e16

/* Accent (Gold) */
--accent-400: #c9a962
--accent-500: #b8984a
--accent-600: #a08339
```

### Typography
- **Headings:** Geist Sans (system font fallback)
- **Body:** Inter (clean, readable)
- **Hero text:** Up to 9rem for large displays

### Components
- Custom button variants
- Card components
- Form inputs with validation states
- Loading states
- Toast notifications

---

## Database Schema (PocketBase)

### Collections

**users**
- id, email, name, role, phone, company, avatar

**user_profiles**
- id, user (relation), bio, linkedin, department, position, skills, member_type

**courses**
- id, slug, title, description, category, duration, price, instructor, thumbnail, features

**modules**
- id, course (relation), title, description, order

**lessons**
- id, module (relation), title, type, content, duration_minutes, video_url, order

**enrollments**
- id, user (relation), course (relation), status, enrolled_at, completed_at

**certificates**
- id, user (relation), course (relation), credential_id, issued_at, score, skills

**events**
- id, slug, title, description, type, date, time, duration, location, price, capacity

**event_registrations**
- id, user (relation), event (relation), name, email, status, confirmation_code

**contact_inquiries**
- id, name, email, phone, company, message, status

**analytics_events**
- id, event_type, page_path, session_id, user_agent, referrer, metadata

---

## What Works Now

1. **Full website navigation** - All pages accessible and linked
2. **Forms with validation** - Contact, enrollment, event registration
3. **Demo mode** - Everything works without PocketBase running
4. **Analytics tracking** - Page views tracked, admin dashboard shows data
5. **Certificate generation** - Download as PNG with profile picture
6. **Responsive design** - Works on mobile, tablet, desktop
7. **Admin CRUD** - Manage courses, events, users, contacts

---

## What Needs Work

### Priority 1 - Before Launch
- [ ] Connect to real PocketBase instance
- [ ] Implement real authentication flow
- [ ] Add password reset functionality
- [ ] Setup email notifications (Resend)
- [ ] Add payment integration (Stripe)

### Priority 2 - Enhancement
- [ ] Course video player integration
- [ ] Quiz/assessment system
- [ ] Real-time progress tracking
- [ ] Email templates for confirmations
- [ ] PDF certificate generation (jsPDF)

### Priority 3 - Nice to Have
- [ ] Multi-language support (EN/BM)
- [ ] Dark mode toggle
- [ ] PWA support
- [ ] Social login (Google, LinkedIn)
- [ ] Calendar integration

---

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production
npm start

# Type check
npx tsc --noEmit
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

---

## File Structure

```
kitaworkshub/
├── app/
│   ├── admin/           # Admin portal pages
│   ├── api/             # API routes
│   ├── components/      # Shared components
│   ├── portal/          # Client portal pages
│   ├── courses/         # Course listing page
│   ├── events/          # Events page
│   ├── services/        # Services page
│   ├── contact/         # Contact page
│   ├── community/       # Community page
│   ├── privacy/         # Privacy policy
│   ├── terms/           # Terms of service
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── lib/
│   ├── context/         # React contexts
│   ├── hooks/           # Custom hooks
│   ├── types/           # TypeScript types
│   ├── pocketbase.ts    # PocketBase client
│   └── analytics.ts     # Analytics service
├── public/              # Static assets
├── tailwind.config.ts   # Tailwind config
└── package.json         # Dependencies
```

---

## Credits

Built by: [Your Team]
Design System: Custom (YTL-inspired)
Icons: Custom SVG components
Animations: GSAP

---

*Last updated: December 2024*
