# Unkillable production foundation

This branch is a staging area for the real cloud-backed product. The public investor demo remains untouched on `main`.

## Architecture

- Next.js 16 server deployment (not static export)
- Supabase Auth + Postgres
- `@supabase/ssr` cookie-based browser/server clients
- Row Level Security on every user-data table
- Publishable key only in browser code
- No service-role/secret key in client bundles
- Cloud persistence for habits, completions, Minimum Days, settings, and reviews

## Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Use Supabase's modern `sb_publishable_...` key. Never put a secret or service-role key in a `NEXT_PUBLIC_` variable.

## Auth configuration after the hosted project exists

Set the Supabase Auth Site URL to the production web origin and add localhost + staging origins as redirect URLs.

For cookie-based SSR confirmation flows, customize the hosted Supabase email templates:

### Confirm signup

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/onboarding">
  Confirm email
</a>
```

### Password recovery

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password">
  Reset password
</a>
```

For a public launch, configure custom SMTP rather than relying on Supabase's trial email sender.

## Database

`supabase/schema.sql` is the reviewed schema blueprint. Before launch:

1. Apply it to the dedicated project.
2. Verify every table has RLS enabled.
3. Test two accounts against one another for cross-user reads/writes.
4. Run Supabase security and performance advisors.
5. Generate committed TypeScript database types from the live project.
6. Turn the final schema into migration history in the private production repository.

## Production repository

Create a private GitHub repository named `unkillable-prod`. Copy this branch into it and keep `unkillable-demo` as the stable public investor experience.

Do not store Supabase secret keys, payment provider secrets, webhook signing secrets, or SMTP credentials in Git.
