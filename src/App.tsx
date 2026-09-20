import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import StatusBar from './components/StatusBar'
import CookieBanner from './components/CookieBanner'
import Home from './pages/Home'
import CaseStudyPage from './pages/CaseStudyPage'
import AboutPage from './pages/AboutPage'
import CodePage from './pages/CodePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import NotFoundPage from './pages/NotFoundPage'

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/code" element={<CodePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
