import { useRef, useState } from 'react'

// Design-evolution carousel for case studies — used to step through a
// run of annotated screenshots showing how a design changed across
// iterations. Unlike `ImageRow` (which lays multiple images out side by
// side in a justified row), this shows one image at a time with
// prev/next arrows + dot indicators, since the point is stepping
// through a sequence in order rather than viewing them all at once.
//
// Scroll-snap + native horizontal scroll (not a transform/translate
// approach) so swiping on mobile works for free, and the arrow buttons
// just call `scrollTo` on the same container instead of needing their
// own separate state machine to stay in sync with touch gestures.
export default function Carousel({ items }: { items: { src: string; caption?: string }[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const scrollToIndex = (i: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(items.length - 1, i))
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' })
    setIndex(clamped)
  }

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    setIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  return (
    <div className="relative mt-8">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl ring-1 ring-ink/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={item.src} className="w-full shrink-0 snap-start bg-neutral-50">
            <img src={item.src} alt={item.caption ?? ''} loading="lazy" decoding="async" className="w-full object-contain" />
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollToIndex(index - 1)}
            disabled={index === 0}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow ring-1 ring-ink/10 transition-opacity hover:bg-white disabled:opacity-0"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollToIndex(index + 1)}
            disabled={index === items.length - 1}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow ring-1 ring-ink/10 transition-opacity hover:bg-white disabled:opacity-0"
          >
            →
          </button>
          <div className="mt-3 flex items-center justify-center gap-2">
            {items.map((item, i) => (
              <button
                key={item.src}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollToIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-ink' : 'w-2 bg-ink/20'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
