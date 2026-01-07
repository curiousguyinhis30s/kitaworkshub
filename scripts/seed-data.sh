#!/bin/bash
# Seed KitaWorksHub data into PocketBase

PB_URL="http://127.0.0.1:8091"

echo "🌱 KitaWorksHub Data Seeder"
echo "==========================="

# Get admin token
echo "🔐 Authenticating..."
TOKEN=$(curl -s -X POST "$PB_URL/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d '{"identity":"admin@kitaworkshub.com","password":"KitaWorks2025!"}' | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Authentication failed"
  exit 1
fi
echo "✅ Authenticated"

# Seed courses
echo ""
echo "📚 Seeding courses..."

curl -s -X POST "$PB_URL/api/collections/courses/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Agile Certified Practitioner",
    "slug": "agile-certified-practitioner",
    "description": "Master Agile methodologies and become a certified practitioner with hands-on project experience.",
    "category": "agile",
    "duration": 2400,
    "price": 350000,
    "instructor_name": "Sarah Lim",
    "features": ["Live workshops", "Real project work", "Certification prep", "Community access"],
    "published": true
  }' > /dev/null && echo "   ✅ Agile Certified Practitioner"

curl -s -X POST "$PB_URL/api/collections/courses/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "PMO Fundamentals & Setup",
    "slug": "pmo-fundamentals-setup",
    "description": "Learn how to establish and run an effective Project Management Office from the ground up.",
    "category": "project-management",
    "duration": 1800,
    "price": 280000,
    "instructor_name": "David Chen",
    "features": ["PMO templates", "Governance frameworks", "Tool selection guide", "Change management"],
    "published": true
  }' > /dev/null && echo "   ✅ PMO Fundamentals & Setup"

curl -s -X POST "$PB_URL/api/collections/courses/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Executive Leadership Presence",
    "slug": "executive-leadership-presence",
    "description": "Develop executive presence and leadership skills to influence stakeholders and drive organizational change.",
    "category": "leadership",
    "duration": 1200,
    "price": 320000,
    "instructor_name": "Amina Karim",
    "features": ["Executive coaching", "Presentation skills", "Stakeholder influence", "Personal branding"],
    "published": true
  }' > /dev/null && echo "   ✅ Executive Leadership Presence"

curl -s -X POST "$PB_URL/api/collections/courses/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Thinking Mastery",
    "slug": "design-thinking-mastery",
    "description": "Apply human-centered design principles to solve complex business problems and drive innovation.",
    "category": "business-analysis",
    "duration": 1500,
    "price": 240000,
    "instructor_name": "Raj Patel",
    "features": ["Hands-on workshops", "Real case studies", "Innovation tools", "Team facilitation"],
    "published": true
  }' > /dev/null && echo "   ✅ Design Thinking Mastery"

curl -s -X POST "$PB_URL/api/collections/courses/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Scrum Master Professional",
    "slug": "scrum-master-professional",
    "description": "Become a professional Scrum Master and lead high-performing agile teams.",
    "category": "scrum",
    "duration": 1800,
    "price": 300000,
    "instructor_name": "Michael Wong",
    "features": ["PSM certification prep", "Sprint facilitation", "Team coaching", "Agile metrics"],
    "published": true
  }' > /dev/null && echo "   ✅ Scrum Master Professional"

curl -s -X POST "$PB_URL/api/collections/courses/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "PMP Exam Preparation",
    "slug": "pmp-exam-preparation",
    "description": "Comprehensive PMP certification preparation with practice exams and study materials.",
    "category": "pmp",
    "duration": 3600,
    "price": 450000,
    "instructor_name": "Linda Tan",
    "features": ["35 PDU credits", "Practice exams", "Study guides", "Mentor support"],
    "published": true
  }' > /dev/null && echo "   ✅ PMP Exam Preparation"

# Seed events
echo ""
echo "📅 Seeding events..."

curl -s -X POST "$PB_URL/api/collections/events/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Building Resilient PMO Systems",
    "slug": "building-resilient-pmo-systems",
    "description": "A full-day workshop on establishing and maintaining resilient PMO systems in uncertain times.",
    "type": "workshop",
    "date": "2025-01-25",
    "time": "9:00 AM - 5:00 PM",
    "duration": "8 hours",
    "location": "KL Convention Centre",
    "price": 45000,
    "capacity": 30,
    "registered_count": 12
  }' > /dev/null && echo "   ✅ Building Resilient PMO Systems"

curl -s -X POST "$PB_URL/api/collections/events/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Leadership in the Age of AI",
    "slug": "leadership-in-the-age-of-ai",
    "description": "Explore how AI is transforming leadership and what skills leaders need to thrive.",
    "type": "seminar",
    "date": "2025-02-08",
    "time": "2:00 PM - 5:00 PM",
    "duration": "3 hours",
    "location": "Online (Zoom)",
    "price": 0,
    "capacity": 100,
    "registered_count": 45
  }' > /dev/null && echo "   ✅ Leadership in the Age of AI"

curl -s -X POST "$PB_URL/api/collections/events/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Agile Transformation Bootcamp",
    "slug": "agile-transformation-bootcamp",
    "description": "Intensive 2-day bootcamp on leading agile transformations in your organization.",
    "type": "bootcamp",
    "date": "2025-02-15",
    "time": "9:00 AM - 5:00 PM",
    "duration": "2 days",
    "location": "Bangsar South, KL",
    "price": 120000,
    "capacity": 20,
    "registered_count": 8
  }' > /dev/null && echo "   ✅ Agile Transformation Bootcamp"

curl -s -X POST "$PB_URL/api/collections/events/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Leaders Networking Night",
    "slug": "project-leaders-networking-night",
    "description": "Connect with fellow project leaders and expand your professional network.",
    "type": "networking",
    "date": "2025-01-30",
    "time": "6:30 PM - 9:00 PM",
    "duration": "2.5 hours",
    "location": "Rooftop Bar, KLCC",
    "price": 5000,
    "capacity": 50,
    "registered_count": 35
  }' > /dev/null && echo "   ✅ Project Leaders Networking Night"

# Create demo user
echo ""
echo "👤 Creating demo user..."
curl -s -X POST "$PB_URL/api/collections/users/records" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@kitaworkshub.com",
    "password": "demo123456",
    "passwordConfirm": "demo123456",
    "name": "Ahmad Demo",
    "role": "student"
  }' > /dev/null && echo "   ✅ Demo user created: demo@kitaworkshub.com / demo123456"

echo ""
echo "✨ Seeding complete!"
echo ""
echo "You can now:"
echo "  1. Visit http://127.0.0.1:8091/_/ to manage data"
echo "  2. Run: bun run dev"
echo "  3. Login as: demo@kitaworkshub.com / demo123456"
