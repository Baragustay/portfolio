import { m } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import GridHoverBackground from './GridHoverBackground'

// Homepage-only pinned left column, emulating danielamuntyan.com's layout
// (name/role up top, nav below, contact links pinned to the bottom).
// `fixed` (not `sticky`) so it's simply always in the same place
// regardless of scroll, no containing-block scoping to get wrong. The
// bento grid next to it (BentoGrid.tsx, via Home.tsx) scrolls with the
// page itself.
//
// This pinned vertical layout is `lg:`-only — a fixed 280px column ate
// ~75% of a 375px phone screen, squeezing the bento grid into a
// barely-usable sliver. Below `lg` this renders nothing (`hidden`);
// Home.tsx shows a horizontal `MobileHero` band instead.
//
// It starts under the full-width Navbar bar (StatusBar 36px + bar 56px +
// its 8px pixel dither = 100px), which every page shows, so it has no
// About/Code links of its own any more.

const EDUCATION = [
  { programme: 'AI tools & workflows', school: 'Courses & hands-on projects' },
  { programme: 'Web Development & User Experience', note: 'Webmaster programme', school: 'Högskolan Väst' },
  { programme: 'Physiotherapy', school: 'Uppsala University' },
  { programme: 'Content for social media', school: 'Högskolan Dalarna' },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <m.aside
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="hidden overflow-hidden bg-page-bg px-8 py-10 lg:fixed lg:top-[100px] lg:bottom-0 lg:left-0 lg:z-20 lg:flex lg:w-[280px] lg:flex-col lg:justify-between xl:w-[320px]"
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
              to Navbar's own "Home" link. */}
          <Link
            to="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          >
            Barbora Gustafsson
          </Link>
        </h1>
        {/* Tagline leads, then role, then location smallest/most muted. */}
        <p className="mt-3 text-xl text-white/80">I study people</p>
        <p className="mt-1 text-xl text-white/60">UX &amp; Product design</p>
        <p className="mt-3 text-sm text-white/55">Uppsala/Stockholm, Sweden</p>

      </div>

      {/* Education pushed to its own block at the bottom
          (`justify-between` on the aside), visually separated from the
          name/nav/tagline group above but still directly visible, not
          tucked behind a click. Each entry gets its own line — programme
          name brighter/first, school name dimmer/smaller right under it
          — so the two are never visually confused with each other. */}
      <div className="relative z-10">
        <p className="font-pixel text-sm uppercase tracking-[0.2em] text-white/60">Education</p>
        <div className="mt-3 flex flex-col gap-3">
          {EDUCATION.map((entry) => (
            <div key={entry.school}>
              <p className="text-base font-medium leading-snug text-white/90">{entry.programme}</p>
              {'note' in entry && <p className="text-sm text-white/55">({entry.note})</p>}
              <p className="text-sm text-white/55">{entry.school}</p>
            </div>
          ))}
        </div>
      </div>
    </m.aside>
  )
}
