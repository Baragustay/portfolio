// Pixel-art icon accents, matching the game's own 8-bit look. Built from
// square `<rect>` cells (not smooth paths) with `shapeRendering=
// "crispEdges"` to keep block edges sharp instead of anti-aliased.
//
// Earlier revisions of this file also had hand-drawn "wobbly ink stroke"
// doodles (an arrow, a star, an underline, a circle) and a Framer-sourced
// clover/blob vector, from before the site settled on the pixel-icon
// language used everywhere now (bento grid open arrows, the Home house,
// the game's own arrow, the video play button) — removed since none of
// them were referenced anywhere once `PixelArrow`/`PixelPlay` took over
// those spots.

type DoodleProps = { className?: string }

// Blocky house (roof, chimney, door and window cut out) for the Navbar's
// "Home" link. 11x11 cells, so render it at a multiple of 11px (e.g. 22px)
// for crisp 2px pixels.
const HOUSE_ROWS = [
  '.....#.....',
  '....###.#..',
  '...######..',
  '..#######..',
  '.#########.',
  '###########',
  '..#######..',
  '..####..#..',
  '..#..#..#..',
  '..#..####..',
  '..#..####..',
]

export function PixelHouse({ className }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 11 11" fill="currentColor" shapeRendering="crispEdges" className={className}>
      {HOUSE_ROWS.flatMap((row, y) =>
        [...row].map((cell, x) => (cell === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)),
      )}
    </svg>
  )
}

// Blocky gamepad (d-pad and two buttons cut out) for the Navbar's game
// link. 13x7 cells.
const GAMEPAD_ROWS = [
  '..#########..',
  '.###########.',
  '###.######.##',
  '##...####.###',
  '###.#########',
  '#############',
  '####.....####',
]

export function PixelGamepad({ className }: DoodleProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 13 7" fill="currentColor" shapeRendering="crispEdges" className={className}>
      {GAMEPAD_ROWS.flatMap((row, y) =>
        [...row].map((cell, x) => (cell === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)),
      )}
    </svg>
  )
}

// Points right by default; rotate via `className` (e.g. `-rotate-45`,
// `rotate-180`) for other directions. Used for the game's pointer, the
// bento grid's "open" arrows and the Code page's "View live/code" arrows.
export function PixelArrow({ className }: DoodleProps) {
  const cells: [number, number][] = [
    [4, 0],
    [4, 1], [5, 1],
    [4, 2], [5, 2], [6, 2],
    [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
    [4, 4], [5, 4], [6, 4],
    [4, 5], [5, 5],
    [4, 6],
  ]
  return (
    // `preserveAspectRatio="none"` lets the shape stretch instead of the
    // default "meet" behavior padding extra width with empty space —
    // that's what lets a wider className actually elongate the arrow
    // rather than just letterboxing it.
    <svg aria-hidden="true" focusable="false"
      viewBox="0 0 9 7"
      preserveAspectRatio="none"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
    >
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
      ))}
    </svg>
  )
}

// Blocky pixel-art play triangle, same technique as `PixelArrow` above.
// Replaces a plain "▶" text glyph in `VideoSquare`.
export function PixelPlay({ className }: DoodleProps) {
  const cells: [number, number][] = [
    [1, 0],
    [1, 1], [2, 1],
    [1, 2], [2, 2], [3, 2],
    [1, 3], [2, 3], [3, 3], [4, 3],
    [1, 4], [2, 4], [3, 4],
    [1, 5], [2, 5],
    [1, 6],
  ]
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 6 7" fill="currentColor" shapeRendering="crispEdges" className={className}>
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
      ))}
    </svg>
  )
}
