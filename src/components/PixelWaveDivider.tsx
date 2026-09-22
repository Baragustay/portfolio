import { useEffect, useMemo, useRef, useState } from 'react'

// Horizontal divider built from small square particles instead of a
// plain `border-t` line — plays a wave (each particle hops, roughly
// left-to-right but with random jitter so it's never identical twice,
// then settles flat) the first time it scrolls into view, and again
// on hover. Pass `animated={false}` for the same pixelated look with
// none of that (e.g. CaseStudyPage.tsx's meta-row rules, which just
// need to read as a divider, not draw attention with motion).
const PARTICLE_PX = 3
const GAP_PX = 2
const BASE_STAGGER_MS = 9
const HOP_MS = 650

export default function PixelWaveDivider({
  className = '',
  particleClassName = 'bg-white/20',
  animated = true,
  entranceDelayMs = 0,
}: {
  className?: string
  // Tailwind background-color utility for each particle — the default
  // (`bg-white/20`) only reads on the site's dark-background pages;
  // light pages (like a case study) need something like `bg-ink/15`.
  particleClassName?: string
  animated?: boolean
  // Extra delay before the viewport-entrance trigger actually starts
  // the wave (hover is unaffected — always instant). Two dividers
  // close enough together that a fast scroll brings both into view
  // in the same frame would otherwise both fire at once and look
  // like a synchronized pair instead of two independent lines; give
  // the second one a small offset (e.g. 150) to break that up.
  entranceDelayMs?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [waveKey, setWaveKey] = useState(0)
  // Starts `false` — particles render as plain static squares (no
  // `animate-pixel-wave` class) until the first trigger, so nothing
  // plays before this divider has actually been seen.
  const [hasPlayed, setHasPlayed] = useState(false)
  const animatingRef = useRef(false)

  // Particle count is derived from the container's own real width
  // (not a fixed number) so the squares actually tile edge-to-edge —
  // a fixed count either left big gaps on a wide desktop screen or
  // overflowed a narrow one, since `justify-between` only spreads
  // whatever count it's given across however much space exists.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => setCount(Math.max(10, Math.floor(el.clientWidth / (PARTICLE_PX + GAP_PX))))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Recomputed on every `waveKey` change (each trigger), so the
  // wave's timing and hop height are freshly randomized each time
  // instead of replaying the exact same mechanical sweep.
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        delay: i * BASE_STAGGER_MS + (Math.random() * 10 - 5),
        duration: HOP_MS + (Math.random() * 160 - 80),
        up: -(3 + Math.random() * 4),
        down: 1 + Math.random() * 2.5,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally re-rolls on waveKey
    [count, waveKey],
  )

  const totalMs = HOP_MS + count * BASE_STAGGER_MS

  // Once a wave starts, it always plays through to completion — a
  // re-trigger while one is already running is ignored instead of
  // restarting it, so leaving (or re-entering, or scrolling past and
  // back) partway through can never cut it short. `animatingRef` is
  // claimed immediately (even before an `entranceDelayMs` wait), so a
  // hover during that wait can't double-trigger it either.
  const triggerWave = (delayMs = 0) => {
    if (animatingRef.current) return
    animatingRef.current = true
    window.setTimeout(
      () => {
        setHasPlayed(true)
        setWaveKey((k) => k + 1)
      },
      Math.max(0, delayMs),
    )
    window.setTimeout(() => {
      animatingRef.current = false
    }, delayMs + totalMs)
  }

  // Plays once, the first time this divider actually scrolls into
  // the viewport — not on mount, which would mean anything below the
  // fold (most of these, on a long page) had already finished
  // animating off-screen before there was ever a chance to see it.
  useEffect(() => {
    if (!animated) return
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggerWave(entranceDelayMs)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only ever needs to run once
  }, [animated, entranceDelayMs])

  return (
    // `py-3 -my-3`: the real hoverable area is padded well past the
    // particles' own 3px height, then pulled back with an equal
    // negative margin so surrounding layout doesn't shift — without
    // this, both a "just slightly off" hover and a fast swipe across
    // the line (easy to skip a 3px target between mouse-position
    // samples) routinely missed it entirely.
    <div
      ref={containerRef}
      className={`-my-3 flex items-center py-3 ${className}`}
      style={{ gap: GAP_PX }}
      onMouseEnter={animated ? () => triggerWave() : undefined}
    >
      {particles.map((p, i) => (
        <span
          key={`${waveKey}-${i}`}
          aria-hidden
          className={`shrink-0 ${particleClassName} ${hasPlayed ? 'animate-pixel-wave' : ''}`}
          style={
            {
              width: PARTICLE_PX,
              height: PARTICLE_PX,
              animationDelay: `${p.delay}ms`,
              animationDuration: `${p.duration}ms`,
              '--wave-up': `${p.up}px`,
              '--wave-down': `${p.down}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
