// Fill in the real GA4 Measurement ID here once one exists (Google
// Analytics → Admin → Data Streams → your stream → Measurement ID,
// looks like "G-XXXXXXXXXX"). Everything in this file is a no-op until
// this is set — no script gets injected, nothing gets tracked.
export const GA_MEASUREMENT_ID = 'G-7PB4GNGFTG'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function gaDisableKey() {
  return `ga-disable-${GA_MEASUREMENT_ID}`
}

let scriptInjected = false

// Only actually injects the gtag.js script once, on first consent —
// calling this again (e.g. re-accepting after a reject) just re-enables
// tracking via `disableGoogleAnalytics`'s flag rather than injecting a
// second copy of the script.
export function loadGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  ;(window as unknown as Record<string, boolean>)[gaDisableKey()] = false

  if (scriptInjected) return
  scriptInjected = true

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID)
}

// Google's own documented opt-out mechanism — setting this flag stops
// tracking even if the gtag script is already loaded and running, no
// page reload required. This is what makes "change your mind later"
// actually work instantly instead of only affecting the next visit.
export function disableGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  ;(window as unknown as Record<string, boolean>)[gaDisableKey()] = true
}
