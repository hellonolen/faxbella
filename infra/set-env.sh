#!/bin/bash
# Sets Convex env vars from docs/Untitled.txt
# Run from faxbella/ directory: bash infra/set-env.sh

NOTES="docs/Untitled.txt"

# Extract values from notes file by variable name
get_val() {
  local var="$1"
  local line=$(grep -n "\`${var}\`" "$NOTES" | head -1 | cut -d: -f1)
  if [ -z "$line" ]; then return 1; fi
  # Value is 5 lines after the variable name in the notes format
  local val_line=$((line + 5))
  local val=$(sed -n "${val_line}p" "$NOTES" | tr -d '[:space:]')
  if [ -z "$val" ] || [ "$val" = "__________________" ] || [ "$val" = "SET" ]; then
    return 1
  fi
  echo "$val"
}

# Convex env vars
CONVEX_VARS=(
  "GEMINI_API_KEY"
  "EMAILIT_API_KEY"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "WHOP_API_KEY"
  "WHOP_WEBHOOK_SECRET"
  "WHOP_COMPANY_ID"
)

echo "Setting Convex environment variables..."
for var in "${CONVEX_VARS[@]}"; do
  val=$(get_val "$var")
  if [ -n "$val" ]; then
    npx convex env set "$var" "$val" 2>/dev/null
    echo "  [SET] $var"
  else
    echo "  [SKIP] $var — no value found"
  fi
done

# .env.local — public keys only
echo ""
echo "Updating .env.local with public keys..."

# Get Stripe publishable key
STRIPE_PK=$(get_val "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")

cat > .env.local << EOF
NEXT_PUBLIC_CONVEX_URL=https://impartial-chicken-456.convex.cloud
CONVEX_DEPLOYMENT=dev:impartial-chicken-456
NEXT_PUBLIC_CONVEX_SITE_URL=https://impartial-chicken-456.convex.site
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${STRIPE_PK}
EOF

echo "  [SET] .env.local (4 public vars)"
echo ""
echo "Done. Run 'npx convex env list' to verify."
