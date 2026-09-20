// Decorative background: a full-bleed grid of cells, invisible at rest,
// each one lighting up under the cursor — recreating the feel of
// Framer's "Grid Hover Effect" marketplace component in plain CSS (no
// JS mouse-tracking needed for a per-cell hover highlight).
//
// Sits absolutely behind the section's real content — the section
// itself must give its content wrapper `relative z-10` so text stays on
// top and clickable; the grid only intercepts hover in the empty space
// around it.
//
// Small cells (32px) and a long hold-then-fade: smaller cells mean the
// mouse crosses more of them per movement (finer, more responsive-
// feeling coverage); the long hold means a "drawn" trail of lit cells
// stays visible long enough to actually look at, instead of fading
// almost as fast as you move on. `CELL_COUNT` is high enough to fully
// tile a typical sidebar-height section at that cell size.
const CELL_COUNT = 700

export default function GridHoverBackground({
  hoverClassName = 'hover:bg-hover-pink',
}: {
  // Hover color as a full utility class rather than hardcoded, since
  // different pages want different hover colors on this same component
  // (e.g. the homepage sidebar uses a dark warm-brown instead of the
  // default pink). Tailwind's arbitrary-value syntax (`hover:bg-
  // [#282622]`) works fine passed in this way since Tailwind scans all
  // source files for literal class-name strings regardless of which
  // file interpolates them into a className at runtime.
  hoverClassName?: string
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid h-full w-full auto-rows-[32px] grid-cols-[repeat(auto-fill,minmax(32px,1fr))]">
        {Array.from({ length: CELL_COUNT }).map((_, i) => (
          <div
            key={i}
            aria-hidden="true"
            // Snappy on the way in (no delay, quick fade to the hover
            // color), but a long hold before slowly fading back to the
            // base state on the way out — long enough to actually see
            // what you drew.
            className={`pointer-events-auto border border-transparent transition-colors delay-[1200ms] duration-[1500ms] ease-in-out hover:delay-0 hover:duration-150 ${hoverClassName}`}
          />
        ))}
      </div>
    </div>
  )
}
