import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { PixelArrow } from './Doodles'

// Used on every page except the homepage's desktop (`lg:`+) layout,
// which has its own pinned Sidebar.tsx instead. Below `lg`, the
// homepage renders this same Navbar too (see Home.tsx). Real routes
// (`/about`, `/code`), not homepage-section anchors — About and Code
// are their own pages. No Contact link here — Contact lives only in
// the homepage sidebar (desktop) / MobileHero (mobile homepage).
//
// No separate "Work" link — it pointed to `/`, same as "Barbora"
// itself, so it was pure redundancy.
const NAV_LINKS = [
  { label: 'Code', to: '/code' },
  { label: 'About', to: '/about' },
]

export default function Navbar() {
  const { scrollY } = useScroll()
  // Lazy initializer reads the real scroll position for the very first
  // render instead of defaulting to `false` and correcting it a moment
  // later in an effect — no flash of the "unscrolled" pill state on a
  // page that's opened already scrolled down, and no separate
  // mount-time effect needed just to sync one value
  // `useMotionValueEvent` already keeps current after mount.
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24)
  const { pathname } = useLocation()
  // A light circle on a light page has almost no contrast, so the
  // back-arrow button flips to dark-on-light on the dark pages
  // (`/about`, `/code`, `/privacy`) instead of assuming one fixed style
  // works everywhere. Case studies stayed light on purpose.
  const isDarkPage = pathname === '/about' || pathname === '/code' || pathname === '/privacy'

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  return (
    <>
      {/* Back-to-home affordance for every page that isn't the
          homepage — fixed top-left corner, independent of the centered
          nav pill below. Suppressed on `/` itself since "back to home"
          while already home is a no-op link. Hidden below `sm`: the
          centered pill (with "Barbora" always visible) gets wide enough
          at 320–414px to physically overlap this button — measured
          actual bounding boxes rather than guessing. Below `sm`,
          "Barbora" itself (at the pill's own left edge, already close
          to this corner) covers the same affordance anyway. */}
      {pathname !== '/' && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-[52px] left-4 z-50 hidden sm:block"
        >
          <Link
            to="/"
            aria-label="Back to home"
            className={`flex h-11 w-11 items-center justify-center rounded-full
                       shadow-[0_8px_32px_rgba(29,43,43,0.18),0_2px_12px_rgba(225,184,186,0.2)]
                       backdrop-blur-xl backdrop-saturate-150 transition-transform hover:-translate-x-0.5 ${
                         isDarkPage
                           ? 'border border-white/70 bg-white/85 text-ink hover:bg-white'
                           : 'border border-ink/10 bg-ink/85 text-white hover:bg-ink'
                       }`}
          >
            {/* Same blocky `PixelArrow` used for the bento grid's
                "open" arrows and the game's pointer, rotated 180° to
                point back. */}
            <PixelArrow className="h-4 w-4 rotate-180" />
          </Link>
        </motion.div>
      )}

      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-[52px] left-1/2 z-50 -translate-x-1/2 px-2"
      >
        <motion.nav
          animate={{
            paddingInline: scrolled ? 8 : 14,
            paddingBlock: scrolled ? 8 : 12,
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex items-center gap-2 rounded-full border border-white/50
                     bg-white/30 shadow-[0_8px_32px_rgba(29,43,43,0.12),0_2px_12px_rgba(225,184,186,0.16)]
                     backdrop-blur-xl backdrop-saturate-150
                     before:pointer-events-none before:absolute before:inset-0
                     before:rounded-full before:bg-gradient-to-r
                     before:from-accent/40 before:via-white/10 before:to-ink/10
                     before:opacity-70
                     relative overflow-hidden sm:gap-6"
        >
          {/* Just "Barbora", not the full "Barbora Gustafsson" — short
              enough to fit at every width once the pill's own gaps/
              padding are also tightened below `sm`. */}
          <Link
            to="/"
            className="font-pixel relative z-10 pl-2 text-sm uppercase tracking-wide text-ink sm:pl-3"
          >
            Barbora
          </Link>
          <ul className="font-pixel relative z-10 flex items-center gap-1 pr-2 text-sm text-ink sm:gap-5 sm:pr-3">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`rounded-full px-1.5 py-1.5 uppercase tracking-wide transition-colors hover:bg-accent-soft/50 sm:px-3 ${
                    pathname === link.to ? 'bg-accent-soft/50 font-bold' : 'font-normal'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      </motion.header>
    </>
  )
}
