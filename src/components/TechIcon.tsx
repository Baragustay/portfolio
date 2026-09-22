// Small pixel-art glyphs for CodePage.tsx's project tiles, replacing a
// plain solid-color dot next to each project's language/framework name.
// Rather than hand-plotting each shape cell-by-cell (error-prone to get
// actually recognizable), these are generated from real geometry —
// React's three rotated orbit ellipses around a nucleus, regular
// polygons for the hexagon (Node) and shield badges (Angular, HTML) —
// then rasterized onto a grid. Fine enough (16x16) to still read as the
// real shape at ~18px, not just a blob, while staying in the site's own
// blocky pixel-art style (same `<rect>`-grid technique as the game's
// SVG icons, not a raster image).
const GRID_SIZE = 16

function emptyGrid(size: number): boolean[][] {
  return Array.from({ length: size }, () => Array(size).fill(false))
}

// React's actual logo: a small solid nucleus with three thin elliptical
// orbit rings crossing through it, each rotated 60° from the last.
function buildAtomGrid(): boolean[][] {
  const grid = emptyGrid(GRID_SIZE)
  const c = (GRID_SIZE - 1) / 2
  const a = GRID_SIZE * 0.46 // orbit semi-major axis
  const b = GRID_SIZE * 0.17 // orbit semi-minor axis
  for (const deg of [0, 60, 120]) {
    const rad = (deg * Math.PI) / 180
    for (let t = 0; t < 360; t += 1.5) {
      const theta = (t * Math.PI) / 180
      const ex = a * Math.cos(theta)
      const ey = b * Math.sin(theta)
      const x = Math.round(ex * Math.cos(rad) - ey * Math.sin(rad) + c)
      const y = Math.round(ex * Math.sin(rad) + ey * Math.cos(rad) + c)
      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) grid[y][x] = true
    }
  }
  const nucleusR = GRID_SIZE * 0.1
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (Math.hypot(x - c, y - c) <= nucleusR) grid[y][x] = true
    }
  }
  return grid
}

function pointInPolygon(px: number, py: number, points: [number, number][]): boolean {
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i]
    const [xj, yj] = points[j]
    const crosses = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi
    if (crosses) inside = !inside
  }
  return inside
}

// A filled regular polygon — solid, like a real brand badge, not just
// an outline. `sides: 5` with the bottom vertex pointing straight down
// gives the rounded-top, pointed-bottom shield silhouette both
// Angular's and HTML5's real logos actually use — the single sharp
// downward point reads clearly even filled solid.
function buildPolygonGrid(sides: number, rotationDeg: number): boolean[][] {
  const grid = emptyGrid(GRID_SIZE)
  const c = (GRID_SIZE - 1) / 2
  const r = GRID_SIZE * 0.46
  const points: [number, number][] = Array.from({ length: sides }, (_, i) => {
    const angle = ((360 / sides) * i + rotationDeg) * (Math.PI / 180)
    return [c + r * Math.cos(angle), c + r * Math.sin(angle)]
  })
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (pointInPolygon(x + 0.5, y + 0.5, points)) grid[y][x] = true
    }
  }
  return grid
}

// A regular polygon drawn as an OUTLINE (stroke only) instead of
// filled — a filled hexagon at this resolution just reads as a circle
// (a hexagon's corners are too subtle a departure from round to
// survive being smoothed into a solid low-res fill), but the same
// shape's straight edges and vertices are obvious once only the
// border is drawn. `flatTop: true` rotates so there's a flat edge at
// the top and bottom (Node's real hexagon logo is flat-top, not
// pointy-top).
function buildPolygonOutlineGrid(sides: number, flatTop: boolean): boolean[][] {
  const grid = emptyGrid(GRID_SIZE)
  const c = (GRID_SIZE - 1) / 2
  const r = GRID_SIZE * 0.46
  const rotationDeg = flatTop ? -90 + 180 / sides : -90
  const points: [number, number][] = Array.from({ length: sides }, (_, i) => {
    const angle = ((360 / sides) * i + rotationDeg) * (Math.PI / 180)
    return [c + r * Math.cos(angle), c + r * Math.sin(angle)]
  })
  for (let i = 0; i < sides; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[(i + 1) % sides]
    const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2)
    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      const x = Math.round(x1 + (x2 - x1) * t)
      const y = Math.round(y1 + (y2 - y1) * t)
      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) grid[y][x] = true
    }
  }
  return grid
}

// JavaScript's actual logo: a solid square with a notch cut from the
// bottom-right corner (its signature "folded corner" treatment).
function buildNotchedSquareGrid(): boolean[][] {
  const grid = emptyGrid(GRID_SIZE)
  const inset = 1
  const notch = GRID_SIZE * 0.32
  for (let y = inset; y < GRID_SIZE - inset; y++) {
    for (let x = inset; x < GRID_SIZE - inset; x++) {
      const fromRight = GRID_SIZE - inset - x
      const fromBottom = GRID_SIZE - inset - y
      if (fromRight + fromBottom < notch) continue // clip the corner
      grid[y][x] = true
    }
  }
  return grid
}

const ICON_GRIDS: Record<string, boolean[][]> = {
  react: buildAtomGrid(),
  angular: buildPolygonGrid(5, -90), // point down
  node: buildPolygonOutlineGrid(6, true), // flat-top hexagon outline
  html: buildPolygonGrid(5, -90),
  vanillajs: buildNotchedSquareGrid(),
}

function pickIcon(language: string): boolean[][] {
  const lower = language.toLowerCase()
  if (lower.includes('react')) return ICON_GRIDS.react
  if (lower.includes('angular')) return ICON_GRIDS.angular
  if (lower.includes('node')) return ICON_GRIDS.node
  if (lower.includes('vanilla')) return ICON_GRIDS.vanillajs
  // HTML-led entries ("HTML · SEO", "HTML · CSS · Branding") fall back
  // to the shield badge — HTML5's own logo is a shield too.
  return ICON_GRIDS.html
}

export default function TechIcon({ language, color }: { language: string; color: string }) {
  const grid = pickIcon(language)
  return (
    <svg viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`} shapeRendering="crispEdges" className="h-4 w-4 shrink-0">
      {grid.map((row, y) => row.map((filled, x) => (filled ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} /> : null)))}
    </svg>
  )
}
