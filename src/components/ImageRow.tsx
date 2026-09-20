import { useEffect, useRef, useState } from 'react'

// Case-study content images. 489px is a *target* height, not just a
// ceiling — a single image renders at exactly 489px tall unless the
// column is too narrow for that. Multiple images on one line must all
// land together, scaled down by the same factor so they stay
// proportionate to each other — never wrapped to a second row and never
// stretched past their own aspect ratio. That's a real "justified row"
// layout (like a photo-gallery justified grid): given each image's own
// aspect ratio and the container's actual width, solve for the one
// shared height where `sum(height * aspectRatio) + gaps ===
// containerWidth`. CSS alone can't solve that system, so this measures
// each image's natural size on load and the container's width via
// `ResizeObserver`, then computes it in JS.
const DEFAULT_MAX_HEIGHT = 489
const GAP = 16

export default function ImageRow({
  srcs,
  alt = '',
  maxHeight = DEFAULT_MAX_HEIGHT,
}: {
  srcs: string[]
  alt?: string
  // Per-instance override of the target/ceiling height described above,
  // for a specific image that should render smaller than the default.
  maxHeight?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ratios, setRatios] = useState<number[] | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Keyed on the joined URLs, not `srcs` itself — call sites like
  // `<ImageRow srcs={[study.heroImage]} />` pass a brand-new array
  // literal on every render, which would otherwise re-run the
  // measurement effect below (and re-fetch every image's natural size)
  // on every re-render even when the actual list of URLs hasn't changed.
  const srcsKey = srcs.join('|')

  useEffect(() => {
    let cancelled = false
    Promise.all(
      srcs.map(
        (src) =>
          new Promise<number>((resolve) => {
            const img = new Image()
            img.onload = () => resolve(img.naturalWidth / img.naturalHeight || 1)
            img.onerror = () => resolve(1)
            img.src = src
          }),
      ),
    ).then((loaded) => {
      if (!cancelled) setRatios(loaded)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally keyed on srcsKey, see above
  }, [srcsKey])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) setContainerWidth(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  let height = maxHeight
  if (ratios && containerWidth > 0) {
    const totalGap = GAP * (srcs.length - 1)
    const sumRatios = ratios.reduce((sum, r) => sum + r, 0)
    const fitHeight = (containerWidth - totalGap) / sumRatios
    height = Math.min(maxHeight, fitHeight)
  }

  return (
    <div ref={containerRef} className="mt-6 flex flex-wrap items-center justify-center" style={{ gap: GAP }}>
      {srcs.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          style={{ height, width: ratios ? height * ratios[i] : undefined }}
          className="block max-w-full"
        />
      ))}
    </div>
  )
}
