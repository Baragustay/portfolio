import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { PixelGamepad, PixelHouse } from './Doodles'
import { workItems, type CaseStudyTile } from '../data/workItems'

// Used on every page except the homepage's desktop (`lg:`+) layout,
// which has its own pinned Sidebar.tsx instead. Below `lg`, the
// homepage renders this same Navbar too (see Home.tsx). Real routes
// (`/about`, `/code`), not homepage-section anchors — About and Code
// are their own pages. No Contact link here — Contact lives only in
// the homepage sidebar (desktop) / MobileHero (mobile homepage).
//
// No separate "Work" link — it pointed to `/`, same as "Home" itself,
// so it was pure redundancy.
const NAV_LINKS = [
  { label: 'Code', to: '/code' },
  { label: 'About', to: '/about' },
]

// Same order as the homepage grid.
const CASE_STUDIES = workItems.filter((item): item is CaseStudyTile => item.kind === 'case-study')

export default function Navbar() {
  const { pathname } = useLocation()
  // The page the panel was opened on: navigating anywhere closes it,
  // without an effect resetting state after the route changes.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const studiesOpen = openOn === pathname
  const setStudiesOpen = (open: boolean) => setOpenOn(open ? pathname : null)
  const studiesRef = useRef<HTMLLIElement>(null)

  // A disclosure, not an ARIA menu: Tab moves through the links as usual.
  // Closes on navigation (above), Escape (focus back on the button) and any
  // click outside it.
  useEffect(() => {
    if (!studiesOpen) return
    const onPointer = (e: PointerEvent) => {
      if (!studiesRef.current?.contains(e.target as Node)) setOpenOn(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpenOn(null)
      studiesRef.current?.querySelector('button')?.focus()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [studiesOpen])
  const itemClass = (current: boolean) =>
    `pixel-corners px-2 py-2 transition-colors hover:bg-white/10 sm:px-3 ${current ? 'bg-white/15' : ''}`
  const linkClass = (current: boolean) => `whitespace-nowrap uppercase tracking-wide ${itemClass(current)} active:translate-y-px`

  return (
    // Full-width bar right under the StatusBar (h-9), the same dark on
    // every page, light case studies included, ending in a pixel
    // dither instead of a hard edge. "Home" on the left doubles as the
    // back-to-home link on every other page, so there's no separate back
    // button any more.
    <m.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-9 z-50 text-white"
    >
      <nav aria-label="Main" className="bg-statusbar/90 backdrop-blur-xl">
        <div className="font-pixel flex h-14 items-center justify-between gap-1 px-2 text-[11px] sm:gap-4 sm:px-8 sm:text-sm">
          <Link
            to="/"
            // A `Link` to the current URL doesn't trigger navigation (no
            // route change), so on the homepage itself this otherwise
            // did nothing — including skipping `ScrollToTop` (App.tsx),
            // which only runs on an actual pathname change. Scroll to
            // top directly in that case instead.
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            aria-current={pathname === '/' ? 'page' : undefined}
            className={`group flex items-center gap-2.5 ${linkClass(pathname === '/')}`}
          >
            <PixelHouse className="animate-pixel-hop-on-hover h-[22px] w-[22px]" />
            {/* Icon only below `sm`, so four items fit on a phone. */}
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
          <ul className="flex items-center gap-0.5 sm:gap-3">
            <li ref={studiesRef} className="sm:relative">
              <button
                type="button"
                aria-expanded={studiesOpen}
                aria-controls="nav-case-studies"
                onClick={() => setStudiesOpen(!studiesOpen)}
                className={`flex items-center gap-1.5 sm:gap-2 ${linkClass(pathname.startsWith('/work/'))}`}
              >
                {/* "Work" below `sm`, so the game button fits too at 360px. */}
                <span className="sm:hidden">Work</span>
                <span className="hidden sm:inline">Case studies</span>
                <svg aria-hidden="true" viewBox="0 0 5 3" fill="currentColor" shapeRendering="crispEdges" className={`h-1.5 w-2.5 transition-transform ${studiesOpen ? 'rotate-180' : ''}`}>
                  <rect x="0" y="0" width="5" height="1" />
                  <rect x="1" y="1" width="3" height="1" />
                  <rect x="2" y="2" width="1" height="1" />
                </svg>
              </button>
              {/* Phones: full width under the bar (positioned against the
                  fixed header). From `sm`: under the button. */}
              <div
                id="nav-case-studies"
                hidden={!studiesOpen}
                className="animate-pixel-drop absolute inset-x-4 top-full mt-1 drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] sm:inset-x-auto sm:left-0 sm:mt-3 sm:w-64"
              >
                <div className="pixel-corners bg-white/20 p-px">
                  <ul className="pixel-corners bg-statusbar p-1.5 font-sans text-sm font-semibold normal-case text-white">
                    {CASE_STUDIES.map((study) => {
                      const to = `/work/${study.slug}`
                      return (
                        <li key={study.slug}>
                          <Link to={to} aria-current={pathname === to ? 'page' : undefined} className={`block ${itemClass(pathname === to)}`}>
                            {study.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} aria-current={pathname === link.to ? 'page' : undefined} className={`block ${linkClass(pathname === link.to)}`}>
                  {link.label}
                </Link>
              </li>
            ))}
            {/* The "get to know me" game, as the bar's one highlighted item.
                Gamepad only below `sm`, so the bar still fits at 360px. */}
            <li className="ml-1 sm:ml-2">
              <Link
                to="/game"
                aria-current={pathname === '/game' ? 'page' : undefined}
                className="group pixel-corners flex items-center gap-2 whitespace-nowrap bg-hover-yellow px-2.5 py-2 uppercase tracking-wide text-ink transition-colors hover:bg-white active:translate-y-px sm:px-3"
              >
                <PixelGamepad className="animate-pixel-hop-on-hover h-[14px] w-[26px]" />
                <span className="sr-only sm:not-sr-only">Play a game</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div aria-hidden="true" className="pixel-dither text-statusbar/90" />
    </m.header>
  )
}
