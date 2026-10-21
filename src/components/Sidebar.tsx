import { m } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import GridHoverBackground from './GridHoverBackground'
import { HOME_BACKGROUND, HOME_SKILLS } from '../data/homeSkills'

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
// It starts under the full-width Navbar bar (64px from `lg`), which every
// page shows, so it has no
// About/Code links of its own any more.


export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <m.aside
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="hidden overflow-hidden border-r border-white/5 bg-sidebar px-8 py-10 lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:z-20 lg:flex lg:w-[280px] lg:flex-col lg:justify-between lg:gap-10 xl:w-[320px]"
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

      {/* Skills pushed to their own block at the bottom
          (`justify-between` on the aside), visually separated from the
          name/tagline group above but still directly visible. */}
      <div className="relative z-10">
        <h2 className="font-pixel text-sm uppercase tracking-[0.2em] text-white/60">Skills</h2>
        <ul className="mt-3 space-y-1.5">
          {HOME_SKILLS.map((skill) => (
            <li key={skill} className="text-base font-medium leading-snug text-white/90">{skill}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-white/55">{HOME_BACKGROUND}</p>
      </div>
    </m.aside>
  )
}
