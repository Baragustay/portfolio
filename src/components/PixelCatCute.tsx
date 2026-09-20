// Small, cute sitting pixel-art cat for the privacy policy page — same
// blocky `<rect>`/`crispEdges` technique as `PixelArrow`/`PixelPlay`/
// `PixelCatWarrior`, but a friendlier chibi pose (big round head, big
// close-set eyes, curled tail) instead of the 404 page's warrior stance.
// Ears are kept as two separate triangles with a visible notch between
// them — tapering both all the way to a shared point (like the warrior
// cat's ears) reads as one jagged zigzag at this smaller, rounder scale.
const EAR_CELLS: [number, number, number, number][] = [
  [10, 1, 2, 1],
  [9, 2, 4, 1],
  [8, 3, 6, 1],
  [8, 4, 6, 1],
  [8, 5, 6, 1],
  [20, 1, 2, 1],
  [19, 2, 4, 1],
  [18, 3, 6, 1],
  [18, 4, 6, 1],
  [18, 5, 6, 1],
]
const HEAD_CELLS: [number, number, number, number][] = [
  [9, 6, 14, 1],
  [7, 7, 18, 12],
  [9, 19, 14, 1],
]
const BODY_CELLS: [number, number, number, number][] = [
  [12, 20, 8, 1],
  [10, 21, 12, 6],
  [12, 27, 8, 1],
  [12, 28, 3, 2],
  [17, 28, 3, 2],
]
const TAIL_CELLS: [number, number, number, number][] = [
  [22, 24, 2, 2],
  [24, 22, 2, 2],
  [25, 20, 2, 2],
  [25, 17, 2, 2],
  [24, 15, 2, 2],
]
// Big round white "sclera" behind a small centered dark pupil (instead
// of one solid tall dark bar) — a solid elongated eye read as
// sleepy/sad, this wide-eyed look reads as cute/alert.
const EYE_BASE_CELLS: [number, number, number, number][] = [
  [11, 10, 4, 5],
  [17, 10, 4, 5],
]
const EYE_PUPIL_CELLS: [number, number, number, number][] = [
  [12, 11, 2, 3],
  [18, 11, 2, 3],
]
const EYE_HIGHLIGHT_CELLS: [number, number, number, number][] = [
  [12, 11, 1, 1],
  [19, 11, 1, 1],
]
const NOSE_CELLS: [number, number, number, number][] = [[15, 16, 2, 1]]
// A "u"-shaped smile: corners sit higher up (near the nose), the center
// dips a row lower — two flat dots at the same row read as a neutral/sad
// mouth, this curve reads as smiling.
const MOUTH_CELLS: [number, number, number, number][] = [
  [14, 17, 1, 1],
  [17, 17, 1, 1],
  [15, 18, 2, 1],
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

export default function PixelCatCute({
  className,
  bodyColor = '#e1b8ba',
}: {
  className?: string
  bodyColor?: string
}) {
  return (
    <svg viewBox="0 0 32 32" shapeRendering="crispEdges" className={className}>
      <Blocks cells={TAIL_CELLS} color={bodyColor} />
      <Blocks cells={BODY_CELLS} color={bodyColor} />
      <Blocks cells={EAR_CELLS} color={bodyColor} />
      <Blocks cells={HEAD_CELLS} color={bodyColor} />
      <Blocks cells={EYE_BASE_CELLS} color="#f0eee9" />
      <Blocks cells={EYE_PUPIL_CELLS} color="#1d2b2b" />
      <Blocks cells={EYE_HIGHLIGHT_CELLS} color="#f0eee9" />
      <Blocks cells={NOSE_CELLS} color="#1d2b2b" />
      <Blocks cells={MOUTH_CELLS} color="#1d2b2b" />
    </svg>
  )
}
