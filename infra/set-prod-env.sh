#!/bin/bash
# Copies env vars from dev to production Convex deployment
# Run from faxbella/ directory: bash infra/set-prod-env.sh

echo "Copying environment variables from dev to production..."

# Get all env vars from dev (key=value format)
while IFS='=' read -r key value; do
  if [ -n "$key" ] && [ -n "$value" ]; then
    npx convex env set "$key" "$value" --prod 2>/dev/null
    echo "  [SET] $key"
  fi
done < <(npx convex env list 2>/dev/null)

echo ""
echo "Done. Production env vars set."
