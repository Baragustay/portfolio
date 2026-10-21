import { Link } from 'react-router-dom'
import { HOME_BACKGROUND, HOME_SKILLS } from '../data/homeSkills'


// Mobile-only (`lg:hidden`, rendered from Home.tsx) replacement for the
// desktop Sidebar's vertical name/role/location + skills block —
// same content and copy as Sidebar.tsx. Sits in normal document flow
// directly under the sticky `Navbar` (not fixed itself), so this needs
// enough top padding to clear both the fixed `Navbar` pill *and* the
// `Navbar` above it (App.tsx). About/Code links aren't
// repeated here since the sticky Navbar above already covers that
// navigation on mobile; contact links (Email/GitHub/LinkedIn) aren't
// repeated here either since they're already in the Navbar
// above and the Footer below.
//
// Only name, tagline, role and location sit above the projects: with the
// skills list here too, the whole first phone screen was intro and no
// project showed. Skills follow the grid instead (`MobileSkills`,
// also from Home.tsx). Its entries switch from stacked (phones) to a
// single centered row (`sm`+, comfortably covers iPad width).
export default function MobileHero() {
  return (
    <section className="bg-page-bg px-6 pb-2 pt-[124px] text-center text-white sm:px-8">
      <h1 className="font-display text-3xl leading-tight text-white">
        <Link to="/">Barbora Gustafsson</Link>
      </h1>
      <p className="mt-3 text-lg text-white/80">I study people</p>
      <p className="mt-1 text-lg text-white/60">UX &amp; Product design</p>
      <p className="mt-2 text-sm text-white/55">Uppsala/Stockholm, Sweden</p>
    </section>
  )
}

export function MobileSkills() {
  return (
    <section aria-labelledby="mobile-skills" className="px-6 pb-4 pt-6 text-center text-white sm:px-8">
      <h2 id="mobile-skills" className="font-pixel text-sm uppercase tracking-[0.2em] text-white/60">Skills</h2>
      <ul className="mt-3 flex flex-col items-center gap-1.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6">
        {HOME_SKILLS.map((skill) => (
          <li key={skill} className="text-base font-medium leading-snug text-white/90">{skill}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-white/55">{HOME_BACKGROUND}</p>
    </section>
  )
}
