import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import GridHoverBackground from '../components/GridHoverBackground'
import PixelReveal from '../components/PixelReveal'
import PixelWaveDivider from '../components/PixelWaveDivider'
import { DEV_SKILL_GROUPS } from '../data/devSkills'

// UX/Design rows are specific to this page's own bio; the technical
// ones (Languages, Frameworks & Tools, Databases, etc.) come from the
// same shared list CodePage.tsx uses, appended after — previously a
// separately hand-written "Frontend" row here, which drifted out of
// sync with CodePage's own breakdown as that page grew (missing PHP,
// SQL, MongoDB, deployment tools, and more).
const SKILLS = [
  {
    label: 'UX & Research',
    value:
      'User interviews, usability testing, A/B testing, accessibility (WCAG), wireframing, prototyping, focus groups, facilitation, design thinking, information architecture, design systems',
  },
  {
    label: 'Design',
    value: 'Figma, Adobe CC (Illustrator, Photoshop, Premiere Pro, After Effects, Express, Audition)',
  },
  ...DEV_SKILL_GROUPS,
]

const EDUCATION = [
  { programme: 'Web Development & User Experience', note: 'Webmaster programme', school: 'Högskolan Väst' },
  { programme: 'Physiotherapy', school: 'Uppsala University' },
  { programme: 'Content for social media', school: 'Högskolan Dalarna' },
]

// Five copies of the same headshot (only one photo exists), the center
// one full color/opacity and each one further out progressively
// grayscale and more transparent. All five are the same size — the
// "disappearing" effect comes entirely from opacity + grayscale, not
// shrinking. Rectangular, not circular: the source photo is a
// portrait/full-body shot, so a circular crop would center on the torso
// instead of the face; `object-top` keeps the face in frame instead.
// Smaller below `sm` — at the full desktop size, all 5 side by side
// (5 × 160px + gaps) overflowed a phone-width screen badly.
const PHOTO_SIZE = 'h-[155px] w-24 sm:h-[259px] sm:w-40'
const PHOTO_TREATMENTS = [
  // Outermost two (most transparent, least visually load-bearing) are
  // hidden below `sm` instead of just shrunk further — even at a
  // smaller size, fitting all 5 on a narrow phone screen meant sizing
  // them small enough to lose the effect entirely. Three (still
  // showing the full fade-in composition) fit comfortably instead.
  { opacity: 'opacity-20', grayscale: true, hiddenOnMobile: true },
  { opacity: 'opacity-55', grayscale: true, hiddenOnMobile: false },
  { opacity: 'opacity-100', grayscale: false, hiddenOnMobile: false },
  { opacity: 'opacity-55', grayscale: true, hiddenOnMobile: false },
  { opacity: 'opacity-20', grayscale: true, hiddenOnMobile: true },
]

// Full About page — its own route, separate from the homepage's left
// sidebar (Sidebar.tsx), which only carries a name/role/location teaser.
// This is where the fuller bio, skills, and education live.
//
// Dark `bg-page-bg`, matching the homepage's theme rather than the
// site's other light pastel-section pages. `GridHoverBackground` (the
// pixel-cell hover-trail effect) runs behind the content here too; the
// content needs `relative z-10` to stay above/clickable over it, same
// pattern Sidebar.tsx uses.
//
// Skills/Education are full-width rows (not a 3-column grid) — each
// skill's tag list is long enough that columns squeezed it into cramped
// multi-line text. "Skills"/"Education" headings match the "About me"
// `h1` size, and their rows are a plain `divide-y` list with no card
// background/radius, not boxes.
export default function AboutPage() {
  // Plays on every page load, not gated to once per session like the
  // homepage/Code page entrances (see Home.tsx, CodePage.tsx) — this
  // one is meant to replay every time.
  const photoRow = (
    <div className="flex items-center justify-center gap-3">
      {PHOTO_TREATMENTS.map((photo, i) => (
        <img
          key={i}
          src="/about/headshot.webp"
          alt={i === 2 ? 'Barbora Gustafsson' : ''}
          aria-hidden={i === 2 ? undefined : true}
          className={`${PHOTO_SIZE} ${photo.opacity} ${photo.grayscale ? 'grayscale' : ''} ${photo.hiddenOnMobile ? 'hidden sm:block' : ''} shrink-0 rounded-2xl object-cover object-top ring-1 ring-white/10 transition-all`}
        />
      ))}
    </div>
  )

  return (
    <div id="top" className="relative bg-page-bg">
      <GridHoverBackground />
      <Navbar />

      <section className="relative z-10 px-6 pb-16 pt-[164px] md:px-12">
        <div className="mx-auto max-w-4xl">
          {/* Pixel-dissolve entrance, echoing the homepage's.
              `revealFrom="center"` (rather than the homepage's fully
              random order) makes the grain resolve outward from the
              middle photo, matching this row's own composition: color
              in the center, fading to grayscale on both sides. Slower
              duration than the shared 550ms default. */}
          <PixelReveal revealFrom="center" delay={0.15} duration={1100}>
            {photoRow}
          </PixelReveal>
          <h1 className="font-display mt-6 text-center text-2xl leading-tight text-white">
            About me
          </h1>

          <p className="mt-6 text-base leading-relaxed sm:text-lg text-white/70">
            My name is Barbora, and I'm a UX and product designer based in
            Sweden.
          </p>
          <p className="mt-4 text-base leading-relaxed sm:text-lg text-white/70">
            I recently graduated from the Webmaster Programme at Högskolan
            Väst, where my thesis looked at how senior UX designers are
            actually using GenAI in their work.
          </p>
          <p className="mt-4 text-base leading-relaxed sm:text-lg text-white/70">
            Before design, I studied physiotherapy at Uppsala University,
            clinical practice included, and wrote a bachelor's thesis on
            exercise-induced breathing symptoms in teenage athletes. Biggest
            learning from this, apart from quantitative data analysis, was
            realising how many people live with real difficulties without
            knowing they have a treatable condition.
          </p>
          <p className="mt-4 text-base leading-relaxed sm:text-lg text-white/70">
            For the past three years I've freelanced across UX/UI, WordPress
            development, graphic design, motion, SEO, and social content
            strategy, working with clients across property management,
            personal coaching, and small business sites.
          </p>
          <p className="mt-4 text-base leading-relaxed sm:text-lg text-white/70">
            I am drawn to ed-tech and health-tech, because here good design
            has real stakes, especially for kids.
          </p>

          <h2 className="font-display mt-10 text-2xl leading-tight text-white">Skills</h2>
          <PixelWaveDivider className="mt-3" />
          <div>
            {SKILLS.map((skill) => (
              <div key={skill.label} className="py-4">
                <p className="text-sm font-semibold uppercase tracking-wider text-white/40">
                  {skill.label}
                </p>
                <p className="mt-2 text-base sm:text-lg text-white/70">{skill.value}</p>
              </div>
            ))}
          </div>

          <h2 className="font-display mt-10 text-2xl leading-tight text-white">Education</h2>
          {/* `entranceDelayMs`: on a fast scroll, this and the Skills
              divider above can both cross into the viewport in the
              same frame — without an offset they fired in perfect
              sync, reading as one synchronized pair instead of two
              independent lines. */}
          <PixelWaveDivider className="mt-3" entranceDelayMs={150} />
          <div>
            {EDUCATION.map((entry) => (
              <div key={entry.school} className="py-4">
                <p className="text-base sm:text-lg text-white/80">
                  {entry.programme}
                  {/* Stacks onto its own line below `sm` (`block`) —
                      inline right after the programme name from `sm`
                      up, where there's room for it on the same line. */}
                  {'note' in entry && <span className="block text-sm text-white/40 sm:inline"> ({entry.note})</span>}
                </p>
                <p className="mt-1 text-sm text-white/40">{entry.school}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* `relative z-10` here too, not just on the section above — the
          grid is `position: absolute` and stretches to cover this whole
          page (including the footer, since it's sized to its parent's
          full height); positioned elements paint above static in-flow
          content regardless of DOM order, so without this the footer's
          links would render underneath the grid overlay. */}
      <div className="relative z-10">
        <Footer dark />
      </div>
    </div>
  )
}
