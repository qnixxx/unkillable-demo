# Unkillable — Investor Demo

A front-end-only, investor-ready version of **Unkillable.app**.

This repository contains the complete marketing site and interactive product demo with no backend requirement. It exports to plain static HTML/CSS/JS and can be hosted on GitHub Pages for free from a public repository.

## What is included

- Premium dark-mode marketing site
- Frictionless **Open product** investor CTA
- Interactive dashboard and Today protocol
- Habit create / edit / delete
- Complete / undo commitments
- Minimum Day mode
- Historical day navigation
- Six resilience pillars
- 7 / 30 / 90 / 365-day analytics
- Weekly review
- Responsive desktop, tablet, and mobile UI
- 90+ days of imperfect seeded history
- Browser persistence through `localStorage`
- Static-export configuration for GitHub Pages
- Automatic GitHub Actions deployment workflow
- No database, API key, server, or paid service required

## Important demo behavior

This is intentionally a **front-end prototype**, not the production account/data architecture.

- `/app` opens directly with populated demo data.
- Changes persist in the current browser with `localStorage`.
- Each browser/device has its own independent copy of the demo data.
- The Settings screen can restore the original populated demo.
- Authentication screens remain in the codebase to demonstrate the intended product flow, but the investor demo does not gate `/app` behind authentication.

That makes the link ideal for an investor pitch: there is no signup friction and nothing external can fail during the demo.

## Local setup

Requirements:

- Node.js 22+
- npm

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

For the static production build:

```bash
npm run build
```

The exported site is written to:

```text
out/
```

To preview that static output locally:

```bash
npm run preview
```

## Deploy free to GitHub Pages

### 1. Create a repository

Create a new repository on GitHub, for example:

```text
unkillable-demo
```

For zero-cost GitHub Pages on a GitHub Free account, make the repository public.

### 2. Upload this project

From this folder:

```bash
git init
git add .
git commit -m "Launch Unkillable investor demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/unkillable-demo.git
git push -u origin main
```

### 3. Enable GitHub Pages

In the GitHub repository:

1. Open **Settings**.
2. Open **Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Open the **Actions** tab and let the included deployment workflow finish.

The workflow in `.github/workflows/deploy-pages.yml` automatically:

- installs dependencies;
- detects the GitHub Pages URL and base path;
- builds a fully static Next.js export;
- uploads `out/`;
- deploys it to GitHub Pages.

A project repository will normally be available at:

```text
https://YOUR-USERNAME.github.io/unkillable-demo/
```

## Custom domain later

You can connect a custom domain such as `demo.unkillable.app` or `unkillable.app` from **Settings → Pages → Custom domain** and configure the DNS records at your domain provider.

The deployment workflow uses GitHub Pages' reported `base_url` and `base_path`, so the same build configuration works when the Pages site moves from a repository subpath to a configured custom domain.

## Best investor demo route

Send investors the homepage URL first. During the conversation:

1. Establish the problem on the landing page.
2. Click **Open product →**.
3. Show the 82 Unkillable Score and 91% consistency.
4. Open **Today** and complete / undo a commitment.
5. Activate **Minimum Day** to demonstrate the core differentiation.
6. Open **Analytics** and switch 7 / 30 / 90 / 365-day ranges.
7. Open **Review** to show the recovery-oriented weekly feedback loop.
8. Return to **Settings** if you want to reset the populated demo before another meeting.

See `PITCH_GUIDE.md` for a short demo narrative.

## Static architecture

```text
app/                    Next.js routes
components/             Marketing + product UI
components/app/         Dashboard/product components
components/marketing/   Public-site components
components/ui/          Shared primitives
lib/                    Metrics, configuration, persistence
 data/                   Seeded 90+ day demo history
public/                 Static assets
.github/workflows/      GitHub Pages deployment
```

The production migration path remains straightforward: replace the local storage adapter and demo auth guard with Supabase/Auth/Postgres or another backend without redesigning the user experience.

## Environment variables

None are required locally.

GitHub Actions automatically supplies these during Pages builds:

```text
NEXT_PUBLIC_BASE_PATH
NEXT_PUBLIC_SITE_URL
```

For an unusual manual static deployment you can define them yourself. See `.env.example`.

## Production commands

```bash
npm run typecheck
npm run lint
npm run build
```

## Product domain

Canonical brand domain:

```text
https://unkillable.app
```

Investor-demo hosting can use GitHub Pages until you are ready to connect the production domain and backend.
