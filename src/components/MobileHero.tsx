import { Link } from 'react-router-dom'

const EDUCATION = [
  { programme: 'Web Development & User Experience', school: 'Högskolan Väst' },
  { programme: 'Physiotherapy', school: 'Uppsala University' },
  { programme: 'Content for social media', school: 'Högskolan Dalarna' },
]

// Mobile-only (`lg:hidden`, rendered from Home.tsx) replacement for the
// desktop Sidebar's vertical name/role/location + education block —
// same content and copy as Sidebar.tsx. Sits in normal document flow
// directly under the sticky `Navbar` (not fixed itself), so this needs
// enough top padding to clear both the fixed `Navbar` pill *and* the
// global `StatusBar` above it (App.tsx). About/Code links aren't
// repeated here since the sticky Navbar above already covers that
// navigation on mobile; contact links (Email/GitHub/LinkedIn) aren't
// repeated here either since they're already in the global StatusBar
// above and the Footer below.
//
// Tagline/location and Education sit side by side from `sm` up — only
// stacked on very small (sub-640px) screens, where two columns would get
// too cramped.
export default function MobileHero() {
  return (
    <section className="bg-page-bg px-6 pb-8 pt-32 text-center text-white sm:px-8">
      <h1 className="font-display text-3xl leading-tight text-white">
        <Link to="/">Barbora Gustafsson</Link>
      </h1>

      <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-center sm:gap-16">
        <div>
          <p className="text-lg text-white/80">I study people</p>
          <p className="mt-1 text-lg text-white/60">UX &amp; Product design</p>
          <p className="mt-3 text-sm text-white/40">Uppsala/Stockholm, Sweden</p>
        </div>

        <div>
          <p className="font-pixel text-xs uppercase tracking-[0.2em] text-white/40">Education</p>
          <div className="mt-2 flex flex-col items-center gap-2">
            {EDUCATION.map((entry) => (
              <div key={entry.school}>
                <p className="text-sm text-white/70">{entry.programme}</p>
                <p className="text-xs text-white/40">{entry.school}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
