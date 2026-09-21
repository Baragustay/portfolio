import { useEffect, useRef, useState } from 'react'

// The actual playable "Catch a Fact" iframe — GamePage.tsx's dedicated
// page (the only place this is used now; the homepage bento grid shows
// an autoplay preview video instead, see BentoGrid.tsx's GameCell).
//
// Downloaded into `public/game/` (HTML + its 7 audio files) and served
// locally, not hot-linked to barboragustafsson.com, since that domain's
// WordPress install is being retired. The HTML's own `<audio
// src="bg-music.mp3">`-style relative paths still resolve correctly
// since the mp3 files sit right alongside it in the same folder.
export const GAME_URL = '/game/catch-a-fact.html'

export default function GameEmbed({ onReady }: { onReady?: () => void }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState<number | null>(null)
  // A ref, not a dependency, so the measurement effect below (which
  // only needs to run once, on mount) doesn't have to re-run just
  // because a parent re-render passed a new inline `onReady` function
  // identity — this always calls whatever the latest one is.
  const onReadyRef = useRef(onReady)
  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  // This iframe is same-origin (served from this site, not hot-linked),
  // so instead of computing an estimated height, we read the real one:
  // `#wrap`'s `scrollHeight` from inside the iframe's own document.
  useEffect(() => {
    const iframeEl = iframeRef.current
    if (!iframeEl) return

    let resizeObserver: ResizeObserver | null = null
    let cancelled = false

    const measure = () => {
      const doc = iframeEl.contentDocument
      const wrap = doc?.getElementById('wrap')
      if (!doc || !wrap) return
      // `#wrap` has no `min-height` of its own (see catch-a-fact.html),
      // so `scrollHeight` already reflects its real, natural content
      // height without needing to be zeroed out first.
      const measured = wrap.scrollHeight
      if (measured > 0) {
        setHeight(measured)
        onReadyRef.current?.()
      }
    }

    const setup = () => {
      const doc = iframeEl.contentDocument
      const wrap = doc?.getElementById('wrap')
      if (cancelled || !doc || !wrap) return
      measure()
      // The pixel-art font swaps in after the initial layout — text
      // reflowing once it loads can change #wrap's real height, so
      // re-measure once it's actually ready rather than only at
      // first paint (using the fallback monospace's metrics).
      doc.fonts?.ready.then(() => {
        if (!cancelled) measure()
      })
      resizeObserver = new ResizeObserver(measure)
      resizeObserver.observe(wrap)
    }

    if (iframeEl.contentDocument?.readyState === 'complete') setup()
    iframeEl.addEventListener('load', setup)

    return () => {
      cancelled = true
      iframeEl.removeEventListener('load', setup)
      resizeObserver?.disconnect()
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      // Sized against this column's own available width (`w-full`,
      // capped by `max-w`), not a viewport-relative unit like `vw` —
      // the sidebar (280/320px) only appears at `lg`+ too, so a `vw`
      // value measured against the full window jumps discontinuously
      // at that exact breakpoint once the sidebar eats into the
      // column's real available space.
      className="mx-auto w-full max-w-[640px] lg:max-w-[680px]"
    >
      <iframe
        ref={iframeRef}
        src={GAME_URL}
        title="Catch a Fact - a mini-game about me"
        // No `width`/`height` HTML attributes — those fixed the iframe's
        // real rendered size regardless of viewport, which is exactly
        // what made it unplayable on narrow screens: the game's own
        // page is itself media-query responsive, but a fixed-size
        // iframe never reports a small viewport to it, so that
        // responsiveness never kicks in.
        style={height !== null ? { height } : undefined}
        // `bg-game-dark` matches the game's own `--bg-deep` background
        // exactly (see GamePage.tsx's `GAME_BG`) — no shadow/ring
        // border anymore either, so the iframe reads as part of the
        // page's own background instead of a bordered "card" sitting
        // on top of it.
        className="block w-full bg-game-dark"
      />
    </div>
  )
}
