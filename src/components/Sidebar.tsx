import type { RefObject, WheelEventHandler } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import GridHoverBackground from './GridHoverBackground'

// Homepage-only pinned left column, emulating danielamuntyan.com's layout
// (name/role up top, nav below, contact links pinned to the bottom).
// `fixed` (not `sticky`) so it's simply always in the same place
// regardless of scroll, no containing-block scoping to get wrong. The
// bento grid next to it (BentoGrid.tsx, via Home.tsx) is a fully
// independent `overflow-y-auto` column.
//
// This pinned vertical layout is `lg:`-only — a fixed 280px column ate
// ~75% of a 375px phone screen, squeezing the bento grid into a
// barely-usable sliver. Below `lg` this renders nothing (`hidden`);
// Home.tsx swaps in the same sticky `Navbar` used on every other page
// plus a horizontal `MobileHero` band instead.
//
// Every other page (case studies, About, Code) keeps the normal
// full-width layout with the floating Navbar instead — this sidebar is
// homepage-only, and desktop-only within the homepage too.
//
// `onWheel`: `position: fixed` elements don't chain scroll to an
// ancestor via the browser's default wheel handling — even though this
// sidebar's actual DOM parent (Home.tsx's outer div) is the page's
// scroll container, wheeling over the fixed sidebar itself does
// nothing (confirmed by checking the container's `scrollTop` before/
// after). Home.tsx passes a handler here that manually forwards the
// wheel delta to its scroll container's `scrollTop` — a plain JS
// workaround for a real browser limitation, not something CSS alone
// can fix.
const NAV_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Code', to: '/code' },
]

const EDUCATION = [
  { programme: 'Web Development & User Experience', school: 'Högskolan Väst' },
  { programme: 'Physiotherapy', school: 'Uppsala University' },
  { programme: 'Content for social media', school: 'Högskolan Dalarna' },
]

export default function Sidebar({
  onWheel,
  scrollContainerRef,
}: {
  onWheel?: WheelEventHandler<HTMLElement>
  // The page this sidebar sits in (Home, GamePage) owns its own real
  // scroll container — on `lg`+, that's an internal `overflow-y-auto`
  // div, not `window`/`document` (this sidebar is `fixed`, and the
  // page's outer element itself never scrolls). `window.scrollTo()`
  // from the "Barbora Gustafsson" link below was a silent no-op there
  // for exactly that reason; scrolling this ref directly is what
  // actually works.
  scrollContainerRef?: RefObject<HTMLDivElement | null>
}) {
  const { pathname } = useLocation()

  return (
    <motion.aside
      onWheel={onWheel}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="hidden overflow-hidden bg-page-bg px-8 py-10 lg:fixed lg:top-9 lg:bottom-0 lg:left-0 lg:z-20 lg:flex lg:w-[280px] lg:flex-col lg:justify-between xl:w-[320px]"
    >
      {/* Hover trail here uses a dark warm-brown (same as
          `--color-textbox`) instead of the site's default pink — reads
          better against this sidebar's own dark background. */}
      <GridHoverBackground hoverClassName="hover:bg-[#282622]" />

      <div className="relative z-10">
        {/* Just a little larger than the surrounding copy below, not a
            big headline. */}
        <h1 className="font-display text-2xl leading-tight text-white">
          {/* Doubles as "scroll to top" on the homepage itself — a
              `Link` to the current URL doesn't trigger navigation (no
              route change), so on `/` this otherwise did nothing.
              Everywhere else (e.g. GamePage), it's a normal "back home"
              link, no special handling needed. Same fix already applied
              to Navbar's own "Barbora" link. */}
          <Link
            to="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                scrollContainerRef?.current?.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          >
            Barbora Gustafsson
          </Link>
        </h1>
        {/* Tagline leads, then role, then location smallest/most muted. */}
        <p className="mt-3 text-xl text-white/80">I study people</p>
        <p className="mt-1 text-xl text-white/60">UX &amp; Product design</p>
        <p className="mt-3 text-sm text-white/40">Uppsala/Stockholm, Sweden</p>

        {/* Sits right under name/role/location, ahead of the education
            block at the bottom, so it reads as navigation rather than
            getting buried under prose. No horizontal padding — flush
            with the name/tagline above it. */}
        <nav className="mt-6 flex flex-col items-start gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="py-1.5 text-xl font-semibold text-white transition-colors hover:text-white/70"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Education pushed to its own block at the bottom
          (`justify-between` on the aside), visually separated from the
          name/nav/tagline group above but still directly visible, not
          tucked behind a click. Each entry gets its own line — programme
          name brighter/first, school name dimmer/smaller right under it
          — so the two are never visually confused with each other. */}
      <div className="relative z-10">
        <p className="font-pixel text-xs uppercase tracking-[0.2em] text-white/40">Education</p>
        <div className="mt-2 flex flex-col gap-2">
          {EDUCATION.map((entry) => (
            <div key={entry.school}>
              <p className="text-sm text-white/70">{entry.programme}</p>
              <p className="text-xs text-white/40">{entry.school}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}
