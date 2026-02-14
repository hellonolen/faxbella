#!/bin/bash
# Updates .env.local to point to production deployment
# Reads Stripe publishable key from docs/Untitled.txt
# Run from faxbella/ directory: bash infra/update-env-local.sh

NOTES="docs/Untitled.txt"

# Extract Stripe publishable key from notes
STRIPE_PK=$(grep -A5 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' "$NOTES" | grep '^pk_' | tr -d '[:space:]')

cat > .env.local << EOF
NEXT_PUBLIC_CONVEX_URL=https://precise-opossum-335.convex.cloud
CONVEX_DEPLOYMENT=prod:precise-opossum-335
NEXT_PUBLIC_CONVEX_SITE_URL=https://precise-opossum-335.convex.site
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${STRIPE_PK}
EOF

echo "[SET] .env.local updated for production"
echo "  NEXT_PUBLIC_CONVEX_URL = [SET]"
echo "  CONVEX_DEPLOYMENT = [SET]"
echo "  NEXT_PUBLIC_CONVEX_SITE_URL = [SET]"
echo "  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = [SET]"
