// Small pixel-art cookie icon for the cookie consent banner — same
// blocky `<rect>`/`crispEdges` technique as `PixelArrow`/`PixelPlay`/
// `PixelCatWarrior`. The body uses `currentColor` (set via the parent's
// text color class) so it can pick up the site's accent color; the chip
// dots stay a fixed darker tone for contrast against it.
const BODY_CELLS: [number, number, number, number][] = [
  [4, 0, 8, 1],
  [2, 1, 12, 1],
  [1, 2, 14, 1],
  [0, 3, 16, 10],
  [1, 13, 14, 1],
  [2, 14, 12, 1],
  [4, 15, 8, 1],
]
const CHIP_CELLS: [number, number, number, number][] = [
  [3, 4, 2, 2],
  [9, 3, 2, 2],
  [12, 6, 2, 2],
  [4, 9, 2, 2],
  [8, 11, 2, 2],
  [11, 10, 2, 2],
  [6, 6, 2, 2],
]

export default function PixelCookie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className}>
      {BODY_CELLS.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill="currentColor" />
      ))}
      {CHIP_CELLS.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill="#4a2e14" />
      ))}
    </svg>
  )
}
