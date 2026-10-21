import { useEffect, useRef, useState } from 'react'
import { m } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { workItems, type CaseStudyTile } from '../data/workItems'
import ContactStatus from './ContactStatus'

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

function HouseIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h5v-6h4v6h5V9.5" />
    </svg>
  )
}

function GamepadIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 8h12a4 4 0 0 1 4 4v1a4 4 0 0 1-7 2.6L14 15h-4l-1 .6A4 4 0 0 1 2 13v-1a4 4 0 0 1 4-4Z" />
      <path d="M7 11v3M5.5 12.5h3" />
      <circle cx="16" cy="11.5" r=".5" fill="currentColor" />
      <circle cx="18" cy="13" r=".5" fill="currentColor" />
    </svg>
  )
}

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
    `rounded-full px-3 py-2 transition-colors hover:bg-white/10 sm:px-4 ${current ? 'bg-white/15' : ''}`
  const linkClass = (current: boolean) => `whitespace-nowrap ${itemClass(current)} active:translate-y-px`

  return (
    // One dark full-width bar at the top of every page, with the contact
    // links and status dot built in. From `lg` it's a single 64px row
    // (`lg:top-16`/`lg:pt-16` offsets elsewhere line up with it); below
    // `lg` the contacts get their own slim row on top, for 100px in all
    // (the `100px` offsets). "Home" on the left doubles as the
    // back-to-home link on every other page, so there's no separate back
    // button any more.
    <m.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 bg-statusbar text-white shadow-[0_6px_16px_rgba(0,0,0,0.35)]"
    >
      <div className="flex h-9 items-center border-b border-white/10 px-4 sm:px-8 lg:hidden">
        <ContactStatus />
      </div>
      <nav aria-label="Main">
        <div className="flex h-16 items-center justify-between gap-1 px-2 text-sm font-semibold sm:gap-4 sm:px-8 sm:text-[15px]">
          <div className="flex items-center gap-4">
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
            <HouseIcon className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            {/* Icon only below `sm`, so four items fit on a phone. */}
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
          <div className="hidden border-l border-white/15 pl-4 lg:block">
            <ContactStatus />
          </div>
          </div>
          <ul className="flex items-center gap-0.5 sm:gap-3">
            <li ref={studiesRef} className="sm:relative">
              <button
                type="button"
                aria-expanded={studiesOpen}
                aria-controls="nav-case-studies"
                onClick={() => setStudiesOpen(!studiesOpen)}
                className={`flex items-center gap-1 sm:gap-1.5 ${linkClass(pathname.startsWith('/work/'))}`}
              >
                {/* "Work" below `sm`, so the game button fits too at 360px. */}
                <span className="sm:hidden">Work</span>
                <span className="hidden sm:inline">Case studies</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 transition-transform ${studiesOpen ? 'rotate-180' : ''}`}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {/* Phones: full width under the bar (positioned against the
                  fixed header). From `sm`: under the button. */}
              <div
                id="nav-case-studies"
                hidden={!studiesOpen}
                className="absolute inset-x-4 top-full mt-2 sm:inset-x-auto sm:left-0 sm:w-64"
              >
                <ul className="rounded-2xl bg-white p-1.5 text-sm font-semibold text-ink shadow-[0_12px_32px_rgba(0,0,0,0.25)] ring-1 ring-ink/10">
                    {CASE_STUDIES.map((study) => {
                      const to = `/work/${study.slug}`
                      return (
                        <li key={study.slug}>
                          <Link to={to} aria-current={pathname === to ? 'page' : undefined} className={`block rounded-xl px-3 py-2.5 transition-colors hover:bg-ink/5 ${pathname === to ? 'bg-ink/10' : ''}`}>
                            {study.title}
                          </Link>
                        </li>
                      )
                    })}
                </ul>
              </div>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} aria-current={pathname === link.to ? 'page' : undefined} className={`block ${linkClass(pathname === link.to)}`}>
                  {link.label}
                </Link>
              </li>
            ))}
            {/* The "get to know me" game, outlined rather than filled: the
                filled yellow button is reserved for "Get in touch", the
                one main call to action (GetInTouch.tsx).
                Gamepad only below `sm`, so the bar still fits at 360px. */}
            <li className="ml-1 sm:ml-2">
              <Link
                to="/game"
                aria-current={pathname === '/game' ? 'page' : undefined}
                className="group flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-hover-yellow ring-1 ring-inset ring-hover-yellow/60 transition-colors hover:bg-hover-yellow/10 active:translate-y-px sm:px-4"
              >
                <GamepadIcon className="h-5 w-5 transition-transform group-hover:-rotate-6" />
                <span className="sr-only sm:not-sr-only">Play a game</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </m.header>
  )
}
