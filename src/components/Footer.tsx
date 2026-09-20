import { Link } from 'react-router-dom'
import { reopenCookiePreferences } from '../lib/cookieConsent'

// Email/GitHub/LinkedIn, repeated at the bottom of every page (including
// the homepage). These same three links already live in the global
// `StatusBar` (icons, top of every page) and in `Sidebar`/`MobileHero`
// (homepage only) — this isn't replacing those, just adding the
// familiar "end of the page" spot people expect contact links to also
// be in. Privacy Policy + "Cookie preferences" (reopens `CookieBanner`)
// sit alongside them for the same reason — the standard place people
// look for that, not just the one-time banner on first visit.
//
// `dark`: the homepage bento grid sits on the near-black `--color-page-
// bg`, so its footer needs light text; every other page is light, using
// the site's usual dark `ink` text.
export default function Footer({ dark }: { dark?: boolean }) {
  const linkClass = `transition-colors ${dark ? 'text-white/70 hover:text-white' : 'text-ink/60 hover:text-ink'}`
  const noteClass = dark ? 'text-white/40' : 'text-ink/40'
  return (
    <footer className="flex flex-col items-center gap-4 px-6 py-10 text-sm font-medium">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <a href="mailto:barbora.gustafsson@gmail.com" className={linkClass}>
          Email
        </a>
        <a href="https://github.com/baragustay" target="_blank" rel="noreferrer" className={linkClass}>
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/barbora-gustafsson"
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          LinkedIn
        </a>
        <Link to="/privacy" className={linkClass}>
          Privacy Policy
        </Link>
        <button type="button" onClick={reopenCookiePreferences} className={linkClass}>
          Cookie preferences
        </button>
      </div>
      <p className={noteClass}>© {new Date().getFullYear()} Barbora Gustafsson. All rights reserved.</p>
    </footer>
  )
}
