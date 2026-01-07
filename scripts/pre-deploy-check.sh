#!/bin/bash
# Pre-deployment validation script for Next.js projects
# Run before every deployment: ./scripts/pre-deploy-check.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

echo "========================================"
echo "  PRE-DEPLOYMENT VALIDATION CHECK"
echo "========================================"
echo ""

# 1. METADATA CHECK
echo "1. Checking Metadata..."
echo "------------------------"

# Check root layout has metadata
if grep -q "export const metadata" app/layout.tsx 2>/dev/null; then
  echo -e "${GREEN}✓${NC} Root layout has metadata export"
else
  echo -e "${RED}✗${NC} Missing metadata in app/layout.tsx"
  ((ERRORS++))
fi

# Check for required metadata fields
REQUIRED_META=("title" "description" "openGraph" "twitter")
for field in "${REQUIRED_META[@]}"; do
  if grep -q "$field" app/layout.tsx 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Metadata has '$field'"
  else
    echo -e "${RED}✗${NC} Missing '$field' in metadata"
    ((ERRORS++))
  fi
done

# Check metadataBase URL
if grep -q "metadataBase" app/layout.tsx 2>/dev/null; then
  METABASE=$(grep -o "metadataBase.*" app/layout.tsx | head -1)
  echo -e "${GREEN}✓${NC} metadataBase defined: $METABASE"
else
  echo -e "${YELLOW}!${NC} Missing metadataBase - OG images may not work"
  ((WARNINGS++))
fi

echo ""

# 2. ASSETS CHECK
echo "2. Checking Required Assets..."
echo "-------------------------------"

# Favicon can be in app/ (Next.js 13+) or public/
if [ -f "app/favicon.ico" ] || [ -f "public/favicon.ico" ]; then
  echo -e "${GREEN}✓${NC} favicon.ico exists"
else
  echo -e "${RED}✗${NC} Missing favicon.ico (check app/ or public/)"
  ((ERRORS++))
fi

REQUIRED_FILES=("public/robots.txt")
OPTIONAL_FILES=("public/apple-touch-icon.png" "public/og-image.png" "app/manifest.webmanifest")

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file exists"
  else
    echo -e "${RED}✗${NC} Missing required: $file"
    ((ERRORS++))
  fi
done

for file in "${OPTIONAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file exists"
  else
    echo -e "${YELLOW}!${NC} Missing optional: $file"
    ((WARNINGS++))
  fi
done

echo ""

# 3. BUILD CHECK
echo "3. Checking Build..."
echo "--------------------"

if [ -d ".next" ]; then
  BUILD_TIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" .next 2>/dev/null || stat -c "%y" .next 2>/dev/null | cut -d'.' -f1)
  echo -e "${GREEN}✓${NC} Build exists (last: $BUILD_TIME)"
else
  echo -e "${RED}✗${NC} No .next build directory - run 'bun run build' first"
  ((ERRORS++))
fi

echo ""

# 4. ENVIRONMENT CHECK
echo "4. Checking Environment..."
echo "--------------------------"

if [ -f ".env.local" ]; then
  echo -e "${GREEN}✓${NC} .env.local exists"

  # Check it's in .gitignore
  if grep -q ".env" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✓${NC} .env files in .gitignore"
  else
    echo -e "${RED}✗${NC} .env files NOT in .gitignore - security risk!"
    ((ERRORS++))
  fi
else
  echo -e "${YELLOW}!${NC} No .env.local file"
  ((WARNINGS++))
fi

# Check for exposed secrets in code
echo ""
echo "5. Checking for Exposed Secrets..."
echo "-----------------------------------"

# Patterns that indicate actual hardcoded secrets
# Looking for actual secret VALUES, not variable names or code patterns
SECRET_PATTERNS=("sk_live_[A-Za-z0-9]" "pk_live_[A-Za-z0-9]" "ghp_[A-Za-z0-9]" "gho_[A-Za-z0-9]" "xoxb-[0-9]" "AKIA[A-Z0-9]")
SECRETS_FOUND=0

for pattern in "${SECRET_PATTERNS[@]}"; do
  MATCHES=$(grep -r "$pattern" --include="*.ts" --include="*.tsx" --include="*.js" app/ lib/ 2>/dev/null | grep -v ".env" | grep -v "process.env" | head -3)
  if [ -n "$MATCHES" ]; then
    echo -e "${RED}✗${NC} Potential secret found matching '$pattern'"
    ((SECRETS_FOUND++))
  fi
done

if [ $SECRETS_FOUND -eq 0 ]; then
  echo -e "${GREEN}✓${NC} No hardcoded secrets detected"
fi

echo ""

# 6. ACCESSIBILITY QUICK CHECK
echo "6. Quick Accessibility Check..."
echo "--------------------------------"

# Check for alt text usage
ALT_COUNT=$(grep -r "alt=" --include="*.tsx" app/ 2>/dev/null | wc -l | tr -d ' ')
IMG_COUNT=$(grep -r "<Image" --include="*.tsx" app/ 2>/dev/null | wc -l | tr -d ' ')
echo -e "${GREEN}✓${NC} Found $ALT_COUNT alt attributes across $IMG_COUNT Image components"

# Check for aria labels
ARIA_COUNT=$(grep -r "aria-" --include="*.tsx" app/ 2>/dev/null | wc -l | tr -d ' ')
echo -e "${GREEN}✓${NC} Found $ARIA_COUNT aria attributes"

# Check html lang
if grep -q 'lang="en"' app/layout.tsx 2>/dev/null; then
  echo -e "${GREEN}✓${NC} HTML lang attribute set"
else
  echo -e "${YELLOW}!${NC} Missing lang attribute on <html>"
  ((WARNINGS++))
fi

echo ""
echo "========================================"
echo "  SUMMARY"
echo "========================================"
echo ""

if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}FAILED: $ERRORS error(s), $WARNINGS warning(s)${NC}"
  echo ""
  echo "Fix errors before deploying!"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}PASSED with $WARNINGS warning(s)${NC}"
  echo ""
  echo "Consider fixing warnings for better SEO/UX"
  exit 0
else
  echo -e "${GREEN}ALL CHECKS PASSED${NC}"
  echo ""
  echo "Ready to deploy!"
  exit 0
fi
