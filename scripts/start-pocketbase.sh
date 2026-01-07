#!/bin/bash
# Start KitaWorksHub PocketBase instance

cd "$(dirname "$0")/../pocketbase" || exit 1

# Check if already running
if lsof -i :8091 > /dev/null 2>&1; then
  echo "✅ PocketBase is already running on port 8091"
  exit 0
fi

echo "🚀 Starting KitaWorksHub PocketBase..."
./pocketbase serve --http=127.0.0.1:8091 &

sleep 2

if lsof -i :8091 > /dev/null 2>&1; then
  echo "✅ PocketBase started successfully"
  echo "   REST API: http://127.0.0.1:8091/api/"
  echo "   Admin UI: http://127.0.0.1:8091/_/"
  echo ""
  echo "   Admin: admin@kitaworkshub.com / KitaWorks2025!"
else
  echo "❌ Failed to start PocketBase"
  exit 1
fi
