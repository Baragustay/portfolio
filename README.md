# Bára Gustafsson — Portfolio v2 (WIP)

React + Vite + TypeScript + Tailwind v4 + Framer Motion + React Router.

## Run it

```
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## What's in here so far

Real content and images pulled from the live site, barboragustafsson.com
(2026-09-18) — see [`src/data/workItems.ts`](src/data/workItems.ts) and
[`src/data/caseStudyContent.ts`](src/data/caseStudyContent.ts) for sourcing
notes. Everything below reflects actual copy/assets, not placeholders,
except where flagged.

- `src/pages/Home.tsx` — the pinned hero→Work reveal, About (real bio +
  skills list + headshot), and Contact (email, GitHub, LinkedIn).
- `src/components/HeroWorkReveal.tsx` + `src/components/WorkGrid.tsx` —
  the hero and "Work" section, combined into one pinned scroll sequence
  (an earlier `OrbitGallery` hero — orbiting icon cards around the
  headline — was built, then explicitly removed at Bára's request: "remove
  the orbiting objects"). Mechanics: only the hero and the two curtain
  panels are pinned to a fixed one-viewport slice
  (`absolute ... h-screen`); the grid itself renders in normal document
  flow at its real height (measured live via `ResizeObserver`, since tiles
  are allowed to be taller than one screen — "they can take more space, we
  just scroll lower to see the rest"). The wrapper's total height is that
  measured content height plus one viewport's worth of dedicated pin
  budget, so the curtain-close animation always gets a full cycle
  regardless of grid height. Two solid white panels slide in from the
  left/right edges (overlapping in the middle) while the tiles in the left
  columns converge from the left and the tiles in the right columns
  converge from the right (grouped by actual on-screen column via
  `index % COLUMNS`, not array index — grouping by index put whole rows on
  one side instead of a real left/right curtain) — closing like a curtain
  and covering/hiding the hero underneath. Both animations ramp across the
  full scroll range so the pin releases right as the curtain finishes
  closing — the same DOM node then just continues in normal document flow
  (scrolling further reveals more of a tall grid exactly like any other
  section), so nothing disappears or needs a second static copy. No filter
  tabs — item count is small enough that filtering would fragment the feed
  rather than help. Captions sit below each image/video, not overlaid on
  top of it. Replaces an even earlier scroll-driven 3D "cube carousel"
  build, which scroll-jacked the page and has been removed.
  - Two framer-motion/React gotchas hit and fixed here, worth knowing for
    future scroll-linked work: `useTransform` with a 2-point range doesn't
    reliably clamp at the end value once progress moves past the range —
    add an explicit third keyframe pinning it flat (see the label
    opacity/y transforms). And `<video muted>` as a JSX attribute doesn't
    reliably sync to the DOM property before the browser checks autoplay
    eligibility — set `videoRef.current.muted = true` explicitly in an
    effect before calling `.play()`.
  - `PIN_BUDGET_VH` (currently `3`) controls how much scroll distance the
    curtain-close animation gets. At `1` the whole section was only
    ~2460px tall, and a normal-paced scroll burst covered all of it in
    under a second — "I scroll off it before I can see them." Verified
    with a simulated realistic wheel-scroll (not precise `scrollTo` jumps,
    which had missed the bug entirely). If pacing complaints come up
    again, re-run that kind of test before assuming the mechanics are
    fine.
- `src/components/VideoLightbox.tsx` — the two motion-graphics tiles
  (Coop Christmas Commercial, Explainer: JavaScript) autoplay muted/looped
  in the grid as ambient motion; clicking either opens this lightbox with
  an independent, unmuted `<video controls>` instance so the film can
  actually be watched with sound. Closes on `Escape` or backdrop click.
- `src/pages/CaseStudyPage.tsx` — full case study detail page at
  `/work/:slug`, rendering the challenge/research/process/solution/testing/
  reflection sections, pull quotes, and image galleries from
  `caseStudyContent.ts`.
- `src/components/Navbar.tsx` — sticky "liquid glass" navbar. Frosted/
  translucent, rounded pill shape, shrinks slightly once you scroll past the
  top. Links use plain `href`s (not router `Link`s) so they work the same
  from the homepage (in-page scroll) or a case study page (navigates home,
  then jumps to the anchor).
- `src/data/workItems.ts` — the 8 homepage tiles: 4 case studies (Piggy
  Bank, PromptKee, SolidHomes, Memory Game), 2 real videos (Coop Christmas
  commercial, JS explainer — both re-encoded from the ~20MB originals down
  to ~450KB muted h.264 clips for autoplay-tile use), 2 color-filler tiles
  (`filler-accent`, `filler-ink`).
- `src/index.css` — brand palette: white, dusty rose, dark ink (pink+green
  was retired). Registered under Tailwind v4's `@theme` as `--color-ink`
  (`#1d2b2b`), `--color-accent` (`#e1b8ba`), `--color-accent-soft`
  (`#f0dcdc`) — real utilities (`bg-ink`, `text-accent/40`, …), not just
  CSS variables. The *previous* palette lived in plain `:root` instead of
  `@theme`, so it was never actually wired into class generation — every
  `pink-*`/`emerald-*` class across the site had silently been Tailwind's
  stock swatches the whole time. Fixed properly this time.
- `src/data/caseStudyContent.ts` — full case study text + image galleries
  for the 4 detail pages, plus external links (PromptKee's live tool,
  Memory Game's playable build + GitHub repo).
- `src/components/PlayCTA.tsx` — a featured banner right after the case
  studies embedding "Catch a Fact", Bára's 8-bit mini-game
  (github.com/Baragustay/catch-a-fact-CV-game), live at
  barboragustafsson.com/game/catch-a-fact.html and embedded there directly
  via iframe (that URL has no framing restrictions).
- `src/components/DevProjects.tsx` + `src/data/devProjects.ts` — a "Code"
  section (nav: Work / Code / About / Contact) with simple GitHub-linking
  cards for Bára's other dev side projects, pulled from the GitHub API
  (github.com/baragustay). Curated: excludes the Memory Game repo (already
  a full case study), the Catch a Fact game (featured separately above),
  and older/basic school-exercise repos.
- `public/work/images/`, `public/work/videos/`, `public/about/headshot.webp`
  — downloaded project assets (converted to webp where the originals were
  large PNGs).

## Known placeholders / not yet built

- The Pan-da (Deloitte/WWF/AI Sweden hackathon) project from earlier
  planning notes isn't on the live site, so per Bára it stays out of this
  build too — only real, currently-published work is shown.
- The scroll-scrubbed "frame sequence" background effect for the hero
  (Apple product-page style) isn't built yet — needs a decided motif and a
  rendered frame sequence first.
- No cookie banner or Google Analytics wiring yet (the live site has both).
- Not yet deployed anywhere (still fully local).
