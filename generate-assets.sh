#!/bin/bash

# ==========================================
# KitaWorksHub - Gemini Asset Generator
# ==========================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🌲 KitaWorksHub Asset Generator${NC}"
echo "Using Google Gemini 3 Pro + Imagen 3"
echo ""

# Check for API key
if [ -z "$GOOGLE_API_KEY" ]; then
    echo "⚠️  GOOGLE_API_KEY not found in environment"
    echo "Please set it with:"
    echo "  export GOOGLE_API_KEY='your-api-key'"
    echo ""
    echo "Or add to .env file:"
    echo "  GOOGLE_API_KEY=your-api-key"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun add @google/generative-ai dotenv
bun add -D @types/node

# Run the generation script
echo "🚀 Starting asset generation..."
bun run scripts/gemini-assets.ts

echo ""
echo -e "${GREEN}✅ Done! Check the /public/assets folder${NC}"
