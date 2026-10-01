# Barbora Gustafsson — Portfolio

Personal portfolio site for Barbora Gustafsson (UX & Product Designer), live at
[barboragustafsson.com](https://barboragustafsson.com).

React + Vite + TypeScript + Tailwind v4 + Framer Motion + React Router.

## Run it

```
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

Other scripts: `npm run build` (typecheck + production build to `dist/`),
`npm run lint` (oxlint), `npm run preview` (serve the production build
locally).

## Structure

- `src/pages/` — routes: `Home`, `AboutPage`, `CodePage`, `CaseStudyPage`
  (`/work/:slug`), `PrivacyPolicyPage`, `NotFoundPage`.
- `src/components/` — `Navbar` (sticky pill nav, used everywhere except
  desktop home), `Sidebar`/`MobileHero` (homepage identity panel, desktop vs.
  mobile), `BentoGrid` (homepage case study / video / game tiles),
  `GameEmbed` (iframe for the embedded pixel-art game), `CookieBanner`,
  `Footer`, `StatusBar`, plus assorted pixel-art icon components
  (`Doodles`, `PixelCat*`, `PixelCookie`, `PixelReveal`).
- `src/data/` — `workItems.ts` (case study summaries for the homepage grid),
  `caseStudyContent.ts` (full case study detail content), `devProjects.ts`
  (Code page project cards, including live-demo links).
- `src/lib/` — `analytics.ts` (Google Analytics, consent-gated),
  `cookieConsent.ts` (localStorage consent state), `video.ts`.
- `public/game/` — the standalone "Catch a Fact" pixel-art game, embedded
  via iframe on the homepage.
- `public/work/`, `public/about/`, `public/code/` — case study and project
  images/videos.

## Deployment

Hosted on **Hostinger**. Hostinger's Git deploy copies a branch into
`public_html` as-is without building, so `.github/workflows/hostinger.yml`
runs `npm run build` on every push to `main` and force-pushes only the
contents of `dist/` to the `hostinger` branch, which Hostinger deploys.

- `public/.htaccess` — HTTPS redirect, SPA fallback, security headers (CSP,
  X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy, HSTS) and cache headers. Vite copies it into `dist/`.

**Domain**: `barboragustafsson.com` is registered, DNS-managed and hosted on
Hostinger.

**`frontend.barboragustafsson.com`**: a separate static site on Hostinger
hosting the older standalone project demos linked from the Code page
(`devProjects.ts`). Its root redirects (`.htaccess`, HTTP 301) to
`barboragustafsson.com/code`; individual project folders are served as-is.

## Analytics & cookies

Google Analytics (`src/lib/analytics.ts`) only loads after a visitor accepts
the cookie banner; rejecting calls GA's documented opt-out instead. Consent
choice is stored in that visitor's own `localStorage` only — not sent
anywhere or visible to the site owner.
