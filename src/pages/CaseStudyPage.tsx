import { useEffect, useRef, useState } from 'react'
import { m, type Variants } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import ImageRow from '../components/ImageRow'
import Carousel from '../components/Carousel'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PixelWaveDivider from '../components/PixelWaveDivider'
import { getCaseStudy, type CaseStudy, type Option, type ParagraphBlock, type Persona, type Section } from '../data/caseStudyContent'
import { posterFor, useInViewVideo } from '../lib/video'
import { impactBySlug, type Impact } from '../data/impact'
import { useBodyBackground, useNoIndex, usePageMeta } from '../lib/pageMeta'
import { MIDOMA_BG } from '../data/workItems'

// Media break out of the text column on large
// screens, centred on it, to near the full window width.
const WIDE = 'lg:relative lg:left-1/2 lg:w-[min(1600px,calc(100vw-6rem))] lg:-translate-x-1/2'
// Breaks out of the ~700px text column to a medium width, for blocks that
// need more room than a line of text but shouldn't go full width: the
// impact card, the carousel and the options grid.
const MEDIUM = 'lg:relative lg:left-1/2 lg:w-[min(1024px,calc(100vw-6rem))] lg:-translate-x-1/2'

// The page's own labels, in the study's language (`lang`).
const UI_TEXT = {
  en: {
    pageTitle: (title: string) => `${title} case study`,
    chapters: 'Chapters',
    whatIMade: 'What I made',
    for: 'For',
    builtWith: 'Built with',
    role: 'My role',
    year: 'Year',
    duration: 'Duration',
    tools: 'Tools',
    swipe: 'Swipe sideways to see the whole flow',
    prev: 'Previous screen',
    next: 'Next screen',
    restart: 'Start over',
    step: (n: number, total: number) => `Step ${n} of ${total}`,
  },
  sv: {
    pageTitle: (title: string) => `${title}, fallstudie`,
    chapters: 'Kapitel',
    whatIMade: 'Vad jag gjorde',
    for: 'För',
    builtWith: 'Gjort med',
    role: 'Min roll',
    year: 'År',
    duration: 'Tid',
    tools: 'Verktyg',
    swipe: 'Svep i sidled för att se hela flödet',
    prev: 'Föregående skärm',
    next: 'Nästa skärm',
    restart: 'Börja om',
    step: (n: number, total: number) => `Steg ${n} av ${total}`,
  },
}
type UiText = (typeof UI_TEXT)['en']

// Ambient muted/looped preview clip — plays only while on screen, same
// as the homepage bento grid's video tiles (see `useInViewVideo`).
function AutoplayLoopVideo({ src, className }: { src: string; className?: string }) {
  const { targetRef, setVideoRef } = useInViewVideo<HTMLDivElement>()
  return (
    <div ref={targetRef}>
      <video
        ref={setVideoRef}
        className={className}
        src={src}
        poster={posterFor(src)}
        muted
        loop
        playsInline
        preload="none"
      />
    </div>
  )
}

// A screen recording inside a landscape tablet. Plays muted while on
// screen like `AutoplayLoopVideo`, but with a visible play/pause button,
// a progress bar and a "Screen recording" label, since a frame alone
// still read as a static screenshot. The button also lets visitors stop
// the motion (WCAG 2.2.2); under reduced motion it never starts on its
// own and the button reads "Play".
function TabletVideo({ src, caption }: { src: string; caption?: string }) {
  const { targetRef, setVideoRef } = useInViewVideo<HTMLElement>()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  return (
    <figure ref={targetRef} className="mx-auto w-full">
      <div className="relative rounded-[28px] bg-ink p-2.5 shadow-[0_30px_60px_rgba(31,35,51,0.22)] sm:rounded-[36px] sm:p-4">
        <span aria-hidden="true" className="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/25 sm:top-1.5" />
        <div className="relative overflow-hidden rounded-[18px] bg-black sm:rounded-[22px]">
          <video
            ref={(el) => {
              videoRef.current = el
              setVideoRef(el)
            }}
            className="block w-full"
            src={src}
            poster={posterFor(src)}
            muted
            loop
            playsInline
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget
              if (v.duration) setProgress(v.currentTime / v.duration)
            }}
          />
          <button
            type="button"
            onClick={toggle}
            className="absolute bottom-3 left-3 flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white shadow-lg ring-2 ring-white/80 transition-colors hover:bg-ink/85"
          >
            <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
            {playing ? 'Pause' : 'Play'}
          </button>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
            <div className="h-full bg-white" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-base text-neutral-700">
          <span className="rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink/75">
            Screen recording
          </span>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// A paragraph slot is either plain text or an inline image/video —
// lets media sit exactly between two specific paragraphs instead of
// only ever at the end of a whole section.
// `[text](/path)` inside a paragraph or bullet becomes a site link, e.g. one
// case study pointing to another. `[text](https://…)` links out, in a new
// tab, e.g. a source.
const INLINE_LINK = /\[([^\]]+)\]\(((?:\/|https:\/\/)[^)\s]*)\)/g

function withLinks(text: string) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(INLINE_LINK)) {
    parts.push(text.slice(last, match.index))
    const linkClass = 'font-semibold text-ink underline decoration-2 underline-offset-4 hover:decoration-ink/40'
    parts.push(
      match[2].startsWith('/') ? (
        <Link key={match.index} to={match[2]} className={linkClass}>
          {match[1]}
        </Link>
      ) : (
        <a key={match.index} href={match[2]} target="_blank" rel="noreferrer" className={linkClass}>
          {match[1]}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    )
    last = match.index + match[0].length
  }
  parts.push(text.slice(last))
  return parts
}

// A clickable prototype from still screens: the same buttons as the Figma
// prototype take you to the same screens, with a short ease-out crossfade
// like Figma's Smart animate between near-identical screens. The text for
// the current screen sits beside it and changes with every step. Clicking
// the screen anywhere else briefly outlines what can be clicked, as Figma
// does. Back/next buttons step through `order` for anyone who doesn't click
// inside the phone; a screen not in `order` (an open panel) counts as the
// step it was opened from.
function ClickThrough({ block, ui }: { block: Extract<ParagraphBlock, { type: 'clickThrough' }>; ui: UiText }) {
  const { screens, order } = block
  const [current, setCurrent] = useState(order[0])
  const [hint, setHint] = useState(false)
  const screen = screens[current]
  const stepOf = (i: number) => {
    const at = order.indexOf(i)
    return at >= 0 ? at : order.indexOf(screens[i].stepOf ?? order[0])
  }
  const step = stepOf(current)
  const go = (i: number) => {
    setHint(false)
    setCurrent(i)
  }

  // A screen that moves on by itself, like a call connecting.
  useEffect(() => {
    if (!screen.autoNext) return
    const timer = window.setTimeout(() => go(screen.autoNext!.to), screen.autoNext.ms)
    return () => window.clearTimeout(timer)
  }, [current]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!hint) return
    const timer = window.setTimeout(() => setHint(false), 900)
    return () => window.clearTimeout(timer)
  }, [hint])

  // Back/next beside the phone; on the last step, next starts over.
  const last = step === order.length - 1
  const arrow = (dir: 'prev' | 'next') => (
    <button
      type="button"
      onClick={() => go(dir === 'prev' ? order[Math.max(0, step - 1)] : order[last ? 0 : step + 1])}
      disabled={dir === 'prev' && step === 0}
      aria-label={dir === 'prev' ? ui.prev : last ? ui.restart : ui.next}
      className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-lg text-white transition-opacity hover:opacity-85 disabled:opacity-25 sm:flex"
    >
      <span aria-hidden="true">{dir === 'prev' ? '←' : last ? '↺' : '→'}</span>
    </button>
  )

  return (
    <div className="mx-auto grid max-w-[1024px] items-center gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
      <div>
        <div className="flex items-center justify-center gap-3 sm:gap-5">
        {arrow('prev')}
        {/* Sized so the phone and the step bar under it fit on one screen,
            below the fixed bars: at most 380px wide, no wider than the
            window leaves (beside the arrows, from sm up), and no taller than the window
            minus ~9.5rem (0.492 is the screen images' width/height). */}
        {/* A size container, so hotspot corners (`radius`) scale with it. */}
        <div
          className="relative aspect-[720/1463] w-[min(calc(100vw_-_3rem),380px,calc((100svh_-_9.5rem)_*_0.492))] sm:w-[min(calc(100vw_-_11rem),380px,calc((100svh_-_9.5rem)_*_0.492))] shrink-0 [container-type:inline-size]"
          onClick={() => setHint(true)}
        >
          {screens.map((sc, i) => (
            <div
              key={sc.src}
              aria-hidden={i !== current}
              className={`absolute inset-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                i === current ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img src={sc.src} alt={i === current ? sc.alt : ''} decoding="async" className="h-full w-full" />
              {/* Motion the still screens lack: a part of the screen, cut out
                  on its own flat background, moving on top of itself, or
                  three loading dots. Decorative. */}
              {sc.overlays?.map((o) =>
                o.cover ? (
                  <span
                    key={`cover-${o.x}-${o.y}`}
                    aria-hidden="true"
                    style={{ left: `${o.x}%`, top: `${o.y}%`, width: `${o.w}%`, height: `${o.h}%`, background: o.cover }}
                    className="absolute"
                  />
                ) : o.src ? (
                  <img
                    key={o.src}
                    src={o.src}
                    alt=""
                    aria-hidden="true"
                    style={{ left: `${o.x}%`, top: `${o.y}%`, width: `${o.w}%`, height: `${o.h}%` }}
                    className={`absolute ${o.motion === 'wave' ? 'animate-proto-wave' : 'animate-proto-breathe'}`}
                  />
                ) : (
                  <span
                    key="dots"
                    aria-hidden="true"
                    style={{ left: `${o.x}%`, top: `${o.y}%`, width: `${o.w}%` }}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 justify-between"
                  >
                    {[0, 1, 2].map((n) => (
                      <span
                        key={n}
                        style={{ animationDelay: `${n * 0.2}s`, background: o.color }}
                        className="aspect-square w-[21%] animate-proto-dot rounded-full"
                      />
                    ))}
                  </span>
                ),
              )}
            </div>
          ))}
          {screen.hotspots?.map((spot) => (
            <button
              key={spot.label}
              type="button"
              aria-label={spot.label}
              onClick={(e) => {
                e.stopPropagation()
                go(spot.to)
              }}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: `${spot.w}%`,
                height: `${spot.h}%`,
                // px of the 720px-wide image, as a share of the phone's width
                borderRadius: spot.radius ? `${spot.radius / 7.2}cqw` : undefined,
              }}
              className={`absolute transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                spot.round ? 'rounded-full' : 'rounded-xl'
              } ${hint ? 'shadow-[0_0_0_3px_rgb(59_130_246_/_0.8)] bg-blue-500/15' : ''}`}
            >
              {/* `guide`: a soft glow on the click the happy path wants next. */}
              {spot.guide && (
                <span
                  aria-hidden="true"
                  // Teal around pink things; pink around things on the teal bar.
                  style={{ '--proto-glow': spot.glow === 'pink' ? '#FF6EC7' : '#375D6E' } as React.CSSProperties}
                  className="absolute inset-0 animate-proto-glow rounded-[inherit] motion-reduce:animate-none"
                />
              )}
            </button>
          ))}
        </div>
        {arrow('next')}
        </div>
        {/* Step bar: one segment per step, filled up to the current one;
            each segment jumps to its step. */}
        <ol className="mx-auto mt-4 flex w-full max-w-[380px] gap-1.5">
          {order.map((screenIndex, n) => (
            <li key={screenIndex} className="flex-1">
              <button
                type="button"
                onClick={() => go(screenIndex)}
                aria-label={ui.step(n + 1, order.length)}
                aria-current={n === step ? 'step' : undefined}
                className="group block w-full py-2"
              >
                <span
                  className={`block h-1.5 rounded-full transition-colors duration-300 ${
                    n <= step ? 'bg-ink' : 'bg-ink/15 group-hover:bg-ink/30'
                  }`}
                />
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div>
        {block.heading && <h2 className="font-display text-[1.75rem] leading-tight text-ink">{block.heading}</h2>}
        {block.intro && <p className="mt-3 text-base leading-relaxed text-neutral-700">{block.intro}</p>}
        <div aria-live="polite" className="mt-6 min-h-48">
          <m.div key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
            <h3 className="font-display text-xl text-ink sm:text-[1.375rem]">{screen.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-neutral-700">{withLinks(screen.text)}</p>
          </m.div>
        </div>
        {block.link && (
          <p className="mt-8 text-sm text-neutral-600">
            {withLinks(block.link)}
          </p>
        )}
      </div>
    </div>
  )
}

function ParagraphContent({ block, studyTitle, ui }: { block: ParagraphBlock; studyTitle: string; ui: UiText }) {
  if (typeof block === 'string') {
    return <p className="text-base leading-relaxed text-neutral-700">{withLinks(block)}</p>
  }
  if (block.type === 'image') {
    if (block.wideDiagram) {
      return (
        <div className={WIDE}>
          <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
            <img src={block.src} alt={block.alt ?? studyTitle} loading="lazy" decoding="async" className="mx-auto w-[900px] max-w-none md:max-h-[85vh] md:w-auto md:max-w-full" />
          </div>
          <p className="mt-2 text-center text-sm text-neutral-500 md:hidden">{ui.swipe}</p>
        </div>
      )
    }
    return block.small ? (
      <ImageRow srcs={[block.src]} alt={block.alt ?? studyTitle} maxHeight={360} />
    ) : (
      <ImageRow srcs={[block.src]} alt={block.alt ?? studyTitle} className={WIDE} />
    )
  }
  if (block.type === 'clickThrough') return <ClickThrough block={block} ui={ui} />
  if (block.type === 'videoPair') {
    // `lg:`: breaks out of the 768px text column (centred on it), so each
    // tablet stays large enough to read side by side.
    return (
      <div className="grid gap-10 pt-4 lg:relative lg:left-1/2 lg:w-[min(1600px,calc(100vw-6rem))] lg:-translate-x-1/2 lg:grid-cols-2 lg:gap-8">
        {block.videos.map((video) => (
          <TabletVideo key={video.src} src={video.src} caption={video.caption} />
        ))}
      </div>
    )
  }
  return (
    <div className={WIDE}>
      {block.heading && (
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-wider text-ink/70">{block.heading}</p>
      )}
      {block.frame === 'tablet' ? (
        <TabletVideo src={block.src} caption={block.caption} />
      ) : block.autoplayLoop ? (
        <AutoplayLoopVideo src={block.src} className="mx-auto block max-h-[85vh] rounded-2xl ring-1 ring-ink/5" />
      ) : (
        <video
          className="mx-auto block max-h-[85vh] rounded-2xl ring-1 ring-ink/5"
          src={block.src}
          poster={posterFor(block.src)}
          controls
          playsInline
        />
      )}
    </div>
  )
}

function PersonaCard({ persona }: { persona: Persona }) {
  return (
    <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-neutral-50 p-6 ring-1 ring-ink/5 sm:flex-row sm:items-start">
      <img
        src={persona.photo}
        alt={persona.name}
        loading="lazy"
        decoding="async"
        className="h-24 w-24 shrink-0 rounded-full object-cover ring-1 ring-ink/10"
      />
      <div>
        <p className="font-display text-xl text-ink">{persona.name}</p>
        <ul className="mt-2 space-y-1.5 text-base text-neutral-600">
          {persona.bio.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function OptionsGrid({ options }: { options: Option[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {options.map((option) => (
        <div
          key={option.label}
          className={`relative rounded-2xl p-4 ring-1 ${
            option.chosen ? 'bg-accent-soft ring-accent' : 'bg-neutral-50 ring-ink/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${
                option.chosen ? 'bg-ink text-white' : 'bg-ink/10 text-ink/75'
              }`}
            >
              {option.label}
            </span>
            {option.chosen && (
              <span className="text-sm font-semibold uppercase tracking-wider text-ink">
                Chosen
              </span>
            )}
          </div>
          {option.image && (
            <div className="mt-3 flex h-28 items-center justify-center rounded-xl bg-white p-3 ring-1 ring-ink/5">
              <img
                src={option.image}
                alt={`Option ${option.label}`}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
          <p className="mt-3 text-base text-neutral-600">{option.description}</p>
        </div>
      ))}
    </div>
  )
}

// The "what changed because of this work" summary, right under the
// title/meta block so it's the first thing a skimming reader takes in.
// One colour per slice; the legend repeats every share as text, so the
// chart never relies on telling the colours apart.
// Shared motion: content fades up once as it scrolls into view, and groups
// stagger their children. `MotionConfig reducedMotion="user"` (App.tsx)
// drops the movement for people who ask for less motion.
const EASE = [0.22, 1, 0.36, 1] as const
const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: 0.6, ease: EASE },
}
const STAGGER: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
const RISE: Variants = { hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }

const SKILL_COLORS = ['#1f2333', '#4a44a8', '#5f59c2', '#9a95e0', '#2e4b61', '#144c6b', '#83c6e9', '#f2aa3c']

// Compact donut of the UX skills a project used and each one's share of
// the work, with the legend beside it. The SVG is
// decorative; the legend list carries the numbers for screen readers.
function SkillsChart({ skills, note }: { skills: NonNullable<CaseStudy['skills']>; note?: string }) {
  const starts = skills.map((_, i) => skills.slice(0, i).reduce((sum, s) => sum + s.share, 0))
  return (
    <section aria-labelledby="skills-heading" className="py-6">
      <h2 id="skills-heading" className="text-sm font-semibold uppercase tracking-wider text-ink/70">
        UX skills applied
        {/* Points to the note under the chart; the note is read anyway, so
            screen readers skip the asterisk on both ends. */}
        {note && <span aria-hidden="true">*</span>}
      </h2>
      <div className="mt-4 flex items-center gap-5 sm:gap-8">
        <svg viewBox="0 0 42 42" className="h-24 w-24 shrink-0 -rotate-90 sm:h-28 sm:w-28" aria-hidden="true">
          {skills.map((skill, i) => (
            <m.circle
                key={skill.name}
                cx="21"
                cy="21"
                r="15.9155"
                fill="none"
                stroke={SKILL_COLORS[i % SKILL_COLORS.length]}
                strokeWidth="8"
                pathLength={100}
                strokeDashoffset={-starts[i]}
                initial={{ strokeDasharray: `0 100` }}
                whileInView={{ strokeDasharray: `${skill.share} ${100 - skill.share}` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (starts[i] / 100) * 0.9, ease: 'easeOut' }}
              />
          ))}
        </svg>
        <ul className="grid flex-1 grid-cols-1 gap-x-8 gap-y-1 text-sm text-neutral-700 md:grid-cols-2">
          {skills.map((skill, i) => (
            <li key={skill.name} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: SKILL_COLORS[i % SKILL_COLORS.length] }}
              />
              <span className="flex-1">{skill.name}</span>
              <span className="tabular-nums text-ink">{skill.share}%</span>
            </li>
          ))}
        </ul>
      </div>
      {note && (
        <p className="mt-4 text-sm text-neutral-600">
          <span aria-hidden="true">* </span>
          {note}
        </p>
      )}
    </section>
  )
}

// Impact points that lead with a rise ("More trust", "Happier tenants")
// get an up arrow, ones that lead with a drop ("Fewer phone calls") a down
// arrow, both in the same color since either can be the good news. Any
// other point keeps a plain square. Decorative: the words already say it.
// Swedish words too, for a study with `lang: 'sv'`.
const RISES = /^(More|Increased|Wider|Happier|Better|Higher|Mer|Fler|Bättre|Ökad|Högre)(?![\p{L}])/u
const DROPS = /^(Less|Fewer|Lower|Reduced|Mindre|Färre|Lägre)(?![\p{L}])/u

const trendOf = (point: string) => (RISES.test(point) ? 'up' : DROPS.test(point) ? 'down' : null)
// Rises first, drops last, anything else in between, each group in its
// written order.
const TREND_ORDER = { up: 0, none: 1, down: 2 }
const byTrend = (a: string, b: string) => TREND_ORDER[trendOf(a) ?? 'none'] - TREND_ORDER[trendOf(b) ?? 'none']

function TrendMarker({ point }: { point: string }) {
  const trend = trendOf(point)
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : null
  return arrow ? (
    <span aria-hidden="true" className="w-3 shrink-0 font-bold text-white">{arrow}</span>
  ) : (
    <span aria-hidden="true" className="mx-[3px] mt-2.5 h-1.5 w-1.5 shrink-0 bg-white" />
  )
}

// Dark card so it stands out on the light page, in the page's own type,
// on the same ground as the study's hero band (`background`).
// `compact`: one column, for the side of a `split` section.
function ImpactCard({ impact, background, compact = false }: { impact: Impact; background: string; compact?: boolean }) {
  return (
    // Full width; on `xl`, as wide as the media below it, with the headline
    // on the left and the points on the right so lines stay readable.
    <m.section
      {...REVEAL}
      aria-labelledby="impact-heading"
      style={{ background }}
      className={`mt-8 rounded-3xl p-6 text-white sm:p-8 ${compact ? 'lg:mt-0 lg:p-10' : `lg:grid lg:grid-cols-2 lg:gap-12 lg:p-12 ${MEDIUM}`}`}
    >
      <div>
        <h2 id="impact-heading" className="text-sm font-semibold uppercase tracking-wider text-white/70">
          {impact.label}
        </h2>
        <p className="mt-3 text-base leading-snug text-white/85">
          <span className="font-display mb-1 block text-2xl leading-tight text-white sm:text-3xl">{impact.highlight}</span>
          {impact.summary}
        </p>
      </div>
      <div>
        <m.ul
          variants={STAGGER}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true }}
          className={`mt-5 space-y-2 ${compact ? '' : 'lg:mt-0'}`}
        >
          {[...impact.points].sort(byTrend).map((point) => (
            <m.li variants={RISE} key={point} className="flex gap-2.5 text-base text-white/85 lg:text-lg">
              <TrendMarker point={point} />
              <span>{point}</span>
            </m.li>
          ))}
        </m.ul>
        {impact.note && <p className="mt-4 text-sm text-white/65">{impact.note}</p>}
      </div>
    </m.section>
  )
}

// midoma.cz's own page ground and its `.glow` (lavender top-left, sky
// bottom-right), for the Midoma study's `theme`.
const MIDOMA_PAPER = '#f4f2fc'
const MIDOMA_GLOW = `radial-gradient(55% 75% at 6% 0%, rgb(121 115 211 / 0.16), transparent 70%),
  radial-gradient(50% 70% at 100% 100%, rgb(131 198 233 / 0.22), transparent 70%), ${MIDOMA_PAPER}`

// Midoma's `gradient-dark`: slate into indigo with a purple and a sky glow.

// Opening band for a study with `hero`: logo (or the name as a wordmark),
// headline, what was made, who for and with what, beside the mockup. Holds
// the page's h1; the logo stands in for the name, which is repeated for
// screen readers.
function StudyHero({ study, name, headline, ui }: { study: CaseStudy; name: string; headline: string; ui: UiText }) {
  const hero = study.hero!
  return (
    <div className="overflow-hidden pb-14 pt-[200px] text-white sm:pb-20 lg:pt-[164px]" style={{ background: hero.background ?? MIDOMA_BG }}>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <m.div variants={STAGGER} initial="hidden" animate="shown">
          {/* With a logo: the logo, then the headline as the h1. Without
              one: "Name:" as the h1, with the headline as a smaller
              subheading under it. */}
          {hero.logo ? (
            <>
              <m.div variants={RISE}>
                <img src={hero.logo} alt="" width={500} height={204} className="h-12 w-auto sm:h-20" />
              </m.div>
              <m.h1 variants={RISE} className="font-display mt-5 text-3xl leading-tight sm:text-4xl md:text-5xl">
                <span className="sr-only">{name}: </span>
                {headline}
              </m.h1>
            </>
          ) : (
            <>
              <m.h1 variants={RISE} className="font-display text-4xl leading-tight md:text-5xl">
                {name}{headline && ':'}
              </m.h1>
              {headline && (
                <m.p variants={RISE} className="mt-4 max-w-xl text-xl leading-snug text-white/85 sm:text-2xl">
                  {headline}
                </m.p>
              )}
            </>
          )}
          {hero.allDetails && study.intro && (
            <m.p variants={RISE} className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
              {study.intro}
            </m.p>
          )}
          <m.ul variants={RISE} className="mt-6 flex flex-wrap gap-2" aria-label={ui.whatIMade}>
            {hero.deliverables.map((d) => (
              <li key={d} className="rounded-full bg-white/12 px-4 py-2 text-sm font-semibold ring-1 ring-white/20">
                {d}
              </li>
            ))}
          </m.ul>
          <m.dl variants={RISE} className="mt-8 grid gap-4 text-base sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/75">{ui.for}</dt>
              <dd className="mt-1">{hero.client}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/75">{ui.builtWith}</dt>
              <dd className="mt-1 flex items-center gap-2">
                {hero.builtWithLogo && (
                  <img src={hero.builtWithLogo} alt="" width={24} height={24} className="h-6 w-6" />
                )}
                {hero.builtWith}
              </dd>
            </div>
            {hero.allDetails &&
              [
                [ui.role, study.role],
                [ui.year, study.year],
                [ui.duration, study.duration],
              ].map(([term, value]) => (
                <div key={term}>
                  <dt className="text-sm font-semibold uppercase tracking-wider text-white/75">{term}</dt>
                  <dd className="mt-1">{value}</dd>
                </div>
              ))}
          </m.dl>
        </m.div>
        <m.img
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          src={study.heroImage}
          alt={hero.imageAlt}
          // Capped height: a square phone shot at full column width filled
          // the whole first screen.
          className="animate-float mx-auto max-h-[480px] w-auto max-w-full lg:scale-110"
        />
      </div>
    </div>
  )
}

const chapterId = (title: string) => 'chapter-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Chapter menu: a full-width band fixed right under the Navbar bar, so the
// study's structure is visible from the first screen. A floating pill used
// to sit over the text column and cover headlines; the band is opaque, so
// text scrolls cleanly under it. It stays put the whole way down. Marks the
// chapter being read (`aria-current`) and moves focus to the chapter title
// it jumps to.
function ChapterNav({ sections, label }: { sections: Section[]; label: string }) {
  const chapters = sections.flatMap((s) => (s.chapter ? [{ id: chapterId(s.chapter.title), nav: s.chapter.nav }] : []))
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      // The current chapter is the last one whose title has passed 40 %
      // of the way down the screen.
      const line = window.innerHeight * 0.4
      let current: string | null = null
      for (const c of chapters) {
        const el = document.getElementById(c.id)
        if (el && el.getBoundingClientRect().top <= line) current = c.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // `chapters` is rebuilt every render but only changes with `sections`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections])

  const jump = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    el.focus({ preventScroll: true })
  }

  if (chapters.length < 2) return null
  return (
    <nav
      aria-label={label}
      className="fixed inset-x-0 top-[100px] z-40 lg:top-16 border-b border-ink/10 bg-white/95 shadow-[0_8px_16px_rgba(31,35,51,0.08)] backdrop-blur-md"
    >
      <ol className="mx-auto flex w-max max-w-full items-center gap-1 overflow-x-auto px-2 py-1">
        {chapters.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              onClick={(e) => jump(e, c.id)}
              aria-current={active === c.id ? 'location' : undefined}
              // Current chapter: full ink with a thick underline; the rest
              // muted until hovered.
              className={`block min-h-11 whitespace-nowrap rounded-md px-3 py-3 text-sm font-semibold leading-5 underline-offset-[10px] transition-colors sm:px-5 ${
                active === c.id ? 'text-ink underline decoration-2' : 'text-ink/60 hover:text-ink'
              }`}
            >
              {c.nav}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

// A section with `split`: heading, text and bullets on one side, its image
// blocks (with their own alt text) stacked on the other, at a width between the text column and WIDE.
// Stacks below `lg`, text first.
const SPLIT = 'lg:relative lg:left-1/2 lg:w-[min(1200px,calc(100vw-6rem))] lg:-translate-x-1/2'

function SplitSection({ section, studyTitle, heroBackground }: { section: Section; studyTitle: string; heroBackground: string }) {
  return (
    <m.section {...REVEAL} className={`mt-20 ${SPLIT}`}>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className={section.split === 'left' ? 'lg:order-2' : undefined}>
          <h2
            id={section.chapter ? chapterId(section.chapter.title) : undefined}
            tabIndex={section.chapter ? -1 : undefined}
            className="font-display scroll-mt-56 text-[1.75rem] leading-tight text-ink outline-none"
          >
            {section.heading}
          </h2>
          <div className="mt-4 space-y-6">
            {section.paragraphs.map((block, i) =>
              typeof block === 'string' ? (
                <p key={i} className="text-base leading-relaxed text-neutral-700">
                  {withLinks(block)}
                </p>
              ) : null,
            )}
          </div>
          {section.bullets && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-neutral-700">
              {section.bullets.map((b, i) => (
                <li key={i}>{withLinks(b)}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          {section.impact && <ImpactCard impact={section.impact} background={heroBackground} compact />}
          {section.paragraphs.map((block) =>
            typeof block !== 'string' && block.type === 'image' ? (
              <figure key={block.src}>
                <ImageRow srcs={[block.src]} alt={block.alt ?? studyTitle} maxHeight={section.imagesMaxHeight ?? 560} />
                {block.caption && <figcaption className="mt-3 text-center text-sm text-neutral-500">{block.caption}</figcaption>}
              </figure>
            ) : null,
          )}
        </div>
      </div>
    </m.section>
  )
}

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const study = slug ? getCaseStudy(slug) : undefined
  const ui = UI_TEXT[study?.lang ?? 'en']
  usePageMeta(study ? ui.pageTitle(study.title) : 'Case study not found', `/work/${slug ?? ''}`)
  useNoIndex(!!study?.unlisted)
  // The only light page — keep overscroll/short-page gaps light too
  // (the body default is the dark `--color-page-bg`, see index.css).
  const midoma = study?.theme === 'midoma'
  const subtitle =
    midoma && study.title.includes(': ')
      ? study.title.slice(study.title.indexOf(': ') + 2).replace(/^./, (c) => c.toUpperCase())
      : null
  const hasChapters = !!study?.sections.some((s) => s.chapter)
  // The hero band's ground, reused by the impact box. Same fallback as StudyHero.
  const heroBackground = study?.hero?.background ?? MIDOMA_BG
  useBodyBackground(study?.pageBackground ?? (midoma ? MIDOMA_PAPER : 'var(--color-white)'))

  if (!study) {
    return (
      <div id="top">
        <Navbar />
        <main id="main" className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="text-neutral-500">Case study not found.</p>
        </main>
      </div>
    )
  }

  return (
    <div id="top">
      {/* `fixed`, not on the wrapper: on a page this tall the glows would
          otherwise stretch over its whole height and fade to nothing. */}
      {midoma && <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" style={{ background: MIDOMA_GLOW }} />}
      <Navbar />

      {/* No "← Back to work" text link here — the Navbar's Home link and
          Case studies menu already cover going back. */}
      <main id="main">
        {/* overflow-x-clip: a full-width `band` mustn't add sideways scroll. */}
        <article lang={study.lang} className="overflow-x-clip">
          {study.hero && (
            <StudyHero
              study={study}
              name={subtitle ? study.title.slice(0, study.title.indexOf(': ')) : study.title}
              headline={subtitle ?? study.tagline}
              ui={ui}
            />
          )}
          <div
            className={`mx-auto max-w-[720px] px-6 pb-24 md:px-10 ${
              // A `band` first in the study sits right against the hero.
              study.hero ? (study.sections[0]?.band ? 'pt-0' : 'pt-6') : hasChapters ? 'pt-[210px] lg:pt-[174px]' : 'pt-[164px] lg:pt-[128px]'
            }`}
          >
          {!study.hero && (
            <>
              {/* midoma theme: the name is the heading, and the description
                  after the colon becomes a smaller subheading, so the
                  headline doesn't fill the first screen. */}
              <h1 className="font-display text-5xl leading-tight text-ink md:text-7xl">
                {subtitle ? study.title.slice(0, study.title.indexOf(': ')) : study.title}
              </h1>
              {subtitle && <p className="mt-3 text-2xl leading-snug text-neutral-700 md:text-3xl">{subtitle}</p>}
              <PixelWaveDivider className="mt-6" particleClassName="bg-ink/15" animated={false} />
            </>
          )}
          {/* Tools gets the widest column — it's the longest list and
              wrapped to five lines in an equal quarter-width column. */}
          {!study.hero?.allDetails && (
            <>
              <div className="grid grid-cols-2 gap-x-6 gap-y-6 py-6 sm:grid-cols-[1.2fr_0.6fr_0.8fr_2fr]">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-ink/70">{ui.role}</p>
                  <p className="mt-1 text-base text-neutral-700">{study.role}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-ink/70">{ui.year}</p>
                  <p className="mt-1 text-base text-neutral-700">{study.year}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-ink/70">{ui.duration}</p>
                  <p className="mt-1 text-base text-neutral-700">{study.duration}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-sm font-semibold uppercase tracking-wider text-ink/70">{ui.tools}</p>
                  <p className="mt-1 text-base text-neutral-700">{study.tools.join(', ')}</p>
                </div>
              </div>
              <PixelWaveDivider particleClassName="bg-ink/15" animated={false} />
            </>
          )}

          {study.skills && (
            <>
              <SkillsChart skills={study.skills} note={study.skillsNote} />
              <PixelWaveDivider particleClassName="bg-ink/15" animated={false} />
            </>
          )}
          {slug && impactBySlug[slug] && <ImpactCard impact={impactBySlug[slug]} background={heroBackground} />}

          {/* With a hero, its headline already says what the tagline would. */}
          {!study.hero && <h2 className="font-display mt-10 text-4xl text-ink">{study.tagline}</h2>}
          {study.intro && !study.hero?.allDetails && <p className="mt-4 text-base leading-relaxed text-neutral-600">{study.intro}</p>}

          {!study.hero && <ImageRow srcs={[study.heroImage]} alt={study.title} className={WIDE} />}

          {study.sections.map((section, i) => section.split ? (
            <SplitSection key={section.heading || i} section={section} studyTitle={study.title} heroBackground={heroBackground} />
          ) : (
            // An empty `heading` continues the text above without a
            // headline of its own.
            <m.section
              {...REVEAL}
              key={section.heading || i}
              // A chapter without a headline jumps to the section itself.
              id={section.chapter && !section.heading ? chapterId(section.chapter.title) : undefined}
              tabIndex={section.chapter && !section.heading ? -1 : undefined}
              // `band`: full window width on its own color, to stand out.
              className={`scroll-mt-40 outline-none ${section.band ? `relative left-1/2 w-screen -translate-x-1/2 px-6 py-10 md:px-10 ${i === 0 ? '' : 'mt-10'}` : 'mt-16'}`}
              style={section.band ? { background: section.band } : undefined}
            >
              {section.heading && (
                // A section that starts a chapter is the chapter menu's
                // jump target: scroll-mt clears the fixed Navbar and
                // chapter menu, tabIndex lets the menu move focus here.
                <h2
                  id={section.chapter ? chapterId(section.chapter.title) : undefined}
                  tabIndex={section.chapter ? -1 : undefined}
                  className={`font-display scroll-mt-56 text-ink outline-none ${section.smallPrint ? 'text-xl' : 'text-[1.75rem] leading-tight'}`}
                >
                  {section.heading}
                </h2>
              )}
              <div className="mt-4 space-y-6">
                {section.paragraphs.map((block, i) => (
                  <ParagraphContent key={i} block={block} studyTitle={study.title} ui={ui} />
                ))}
              </div>
              {section.quote && (
                <blockquote
                  className={`mt-6 rounded-2xl p-5 text-base leading-relaxed text-neutral-700 italic ${
                    section.quote.bg ? '' : 'bg-accent-soft'
                  }`}
                  style={section.quote.bg ? { backgroundColor: section.quote.bg } : undefined}
                >
                  “{section.quote.text}”
                  <footer className="mt-2 text-base not-italic text-ink/70">
                    - {section.quote.attribution}
                  </footer>
                </blockquote>
              )}
              {section.persona && <PersonaCard persona={section.persona} />}
              {section.bullets && (
                <ul className={`mt-4 list-disc pl-5 leading-relaxed ${section.smallPrint ? 'space-y-1 text-sm text-neutral-600' : 'space-y-2 text-base text-neutral-700'}`}>
                  {section.bullets.map((b, i) => (
                    <li key={i}>{withLinks(b)}</li>
                  ))}
                </ul>
              )}
              {section.options && <OptionsGrid options={section.options} />}
              {section.images && (
                <ImageRow
                  srcs={section.images}
                  alt={`${study.title} - ${section.heading} screenshot`}
                  maxHeight={section.imagesMaxHeight}
                  className={WIDE}
                />
              )}
              {section.carousel && (
                <>
                  {section.carouselHeading && (
                    <p className="mt-8 text-center text-sm font-semibold uppercase tracking-wider text-ink/70">
                      {section.carouselHeading}
                    </p>
                  )}
                  <div className={MEDIUM}>
                    <Carousel items={section.carousel} />
                  </div>
                </>
              )}
              {section.video && section.video.autoplayLoop && (
                <div className={WIDE}>
                  <AutoplayLoopVideo
                    src={section.video.src}
                    className="mt-8 mx-auto block max-h-[85vh] rounded-2xl ring-1 ring-ink/5"
                  />
                </div>
              )}
              {section.video && !section.video.autoplayLoop && (
                <div className={WIDE}>
                  <video
                    className="mt-8 mx-auto block max-h-[85vh] rounded-2xl ring-1 ring-ink/5"
                    src={section.video.src}
                    poster={posterFor(section.video.src)}
                    controls
                    playsInline
                  />
                </div>
              )}
            </m.section>
          ))}

          {(study.externalLink || study.moreLinks || study.githubLink) && (
            <div className="mt-16 flex flex-wrap gap-4 border-t border-ink/10 pt-8">
              {study.externalLink && (
                <a
                  href={study.externalLink.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-full bg-ink px-5 py-2.5 text-base font-medium text-white transition-opacity hover:opacity-80"
                >
                  {study.externalLink.label} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {study.moreLinks?.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-full border border-ink/20 px-5 py-2.5 text-base font-medium transition-colors hover:bg-accent-soft"
                >
                  {link.label} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
              {study.githubLink && (
                <a
                  href={study.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-ink/10 px-5 py-2.5 text-base font-medium transition-colors hover:bg-accent-soft"
                >
                  See code (GitHub) <span aria-hidden="true">→</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          )}
          </div>
        </article>
      </main>

      <Footer />
      {hasChapters && <ChapterNav sections={study.sections} label={ui.chapters} />}
    </div>
  )
}
