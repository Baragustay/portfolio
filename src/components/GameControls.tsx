// A small "how to play" visual for the "Catch a Fact" game. Built as
// blocky retro keycaps (square corners, thick border, hard offset
// shadow standing in for a pixel-art bevel) rather than hand-drawn
// raster pixel art for each glyph — `font-display` (Pixelify Sans)
// already renders the ← → and "SPACE" characters with a chunky, blocky
// look consistent with the game's own 8-bit style.
function KeyCap({ children, wide }: { children: string; wide?: boolean }) {
  return (
    <span
      className={`font-display inline-flex h-10 items-center justify-center border-2 border-white/70 bg-white/10 px-2 text-sm text-white shadow-[3px_3px_0_rgba(255,255,255,0.35)] ${
        wide ? 'min-w-[92px]' : 'min-w-[40px]'
      }`}
    >
      {children}
    </span>
  )
}

export default function GameControls({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ''}`}>
      <KeyCap>←</KeyCap>
      <KeyCap>→</KeyCap>
      <span className="text-xs font-medium uppercase tracking-wide text-white/50">move</span>
      <KeyCap wide>Space</KeyCap>
      <span className="text-xs font-medium uppercase tracking-wide text-white/50">catch</span>
    </div>
  )
}
