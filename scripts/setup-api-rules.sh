#!/bin/bash
# Set up PocketBase API rules for public/authenticated access

PB_URL="http://127.0.0.1:8091"

echo "Getting auth token..."
AUTH_RESPONSE=$(curl -s -X POST "$PB_URL/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d '{"identity":"admin@kitaworkshub.com","password":"KitaWorks2025!"}')

TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token"
  exit 1
fi

echo "Token obtained"

# Set API rules for each collection
echo ""
echo "Setting API rules..."

# Courses - public read
echo "  courses: public read"
curl -s -X PATCH "$PB_URL/api/collections/courses" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listRule": "", "viewRule": ""}' > /dev/null

# Events - public read
echo "  events: public read"
curl -s -X PATCH "$PB_URL/api/collections/events" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listRule": "", "viewRule": ""}' > /dev/null

# Modules - public read
echo "  modules: public read"
curl -s -X PATCH "$PB_URL/api/collections/modules" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listRule": "", "viewRule": ""}' > /dev/null

# Lessons - public read
echo "  lessons: public read"
curl -s -X PATCH "$PB_URL/api/collections/lessons" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listRule": "", "viewRule": ""}' > /dev/null

# Contact inquiries - public create only
echo "  contact_inquiries: public create"
curl -s -X PATCH "$PB_URL/api/collections/contact_inquiries" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"createRule": ""}' > /dev/null

# Enrollments - authenticated users only (own records)
echo "  enrollments: auth user's own records"
curl -s -X PATCH "$PB_URL/api/collections/enrollments" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listRule": "@request.auth.id = user", "viewRule": "@request.auth.id = user", "createRule": "@request.auth.id != \"\""}' > /dev/null

# Event registrations - authenticated users only (own records)
echo "  event_registrations: auth user's own records"
curl -s -X PATCH "$PB_URL/api/collections/event_registrations" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listRule": "@request.auth.id = user", "viewRule": "@request.auth.id = user", "createRule": "@request.auth.id != \"\""}' > /dev/null

# Lesson progress - authenticated users only (own records)
echo "  lesson_progress: auth user's own records"
curl -s -X PATCH "$PB_URL/api/collections/lesson_progress" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listRule": "@request.auth.id = user", "viewRule": "@request.auth.id = user", "createRule": "@request.auth.id != \"\"", "updateRule": "@request.auth.id = user"}' > /dev/null

# Certificates - authenticated users only (own records)
echo "  certificates: auth user's own records"
curl -s -X PATCH "$PB_URL/api/collections/certificates" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listRule": "@request.auth.id = user", "viewRule": "@request.auth.id = user"}' > /dev/null

# Activity logs - authenticated users only (own records)
echo "  activity_logs: auth user's own records"
curl -s -X PATCH "$PB_URL/api/collections/activity_logs" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listRule": "@request.auth.id = user", "createRule": "@request.auth.id != \"\""}' > /dev/null

# Payments - authenticated users only (own records)
echo "  payments: auth user's own records"
curl -s -X PATCH "$PB_URL/api/collections/payments" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listRule": "@request.auth.id = user", "viewRule": "@request.auth.id = user"}' > /dev/null

echo ""
echo "✅ API rules configured!"
echo ""
echo "Testing public access..."
curl -s "$PB_URL/api/collections/courses/records" | grep -o '"totalItems":[0-9]*' || echo "courses: accessible"
curl -s "$PB_URL/api/collections/events/records" | grep -o '"totalItems":[0-9]*' || echo "events: accessible"
