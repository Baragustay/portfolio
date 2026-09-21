import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { workItems, type CaseStudyTile, type VideoTile } from '../data/workItems'
import { PixelArrow, PixelPlay } from './Doodles'
import GameControls from './GameControls'
import VideoLightbox from './VideoLightbox'
import { setMutedAttribute } from '../lib/video'

// Homepage bento grid — emulates danielamuntyan.com's project layout.
//
// Case studies are a matched *pair* of cells (image/video half + text half
// with title/description/category·year + a small "open" arrow), wrapped in
// one shared `PairCard` so rounding/ring/overflow-hidden live on the
// wrapper and the two halves read as one continuous card split in two,
// not two separate tiles that happen to sit next to each other.
//
// Motion-graphics pieces have no case study to pair with (just the film
// itself), so each gets its own single square tile: autoplay muted/looped,
// and on hover the film slides down within the tile to reveal a text panel
// underneath (title, role/year, short description) that was hidden behind
// it — click opens the full film with sound in a lightbox. The two video
// tiles sit together as their own row of two single squares (see the
// dedicated `videoItems`/`caseStudies` split below) so nothing about their
// mid-position in the source data list leaves half a row empty.
const TEXT_BG = ['bg-mist', 'bg-sky', 'bg-blush', 'bg-peach', 'bg-sage'] as const

// The dedicated full-page destination for the game (GamePage.tsx) —
// wraps the same embed with the site's own Navbar/Footer, unlike the
// bare static file GAME_URL points at directly.
const GAME_PAGE_URL = '/game'

// Pixel-art "open" arrow, rotated -45° to point up-right (external-link
// direction), in a slightly larger circle than a plain text glyph would
// need.
function OpenArrow() {
  return (
    // `group-hover` (not a local `hover:`) — lightens as soon as the
    // cursor is anywhere over the card, matching the translate effect
    // right beside it, instead of only once the cursor happens to land
    // on this small circle specifically. Both the plain `group` (this
    // sits inside `TextCell`, which has its own) and `group/card` (the
    // shared `PairCard` wrapper around both the image and text halves)
    // variants are covered, so hovering *either* half of the card lights
    // it up, not just the text half.
    <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/60 text-ink transition-all duration-300 group-hover:bg-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover/card:bg-white/80 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5">
      <PixelArrow className="h-4 w-4 -rotate-45" />
    </span>
  )
}

// Shared wrapper for a case study's image half + its text half — owns the
// rounding/ring/overflow-hidden that used to live on each half
// individually, which is what made paired cells look like two unrelated
// tiles instead of one card. Below 690px this stacks to one column too —
// image on top, text below — same as the outer grid.
//
// Named group (`group/card`) rather than a plain `group` so `ImageCell`'s
// hover animation below can trigger off *this* wrapper instead of only
// the image's own pixels — moving onto the text half starts the image
// animation too.
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
function PairCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="group/card grid grid-cols-1 overflow-hidden rounded-3xl ring-1 ring-ink/5 min-[690px]:grid-cols-2 min-[690px]:col-span-2">
      {children}
    </div>
  )
}

// Fixed `h-[545px]` rather than `aspect-square` — aspect-square tracked
// column width, which made tiles taller than intended on typical desktop
// widths. Same fixed height on `ImageCell`, `TextCell`, and `VideoSquare`
// below, so every bento tile stays the same height regardless of column
// width — only `GameCell` (its own full-width row) is sized by its own
// content instead.
//
// The thumbnail starts zoomed in and zooms back out to exactly fill the
// frame on hover, revealing more of the source image than the resting
// crop shows. The hover target is pinned at `scale-100` (exactly filling
// the container, since `object-cover` already covers it at scale 1) and
// never goes below that on purpose — an earlier version let hover go
// below 100 (`scale-95`), which shrank the image *smaller* than its
// rounded container and, since nothing behind it is opaque, exposed the
// page's own dark background at the corners. Fixed by raising the
// *resting* scale instead of lowering the hover floor (`scale-125`
// resting → `scale-100` hover, same visual zoom-out swing without ever
// uncovering the frame). Driven by `PairCard`'s `group/card` rather than
// its own local hover state, so moving onto the text half of the pair
// starts the animation too.
function ImageCell({
  src,
  alt,
  to,
  priority = false,
}: {
  src: string
  alt: string
  to: string
  priority?: boolean
}) {
  return (
    <Link to={to} className="relative block h-[545px] overflow-hidden">
      <img
        src={src}
        alt={alt}
        // The first case study tile is the largest above-the-fold image
        // on the homepage (i.e. the LCP candidate on wide viewports) —
        // lazy-loading it, like every other tile, delayed its own
        // discovery and hurt LCP. It loads eagerly and at high priority;
        // everything else stays lazy.
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        className="h-full w-full scale-125 object-cover transition-transform duration-[1100ms] ease-in-out group-hover/card:scale-100"
      />
      {/* Warm-brown tint over every thumbnail (not just the brightest
          ones) to reduce eye strain from bright screenshots against the
          dark page. Fades out on hover (image reads as more vivid),
          back in on mouse leave — driven by the same `group-hover/card`
          as the zoom above so both fade together. */}
      <div className="pointer-events-none absolute inset-0 bg-[#4a2e14]/20 transition-opacity duration-[1100ms] ease-in-out group-hover/card:opacity-0" />
    </Link>
  )
}

// Shows the study's goal and its concrete benefits rather than just a
// one-line tagline, so the card communicates what the project achieved,
// not only what it was. Flat `bg-textbox` on every one of these (not a
// rotating pastel set) — text is always the light variant since the
// background is always dark.
function TextCell({
  title,
  goal,
  benefits,
  meta,
  to,
}: {
  title: string
  goal: string
  benefits: string[]
  meta: string
  to: string
}) {
  return (
    <Link
      to={to}
      className="group relative flex h-[545px] flex-col justify-center bg-textbox p-6 text-left"
    >
      <OpenArrow />
      <div>
        <h3 className="font-display text-2xl leading-tight text-white">{title}</h3>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.15em] text-white/60">Goal</p>
        {/* No `line-clamp` — real goal/benefit copy (including
            SolidHomes' longer set, the longest of the bunch) needs to
            show in full, not truncate with a trailing "…". Text sizes
            kept small enough that it all still fits inside the tile's
            fixed 545px height. */}
        <p className="mt-1 text-lg text-white/80">{goal}</p>
        <ul className="mt-3 space-y-1">
          {benefits.slice(0, 3).map((benefit) => (
            <li key={benefit} className="flex gap-1.5 text-base text-white/70">
              <span className="text-white/40">·</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm font-medium text-white/50">{meta}</p>
      </div>
    </Link>
  )
}

function CaseStudyPair({ item, priority = false }: { item: CaseStudyTile; priority?: boolean }) {
  return (
    <PairCard>
      <ImageCell src={item.image} alt={item.title} to={`/work/${item.slug}`} priority={priority} />
      <TextCell
        title={item.title}
        goal={item.goal}
        benefits={item.benefits}
        meta={`${item.tags[0]} · ${item.year}`}
        to={`/work/${item.slug}`}
      />
    </PairCard>
  )
}

// A single square tile for a motion-graphics piece: the film autoplays
// muted/looped covering the whole tile; a text panel (title, role/year,
// short description) sits behind it, top-aligned rather than centered
// (unlike `TextCell`) — since only the *top* of the tile gets uncovered
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const tryPlay = () => {
    const el = videoRef.current
    if (!el) return
    // `setMutedAttribute` (see `lib/video.ts`) fixes the real root cause
    // (Safari's autoplay policy checks the HTML attribute, not just the
    // DOM property); `el.muted = true` is kept alongside it since some
    // engines do check the live property too.
    setMutedAttribute(el)
    el.muted = true
    el.play().catch(() => {})
  }
  // `onLoadedData`/`onCanPlay` retry the actual `play()` call once the
  // browser reports the video has real data to play, since an earlier
  // attempt at mount time (before enough data has loaded) can still
  // silently reject even with the attribute already present.
  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el
    setMutedAttribute(el)
  }
  // No mount-time `tryPlay` — these tiles sit further down the homepage,
  // so unconditionally starting playback immediately on every load,
  // whether or not the tile is ever scrolled to, was hurting mobile load
  // time. `onViewportEnter` (below) already fires once the tile is
  // actually visible, including on mount if it happens to start in view.
  // The `autoPlay` attribute IS still kept on the `<video>` below despite
  // that (a previous version removed it, relying only on this JS-driven
  // play() to control *when* it starts) — confirmed on a real desktop
  // browser that relying on JS/viewport-detection alone left the video
  // never actually playing at all in practice (no console error; it just
  // silently never started). `autoPlay` is the browser's own native,
  // reliable mechanism for a muted video and costs little extra given
  // `preload="metadata"` still limits how much it fetches up front;
  // `tryPlay()` stays as a harmless, redundant backup.

  return (
    <motion.button
      type="button"
      onClick={() => onPlay(item)}
      onMouseEnter={tryPlay}
      onViewportEnter={tryPlay}
      viewport={{ once: false, amount: 0.3 }}
      aria-label={`Play ${item.title} with sound`}
      className={`group relative h-[545px] overflow-hidden rounded-3xl text-left ring-1 ring-ink/5 ${bg}`}
    >
      <div className="absolute inset-0 z-0 flex flex-col justify-start p-6">
        {/* text-ink, not text-white — this tile's `bg` is still a light
            pastel (rotates through TEXT_BG), unlike TextCell's flat dark
            background. */}
        <h3 className="font-display text-2xl leading-tight text-ink">{item.title}</h3>
        <p className="mt-2 text-base sm:text-xl text-ink/70 line-clamp-3">{item.description}</p>
        <p className="mt-4 text-sm font-medium text-ink/40">{item.role}</p>
      </div>
      {/* Rounded corners on the video itself (not just the tile) — once
          it slides down on hover, its top edge separates from the
          tile's own rounded-3xl clip and would otherwise show a hard
          square corner. Drop shadow is warm brown, not black, to read
          as a layer sitting *above* the revealed text rather than a
          mask sliding away. */}
      <video
        ref={setVideoRef}
        className="absolute inset-0 z-10 h-full w-full rounded-2xl object-cover shadow-[0_12px_20px_-6px_rgba(74,46,20,0.5)] transition-transform duration-500 ease-in-out group-hover:translate-y-[35%]"
        src={item.videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={tryPlay}
        onCanPlay={tryPlay}
      />
      <span className="pointer-events-none absolute bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-ink shadow transition-transform duration-300 group-hover:scale-110">
        <PixelPlay className="h-3.5 w-3.5" />
        <span className="font-pixel text-xs uppercase tracking-widest">Play</span>
      </span>
    </motion.button>
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const tryPlay = () => {
    const el = videoRef.current
    if (!el) return
    setMutedAttribute(el)
    el.muted = true
    el.play().catch(() => {})
  }
  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el
    setMutedAttribute(el)
  }

  return (
    // The *whole* cell is now one click target (text half or video half,
    // doesn't matter) — a single outer `<a>`/`motion.a` rather than two
    // separate links (one on the text's "Click here to play", one
    // wrapping just the video), which meant clicking the headline or
    // controls area did nothing. `onMouseEnter`/`onViewportEnter` moved
    // here too so hovering either half starts the video preview, not
    // just hovering the video's own rectangle.
    <motion.a
      href={GAME_PAGE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Play the Catch a Fact game in a new window"
      onMouseEnter={tryPlay}
      onViewportEnter={tryPlay}
      viewport={{ once: false, amount: 0.3 }}
      className="group min-[690px]:col-span-2 flex flex-col items-center overflow-hidden rounded-3xl bg-game-dark xl:flex-row xl:items-center"
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
        <h2 className="font-pixel text-5xl uppercase leading-relaxed tracking-widest text-hover-pink">
          Game Time!
        </h2>
        {/* Same headline size as every other tile (`TextCell`,
            `VideoSquare`: `font-display text-2xl leading-tight`). */}
        <h3 className="font-display mt-4 text-2xl leading-tight text-white">
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
        <p className="mt-2 text-xs text-white/40">Opens in a new window</p>
      </div>
      {/* Vertical padding around the video (was flush top/bottom) —
          horizontal stays flush so the card's own rounded corners still
          clip its left/right edges cleanly. Plain `div` now, not its own
          `motion.a` — the outer element is the link for the whole cell. */}
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
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={tryPlay}
            onCanPlay={tryPlay}
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
    </motion.a>
  )
}

export default function BentoGrid() {
  const [playing, setPlaying] = useState<VideoTile | null>(null)
  const caseStudies = workItems.filter((item): item is CaseStudyTile => item.kind === 'case-study')
  const videoItems = workItems.filter((item): item is VideoTile => item.kind === 'video')
  // Used for the video tiles' own background (visible behind the video
  // during its hover-reveal) — case studies don't need this since every
  // `TextCell` uses the same flat `bg-textbox`.
  let textBgIndex = 0
  const nextBg = () => TEXT_BG[textBgIndex++ % TEXT_BG.length]

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 p-6 min-[690px]:grid-cols-2 md:gap-6 md:p-10">
      <CaseStudyPair item={caseStudies[0]} priority />
      <CaseStudyPair item={caseStudies[1]} />

      <GameCell />

      {caseStudies.slice(2).map((item) => (
        <CaseStudyPair key={item.id} item={item} />
      ))}

      {videoItems.map((item) => (
        <VideoSquare key={item.id} item={item} onPlay={setPlaying} bg={nextBg()} />
      ))}

      {playing && <VideoLightbox item={playing} onClose={() => setPlaying(null)} />}
    </div>
  )
}
