// React's JSX `muted` prop only ever sets the DOM *property*, never the
// real HTML *attribute* — confirmed by inspecting a rendered video's
// `outerHTML` directly (it had `autoplay=""`/`playsinline=""` present
// but no `muted` at all). Some browsers' autoplay policies (Safari in
// particular) check for the attribute specifically, so `el.muted = true`
// alone isn't reliable even though it reads back as `true` in JS.
//
// Call this from a `ref` *callback*, not `useEffect` — a callback runs
// the instant the DOM node is created, during React's commit, which is
// earlier than an effect (only runs after paint) and can matter for
// whether the browser considers autoplay eligibility met in time.
export function setMutedAttribute(el: HTMLVideoElement | null) {
  if (el) el.setAttribute('muted', '')
}

// Every video under /work/videos has a still frame saved next to it as
// `<name>-poster.webp`, shown until the video has loaded — and for good
// wherever autoplay is refused (Safari "Never Auto-Play", Low Power
// Mode), instead of an empty tile. Add one alongside any new video.
export function posterFor(src: string) {
  return src.replace(/\.mp4$/, '-poster.webp')
}
