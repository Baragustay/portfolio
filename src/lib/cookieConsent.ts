// Shared consent state, readable/writable from anywhere without prop
// drilling through every page — `localStorage` is the source of truth,
// and a plain `window` event lets any component (the footer's "Cookie
// preferences" link, the privacy policy page) reopen the banner, the
// same "manual event, not a framework" pattern already used elsewhere
// in this app (e.g. Sidebar's wheel-forwarding).
export type ConsentValue = 'accepted' | 'rejected' | null

const STORAGE_KEY = 'cookie-consent'
const REOPEN_EVENT = 'cookie-consent:reopen'

export function getStoredConsent(): ConsentValue {
  const value = window.localStorage.getItem(STORAGE_KEY)
  return value === 'accepted' || value === 'rejected' ? value : null
}

export function setStoredConsent(value: Exclude<ConsentValue, null>) {
  window.localStorage.setItem(STORAGE_KEY, value)
}

export function reopenCookiePreferences() {
  window.dispatchEvent(new Event(REOPEN_EVENT))
}

export function onReopenCookiePreferences(callback: () => void) {
  window.addEventListener(REOPEN_EVENT, callback)
  return () => window.removeEventListener(REOPEN_EVENT, callback)
}
