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
import { useBodyBackground, usePageMeta } from '../lib/pageMeta'
import { MIDOMA_BG } from '../data/workItems'

// Media break out of the text column on large
// screens, centred on it, to near the full window width.
const WIDE = 'lg:relative lg:left-1/2 lg:w-[min(1600px,calc(100vw-6rem))] lg:-translate-x-1/2'
// Breaks out of the ~700px text column to a medium width, for blocks that
// need more room than a line of text but shouldn't go full width: the
// impact card, the carousel and the options grid.
const MEDIUM = 'lg:relative lg:left-1/2 lg:w-[min(1024px,calc(100vw-6rem))] lg:-translate-x-1/2'

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
        <figcaption className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-base text-neutral-700 sm:text-lg">
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
// `[text](/path)` inside a paragraph string becomes a site link, e.g. one
// case study pointing to another. Internal paths only.
const INLINE_LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g

function withLinks(text: string) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(INLINE_LINK)) {
    parts.push(text.slice(last, match.index))
    parts.push(
      <Link key={match.index} to={match[2]} className="font-semibold text-ink underline decoration-2 underline-offset-4 hover:decoration-ink/40">
        {match[1]}
      </Link>,
    )
    last = match.index + match[0].length
  }
  parts.push(text.slice(last))
  return parts
}

function ParagraphContent({ block, studyTitle }: { block: ParagraphBlock; studyTitle: string }) {
  if (typeof block === 'string') {
    return <p className="text-base leading-relaxed sm:text-lg text-neutral-700">{withLinks(block)}</p>
  }
  if (block.type === 'image') {
    if (block.wideDiagram) {
      return (
        <div className={WIDE}>
          <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
            <img src={block.src} alt={block.alt ?? studyTitle} loading="lazy" decoding="async" className="mx-auto w-[900px] max-w-none md:max-h-[85vh] md:w-auto md:max-w-full" />
          </div>
          <p className="mt-2 text-center text-sm text-neutral-500 md:hidden">Swipe sideways to see the whole flow</p>
        </div>
      )
    }
    return block.small ? (
      <ImageRow srcs={[block.src]} alt={block.alt ?? studyTitle} maxHeight={360} />
    ) : (
      <ImageRow srcs={[block.src]} alt={block.alt ?? studyTitle} className={WIDE} />
    )
  }
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
        <ul className="mt-2 space-y-1.5 text-base sm:text-lg text-neutral-600">
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
          <p className="mt-3 text-base sm:text-lg text-neutral-600">{option.description}</p>
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
// arrow, both in the same yellow since either can be the good news. Any
// other point keeps a plain square. Decorative: the words already say it.
const RISES = /^(More|Increased|Wider|Happier|Better|Higher)\b/
const DROPS = /^(Less|Fewer|Lower|Reduced)\b/

const trendOf = (point: string) => (RISES.test(point) ? 'up' : DROPS.test(point) ? 'down' : null)
// Rises first, drops last, anything else in between, each group in its
// written order.
const TREND_ORDER = { up: 0, none: 1, down: 2 }
const byTrend = (a: string, b: string) => TREND_ORDER[trendOf(a) ?? 'none'] - TREND_ORDER[trendOf(b) ?? 'none']

function TrendMarker({ point }: { point: string }) {
  const trend = trendOf(point)
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : null
  return arrow ? (
    <span aria-hidden="true" className="w-3 shrink-0 font-bold text-hover-yellow">{arrow}</span>
  ) : (
    <span aria-hidden="true" className="mx-[3px] mt-2.5 h-1.5 w-1.5 shrink-0 bg-hover-yellow" />
  )
}

// Dark card on the light page, echoing the homepage tiles where the same
// copy appears on hover.
function ImpactCard({ impact }: { impact: Impact }) {
  return (
    // Full width; on `xl`, as wide as the media below it, with the headline
    // on the left and the points on the right so lines stay readable.
    <m.section
      {...REVEAL}
      aria-labelledby="impact-heading"
      className={`mt-8 rounded-3xl bg-ink p-6 text-white sm:p-8 lg:grid lg:grid-cols-2 lg:gap-12 lg:p-12 ${MEDIUM}`}
    >
      <div>
        <h2 id="impact-heading" className="font-pixel text-xs uppercase tracking-[0.2em] text-hover-yellow">
          {impact.label}
        </h2>
        <p className="mt-4 text-lg leading-snug text-white/85 sm:text-xl lg:text-2xl">
          <span className="font-display mb-2 block text-4xl leading-none text-white sm:text-5xl lg:text-6xl">{impact.highlight}</span>
          {impact.summary}
        </p>
      </div>
      <div>
        <m.ul
          variants={STAGGER}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true }}
          className="mt-5 space-y-2 border-t border-white/15 pt-5 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
        >
          {[...impact.points].sort(byTrend).map((point) => (
            <m.li variants={RISE} key={point} className="flex gap-2.5 text-base text-white/80 lg:text-lg">
              <TrendMarker point={point} />
              <span>{point}</span>
            </m.li>
          ))}
        </m.ul>
        {impact.note && <p className="mt-4 text-sm text-white/55 lg:pl-12">{impact.note}</p>}
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
function StudyHero({ study, name, headline }: { study: CaseStudy; name: string; headline: string }) {
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
                {name}:
              </m.h1>
              <m.p variants={RISE} className="mt-4 max-w-xl text-xl leading-snug text-white/85 sm:text-2xl">
                {headline}
              </m.p>
            </>
          )}
          <m.ul variants={RISE} className="mt-6 flex flex-wrap gap-2" aria-label="What I made">
            {hero.deliverables.map((d) => (
              <li key={d} className="rounded-full bg-white/12 px-4 py-2 text-sm font-semibold ring-1 ring-white/20">
                {d}
              </li>
            ))}
          </m.ul>
          <m.dl variants={RISE} className="mt-8 grid gap-4 text-base sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/75">For</dt>
              <dd className="mt-1">{hero.client}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-white/75">Built with</dt>
              <dd className="mt-1 flex items-center gap-2">
                {hero.builtWithLogo && (
                  <img src={hero.builtWithLogo} alt="" width={24} height={24} className="h-6 w-6" />
                )}
                {hero.builtWith}
              </dd>
            </div>
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
function ChapterNav({ sections }: { sections: Section[] }) {
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
      aria-label="Chapters"
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

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const study = slug ? getCaseStudy(slug) : undefined
  usePageMeta(study ? `${study.title} case study` : 'Case study not found', `/work/${slug ?? ''}`)
  // The only light page — keep overscroll/short-page gaps light too
  // (the body default is the dark `--color-page-bg`, see index.css).
  const midoma = study?.theme === 'midoma'
  const subtitle =
    midoma && study.title.includes(': ')
      ? study.title.slice(study.title.indexOf(': ') + 2).replace(/^./, (c) => c.toUpperCase())
      : null
  const hasChapters = !!study?.sections.some((s) => s.chapter)
  useBodyBackground(midoma ? MIDOMA_PAPER : 'var(--color-white)')

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
        <article>
          {study.hero && (
            <StudyHero
              study={study}
              name={subtitle ? study.title.slice(0, study.title.indexOf(': ')) : study.title}
              headline={subtitle ?? study.tagline}
            />
          )}
          <div
            className={`mx-auto max-w-[720px] px-6 pb-24 md:px-10 ${
              study.hero ? 'pt-6' : hasChapters ? 'pt-[210px] lg:pt-[174px]' : 'pt-[164px] lg:pt-[128px]'
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
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 py-6 sm:grid-cols-[1.2fr_0.6fr_0.8fr_2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-ink/70">My role</p>
              <p className="mt-1 text-base text-neutral-700">{study.role}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-ink/70">Year</p>
              <p className="mt-1 text-base text-neutral-700">{study.year}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-ink/70">Duration</p>
              <p className="mt-1 text-base text-neutral-700">{study.duration}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-sm font-semibold uppercase tracking-wider text-ink/70">Tools</p>
              <p className="mt-1 text-base text-neutral-700">{study.tools.join(', ')}</p>
            </div>
          </div>
          <PixelWaveDivider particleClassName="bg-ink/15" animated={false} />

          {study.skills && (
            <>
              <SkillsChart skills={study.skills} note={study.skillsNote} />
              <PixelWaveDivider particleClassName="bg-ink/15" animated={false} />
            </>
          )}
          {slug && impactBySlug[slug] && <ImpactCard impact={impactBySlug[slug]} />}

          {/* With a hero, its headline already says what the tagline would. */}
          {!study.hero && <h2 className="font-display mt-10 text-4xl text-ink">{study.tagline}</h2>}
          {study.intro && <p className="mt-4 text-base leading-relaxed sm:text-lg text-neutral-600">{study.intro}</p>}

          {!study.hero && <ImageRow srcs={[study.heroImage]} alt={study.title} className={WIDE} />}

          {study.sections.map((section, i) => (
            // An empty `heading` continues the text above without a
            // headline of its own.
            <m.section {...REVEAL} key={section.heading || i} className="mt-16">
              {section.heading && (
                // A section that starts a chapter is the chapter menu's
                // jump target: scroll-mt clears the fixed Navbar and
                // chapter menu, tabIndex lets the menu move focus here.
                <h2
                  id={section.chapter ? chapterId(section.chapter.title) : undefined}
                  tabIndex={section.chapter ? -1 : undefined}
                  className="font-display scroll-mt-56 text-4xl text-ink outline-none"
                >
                  {section.heading}
                </h2>
              )}
              <div className="mt-4 space-y-6">
                {section.paragraphs.map((block, i) => (
                  <ParagraphContent key={i} block={block} studyTitle={study.title} />
                ))}
              </div>
              {section.quote && (
                <blockquote
                  className={`mt-6 rounded-2xl p-5 text-base leading-relaxed sm:text-lg text-neutral-700 italic ${
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
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed sm:text-lg text-neutral-700">
                  {section.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
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
      {hasChapters && <ChapterNav sections={study.sections} />}
    </div>
  )
}
