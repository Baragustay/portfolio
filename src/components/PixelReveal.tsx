import { useEffect, useRef, useState } from 'react'

// Entrance effect: a "sand grain" pixel dissolve. A grid fine enough to
// read as sand means low hundreds of thousands of individual cells
// across a bento grid that can run several thousand px tall — one DOM
// node + one CSS animation per cell doesn't scale to that count. A
// `<canvas>` does: it's drawn solid, then cleared in small random
// squares over time via `clearRect`, which is just arithmetic + canvas
// calls, not DOM nodes, so the grain size is free to be genuinely tiny
// without a performance cliff.
const CELL_SIZE = 3 // px — the "grain" size
const DEFAULT_DURATION_MS = 550

export default function PixelReveal({
  children,
  delay = 0,
  duration = DEFAULT_DURATION_MS,
  label,
  revealFrom = 'random',
}: {
  children: React.ReactNode
  delay?: number
  // Per-instance override, e.g. a slower dissolve for the About page's
  // photo strip without changing the homepage's default speed.
  duration?: number
  // Optional loading-style label shown centered on screen while the
  // canvas is still solid, fading out the instant the grain starts
  // resolving. Opt-in (only `Home.tsx` passes one) rather than baked
  // into the component.
  label?: string
  // 'center': cells resolve outward from the middle instead of in pure
  // random order — used on the About page's photo strip, where the
  // composition itself already converges on the center (color) photo
  // with grayscale fading outward on both sides, so the reveal direction
  // echoes that instead of reusing the homepage's fully random dissolve.
  revealFrom?: 'random' | 'center'
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [done, setDone] = useState(false)
  const [revealStarted, setRevealStarted] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let cancelled = false

    const dpr = window.devicePixelRatio || 1
    const width = container.clientWidth
    const height = container.clientHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const pageBg =
      getComputedStyle(document.documentElement).getPropertyValue('--color-page-bg').trim() || '#171716'
    ctx.fillStyle = pageBg
    ctx.fillRect(0, 0, width, height)

    const cols = Math.ceil(width / CELL_SIZE)
    const rows = Math.ceil(height / CELL_SIZE)
    const cellCount = cols * rows
    let cellIndexes: Uint32Array | number[]

    if (revealFrom === 'center') {
      // Sort by distance-from-center plus a little random jitter (so it
      // still reads as grain, not a perfectly circular wipe) instead of
      // a uniform shuffle.
      const centerX = cols / 2
      const centerY = rows / 2
      const maxDist = Math.hypot(centerX, centerY) || 1
      const keys = new Float64Array(cellCount)
      const order = new Array<number>(cellCount)
      for (let i = 0; i < cellCount; i++) {
        const x = i % cols
        const y = Math.floor(i / cols)
        const dist = Math.hypot(x - centerX, y - centerY) / maxDist
        keys[i] = dist + (Math.random() - 0.5) * 0.15
        order[i] = i
      }
      order.sort((a, b) => keys[a] - keys[b])
      cellIndexes = order
    } else {
      const indexes = new Uint32Array(cellCount)
      for (let i = 0; i < cellCount; i++) indexes[i] = i
      // Fisher-Yates — a random reveal order is what makes this read as
      // grain dissolving rather than a wipe sweeping across in one
      // direction.
      for (let i = cellCount - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const tmp = indexes[i]
        indexes[i] = indexes[j]
        indexes[j] = tmp
      }
      cellIndexes = indexes
    }

    // Gate the whole reveal (dissolve + label) on the actual `<img>`s
    // inside this content having finished loading, not just a fixed
    // timer — so a slow connection keeps the "loading" state visible
    // for as long as it's genuinely still loading. `window`'s own
    // `load` event doesn't work for this: in a client-rendered SPA, by
    // the time React has mounted `children` (and this effect can even
    // run), `load` has typically already fired against the *initial*
    // document/script tags — it doesn't retroactively wait for images
    // React injects afterward. Checking each image's own `.complete`
    // state (and listening for `load`/`error` on the ones still
    // pending) ties this directly to the real images being revealed.
    // Verified by stalling one image request indefinitely via route
    // interception and confirming the reveal simply never proceeds past
    // the solid black state until it resolves.
    const imgs = Array.from(container.querySelectorAll('img'))
    let pendingImages = imgs.filter((img) => !img.complete).length
    let imagesReady = pendingImages === 0
    const handleImgSettled = () => {
      pendingImages -= 1
      if (pendingImages <= 0) imagesReady = true
    }
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', handleImgSettled)
        img.addEventListener('error', handleImgSettled)
      }
    })

    let startTime: number | null = null
    let revealed = 0
    let hasSignalledStart = false

    const step = (t: number) => {
      if (cancelled) return
      if (!imagesReady) {
        raf = requestAnimationFrame(step)
        return
      }
      if (startTime === null) startTime = t + delay * 1000
      const elapsed = t - startTime
      if (elapsed < 0) {
        raf = requestAnimationFrame(step)
        return
      }
      if (!hasSignalledStart) {
        hasSignalledStart = true
        setRevealStarted(true)
      }
      const progress = Math.min(1, elapsed / duration)
      const targetRevealed = Math.floor(progress * cellCount)
      for (; revealed < targetRevealed; revealed++) {
        const idx = cellIndexes[revealed]
        const cx = (idx % cols) * CELL_SIZE
        const cy = Math.floor(idx / cols) * CELL_SIZE
        ctx.clearRect(cx, cy, CELL_SIZE, CELL_SIZE)
      }
      if (progress >= 1) {
        setDone(true)
        return
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      imgs.forEach((img) => {
        img.removeEventListener('load', handleImgSettled)
        img.removeEventListener('error', handleImgSettled)
      })
    }
  }, [delay, duration, revealFrom])

  return (
    <div ref={containerRef} className="relative">
      {children}
      {!done && <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" />}
      {!done && label && (
        <div
          aria-hidden
          className={`pointer-events-none fixed inset-0 z-30 flex items-center justify-center transition-opacity duration-300 ${
            revealStarted ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <p className="font-pixel text-sm uppercase tracking-[0.3em] text-white/70">{label}</p>
        </div>
      )}
    </div>
  )
}
