import { useEffect, useState } from 'react'

// Fixed bar above everything else on every page (rendered once from
// App.tsx, not per-page) — GitHub/LinkedIn/email, always reachable, plus
// a status dot right next to them. Real LinkedIn presence isn't
// available to third-party sites (no public API exposes it, and
// scraping it would violate their ToS and break constantly), so this is
// a schedule-based stand-in instead — green ("Active now") from 06:00
// to 22:59, red ("Away") otherwise. Computed in *her* local time
// (Europe/Stockholm), not the visitor's, since it's meant to describe
// her actual availability regardless of who's looking at the site.
const TIMEZONE = 'Europe/Stockholm'
const ONLINE_FROM_HOUR = 6
const ONLINE_UNTIL_HOUR = 23

function isOnlineNow() {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { timeZone: TIMEZONE, hour: 'numeric', hour12: false }).format(new Date()),
  )
  return hour >= ONLINE_FROM_HOUR && hour < ONLINE_UNTIL_HOUR
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.51 10.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  )
}

export default function StatusBar() {
  const [online, setOnline] = useState(isOnlineNow)

  // Re-checks every minute so the dot flips on its own right at 06:00/
  // 23:00 for anyone who leaves the tab open across that boundary.
  useEffect(() => {
    const id = setInterval(() => setOnline(isOnlineNow()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[70] flex h-9 items-center gap-3 bg-statusbar px-4 text-xs text-white shadow-[0_4px_10px_rgba(23,23,22,0.6)] sm:px-6">
      {/* Status + Email + LinkedIn + GitHub, all grouped on the left as
          one unit — GitHub used to sit alone on the far right, where it
          read as disconnected from the other icons. */}
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex items-center gap-1.5 font-medium">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${online ? 'bg-emerald-400' : 'bg-rose-400'}`}
            aria-hidden="true"
          />
          <span className="sm:hidden">{online ? 'Active now' : 'Away'}</span>
          <span className="hidden truncate sm:inline">
            {online ? 'Active now - say hi' : "Away - I'll reply as soon as I can"}
          </span>
        </span>
        <span className="text-white/30" aria-hidden="true">
          ·
        </span>
        <a href="mailto:barbora.gustafsson@gmail.com" aria-label="Email" className="shrink-0 hover:text-white/70">
          <EmailIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/barbora-gustafsson"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="shrink-0 hover:text-white/70"
        >
          <LinkedInIcon />
        </a>
        <a
          href="https://github.com/baragustay"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="shrink-0 hover:text-white/70"
        >
          <GitHubIcon />
        </a>
      </span>
    </div>
  )
}
