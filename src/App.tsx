import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import StatusBar from './components/StatusBar'
import CookieBanner from './components/CookieBanner'
import Home from './pages/Home'

// Loaded on demand rather than bundled into the homepage's initial JS —
// the homepage is the page mobile load time is measured against, and
// none of these are needed until the visitor actually navigates there.
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const CodePage = lazy(() => import('./pages/CodePage'))
const GamePage = lazy(() => import('./pages/GamePage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// React Router doesn't reset scroll position on navigation — without
// this, clicking a link while scrolled down (e.g. the footer's
// "Privacy Policy" link from the bottom of a long page) lands on the
// new page at that same scroll depth instead of its top.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      {/* Rendered once, above every route — see StatusBar.tsx. Every
          other fixed-position element (Navbar's pill/back-arrow, the
          homepage Sidebar) and every page's top padding is offset by its
          36px (`h-9`) height. */}
      <StatusBar />
      {/* Also rendered once, above every route — see CookieBanner.tsx.
          Shows itself on first visit; reopenable later via the footer's
          "Cookie preferences" link or the privacy policy page. */}
      <CookieBanner />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/code" element={<CodePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
