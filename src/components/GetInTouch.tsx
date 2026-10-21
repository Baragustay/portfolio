// The site's main call to action: a big email button in the homepage
// Sidebar (desktop) and MobileHero (phones), so getting in touch never
// depends on spotting the small icons in the Navbar.
export default function GetInTouch({ className = '' }: { className?: string }) {
  return (
    <a
      href="mailto:barbora.gustafsson@gmail.com"
      className={`group flex items-center justify-center gap-2.5 rounded-full bg-hover-yellow px-6 py-4 text-lg font-bold text-ink shadow-[0_8px_24px_rgba(236,213,143,0.18)] transition-[background-color,transform] hover:bg-hover-yellow/90 active:translate-y-px ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
      Get in touch
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
    </a>
  )
}
