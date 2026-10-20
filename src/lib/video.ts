import { useEffect, useRef } from 'react'

// React sets `muted` as a property, not an attribute — Safari/iOS only
// allow autoplay when the real attribute is present, so set it by hand.
export function setMutedAttribute(el: HTMLVideoElement | null) {
  if (el) el.setAttribute('muted', '')
}

export function posterFor(src: string) {
  return src.replace(/\.mp4$/, '-poster.webp')
}

export function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

function playMuted(el: HTMLVideoElement) {
  setMutedAttribute(el)
  el.muted = true
  el.play().catch(() => {})
}

// Ambient muted preview: plays while at least 30% of `targetRef` is on
// screen and pauses once it scrolls away. Videos using this are
// `preload="none"` with no `autoPlay`, so nothing downloads until a
// video actually comes into view (previously every preview on the
// homepage, ~1.3MB, downloaded on first load, even on phones). Under
// `prefers-reduced-motion` nothing starts on its own; only the poster
// shows, and `play` (wired to hover/focus) still lets a visitor start it.
export function useInViewVideo<T extends Element>() {
  const targetRef = useRef<T>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const target = targetRef.current
    const video = videoRef.current
    if (!target || !video || prefersReducedMotion()) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) playMuted(video)
        else video.pause()
      },
      { threshold: 0.3 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el
    setMutedAttribute(el)
  }
  const play = () => {
    if (videoRef.current) playMuted(videoRef.current)
  }

  return { targetRef, setVideoRef, play }
}
