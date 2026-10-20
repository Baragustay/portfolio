import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import MobileHero from '../components/MobileHero'
import Sidebar from '../components/Sidebar'
import BentoGrid from '../components/BentoGrid'
import Footer from '../components/Footer'
import PixelReveal from '../components/PixelReveal'
import { usePageMeta } from '../lib/pageMeta'

const INTRO_SEEN_KEY = 'home-intro-seen'

// Homepage: a pinned left sidebar (name/role/location, About/Code nav)
// next to a scrolling bento grid of projects on the
// right. Background is `bg-page-bg` (near-black) — every other page
// keeps the lighter per-section pastel treatment; only the homepage
// went dark, with the bento tiles' own pastel colors sitting on top of
// it like cards.
//
// The page scrolls normally (the document, not an inner container); the
// sidebar stays pinned purely because it's `fixed`. An earlier version
// made the outer wrapper its own `overflow-y-auto` scroll container,
// which broke keyboard scrolling (PageDown/Space/arrows did nothing until
// the column was clicked), needed wheel events forwarded by hand from the
// sidebar, and let absolutely positioned descendants stretch the document
// past the container so the light body background showed underneath.
//
// `lg:pt-[100px]` clears the global `StatusBar` (36px, App.tsx) plus the
// full-width `Navbar` bar under it (64px with its pixel dither), which
// the homepage shows at every width like every other page; `Sidebar`'s
// own `lg:top-[100px]` matches it independently since it's `fixed`.
//
// The pinned two-column layout is `lg:`-only —
// a fixed 280px sidebar ate ~75% of a 375px phone screen. Below `lg`,
// `Sidebar` renders nothing (`hidden`) and this swaps in `MobileHero`, a
// horizontal (not stacked) rendition of the same name/role/contact
// content, both in normal document flow ahead of the grid.
export default function Home() {
  usePageMeta(null, '/')
  // The pixel-dissolve entrance plays on the first homepage visit of a
  // session only — after that it just hid already-cached content.
  const [skipIntro] = useState(() => {
    try {
      return sessionStorage.getItem(INTRO_SEEN_KEY) === '1'
    } catch {
      return false
    }
  })
  useEffect(() => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    } catch {
      // Storage blocked (private mode etc.) — the intro just plays again.
    }
  }, [])

  return (
    <div className="bg-page-bg lg:pt-[100px]">
      <Navbar />
      <div className="lg:hidden">
        <MobileHero />
      </div>
      <Sidebar />
      <main id="main" className="lg:ml-[280px] xl:ml-[320px]">
        {/* Entrance sequencing: sidebar fades/slides in first (see
            Sidebar.tsx, no delay, ~0.4s), then the bento grid dissolves
            in via the pixel-reveal effect starting at 0.7s, once the
            sidebar has settled. Once per session (`skipIntro`). The
            "Loading case studies..." label only lingers as long as `PixelReveal`'s own image-readiness check
            says something is still actually loading (see
            PixelReveal.tsx) — a fast load just flashes through it
            quickly rather than skipping the dissolve outright. */}
        <PixelReveal delay={0.7} label="Loading case studies..." skip={skipIntro}>
          <BentoGrid />
        </PixelReveal>
        {/* Same Email/GitHub/LinkedIn already in the sidebar/mobile hero
            and the global StatusBar, repeated in a footer at the bottom
            of every page. */}
        <Footer dark />
      </main>
    </div>
  )
}
