# Supabase Setup & Migration guide

This project expects a Supabase project with the following tables in the `public` schema:
- users
- rooms
- devices
- gadgets
- bookings
- maintenance
- notifications
- audit_logs

If you see 404 responses for those endpoints (PGRST205 errors) it means PostgREST cannot find the table(s) in the API schema.

## Quick checks
1) Make sure `.env.local` contains the correct project URL and anon key:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hmbwkxapbvffubnxwieh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-here>
```

2) Verify the tables using the script we've included:

```bash
# Source .env.local (optional)
set -o allexport; source .env.local; set +o allexport

# Run the check script (will use values from env)
npm run supabase:check
```

If the script reports any `MISSING - table (404)` entries, it means the table does not exist in the public REST schema.

## Create the tables
You can create the tables using Supabase SQL editor or via the Supabase CLI.

### Dashboard SQL Editor (manual)
- Go to Supabase Dashboard → SQL → New Query
- Open `scripts/01-create-tables.sql` and run it
- Then run `scripts/02-fix-rls-policies.sql` if needed

### Using supabase CLI (automated)
1) Install supabase CLI or use npx (recommended)

```bash
npx supabase login
npx supabase link --project-ref hmbwkxapbvffubnxwieh
npm run supabase:migrate
```

> Note: The CLI will require you to login and/or link the project; follow the prompts. `supabase:migrate` will run the two SQL files in order.

## Testing the REST endpoints
Use curl to test an endpoint directly:

```bash
# Example for rooms
curl -i \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rooms?select=*"
```

You should receive a 200 response with JSON (possibly empty array []). If you still receive 404, check project ref, schema, and whether PostgREST is configured to use the public schema.

---

If you want, I can add a `supabase:seed` script to insert sample data after migration or write a small Node script to check and create the tables programmatically (server-side only) using the service role key. Let me know which route you prefer.
