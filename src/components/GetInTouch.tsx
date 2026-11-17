import { Link } from 'react-router-dom'

// The site's main call to action: a big button in the homepage Sidebar
// (desktop) and MobileHero (phones), so getting in touch never depends on
// spotting the small icons in the Navbar. It leads to the About page,
// which lists every way to reach me right under its headline, instead of
// a mailto link that does nothing without a mail app set up.
export default function GetInTouch({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/about"
      className={`group flex items-center justify-center gap-2.5 rounded-full bg-white px-6 py-4 text-lg font-bold text-ink shadow-[0_8px_24px_rgba(240,238,233,0.12)] transition-[background-color,transform] hover:bg-white/90 active:translate-y-px ${className}`}
    >
      Get in touch
    </Link>
  )
}
