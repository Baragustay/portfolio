// The actual playable "Catch a Fact" iframe, used in the homepage bento
// grid (BentoGrid.tsx). Not 480×420: the game's own CSS is a full
// mobile-page layout (`min-height: 100vh`, `overflow: hidden`), so it
// needs real vertical room or it clips its own UI. 480×700 was measured
// (by loading the page directly at several heights) as the shortest
// that shows every element, intro screen and live gameplay both, with
// nothing cut off.
//
// No `width`/`height` HTML attributes — those fixed the iframe's real
// rendered size regardless of viewport, which is exactly what made it
// unplayable on narrow screens: the game's own page is itself media-query
// responsive, but a fixed-size iframe never reports a small viewport to
// it, so that responsiveness never kicks in — the container was the
// actual problem, not the game. `aspect-[480/700]` + `w-full max-w-[480px]`
// keeps the 480×700 shape at any width up to 480px, and lets it shrink
// (both dimensions, proportionally) below that on small screens, so the
// iframe's real rendered viewport gets smaller too and the game's own
// responsive layout actually engages.
//
// Downloaded into `public/game/` (HTML + its 7 audio files) and served
// locally, not hot-linked to barboragustafsson.com, since that domain's
// WordPress install is being retired. The HTML's own `<audio
// src="bg-music.mp3">`-style relative paths still resolve correctly
// since the mp3 files sit right alongside it in the same folder.
export const GAME_URL = '/game/catch-a-fact.html'

export default function GameEmbed({ className }: { className?: string }) {
  return (
    <iframe
      src={GAME_URL}
      title="Catch a Fact - a mini-game about me"
      className={className ?? 'mx-auto aspect-[480/700] w-full max-w-[480px] bg-white shadow-lg ring-1 ring-ink/10'}
    />
  )
}
