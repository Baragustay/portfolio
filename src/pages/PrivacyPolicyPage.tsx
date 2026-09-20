import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GridHoverBackground from '../components/GridHoverBackground'
import PixelCatCute from '../components/PixelCatCute'
import { reopenCookiePreferences } from '../lib/cookieConsent'

// Dark `bg-page-bg`, matching the site's other dark pages (About, Code)
// rather than the light case-study reading style — same
// `GridHoverBackground` + light-text-on-dark treatment as AboutPage.tsx.
export default function PrivacyPolicyPage() {
  return (
    <div id="top" className="relative bg-page-bg">
      <GridHoverBackground />
      <Navbar />

      <article className="relative z-10 mx-auto max-w-2xl px-6 pb-24 pt-[164px] md:px-0">
        <p className="text-sm font-semibold uppercase tracking-wider text-white/40">Legal</p>
        <h1 className="font-display mt-2 text-4xl leading-tight text-white md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-base text-white/40">Last updated: 2026</p>

        <div className="mt-8 flex flex-col items-center gap-2">
          <PixelCatCute className="h-40 w-40 sm:h-48 sm:w-48" />
          <p className="font-pixel text-sm uppercase tracking-widest text-hover-pink">Guarding your data</p>
        </div>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-white/70 sm:text-lg">
          <section>
            <h2 className="font-display text-xl text-white">Who this is</h2>
            <p className="mt-2">
              This site (barboragustafsson.com) is run by Barbora Gustafsson. For any question about this
              policy or your data, email{' '}
              <a
                href="mailto:barbora.gustafsson@gmail.com"
                className="text-white underline underline-offset-2 hover:text-hover-pink"
              >
                barbora.gustafsson@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white">Cookies and analytics</h2>
            <p className="mt-2">
              This site uses Google Analytics to understand roughly how many people visit and which pages
              are read, so the site can be improved over time. Google Analytics only runs if you accept
              cookies in the banner shown on your first visit — it does not load at all if you reject.
            </p>
            <p className="mt-2">
              If enabled, Google Analytics may set cookies and process data such as your approximate
              location (city/country level), device and browser type, and which pages you visit. This data
              is processed by Google; see{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-white underline underline-offset-2 hover:text-hover-pink"
              >
                Google's own privacy policy
              </a>{' '}
              for details on how they handle it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white">Your cookie choice</h2>
            <p className="mt-2">
              Whichever option you pick (accept or reject) is stored locally in your browser so you're not
              asked again on every visit. This is the only thing stored if you reject cookies — it's not
              itself used for tracking.
            </p>
            <button
              type="button"
              onClick={reopenCookiePreferences}
              className="mt-4 rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white"
            >
              Change your cookie preference
            </button>
          </section>

          <section>
            <h2 className="font-display text-xl text-white">Your rights</h2>
            <p className="mt-2">
              If you're in the EU/EEA, the General Data Protection Regulation (GDPR) gives you the right to
              ask what data (if any) is held about you, request it be corrected or deleted, and object to
              its processing. Email the address above for any of these requests.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white">Other links on this site</h2>
            <p className="mt-2">
              This site links out to third parties (GitHub, LinkedIn, and individual project demos). Once
              you leave this site, that third party's own privacy policy applies, not this one.
            </p>
          </section>
        </div>
      </article>

      <div className="relative z-10">
        <Footer dark />
      </div>
    </div>
  )
}
