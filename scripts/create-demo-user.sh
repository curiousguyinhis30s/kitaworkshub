#!/bin/bash
# Create demo user for KitaWorksHub portal authentication

PB_URL="http://127.0.0.1:8091"

# Get admin token
echo "Getting admin token..."
AUTH=$(curl -s -X POST "$PB_URL/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d '{"identity":"admin@kitaworkshub.com","password":"KitaWorks2025!"}')

TOKEN=$(echo "$AUTH" | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "Failed to get admin token"
  exit 1
fi
echo "Got admin token"

# First, make sure users collection allows admin to create
echo "Setting users collection rules..."
USERS_COLLECTION=$(curl -s -H "Authorization: $TOKEN" "$PB_URL/api/collections/users")
USERS_ID=$(echo "$USERS_COLLECTION" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)

# Create demo user directly via PocketBase API
echo "Creating demo user..."
DEMO_USER=$(curl -s -X POST "$PB_URL/api/collections/users/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@kitaworkshub.com",
    "password": "demo123456",
    "passwordConfirm": "demo123456",
    "name": "John Doe",
    "role": "student",
    "phone": "+60 12-345 6789",
    "company": "Demo Company",
    "emailVisibility": true
  }')

echo "Demo user response: $DEMO_USER"

# Extract user ID
USER_ID=$(echo "$DEMO_USER" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)

if [ -z "$USER_ID" ]; then
  echo "Failed to create demo user - might already exist"
  # Try to find existing user
  EXISTING=$(curl -s -H "Authorization: $TOKEN" "$PB_URL/api/collections/users/records?filter=(email='demo@kitaworkshub.com')")
  USER_ID=$(echo "$EXISTING" | python3 -c "import sys,json; items=json.load(sys.stdin).get('items',[]); print(items[0].get('id','') if items else '')" 2>/dev/null)
fi

if [ -n "$USER_ID" ]; then
  echo "User ID: $USER_ID"

  # Create user profile
  echo "Creating user profile..."
  PROFILE=$(curl -s -X POST "$PB_URL/api/collections/user_profiles/records" \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"user\": \"$USER_ID\",
      \"bio\": \"Demo user for testing KitaWorksHub portal\",
      \"department\": \"Engineering\",
      \"position\": \"Software Developer\",
      \"skills\": [\"Project Management\", \"Agile\", \"Leadership\"],
      \"member_type\": \"premium\",
      \"notification_email\": true,
      \"notification_courses\": true,
      \"notification_events\": true
    }")
  echo "Profile response: $PROFILE"
fi

# Also create the ahmad demo user
echo ""
echo "Creating ahmad demo user..."
AHMAD_USER=$(curl -s -X POST "$PB_URL/api/collections/users/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmad@demo.com",
    "password": "demo123456",
    "passwordConfirm": "demo123456",
    "name": "Ahmad bin Abdullah",
    "role": "student",
    "phone": "+60 12-345 6789",
    "company": "Petronas Dagangan Berhad",
    "emailVisibility": true
  }')

echo "Ahmad user response: $AHMAD_USER"

AHMAD_ID=$(echo "$AHMAD_USER" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)

if [ -n "$AHMAD_ID" ]; then
  echo "Ahmad ID: $AHMAD_ID"

  # Create ahmad's profile
  AHMAD_PROFILE=$(curl -s -X POST "$PB_URL/api/collections/user_profiles/records" \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"user\": \"$AHMAD_ID\",
      \"bio\": \"Passionate about driving organizational change through effective project management and agile practices.\",
      \"linkedin\": \"linkedin.com/in/ahmadabdullah\",
      \"department\": \"Digital Transformation\",
      \"position\": \"Senior Project Manager\",
      \"skills\": [\"Project Management\", \"Agile\", \"Scrum\", \"Leadership\", \"PMO Setup\"],
      \"member_type\": \"premium\",
      \"notification_email\": true,
      \"notification_courses\": true,
      \"notification_events\": true
    }")
  echo "Ahmad profile: $AHMAD_PROFILE"
fi

echo ""
echo "✅ Demo users created!"
echo ""
echo "Login credentials:"
echo "  Email: demo@kitaworkshub.com"
echo "  Password: demo123456"
echo ""
echo "  Email: ahmad@demo.com"
echo "  Password: demo123456"
