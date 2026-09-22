import Navbar from '../components/Navbar'
import { devProjects } from '../data/devProjects'
import Footer from '../components/Footer'
import PixelReveal from '../components/PixelReveal'
import { PixelArrow } from '../components/Doodles'
import TechIcon from '../components/TechIcon'
import PixelWaveDivider from '../components/PixelWaveDivider'
import { DEV_SKILL_GROUPS } from '../data/devSkills'

// Full Code page, its own route.
//
// Masonry layout: CSS multi-column (`columns-*` + `break-inside-avoid`
// on each tile) rather than CSS Grid — this is the one layout CSS can do
// a Pinterest-style staggered stack with, with zero JS. Each tile flows
// into the shortest column, and columns end up different heights once
// tiles vary in their own height. `ASPECTS` cycles a different banner
// aspect ratio per tile so heights actually vary (uniform square tiles
// wouldn't stagger at all).
//
// Each tile gets a colorful banner. Real photos come from `PROJECT_IMAGES`
// (each project's own real screenshot); projects without one fall back to
// a generated color-wave (`ColorWave`, built from the project's own
// `languageColor`).
//
// Downloaded into `public/code/` and referenced locally, not hot-linked
// to barboragustafsson.com, since that domain's WordPress install is
// being retired.
const PROJECT_IMAGES: Record<string, string> = {
  'react-activity-app': '/code/ReactApp1.webp',
  'polis-webbapp': '/code/PolisApp.webp',
  'angular-tracker': '/code/angularAppMockup1.webp',
  'vanilla-js-crud': '/code/VanillaJSToDO1.webp',
  'seo-site': '/code/BrigittaWebsite1.webp',
  'artisan-bakery': '/code/WebsiteBaking1.webp',
}

// width/height ratios cycled per tile index so banner heights vary —
// the actual source of the masonry stagger (see file-level comment).
const ASPECTS = [4 / 5, 1, 5 / 4, 4 / 3, 3 / 4]


// Each tile's own data comes from two sources — see devProjects.ts:
// live-demo cards from her curated frontend portfolio site, plus a
// handful of GitHub-only repos with no live demo. A tile's primary click
// target is its live demo when it has one, otherwise the repo itself; a
// secondary "View code" link only shows up when a project has both a
// live demo and a known repo URL.
function ColorWave({ color }: { color: string }) {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: color }}>
      <svg
        className="absolute inset-x-0 bottom-0 h-1/2 w-full"
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
      >
        <path d="M0,40 C100,80 300,0 400,40 L400,80 L0,80 Z" fill="rgba(0,0,0,0.18)" />
      </svg>
      <svg
        className="absolute inset-x-0 bottom-0 h-1/3 w-full"
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
      >
        <path d="M0,50 C120,10 280,90 400,30 L400,80 L0,80 Z" fill="rgba(255,255,255,0.14)" />
      </svg>
    </div>
  )
}

// Banner sits in normal document flow above the text (not an
// absolute-positioned full-bleed backdrop with text overlaid) — masonry
// needs each tile's own natural height to vary, which an absolutely
// positioned backdrop (sized only by its parent) can't drive on its own.
function TileBanner({
  project,
  aspect,
  priority,
}: {
  project: (typeof devProjects)[number]
  aspect: number
  // First row's worth of tiles (4, matching the `xl:columns-4` masonry
  // width) load eagerly — everything else is `loading="lazy"`, since
  // this whole grid sits inside a `PixelReveal` (see CodePage's default
  // export) that gates its reveal on every non-lazy `<img>` finishing
  // load. Without this, tiles well below the fold would delay the
  // entrance for content nobody's scrolled to yet.
  priority: boolean
}) {
  const photoUrl = PROJECT_IMAGES[project.id]

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: aspect }}>
      {photoUrl ? (
        <>
          <img
            src={photoUrl}
            alt=""
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Same warm-brown tint (and hover-fade behavior) as the
              homepage bento image tiles. */}
          <div className="pointer-events-none absolute inset-0 bg-[#4a2e14]/20 transition-opacity duration-500 ease-in-out group-hover:opacity-0" />
        </>
      ) : (
        <ColorWave color={project.languageColor} />
      )}
    </div>
  )
}

export default function CodePage() {
  const grid = (
    <div className="mx-auto max-w-6xl columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
      {devProjects.map((project, i) => {
        // `!` is safe here: every entry in `devProjects` has at least
        // one of `liveHref`/`githubHref` set (enforced by convention in
        // that file, not by the type itself, since a project with
        // neither wouldn't make sense to list at all).
        const primaryHref = project.liveHref ?? project.githubHref!
        const primaryLabel = project.liveHref ? 'View live' : 'View code'
        const showSecondaryGithub = project.liveHref && project.githubHref
        const aspect = ASPECTS[i % ASPECTS.length]
        const openPrimary = () => window.open(primaryHref, '_blank', 'noopener,noreferrer')

        return (
          // A `<div>` with `role="link"`, not an `<a>` — the secondary
          // "View code" link below needs to be a real `<a>` too, and an
          // `<a>` can't validly contain another `<a>` (invalid HTML;
          // React logs a hydration-mismatch warning and the browser
          // silently un-nests them at parse time, which breaks click
          // targeting on whichever one ends up de-nested).
          <div
            key={project.id}
            role="link"
            tabIndex={0}
            onClick={openPrimary}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openPrimary()
              }
            }}
            // `transform-gpu`: without it, the banner image's own
            // `group-hover:scale-105` (see TileBanner) promotes just
            // that image to its own GPU-composited layer on hover —
            // Chrome/Safari can then fail to keep applying this card's
            // `rounded-3xl overflow-hidden` clip consistently against
            // a child compositing on top of it, so the corners visibly
            // square off. Promoting this element too keeps the clip on
            // the same compositing layer as the thing it's clipping.
            className="group relative mb-6 block w-full transform-gpu cursor-pointer overflow-hidden rounded-3xl break-inside-avoid bg-textbox"
          >
            <TileBanner project={project} aspect={aspect} priority={i < 4} />
            <div className="p-5">
              <div className="flex items-center gap-2">
                <TechIcon language={project.language} color={project.languageColor} />
                <span className="text-sm font-medium text-white/70">{project.language}</span>
              </div>
              <h3 className="font-display mt-2 text-2xl text-white">{project.name}</h3>
              <p className="mt-2 text-base sm:text-lg text-white/70">{project.description}</p>
              {/* Pixel arrows (not plain "→" text), matching the same
                  `PixelArrow` used for the bento grid's open arrows and
                  the back-nav button. */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-white/70 group-hover:text-white">
                  {primaryLabel}
                  <PixelArrow className="h-3 w-3 -rotate-45" />
                </p>
                {showSecondaryGithub && (
                  <a
                    href={project.githubHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-white/50 hover:text-white/80"
                  >
                    View code
                    <PixelArrow className="h-3 w-3 -rotate-45" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div id="top" className="bg-page-bg">
      <Navbar />

      <section className="px-6 py-24 pt-[164px] md:px-12">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
          Dev Projects
        </p>
        <h1 className="font-display text-center text-5xl text-white md:text-6xl">Code</h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-white/70 sm:text-lg">
          I studied full-stack development at Högskolan Väst, and I'm currently improving my skills in
          React and TypeScript.
        </p>

        <PixelWaveDivider className="mx-auto mt-6 max-w-6xl" />

        {/* `max-w-6xl` — same as the project grid below (see `grid`'s
            own className) — instead of the narrower `max-w-2xl` the
            rest of this hero text uses, so 5 groups have room to sit
            3-then-2 across at `lg`+ instead of stacking into a much
            taller 2-column block. Stacks to 1 column below `sm`, 2
            from `sm`. */}
        <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-x-10 gap-y-6 pt-2 text-left sm:grid-cols-2 lg:grid-cols-3">
          {DEV_SKILL_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-sm font-semibold uppercase tracking-wider text-white/40">{group.label}</p>
              <p className="mt-2 text-base text-white/70 sm:text-lg">{group.value}</p>
            </div>
          ))}
        </div>

        {/* Same GitHub profile URL used site-wide (StatusBar, Footer). */}
        <p className="mx-auto mt-6 mb-10 max-w-2xl text-center text-base leading-relaxed text-white/70 sm:text-lg">
          Here are some of the projects I've built. Check out more on{' '}
          <a
            href="https://github.com/baragustay"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-white underline underline-offset-2 hover:text-white/80"
          >
            GitHub
          </a>
          .
        </p>

        {/* Pixel-dissolve entrance, same as the homepage. Plays on every
            visit, no session gating. */}
        <PixelReveal delay={0.2}>{grid}</PixelReveal>
      </section>

      <Footer dark />
    </div>
  )
}
