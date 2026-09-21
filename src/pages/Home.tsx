import { useRef } from 'react'
import Navbar from '../components/Navbar'
import MobileHero from '../components/MobileHero'
import Sidebar from '../components/Sidebar'
import BentoGrid from '../components/BentoGrid'
import Footer from '../components/Footer'
import PixelReveal from '../components/PixelReveal'

// Homepage: a pinned left sidebar (name/role/location, About/Code nav)
// next to an independently-scrollable bento grid of projects on the
// right. Background is `bg-page-bg` (near-black) — every other page
// keeps the lighter per-section pastel treatment; only the homepage
// went dark, with the bento tiles' own pastel colors sitting on top of
// it like cards.
//
// The outer wrapper itself is the scroll container (not `main`) — the
// sidebar stays visually "pinned" purely because it's `fixed`
// (viewport-relative, immune to any ancestor's scroll).
//
// `scrollRef` + `Sidebar`'s `onWheel` prop manually forward wheel
// events to the scroll container. This isn't cosmetic: `position:
// fixed` elements don't participate in the browser's default wheel
// scroll-chaining to an ancestor at all, even when that ancestor is
// their actual DOM parent and is itself scrollable (confirmed by
// measuring the container's real `scrollTop` before/after a wheel
// event dispatched at sidebar coordinates — wheeling over the sidebar
// was otherwise a complete no-op). No CSS property fixes this.
//
// `lg:mt-9` shifts the whole pinned layout down by the global
// `StatusBar`'s 36px height (rendered above every route in App.tsx),
// and the height calc subtracts that same 36px so the bottom edge
// still lands exactly at the viewport bottom — `Sidebar`'s own
// `lg:top-9 lg:bottom-0` matches this independently since it's `fixed`.
//
// `overscroll-y-contain`: without it, bouncing past the top/bottom of
// this scroll container (trackpad/touch overscroll) revealed the light
// `body` background behind it — a white flash on an otherwise all-dark
// homepage. `overscroll-behavior-y: none` on `html`/`body` (index.css)
// stops the page itself from bouncing too, belt-and-suspenders.
//
// The pinned/independently-scrolling two-column layout is `lg:`-only —
// a fixed 280px sidebar ate ~75% of a 375px phone screen. Below `lg`,
// `Sidebar` renders nothing (`hidden`) and this swaps in the same
// sticky `Navbar` used on every other page plus `MobileHero`, a
// horizontal (not stacked) rendition of the same name/role/contact
// content, both in normal document flow ahead of the grid.
export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollRef}
      className="bg-page-bg lg:mt-9 lg:h-[calc(100vh-2.25rem)] lg:overflow-y-auto lg:overscroll-y-contain"
    >
      <div className="lg:hidden">
        <Navbar />
        <MobileHero />
      </div>
      <Sidebar
        onWheel={(e) => {
          if (scrollRef.current) scrollRef.current.scrollTop += e.deltaY
        }}
        scrollContainerRef={scrollRef}
      />
      <main className="lg:ml-[280px] xl:ml-[320px]">
        {/* Entrance sequencing: sidebar fades/slides in first (see
            Sidebar.tsx, no delay, ~0.4s), then the bento grid dissolves
            in via the pixel-reveal effect starting at 0.7s, once the
            sidebar has settled. Plays on every visit, not gated to
            once per session. The "Loading case studies..." label only
            lingers as long as `PixelReveal`'s own image-readiness check
            says something is still actually loading (see
            PixelReveal.tsx) — a fast load just flashes through it
            quickly rather than skipping the dissolve outright. */}
        <PixelReveal delay={0.7} label="Loading case studies...">
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
