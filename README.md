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

Hosted on **Netlify**, auto-deploying from the `main` branch on every push to
[github.com/Baragustay/portfolio](https://github.com/Baragustay/portfolio).
Build command `npm run build`, publish directory `dist`.

- `public/_redirects` — SPA fallback (`/* /index.html 200`), required since
  this is a client-side-routed React app.
- `netlify.toml` — security headers (CSP, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS).

**Domain**: `barboragustafsson.com` is registered and DNS-managed on
Hostinger, with an A record (root) and CNAME (`www`) pointing at Netlify.
Nameservers stay on Hostinger (not switched to Netlify DNS), since Hostinger
also hosts a separate subdomain (see below).

**`frontend.barboragustafsson.com`**: a separate static site on Hostinger
hosting the older standalone project demos linked from the Code page
(`devProjects.ts`). Its root redirects (`.htaccess`, HTTP 301) to
`barboragustafsson.com/code`; individual project folders are served as-is.

## Analytics & cookies

Google Analytics (`src/lib/analytics.ts`) only loads after a visitor accepts
the cookie banner; rejecting calls GA's documented opt-out instead. Consent
choice is stored in that visitor's own `localStorage` only — not sent
anywhere or visible to the site owner.
