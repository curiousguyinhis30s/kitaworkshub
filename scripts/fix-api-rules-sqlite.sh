#!/bin/bash
cd /Users/samiullah/kitaworkshub/pocketbase

echo "Stopping PocketBase..."
lsof -ti :8091 | xargs kill -9 2>/dev/null
sleep 2

echo "Updating API rules via SQLite..."
sqlite3 pb_data/data.db "UPDATE _collections SET listRule = '', viewRule = '' WHERE name = 'courses';"
sqlite3 pb_data/data.db "UPDATE _collections SET listRule = '', viewRule = '' WHERE name = 'events';"
sqlite3 pb_data/data.db "UPDATE _collections SET listRule = '', viewRule = '' WHERE name = 'modules';"
sqlite3 pb_data/data.db "UPDATE _collections SET listRule = '', viewRule = '' WHERE name = 'lessons';"
sqlite3 pb_data/data.db "UPDATE _collections SET createRule = '' WHERE name = 'contact_inquiries';"

echo "Starting PocketBase..."
./pocketbase serve --http=127.0.0.1:8091 &
sleep 3

echo ""
echo "Testing public access..."
COURSES=$(curl -s "http://127.0.0.1:8091/api/collections/courses/records")
echo "Courses response: $COURSES" | head -100

EVENTS=$(curl -s "http://127.0.0.1:8091/api/collections/events/records")
echo "Events response: $EVENTS" | head -100
