import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PixelReveal from '../components/PixelReveal'
import PixelCatWarrior from '../components/PixelCatWarrior'

// Catch-all for any URL that doesn't match a real route (App.tsx's `*`
// route) — without this, an unmatched path just rendered a blank page
// below the fixed StatusBar, since react-router-dom has no built-in
// fallback UI. Dark `bg-page-bg` + the pixel-dissolve entrance, matching
// the homepage/About/Code — this page shouldn't look like a bare error
// screen bolted onto an otherwise pixel-art-themed site.
export default function NotFoundPage() {
  return (
    <div id="top" className="min-h-screen bg-page-bg">
      <Navbar />
      <PixelReveal delay={0.15}>
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 pb-24 pt-24 text-center">
          <PixelCatWarrior className="h-56 w-56 sm:h-72 sm:w-72" />
          <div>
            <h1 className="font-pixel text-3xl uppercase tracking-widest text-hover-pink sm:text-4xl">
              Oh no!
            </h1>
            <p className="font-display mt-3 text-2xl leading-tight text-white">There's nothing here</p>
          </div>
          <Link
            to="/"
            className="rounded-full bg-white/90 px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-white"
          >
            Take me home
          </Link>
        </div>
      </PixelReveal>
    </div>
  )
}
