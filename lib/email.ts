// lib/email.ts
import { Resend } from 'resend';

// Initialize Resend (lazy - only when API key is available)
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

// Configuration Constants
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_EMAILS_PER_WINDOW = 10;
const EMAIL_FROM = 'KitaWorksHub <noreply@kitaworkshub.com>';

// --- Types ---

interface User {
  name: string;
  email: string;
}

interface Course {
  title: string;
  startDate: string | Date;
}

interface Event {
  title: string;
  date: string | Date;
  location: string;
}

interface Certificate {
  courseName: string;
  pdfUrl: string;
}

type EmailJob =
  | { type: 'welcome'; user: User }
  | { type: 'enrollment'; user: User; course: Course }
  | { type: 'event'; user: User; event: Event }
  | { type: 'certificate'; user: User; certificate: Certificate }
  | { type: 'reset'; user: User; resetLink: string };

// --- Helper: Email Template Renderer ---

const BaseLayout = ({ content }: { content: string }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .header h1 { color: #5F7C6B; margin: 0; }
        .content { padding: 20px 0; }
        .button { display: inline-block; background-color: #5F7C6B; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: bold; }
        .footer { text-align: center; font-size: 0.8em; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>KitaWorksHub</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} KitaWorksHub. All rights reserved.</p>
          <p>Professional Development & Training</p>
        </div>
      </div>
    </body>
  </html>
`;

const Templates = {
  welcome: (user: User) => BaseLayout({
    content: `
      <h2>Welcome to KitaWorksHub, ${user.name}!</h2>
      <p>We are thrilled to have you on board. Get ready to explore amazing courses and connect with the professional community.</p>
      <p>Your journey to professional excellence starts here.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://kitaworkshub.com'}/portal/dashboard" class="button">Go to Dashboard</a>
    `
  }),

  enrollment: (user: User, course: Course) => BaseLayout({
    content: `
      <h2>Enrollment Confirmed!</h2>
      <p>Hi ${user.name},</p>
      <p>You have successfully enrolled in <strong>${course.title}</strong>.</p>
      <p><strong>Start Date:</strong> ${new Date(course.startDate).toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p>Please prepare your materials and check your dashboard for preliminary tasks.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://kitaworkshub.com'}/portal/courses" class="button">View Course Details</a>
    `
  }),

  event: (user: User, event: Event) => BaseLayout({
    content: `
      <h2>Event Registration Confirmed!</h2>
      <p>Hi ${user.name},</p>
      <p>You are registered for <strong>${event.title}</strong>.</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Date:</strong> ${new Date(event.date).toLocaleString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</li>
        <li><strong>Location:</strong> ${event.location}</li>
      </ul>
      <p>We look forward to seeing you there!</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://kitaworkshub.com'}/portal/events" class="button">View Event Details</a>
    `
  }),

  certificate: (user: User, certificate: Certificate) => BaseLayout({
    content: `
      <h2>Congratulations, ${user.name}!</h2>
      <p>You have successfully completed <strong>${certificate.courseName}</strong>.</p>
      <p>Your certificate of completion is ready for download.</p>
      <a href="${certificate.pdfUrl}" class="button">Download Certificate</a>
      <p style="margin-top: 20px; font-size: 0.9em; color: #666;">This certificate validates your professional development achievement.</p>
    `
  }),

  reset: (user: User, resetLink: string) => BaseLayout({
    content: `
      <h2>Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password.</p>
      <p><strong>Note:</strong> This link is valid for the next 1 hour.</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p style="margin-top: 20px; font-size: 0.9em; color: #666;">If you did not request this, please ignore this email.</p>
    `
  })
};

// --- Rate Limiter Class ---

class RateLimiter {
  private timestamps: number[] = [];

  canProceed(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(
      time => now - time < RATE_LIMIT_WINDOW_MS
    );

    if (this.timestamps.length < MAX_EMAILS_PER_WINDOW) {
      this.timestamps.push(now);
      return true;
    }

    return false;
  }

  getWaitTime(): number {
    if (this.timestamps.length === 0) return 0;
    const oldest = this.timestamps[0];
    return Math.max(0, (oldest + RATE_LIMIT_WINDOW_MS) - Date.now());
  }
}

// --- Email Service Class ---

export class EmailService {
  private queue: EmailJob[] = [];
  private isProcessing: boolean = false;
  private rateLimiter = new RateLimiter();

  constructor() {}

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      if (!this.rateLimiter.canProceed()) {
        const waitTime = this.rateLimiter.getWaitTime();
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      const job = this.queue.shift();
      if (job) {
        await this.executeJob(job);
      }
    }

    this.isProcessing = false;
  }

  private async executeJob(job: EmailJob): Promise<void> {
    try {
      let to: string;
      let subject: string;
      let html: string;

      switch (job.type) {
        case 'welcome':
          to = job.user.email;
          subject = 'Welcome to KitaWorksHub!';
          html = Templates.welcome(job.user);
          break;

        case 'enrollment':
          to = job.user.email;
          subject = `Enrolled: ${job.course.title}`;
          html = Templates.enrollment(job.user, job.course);
          break;

        case 'event':
          to = job.user.email;
          subject = `Registered: ${job.event.title}`;
          html = Templates.event(job.user, job.event);
          break;

        case 'certificate':
          to = job.user.email;
          subject = `Certificate: ${job.certificate.courseName}`;
          html = Templates.certificate(job.user, job.certificate);
          break;

        case 'reset':
          to = job.user.email;
          subject = 'Password Reset Instructions';
          html = Templates.reset(job.user, job.resetLink);
          break;
      }

      const resend = getResend();
      if (!resend) {
        console.log(`[Email Mock] Would send to ${to}: ${subject}`);
        return;
      }

      await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject,
        html,
      });

      console.log(`[Email] Sent to ${to}: ${subject}`);
    } catch (error) {
      console.error(`[Email] Failed:`, error);
    }
  }

  private enqueue(job: EmailJob): void {
    this.queue.push(job);
    this.processQueue();
  }

  // Public API Methods

  public sendWelcomeEmail(user: User) {
    this.enqueue({ type: 'welcome', user });
  }

  public sendCourseEnrollmentEmail(user: User, course: Course) {
    this.enqueue({ type: 'enrollment', user, course });
  }

  public sendEventRegistrationEmail(user: User, event: Event) {
    this.enqueue({ type: 'event', user, event });
  }

  public sendCertificateEmail(user: User, certificate: Certificate) {
    this.enqueue({ type: 'certificate', user, certificate });
  }

  public sendPasswordResetEmail(user: User, resetLink: string) {
    this.enqueue({ type: 'reset', user, resetLink });
  }
}

// Singleton instance
export const emailService = new EmailService();
