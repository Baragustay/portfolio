import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import GameEmbed from '../components/GameEmbed'
import PixelReveal from '../components/PixelReveal'
import { useBodyBackground, usePageMeta } from '../lib/pageMeta'

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
// restored on unmount) so no other color shows through any gap below
// the footer, regardless of how viewport units behave on a given device.
export default function GamePage() {
  usePageMeta('Catch a Fact, a mini-game', '/game')
  useBodyBackground(GAME_BG)
  const [gameReady, setGameReady] = useState(false)

  return (
    // Normal document scroll with a `fixed` sidebar — see Home.tsx.
    <div style={{ backgroundColor: GAME_BG }} className="lg:pt-[100px]">
      <Navbar />
      <Sidebar />
      {/* Footer lives inside `main` (sharing its `lg:ml-*` offset), not
          as a sibling after it — the fixed, full-height `Sidebar`
          (`lg:top-[100px] lg:bottom-0`) would otherwise cover a full-width
          footer's left 280/320px on desktop, same reasoning as
          Home.tsx's identical nesting. */}
      {/* No `pb-*` here — `Footer` (last child) already carries its own
          `py-10`; adding padding after it too just stacked redundant
          empty space below the footer for no reason. */}
      <main id="main" className="flex flex-col items-center px-6 pt-[164px] lg:ml-[280px] lg:items-stretch lg:pt-10 xl:ml-[320px]">
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
