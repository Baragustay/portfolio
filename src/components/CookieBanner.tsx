import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getStoredConsent,
  onReopenCookiePreferences,
  setStoredConsent,
  type ConsentValue,
} from '../lib/cookieConsent'
import { disableGoogleAnalytics, loadGoogleAnalytics } from '../lib/analytics'
import PixelCookie from './PixelCookie'

// Rendered once from App.tsx, above every route (same pattern as
// StatusBar). Shows on first visit (no stored choice yet), and can be
// reopened any time via `reopenCookiePreferences()` — the Footer's
// "Cookie preferences" link and the privacy policy page both call that,
// so "change your mind later" doesn't need its own separate settings
// screen, just this same banner again.
export default function CookieBanner() {
  // Lazy initializer — the very first render already knows whether a
  // choice exists, no flash of the banner appearing-then-disappearing.
  const [visible, setVisible] = useState(() => getStoredConsent() === null)

  useEffect(() => {
    // Respect an already-made choice on every load, not just the first
    // — this is what actually turns analytics on/off, not just the
    // banner's own visibility.
    const stored = getStoredConsent()
    if (stored === 'accepted') loadGoogleAnalytics()
    if (stored === 'rejected') disableGoogleAnalytics()

    return onReopenCookiePreferences(() => setVisible(true))
  }, [])

  const choose = (value: Exclude<ConsentValue, null>) => {
    setStoredConsent(value)
    if (value === 'accepted') loadGoogleAnalytics()
    else disableGoogleAnalytics()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="flex w-full max-w-3xl flex-col items-center gap-5 rounded-3xl bg-statusbar p-6 text-white shadow-[0_16px_48px_rgba(0,0,0,0.45)] ring-1 ring-hover-pink/30 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
        <PixelCookie className="h-14 w-14 shrink-0 text-hover-pink sm:h-16 sm:w-16" />
        <p className="text-base leading-relaxed text-white/85 sm:text-lg">
          This site uses cookies for basic visit analytics. You can accept or reject them, and change
          your mind any time via{' '}
          <Link to="/privacy" className="font-semibold text-hover-pink underline underline-offset-2 hover:text-white">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
          <button
            type="button"
            onClick={() => choose('rejected')}
            className="flex-1 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 sm:flex-none"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="flex-1 rounded-full bg-hover-pink px-6 py-3 text-sm font-bold text-ink transition-transform hover:scale-105 sm:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
