#!/bin/bash
# Add missing fields to lesson_progress collection

PB_URL="http://127.0.0.1:8091"

echo "Getting auth token..."
AUTH_RESPONSE=$(curl -s -X POST "$PB_URL/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d '{"identity":"admin@kitaworkshub.com","password":"KitaWorks2025!"}')

TOKEN=$(echo "$AUTH_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token"
  echo "$AUTH_RESPONSE"
  exit 1
fi

echo "Token obtained"

# Get current collection schema
echo "Getting current lesson_progress schema..."
COLLECTION=$(curl -s -H "Authorization: $TOKEN" "$PB_URL/api/collections/lesson_progress")
COLLECTION_ID=$(echo "$COLLECTION" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "Collection ID: $COLLECTION_ID"

# Get enrollments collection ID for relation
ENROLLMENTS=$(curl -s -H "Authorization: $TOKEN" "$PB_URL/api/collections/enrollments")
ENROLLMENTS_ID=$(echo "$ENROLLMENTS" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "Enrollments ID: $ENROLLMENTS_ID"

# Current schema fields
CURRENT_SCHEMA=$(echo "$COLLECTION" | grep -o '"schema":\[[^]]*\]')

# Build updated schema with new fields
# We'll update via the API by patching the collection
echo "Adding new fields to lesson_progress..."

curl -s -X PATCH "$PB_URL/api/collections/$COLLECTION_ID" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"schema\": [
      {\"name\": \"user\", \"type\": \"relation\", \"required\": true, \"options\": {\"collectionId\": \"_pb_users_auth_\", \"maxSelect\": 1}},
      {\"name\": \"lesson\", \"type\": \"relation\", \"required\": true, \"options\": {\"collectionId\": \"ay1liedygtftzcn\", \"maxSelect\": 1}},
      {\"name\": \"enrollment\", \"type\": \"relation\", \"required\": false, \"options\": {\"collectionId\": \"$ENROLLMENTS_ID\", \"maxSelect\": 1}},
      {\"name\": \"completed\", \"type\": \"bool\", \"required\": false},
      {\"name\": \"completed_at\", \"type\": \"date\", \"required\": false},
      {\"name\": \"video_position_sec\", \"type\": \"number\", \"required\": false},
      {\"name\": \"time_spent_sec\", \"type\": \"number\", \"required\": false},
      {\"name\": \"notes\", \"type\": \"text\", \"required\": false}
    ]
  }" > /dev/null && echo "✅ Schema updated successfully" || echo "❌ Failed to update schema"

# Verify
echo ""
echo "Verifying new schema..."
curl -s -H "Authorization: $TOKEN" "$PB_URL/api/collections/lesson_progress" | grep -o '"name":"[^"]*"' | cut -d'"' -f4

echo ""
echo "Done!"
