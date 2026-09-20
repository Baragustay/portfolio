// Large pixel-art black cat warrior holding a raised sword, for the 404
// page. Same blocky `<rect>`/`crispEdges` technique as `PixelArrow`/
// `PixelPlay` in Doodles.tsx, just a bigger composition — each entry is
// one rectangular block `[x, y, width, height]` on a shared grid, grouped
// by color so the whole shape is ~47 rects instead of one per pixel.
const CAT_CELLS: [number, number, number, number][] = [
  [19, 0, 1, 1],
  [18, 1, 3, 1],
  [17, 2, 5, 1],
  [16, 3, 7, 1],
  [15, 4, 9, 1],
  [30, 0, 1, 1],
  [29, 1, 3, 1],
  [28, 2, 5, 1],
  [27, 3, 7, 1],
  [26, 4, 9, 1],
  [16, 5, 9, 2],
  [27, 5, 9, 2],
  [16, 7, 20, 11], // head
  [18, 18, 16, 3], // neck/shoulders
  [17, 21, 18, 10], // torso
  [34, 21, 4, 8], // arm at side
  [17, 21, 3, 3], // raised arm, shoulder to paw
  [16, 20, 3, 3],
  [15, 19, 3, 3],
  [14, 18, 3, 3],
  [13, 17, 3, 3],
  [19, 31, 6, 8], // legs
  [27, 31, 6, 8],
  [18, 39, 8, 1], // feet
  [26, 39, 8, 1],
  [35, 29, 3, 3], // tail
  [37, 28, 3, 3],
  [39, 26, 3, 3],
  [40, 24, 3, 3],
  [40, 21, 3, 3],
  [39, 19, 3, 3],
]
const EYE_CELLS: [number, number, number, number][] = [
  [20, 11, 2, 2],
  [29, 11, 2, 2],
]
const HILT_CELLS: [number, number, number, number][] = [
  [12, 16, 2, 2],
  [11, 15, 2, 2],
  [9, 16, 6, 2],
]
const BLADE_CELLS: [number, number, number, number][] = [
  [10, 14, 2, 2],
  [9, 13, 2, 2],
  [8, 12, 2, 2],
  [7, 11, 2, 2],
  [6, 10, 2, 2],
  [5, 9, 2, 2],
  [4, 8, 2, 2],
  [3, 7, 2, 2],
  [2, 6, 2, 2],
  [1, 5, 2, 2],
  [0, 4, 2, 2],
]

function Blocks({ cells, color }: { cells: [number, number, number, number][]; color: string }) {
  return (
    <>
      {cells.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill={color} />
      ))}
    </>
  )
}

export default function PixelCatWarrior({
  className,
  bodyColor = '#2f2f2f',
}: {
  className?: string
  // Default tuned for the 404 page's `bg-page-bg` (near-black) — a
  // lighter override is needed on darker card backgrounds where that
  // default would nearly disappear.
  bodyColor?: string
}) {
  return (
    <svg viewBox="0 0 43 40" shapeRendering="crispEdges" className={className}>
      <Blocks cells={BLADE_CELLS} color="#d8dde3" />
      <Blocks cells={HILT_CELLS} color="#6b4226" />
      <Blocks cells={CAT_CELLS} color={bodyColor} />
      <Blocks cells={EYE_CELLS} color="#f7d046" />
    </svg>
  )
}
