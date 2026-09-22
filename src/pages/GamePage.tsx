import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import GameEmbed from '../components/GameEmbed'
import PixelReveal from '../components/PixelReveal'
import { PixelArrow } from '../components/Doodles'

const GAME_BG = '#241c3d'

// Dedicated full-page destination for "Play game in a new window"
// (BentoGrid.tsx's GameCell) — the embedded homepage tile can't be
// played on mobile at all (see that link's own comment).
//
// Layout: on `lg`+, the same pinned-sidebar-plus-scrolling-column
// structure as Home.tsx. Below `lg`, plain `Navbar` + centered content
// + footer, normal document flow.
//
// No headline/eyebrow text (the game's own intro screen covers that)
// and no `GridHoverBackground` — this page uses the game's own
// background color (`GAME_BG`, matching `--bg-deep` in
// catch-a-fact.html) instead of the site's usual `bg-page-bg`, so
// there's no visible seam with the iframe. `Sidebar` keeps its own
// `bg-page-bg` regardless, an intentional two-tone split.
//
// `document.body`'s background is set to `GAME_BG` while mounted (and
// restored on unmount) so there's no off-white `<body>` background
// visible through any gap below the footer on mobile, regardless of
// how viewport units behave on a given device.
export default function GamePage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [gameReady, setGameReady] = useState(false)

  useEffect(() => {
    const previous = document.body.style.backgroundColor
    document.body.style.backgroundColor = GAME_BG
    return () => {
      document.body.style.backgroundColor = previous
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      style={{ backgroundColor: GAME_BG }}
      className="lg:mt-9 lg:h-[calc(100vh-2.25rem)] lg:overflow-y-auto lg:overscroll-y-contain"
    >
      <div className="lg:hidden">
        <Navbar />
      </div>
      <Sidebar
        onWheel={(e) => {
          if (scrollRef.current) scrollRef.current.scrollTop += e.deltaY
        }}
      />
      {/* Footer lives inside `main` (sharing its `lg:ml-*` offset), not
          as a sibling after it — the fixed, full-height `Sidebar`
          (`lg:top-9 lg:bottom-0`) would otherwise cover a full-width
          footer's left 280/320px on desktop, same reasoning as
          Home.tsx's identical nesting. */}
      {/* No `pb-*` here — `Footer` (last child) already carries its own
          `py-10`; adding padding after it too just stacked redundant
          empty space below the footer for no reason. */}
      <main className="flex flex-col items-center px-6 pt-[164px] lg:ml-[280px] lg:items-stretch lg:pt-8 xl:ml-[320px]">
        {/* `lg:`-only — below that, `Navbar` (above) already renders its
            own fixed back-arrow in the top-left corner; this would just
            be a second, redundant one competing for the same spot. At
            `lg`+, `Navbar` is hidden entirely (`Sidebar` takes over), so
            without this there'd be no way back to home at all from the
            main content column. In flow at the top of the game area
            itself, not fixed to the viewport corner like Navbar's own —
            this page has no floating nav pill to visually match.
            `lg:pt-8` on `main` (above) roughly lines this up with
            "Barbora Gustafsson" in the sidebar next to it — both start
            from the same `lg:mt-9`/`lg:top-9` origin, so matching top
            padding keeps them visually level. */}
        <Link
          to="/"
          aria-label="Back to home"
          className="mb-6 hidden h-11 w-11 items-center justify-center self-start rounded-full border border-white/70 bg-white/85 text-ink shadow-lg transition-transform hover:-translate-x-0.5 hover:bg-white lg:flex"
        >
          <PixelArrow className="h-4 w-4 rotate-180" />
        </Link>
        {/* `w-full` wrapper: below `lg`, `main` uses `items-center`
            (shrink-to-fit sizing for flex children), and `PixelReveal`'s
            own wrapper has no width of its own — without this, nothing
            in that chain has a definite width, so the iframe (a
            replaced element) falls back to the browser's ~300px
            default intrinsic size instead of `GameEmbed`'s own sizing
            applying.
            `ready={gameReady}`: `GameEmbed` measures its real content
            height asynchronously (after the iframe loads), starting
            from the browser's tiny default size. `PixelReveal` sizes
            its cover canvas once, from `children`'s size when its own
            effect runs — withholding `ready` until `GameEmbed`'s first
            real measurement keeps that from locking in the wrong
            (tiny, pre-load) size. */}
        <div className="w-full">
          <PixelReveal delay={0.2} ready={gameReady} bgColor={GAME_BG}>
            <GameEmbed onReady={() => setGameReady(true)} />
          </PixelReveal>
        </div>
        <Footer dark />
      </main>
    </div>
  )
}
