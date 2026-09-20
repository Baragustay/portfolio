import { Route, Routes } from 'react-router-dom'
import StatusBar from './components/StatusBar'
import CookieBanner from './components/CookieBanner'
import Home from './pages/Home'
import CaseStudyPage from './pages/CaseStudyPage'
import AboutPage from './pages/AboutPage'
import CodePage from './pages/CodePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <>
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
