import { Fragment, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { workItems, type AppTile, type CaseStudyTile as CaseStudyItem, type VideoTile } from '../data/workItems'
import { PixelArrow, PixelPlay } from './Doodles'
import GameControls from './GameControls'
import VideoLightbox from './VideoLightbox'
import { posterFor, useInViewVideo } from '../lib/video'
import { impactBySlug, type Impact } from '../data/impact'

// Homepage bento grid — emulates danielamuntyan.com's project layout.
//
// Case studies and apps are image tiles (`ImageTile`): the project image
// with its title and goal underneath, and the impact on hover. The featured
// studies span both columns.
//
// Motion-graphics pieces have no case study to pair with (just the film
// itself), so each gets its own single square tile: autoplay muted/looped,
// and on hover the film slides down within the tile to reveal a text panel
// underneath (title and short description) that was hidden behind
// it — click opens the full film with sound in a lightbox. The two video
// tiles sit together as their own row of two single squares (see the
// dedicated `videoItems`/`caseStudies` split below) so nothing about their
// mid-position in the source data list leaves half a row empty.
const TEXT_BG = ['bg-mist', 'bg-sky', 'bg-blush', 'bg-peach', 'bg-sage'] as const

// The dedicated full-page destination for the game (GamePage.tsx) —
// wraps the same embed with the site's own Navbar/Footer, unlike the
// bare static file GAME_URL points at directly.
const GAME_PAGE_URL = '/game'

// Every `-thumb.webp` has an 800px-wide `-thumb-800.webp` sibling (made
// with `cwebp -resize 800 0`), so phones and 1x desktop screens don't
// download the full 1200–2000px original. Keep index.html's LCP preload
// (`imagesrcset`/`imagesizes`) in sync with these.
function thumbSrcSet(src: string) {
  return `${src.replace(/\.webp$/, '-800.webp')} 800w, ${src} 1500w`
}
const SQUARE_THUMB_SIZES = '(min-width: 690px) 660px, 90vw'

// Pixel-art "open" arrow, rotated -45° to point up-right (external-link
// direction), in a slightly larger circle than a plain text glyph would
// need.
function OpenArrow() {
  return (
    // `group-hover` (not a local `hover:`) — lightens as soon as the
    // cursor is anywhere over the card, matching the translate effect
    // right beside it, instead of only once the cursor happens to land
    // on this small circle specifically. Both the plain `group` (the
    // game tile) and `group/card` (`ImageTile`) variants are covered.
    <span className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/60 text-ink transition-all duration-300 group-hover:bg-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover/card:bg-white/80 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5">
      <PixelArrow className="h-4 w-4 -rotate-45" />
    </span>
  )
}

function ImpactDescription({ impact, id }: { impact: Impact; id: string }) {
  return (
    <span id={id} className="sr-only">
      {impact.label}: {impact.highlight} {impact.summary}
    </span>
  )
}

// Two layouts:
//
// - `wide` tiles (the two key studies) span both columns from 690px: the
//   image on the left half, and a dark panel on the right with the
//   headline, impact and meta, always visible. Below 690px the panel
//   stacks under the image, so phones (which never hover) see it too.
// - Square tiles are the image with a short caption under it (title and
//   goal): no text over the image at rest, so screenshots with words in
//   them don't compete with the caption. On hover, or while keyboard focus
//   is on it, the same dark panel rises over the image.
//
// Every image zooms in slightly on hover (`scale-105`, clipped by the
// frame), the same for thumbnails and device mockups.
//
// `col-span-2` is scoped to `min-[690px]:`, not applied unconditionally.
// Real bug otherwise: a bare `col-span-2` on an item inside a
// `grid-cols-1` container still forces the browser to create an implicit
// second grid column (to satisfy the span), even though only 1 column is
// ever meant to exist below 690px. That phantom near-0px-wide column then
// hijacked the outer grid's auto-placement — the second video tile (a
// plain, unspanned item) got auto-flowed into it instead of wrapping to
// its own row, rendering at `width: 0` (confirmed by reading
// `getComputedStyle(grid).gridTemplateColumns`, which showed `343px 0px`).
// Same fix applied to `GameCell` below, the only other `col-span-2` user.
//
// `min-h-[340px]` rather than `aspect-square` — aspect-square tracked
// column width, which made tiles taller than intended on typical desktop
// widths. A minimum, not a fixed height: with enlarged text (browser zoom
// / 200% text size) the tile grows instead of clipping its panel.
function ImageTile({
  title,
  kind,
  goal,
  meta,
  image,
  to,
  href,
  wide = false,
  imageOrigin = '',
  impact,
  priority = false,
  mockupBackground,
}: {
  title: string
  kind: string
  goal: string
  meta: string
  image: string
  to?: string
  href?: string
  wide?: boolean
  // Per-image zoom origin, for thumbnails whose subject sits off-centre.
  imageOrigin?: string
  impact?: Impact
  priority?: boolean
  // Set when `image` is a transparent device mockup: shown whole on this
  // background instead of cropped to fill.
  mockupBackground?: string
}) {
  // Link is named by just its title + kind ("Piggy Bank, Case study")
  // and described by its goal and impact, instead of its entire text
  // content — keeps screen readers' link lists short and scannable.
  const id = useId()
  const a11y = {
    'aria-labelledby': `${id}-title ${id}-kind${href ? ` ${id}-newtab` : ''}`,
    'aria-describedby': [wide ? '' : `${id}-goal`, impact ? `${id}-impact` : ''].filter(Boolean).join(' ') || undefined,
  }
  const className = `group/card flex flex-col rounded-3xl text-left ${wide ? 'min-[690px]:col-span-2' : ''}`

  const picture = (
    <img
        src={image}
        srcSet={mockupBackground ? undefined : thumbSrcSet(image)}
        sizes={mockupBackground ? undefined : wide ? '(min-width: 690px) 560px, 90vw' : SQUARE_THUMB_SIZES}
        // Empty alt: the title is already this link's name.
        alt=""
        // The first tile is the largest above-the-fold image on the
        // homepage (the LCP candidate), so it loads eagerly and at high
        // priority; everything else stays lazy.
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        className={`absolute inset-0 h-full w-full transition-transform duration-[1100ms] ease-in-out group-hover/card:scale-105 ${
          mockupBackground ? 'object-contain p-6 sm:p-8' : `object-cover ${imageOrigin}`
        }`}
    />
  )
  const background = mockupBackground ? { background: mockupBackground } : undefined

  // Wide tiles' panel holds the tile's heading; square tiles' heading is
  // the caption under the image, so their panel repeats the title as text.
  const Headline = wide ? 'h3' : 'p'
  const panel = (
    <>
      <Headline className="font-display pr-14 text-2xl leading-tight text-white">
        <span id={`${id}-kind`}>{kind}</span>: {wide ? <span id={`${id}-title`}>{title}</span> : title}
      </Headline>
      {impact && (
        <p className="mt-4 text-base leading-snug text-white/80 sm:text-lg">
          <span className="font-display mb-2 block text-3xl leading-none text-hover-yellow">{impact.highlight}</span>
          {impact.summary}
        </p>
      )}
      <p className="mt-4 text-sm font-medium text-white/60">{meta}</p>
    </>
  )

  const content = wide ? (
    <div className="relative overflow-hidden rounded-3xl bg-[#1c1a17] ring-1 ring-white/15 min-[690px]:grid min-[690px]:min-h-[340px] min-[690px]:grid-cols-2">
      <div className="relative h-[280px] overflow-hidden bg-textbox min-[690px]:h-auto" style={background}>
        {picture}
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8">{panel}</div>
      <OpenArrow />
    </div>
  ) : (
    <>
      <div className="relative min-h-[340px] overflow-hidden rounded-3xl bg-textbox ring-1 ring-white/15" style={background}>
        {picture}
        <div
          className="absolute inset-0 z-10 flex translate-y-6 flex-col justify-end bg-[#1c1a17]/92 p-6 opacity-0 backdrop-blur-sm transition-all duration-500 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-visible/card:translate-y-0 group-focus-visible/card:opacity-100 sm:p-8 [@media(hover:none)]:hidden"
        >
          {panel}
        </div>
        <OpenArrow />
      </div>
      <div className="px-1 pt-4">
        <h3 id={`${id}-title`} className="font-display text-2xl leading-tight text-white">{title}</h3>
        <p id={`${id}-goal`} className="mt-1 max-w-xl text-base leading-snug text-white/60">{goal}</p>
      </div>
    </>
  )

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...a11y} className={className}>
      {content}
      {impact && <ImpactDescription impact={impact} id={`${id}-impact`} />}
      <span id={`${id}-newtab`} className="sr-only">
        (opens in a new tab)
      </span>
    </a>
  ) : (
    <Link to={to ?? '/'} {...a11y} className={className}>
      {content}
      {impact && <ImpactDescription impact={impact} id={`${id}-impact`} />}
    </Link>
  )
}

function CaseStudyTile({ item, wide = false, priority = false }: { item: CaseStudyItem; wide?: boolean; priority?: boolean }) {
  return (
    <ImageTile
      title={item.title}
      kind="Case study"
      goal={item.goal}
      meta={`${item.tags[0]} · ${item.year}`}
      image={item.image}
      to={`/work/${item.slug}`}
      wide={wide}
      impact={impactBySlug[item.slug]}
      mockupBackground={item.mockupBackground}
      priority={priority}
    />
  )
}

// A single square tile for a motion-graphics piece: the film autoplays
// muted/looped covering the whole tile; a text panel (title and short
// description) sits behind it, top-aligned rather than centered
// — since only the *top* of the tile gets uncovered
// on hover, centered text would stay half-hidden behind the video no
// matter how far it slides. On hover the film slides down ~35% of its
// own height, then a real click opens the full film with sound in the
// lightbox.
function VideoSquare({
  item,
  onPlay,
  bg,
}: {
  item: VideoTile
  onPlay: (item: VideoTile) => void
  bg: (typeof TEXT_BG)[number]
}) {
  // Plays only while on screen and never downloads up front — see
  // `useInViewVideo`. Hover/focus still start it under reduced motion.
  const { targetRef, setVideoRef, play } = useInViewVideo<HTMLButtonElement>()

  return (
    <button
      ref={targetRef}
      type="button"
      onClick={() => onPlay(item)}
      onMouseEnter={play}
      onFocus={play}
      className="group flex flex-col rounded-3xl text-left"
    >
      <div className={`relative h-[340px] w-full overflow-hidden rounded-3xl ring-1 ring-white/15 ${bg}`}>
      <div className="absolute inset-0 z-0 flex flex-col justify-start p-6">
        {/* text-ink, not text-white — this tile's `bg` is still a light
            pastel (rotates through TEXT_BG), unlike the image tiles' dark
            panel. The title is in the caption below. */}
        <p className="text-base text-ink/75 line-clamp-3 sm:text-lg">{item.description}</p>
      </div>
      {/* Rounded corners on the video itself (not just the tile) — once
          it slides down on hover, its top edge separates from the
          tile's own rounded-3xl clip and would otherwise show a hard
          square corner. Drop shadow is warm brown, not black, to read
          as a layer sitting *above* the revealed text rather than a
          mask sliding away. */}
      <video
        ref={setVideoRef}
        aria-hidden="true"
        className="absolute inset-0 z-10 h-full w-full rounded-2xl object-cover shadow-[0_12px_20px_-6px_rgba(74,46,20,0.5)] transition-transform duration-500 ease-in-out group-hover:translate-y-[35%]"
        src={item.videoSrc}
        poster={posterFor(item.videoSrc)}
        muted
        loop
        playsInline
        preload="none"
      />
      <span className="pointer-events-none absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-ink shadow transition-transform duration-300 group-hover:scale-110">
        <PixelPlay className="h-3.5 w-3.5" />
        <span className="font-pixel text-xs uppercase tracking-widest">Play</span>
        <span className="sr-only"> with sound</span>
      </span>
      </div>
      <h3 className="font-display px-1 pt-4 text-2xl leading-tight text-white">{item.title}</h3>
    </button>
  )
}

// The game's own full-width bento cell: an autoplay preview clip on one
// side, an intro card on the other. The game itself is never played
// inline here at any screen size (an embedded iframe was unplayable on
// mobile — tiny touch targets, cramped canvas — and inconsistent even
// on desktop); this is a showcase for browsers who won't bother
// playing, with a single click-through path to the real, full-size game
// on its own page for anyone who wants to actually play.
function GameCell() {
  const id = useId()
  const { targetRef, setVideoRef, play } = useInViewVideo<HTMLAnchorElement>()

  return (
    // The *whole* cell is now one click target (text half or video half,
    // doesn't matter) — a single outer `<a>` rather than two separate
    // links (one on the text's "Click here to play", one wrapping just
    // the video), which meant clicking the headline or controls area did
    // nothing. The in-view/hover preview triggers live here too, so
    // hovering either half starts the video, not just its own rectangle.
    //
    // Named by its visible headline (plus the new-window note), not a
    // separate `aria-label` — voice-control users say what they see
    // ("click Game Time"), which only works if the name contains it.
    <a
      ref={targetRef}
      href={GAME_PAGE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-labelledby={`${id}-eyebrow ${id}-title ${id}-newtab`}
      onMouseEnter={play}
      onFocus={play}
      className="group min-[690px]:col-span-2 flex flex-col items-center overflow-hidden rounded-3xl bg-game-dark ring-1 ring-white/15 xl:flex-row xl:items-center"
    >
      {/* Centered at every breakpoint now, not just below `xl` — this
          used to switch to left-aligned once the row layout kicked in,
          but there's no longer a "primary action beside the media"
          reason to differentiate; it reads better centered regardless
          of how the tile is laid out. No tint here (unlike the video
          side) — a flat brown wash over plain text didn't read as
          anything, it just dimmed the copy for no benefit; the tint
          stays scoped to the video, where it's actually functioning as
          a "dim the footage" effect. */}
      <div className="order-1 flex-1 p-8 text-center">
        <p id={`${id}-eyebrow`} className="font-pixel text-4xl uppercase leading-relaxed tracking-widest text-hover-pink sm:text-5xl">
          Game Time!
        </p>
        {/* Same headline size as every other tile (`ImageTile`,
            `VideoSquare`: `font-display text-2xl leading-tight`). */}
        <h3 id={`${id}-title`} className="font-display mt-4 text-2xl leading-tight text-white transition-colors duration-300 group-hover:text-hover-yellow">
          Get to know me with a little game I built
        </h3>
        {/* Keyboard-only info (arrows/space) — useless below `xl` where
            the tile is stacked for touch screens with no physical
            keyboard, same "no keyboard here" assumption already made
            for the circle badge above. */}
        <div className="mt-5 hidden justify-center xl:flex">
          <GameControls />
        </div>
        {/* Plain text now, not its own nested `<a>` — the whole cell is
            the link now, and a real `<a>` can't validly nest inside
            another one anyway. Still labeled (not a bare icon/arrow)
            since this is the one place that actually says what clicking
            does. */}
        <div className="mt-6 inline-flex items-center justify-center gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-hover-pink">Click here to play</p>
          <PixelArrow className="animate-pixel-blink h-6 w-6 shrink-0 rotate-90 text-hover-pink xl:rotate-0" />
        </div>
        {/* Quiet, not a competing second call to action — the arrow
            circle on the video below is already the click target; this
            just clarifies what clicking it does. */}
        <p id={`${id}-newtab`} className="mt-2 text-xs text-white/55">Opens in a new window</p>
      </div>
      {/* Vertical padding around the video (was flush top/bottom) —
          horizontal stays flush so the card's own rounded corners still
          clip its left/right edges cleanly. Plain `div` — the outer element
          is the link for the whole cell. */}
      <div className="relative order-2 w-full max-w-[480px] shrink-0 py-6 xl:w-[480px] xl:max-w-none">
        {/* Same warm-brown tint (and hover-fade) as every other bento
            tile's image — covers the *whole* video column (its own
            top/bottom padding included), not just the video's own
            rectangle, so it reads as one tinted surface. `z-10`: above
            the video (`z-0`) so it actually dims it, below the play
            button (`z-20`) so that stays crisp/untinted. */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[#4a2e14]/20 transition-opacity duration-[1100ms] ease-in-out group-hover:opacity-0" />
        <div className="relative mx-auto w-full max-w-[480px]">
          <video
            ref={setVideoRef}
            aria-hidden="true"
            className="relative z-0 block aspect-[480/524] w-full rounded-2xl object-cover"
            src="/game/gameplay-demo.mp4"
            // Confirmed on real Safari: autoplay doesn't start there
            // (works fine in Chrome/Firefox/Opera), and — unlike a
            // simple loading-speed issue — a hover-triggered `.play()`
            // call doesn't work there either. That's Safari's own (or
            // the visitor's own Safari settings, e.g. "Never Auto-
            // Play"/Low Power Mode) autoplay policy actively refusing
            // it, which no amount of client-side JS can force open —
            // there's no code fix for that side of it. `poster` is the
            // honest fallback: a real gameplay frame shows instead of a
            // blank rectangle wherever autoplay doesn't happen, while it
            // still doesn't get in the way of actual video playback
            // wherever it does.
            poster="/game/gameplay-poster.jpg"
            muted
            loop
            playsInline
            preload="none"
          />
          {/* Centered "play button" over the video, like a classic video
              thumbnail's play overlay — not a corner badge anymore.
              Labeled "Play game" (not a bare icon) because on browsers
              where the preview doesn't autoplay (confirmed on Safari,
              whose autoplay policy this site can't override — see the
              `poster` note above), all a visitor sees is a static poster
              frame plus this button; an unlabeled play icon there reads
              as "expand the preview", not "leave this page", and landing
              on a full game page instead would be a jarring surprise.
              `z-20` — above the tint, so it stays crisp/untinted. */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <span className="font-pixel flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full bg-white/85 text-ink shadow-lg transition-transform duration-300 group-hover:scale-105">
              <PixelArrow className="h-4 w-4 -rotate-45" />
              <span className="text-[10px] uppercase leading-tight tracking-wide">
                Play
                <br />
                game
              </span>
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}

// Most important first.
const FEATURED = ['midoma', 'piggy-bank']

export default function BentoGrid() {
  const [playing, setPlaying] = useState<VideoTile | null>(null)
  const caseStudies = workItems.filter((item): item is CaseStudyItem => item.kind === 'case-study')
  const videoItems = workItems.filter((item): item is VideoTile => item.kind === 'video')
  const apps = workItems.filter((item): item is AppTile => item.kind === 'app')
  const bySlug = (slug: string) => caseStudies.find((item) => item.slug === slug)!
  // Used for the video tiles' own background (visible behind the video
  // during its hover-reveal) — image tiles don't need this.
  let textBgIndex = 0
  const nextBg = () => TEXT_BG[textBgIndex++ % TEXT_BG.length]

  const squareStudies = caseStudies.filter((item) => !FEATURED.includes(item.slug) && item.slug !== 'promptkee')

  // One full-width band per row, alternating between the page colour and
  // a slightly lighter one, so each project (or pair) sits on its own
  // ground. The two key studies lead as full-width tiles; everything else
  // follows as squares, two to a row, with the game in between.
  const rows = [
    ...FEATURED.map((slug, i) => <CaseStudyTile key={slug} item={bySlug(slug)} wide priority={i === 0} />),
    <Fragment key="promptkee-apps">
      <CaseStudyTile item={bySlug('promptkee')} />
      {apps.map((item) => (
        <ImageTile
          key={item.id}
          title={item.title}
          kind={item.label}
          goal={item.goal}
          meta={`${item.tags[0]} · ${item.year}`}
          image={item.image}
          href={item.url}
          // Squinty sits at the far left of the OG image — keep him in
          // frame at the resting zoom.
          imageOrigin="origin-[25%_50%]"
        />
      ))}
    </Fragment>,
    <GameCell key="game" />,
    <Fragment key="studies">
      {squareStudies.map((item) => (
        <CaseStudyTile key={item.id} item={item} />
      ))}
    </Fragment>,
    <Fragment key="videos">
      {videoItems.map((item) => (
        <VideoSquare key={item.id} item={item} onPlay={setPlaying} bg={nextBg()} />
      ))}
    </Fragment>,
  ]

  return (
    <div>
      {/* Screen-reader-only section heading so the tile titles (h3) sit
          under an h2 instead of jumping straight from the page's h1. */}
      <h2 className="sr-only">Projects</h2>
      {rows.map((row, i) => (
        <div key={i} className={i % 2 ? 'bg-band' : ''}>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-8 gap-y-14 px-6 py-10 min-[690px]:grid-cols-2 md:gap-x-10 md:px-10 md:py-14">
            {row}
          </div>
        </div>
      ))}
      {playing && <VideoLightbox item={playing} onClose={() => setPlaying(null)} />}
    </div>
  )
}
