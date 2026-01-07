/// <reference path="../pb_data/types.d.ts" />

// KitaWorksHub PocketBase Schema Migration for v0.22+
migrate((db) => {
  const dao = new Dao(db);

  // Create courses collection
  const courses = new Collection({
    name: "courses",
    type: "base",
    schema: [
      { name: "title", type: "text", required: true },
      { name: "slug", type: "text", required: true },
      { name: "description", type: "editor" },
      { name: "category", type: "select", options: { values: ["project-management", "agile", "leadership", "business-analysis", "scrum", "pmp"] } },
      { name: "duration", type: "number" },
      { name: "price", type: "number", required: true },
      { name: "thumbnail", type: "file", options: { maxSelect: 1, maxSize: 10485760, mimeTypes: ["image/jpeg", "image/png", "image/webp"] } },
      { name: "features", type: "json" },
      { name: "instructor_name", type: "text" },
      { name: "published", type: "bool" }
    ],
    indexes: ["CREATE UNIQUE INDEX idx_courses_slug ON courses(slug)"]
  });
  dao.saveCollection(courses);

  // Create modules collection
  const modules = new Collection({
    name: "modules",
    type: "base",
    schema: [
      { name: "course", type: "relation", required: true, options: { collectionId: courses.id, maxSelect: 1 } },
      { name: "title", type: "text", required: true },
      { name: "description", type: "text" },
      { name: "order", type: "number", required: true }
    ]
  });
  dao.saveCollection(modules);

  // Create lessons collection
  const lessons = new Collection({
    name: "lessons",
    type: "base",
    schema: [
      { name: "module", type: "relation", required: true, options: { collectionId: modules.id, maxSelect: 1 } },
      { name: "title", type: "text", required: true },
      { name: "type", type: "select", required: true, options: { values: ["video", "text", "quiz", "live_class"] } },
      { name: "content", type: "editor" },
      { name: "video_url", type: "url" },
      { name: "duration_minutes", type: "number" },
      { name: "order", type: "number", required: true }
    ]
  });
  dao.saveCollection(lessons);

  // Create lesson_materials collection
  const lessonMaterials = new Collection({
    name: "lesson_materials",
    type: "base",
    schema: [
      { name: "lesson", type: "relation", required: true, options: { collectionId: lessons.id, maxSelect: 1 } },
      { name: "title", type: "text", required: true },
      { name: "type", type: "select", required: true, options: { values: ["pdf", "slides", "worksheet", "template", "video"] } },
      { name: "file", type: "file", options: { maxSelect: 1, maxSize: 52428800 } },
      { name: "url", type: "url" }
    ]
  });
  dao.saveCollection(lessonMaterials);

  // Get users collection for relations
  const usersCollection = dao.findCollectionByNameOrId("users");
  const usersId = usersCollection ? usersCollection.id : "_pb_users_auth_";

  // Create enrollments collection
  const enrollments = new Collection({
    name: "enrollments",
    type: "base",
    schema: [
      { name: "user", type: "relation", required: true, options: { collectionId: usersId, maxSelect: 1 } },
      { name: "course", type: "relation", required: true, options: { collectionId: courses.id, maxSelect: 1 } },
      { name: "status", type: "select", required: true, options: { values: ["active", "completed", "cancelled"] } },
      { name: "payment_id", type: "text" },
      { name: "enrolled_at", type: "date" },
      { name: "completed_at", type: "date" }
    ]
  });
  dao.saveCollection(enrollments);

  // Create lesson_progress collection
  const lessonProgress = new Collection({
    name: "lesson_progress",
    type: "base",
    schema: [
      { name: "user", type: "relation", required: true, options: { collectionId: usersId, maxSelect: 1 } },
      { name: "lesson", type: "relation", required: true, options: { collectionId: lessons.id, maxSelect: 1 } },
      { name: "completed", type: "bool" },
      { name: "completed_at", type: "date" },
      { name: "notes", type: "text" }
    ]
  });
  dao.saveCollection(lessonProgress);

  // Create events collection
  const events = new Collection({
    name: "events",
    type: "base",
    schema: [
      { name: "title", type: "text", required: true },
      { name: "slug", type: "text", required: true },
      { name: "description", type: "editor" },
      { name: "type", type: "select", required: true, options: { values: ["workshop", "seminar", "webinar", "bootcamp", "networking"] } },
      { name: "date", type: "date", required: true },
      { name: "time", type: "text", required: true },
      { name: "duration", type: "text", required: true },
      { name: "location", type: "text" },
      { name: "price", type: "number", required: true },
      { name: "capacity", type: "number", required: true },
      { name: "registered_count", type: "number" },
      { name: "image", type: "file", options: { maxSelect: 1, maxSize: 10485760 } }
    ],
    indexes: ["CREATE UNIQUE INDEX idx_events_slug ON events(slug)"]
  });
  dao.saveCollection(events);

  // Create event_registrations collection
  const eventRegistrations = new Collection({
    name: "event_registrations",
    type: "base",
    schema: [
      { name: "user", type: "relation", required: true, options: { collectionId: usersId, maxSelect: 1 } },
      { name: "event", type: "relation", required: true, options: { collectionId: events.id, maxSelect: 1 } },
      { name: "status", type: "select", required: true, options: { values: ["confirmed", "attended", "cancelled"] } },
      { name: "payment_id", type: "text" },
      { name: "confirmation_code", type: "text" }
    ]
  });
  dao.saveCollection(eventRegistrations);

  // Create contact_inquiries collection
  const contactInquiries = new Collection({
    name: "contact_inquiries",
    type: "base",
    schema: [
      { name: "name", type: "text", required: true },
      { name: "email", type: "email", required: true },
      { name: "phone", type: "text" },
      { name: "company", type: "text" },
      { name: "message", type: "text", required: true },
      { name: "status", type: "select", options: { values: ["new", "in_progress", "resolved"] } }
    ]
  });
  dao.saveCollection(contactInquiries);

  // Create payments collection
  const payments = new Collection({
    name: "payments",
    type: "base",
    schema: [
      { name: "user", type: "relation", required: true, options: { collectionId: usersId, maxSelect: 1 } },
      { name: "type", type: "select", required: true, options: { values: ["course", "event"] } },
      { name: "reference_id", type: "text", required: true },
      { name: "amount", type: "number", required: true },
      { name: "currency", type: "text", required: true },
      { name: "stripe_session_id", type: "text" },
      { name: "stripe_payment_intent", type: "text" },
      { name: "status", type: "select", required: true, options: { values: ["pending", "completed", "failed", "refunded"] } }
    ]
  });
  dao.saveCollection(payments);

  // Create certificates collection
  const certificates = new Collection({
    name: "certificates",
    type: "base",
    schema: [
      { name: "user", type: "relation", required: true, options: { collectionId: usersId, maxSelect: 1 } },
      { name: "course", type: "relation", required: true, options: { collectionId: courses.id, maxSelect: 1 } },
      { name: "credential_id", type: "text", required: true },
      { name: "issued_at", type: "date", required: true },
      { name: "expires_at", type: "date" },
      { name: "skills", type: "json" },
      { name: "score", type: "number" }
    ]
  });
  dao.saveCollection(certificates);

  // Create activity_logs collection
  const activityLogs = new Collection({
    name: "activity_logs",
    type: "base",
    schema: [
      { name: "user", type: "relation", required: true, options: { collectionId: usersId, maxSelect: 1 } },
      { name: "action", type: "text", required: true },
      { name: "detail", type: "text" },
      { name: "type", type: "select", options: { values: ["lesson", "certificate", "event", "resource"] } }
    ]
  });
  dao.saveCollection(activityLogs);

}, (db) => {
  const dao = new Dao(db);

  // Rollback - delete collections
  const collections = ["activity_logs", "certificates", "payments", "contact_inquiries", "event_registrations", "events", "lesson_progress", "enrollments", "lesson_materials", "lessons", "modules", "courses"];

  for (const name of collections) {
    try {
      const collection = dao.findCollectionByNameOrId(name);
      if (collection) {
        dao.deleteCollection(collection);
      }
    } catch (e) {
      // Collection may not exist
    }
  }
});
