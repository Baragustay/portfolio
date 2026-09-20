// Small pixel-art cookie icon for the cookie consent banner — same
// blocky `<rect>`/`crispEdges` technique as `PixelArrow`/`PixelPlay`/
// `PixelCatWarrior`. Colors are fixed (light-brown dough, darker-brown
// chips/crumbs) rather than `currentColor`, so the icon reads as an
// actual cookie regardless of what background it sits on.
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
// Smaller loose crumbs, both scattered inside the dough and a few
// spilling past the cookie's own edge (below its base) for a "crumbs
// falling off" look.
const CRUMB_CELLS: [number, number, number, number][] = [
  [7, 2, 1, 1],
  [13, 9, 1, 1],
  [2, 8, 1, 1],
  [10, 13, 1, 1],
  [3, 17, 1, 1],
  [7, 17, 1, 1],
  [12, 17, 1, 1],
]

const DOUGH = '#d9a066'
const CHOCOLATE = '#4a2e14'

export default function PixelCookie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 18" shapeRendering="crispEdges" className={className}>
      {BODY_CELLS.map(([x, y, w, h]) => (
        <rect key={`body-${x}-${y}`} x={x} y={y} width={w} height={h} fill={DOUGH} />
      ))}
      {CHIP_CELLS.map(([x, y, w, h]) => (
        <rect key={`chip-${x}-${y}`} x={x} y={y} width={w} height={h} fill={CHOCOLATE} />
      ))}
      {CRUMB_CELLS.map(([x, y, w, h]) => (
        <rect key={`crumb-${x}-${y}`} x={x} y={y} width={w} height={h} fill={CHOCOLATE} />
      ))}
    </svg>
  )
}
