import { useRef, useState } from 'react'

// Design-evolution carousel for case studies — used to step through a
// run of annotated screenshots showing how a design changed across
// iterations. Unlike `ImageRow` (which lays multiple images out side by
// side in a justified row), this shows one image at a time with
// prev/next arrows, version tabs and a visible caption, since the point is stepping
// through a sequence in order rather than viewing them all at once.
//
// Scroll-snap + native horizontal scroll (not a transform/translate
// approach) so swiping on mobile works for free, and the arrow buttons
// just call `scrollTo` on the same container instead of needing their
// own separate state machine to stay in sync with touch gestures.

// Captions written as "v2: what changed" are split into a short version
// label ("v2", used on the version tabs) and the description shown under
// the image.
function splitCaption(caption: string | undefined, i: number) {
  const match = caption?.match(/^(v\d+):\s*(.*)$/)
  return match ? { label: match[1], text: match[2] } : { label: String(i + 1), text: caption ?? '' }
}

export default function Carousel({ items }: { items: { src: string; caption?: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  // The slide a tab or arrow is scrolling to. Until the track arrives
  // there, scroll events are ignored, so the tabs and caption don't flick
  // through every slide in between.
  const targetRef = useRef<number | null>(null)
  const slides = items.map((item, i) => ({ ...item, ...splitCaption(item.caption, i) }))
  const current = slides[index]

  const scrollToIndex = (i: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(items.length - 1, i))
    targetRef.current = clamped
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' })
    setIndex(clamped)
  }

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const at = Math.round(track.scrollLeft / track.clientWidth)
    if (targetRef.current !== null) {
      if (at === targetRef.current) targetRef.current = null
      return
    }
    setIndex(at)
  }

  // Hidden on phones, where they would cover the annotations: swiping
  // and the version tabs do the same job there.
  const arrowClass =
    'absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl text-ink shadow-lg ring-1 ring-ink/10 transition-[opacity,transform] hover:scale-105 disabled:pointer-events-none disabled:opacity-0 sm:flex'

  return (
    <div className="mt-4">
      {/* Version tabs: which iteration is showing, and how many there are. */}
      {items.length > 1 && (
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show version ${i + 1} of ${items.length}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => scrollToIndex(i)}
              className={`min-w-11 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                i === index ? 'bg-ink text-white' : 'bg-ink/5 text-ink/70 hover:bg-ink/10'
              }`}
            >
              {slide.label}
            </button>
          ))}
        </div>
      )}

      {/* What changed in this version, right under its tab. Space for two
          lines is kept, so the image doesn't jump between captions of
          different lengths. Announced after tab or arrow navigation. */}
      {current?.text && (
        <p className="mx-auto mb-4 max-w-2xl text-center text-base text-neutral-700 sm:min-h-12" aria-live="polite">
          {items.length > 1 && (
            <span className="font-semibold text-ink">
              Version {index + 1} of {items.length}:{' '}
            </span>
          )}
          {current.text}
        </p>
      )}

      <div className="relative">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          role="region"
          aria-roledescription="carousel"
          aria-label="Image carousel"
          className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl bg-neutral-50 ring-1 ring-ink/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              // Off-screen slides hidden from screen readers so they read
              // only the one actually showing.
              aria-hidden={i !== index}
              // Capped at ~60% of the screen height, so the image, the
              // tabs and the caption fit on one screen together.
              className="flex h-[min(60vh,560px)] w-full shrink-0 snap-start items-center justify-center p-4"
            >
              <img src={slide.src} alt={slide.caption ?? ''} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button type="button" aria-label="Previous image" onClick={() => scrollToIndex(index - 1)} disabled={index === 0} className={`${arrowClass} left-3`}>
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => scrollToIndex(index + 1)}
              disabled={index === items.length - 1}
              className={`${arrowClass} right-3`}
            >
              <span aria-hidden="true">→</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
