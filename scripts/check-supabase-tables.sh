#!/usr/bin/env bash
# Quick script to check whether the REST endpoints for the expected tables are available.
# Usage: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in env or .env file

set -euo pipefail

BASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-}
ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}

if [[ -z "$BASE_URL" || -z "$ANON_KEY" ]]; then
  echo "ERROR: Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required"
  echo "Set them in the environment or source .env.local (e.g. source .env.local)"
  exit 2
fi

TABLES=(users rooms devices gadgets bookings maintenance notifications audit_logs)

printf "Checking Supabase REST endpoints at %s\n" "$BASE_URL"

for table in "${TABLES[@]}"; do
  url="$BASE_URL/rest/v1/$table?select=*"
  status=$(curl -s -o /dev/null -w "%{http_code}" -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" "$url")

  if [[ "$status" == "200" ]]; then
    echo "OK  - $table (200)"
  elif [[ "$status" == "404" ]]; then
    echo "MISSING - $table (404) - Table likely not present in REST schema"
  else
    echo "ERROR - $table ($status) - Response code indicates another issue"
  fi
done

# Optional more informative check: info_schema via supabase CLI
if command -v supabase >/dev/null 2>&1; then
  echo "\nSupabase CLI found. Checking information_schema (requires linking project and supabase CLI login)."
  npx supabase db query --sql "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('users','rooms','devices','gadgets','bookings','maintenance','notifications','audit_logs') ORDER BY table_name;" || true
else
  echo "\nNote: supabase CLI not found in PATH. Install supabase CLI or run 'npx supabase' to use the information_schema check."
fi

exit 0
