# Unkillable production foundation

The public investor demo remains on `main`. Production work is isolated from it.

## Backend

Hosted Supabase project:

- Project name: `unkillable-prod`
- Region: `eu-central-1` (Frankfurt)
- Project ref: `sztraqxqwtnebxkjdlsw`
- Current project cost at creation: $0/month

The application uses:

- Next.js 16 server deployment (not static export)
- Supabase Auth + Postgres
- `@supabase/ssr` cookie-based browser/server clients
- Row Level Security on every user-data table
- modern publishable keys in browser code
- no service-role/secret key in browser bundles
- cloud persistence for habits, completions, Minimum Days, profile/settings, and weekly review storage

## Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=https://sztraqxqwtnebxkjdlsw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<project publishable key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never place a Supabase secret/service-role key in a `NEXT_PUBLIC_` variable or Git.

## Auth URL configuration

Before beta, set the hosted Supabase Auth Site URL to the real application origin and allow these redirect patterns:

- local: `http://localhost:3000/**`
- staging: your staging deployment origin
- production: the production application origin

The app sends email confirmations and password recovery back through:

```text
/auth/confirm
```

That route accepts current Supabase PKCE `code` callbacks and token-hash confirmation links, exchanges them for a cookie-backed session, and then redirects to onboarding or password reset.

For public launch, configure custom SMTP instead of relying on the Supabase trial mail service.

## Database

Live migrations:

1. `20260926082513_initial_unkillable_schema.sql`
2. `20260926082554_add_completion_owner_index.sql`

All seven public user-data tables have RLS enabled. The initial Supabase security advisor pass returned no findings.

Generated live database types are committed at:

```text
types/database.ts
```

## Production repository

Create a private GitHub repository named `unkillable-prod`. Copy the `production-foundation` branch into it and keep `unkillable-demo` as the stable public investor experience.

Do not store Supabase secret keys, payment provider secrets, webhook signing secrets, SMTP credentials, or Apple credentials in Git.
