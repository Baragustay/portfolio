import { useParams } from 'react-router-dom'
import ImageRow from '../components/ImageRow'
import Carousel from '../components/Carousel'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PixelWaveDivider from '../components/PixelWaveDivider'
import { getCaseStudy, type Option, type ParagraphBlock, type Persona } from '../data/caseStudyContent'
import { setMutedAttribute } from '../lib/video'

// Ambient muted/looped preview clip — same real-attribute fix the
// homepage bento grid's video tiles use, see `lib/video.ts`.
function AutoplayLoopVideo({ src, className }: { src: string; className?: string }) {
  return (
    <video
      ref={setMutedAttribute}
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
    />
  )
}

// A paragraph slot is either plain text or an inline image/video —
// lets media sit exactly between two specific paragraphs instead of
// only ever at the end of a whole section.
function ParagraphContent({ block, studyTitle }: { block: ParagraphBlock; studyTitle: string }) {
  if (typeof block === 'string') {
    return <p className="text-base leading-relaxed sm:text-xl text-neutral-700">{block}</p>
  }
  if (block.type === 'image') {
    return <ImageRow srcs={[block.src]} alt={block.alt ?? studyTitle} />
  }
  return (
    <div>
      {block.heading && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink/40">{block.heading}</p>
      )}
      {block.autoplayLoop ? (
        <AutoplayLoopVideo src={block.src} className="mx-auto block max-h-[600px] rounded-2xl ring-1 ring-ink/5" />
      ) : (
        <video
          className="mx-auto block max-h-[600px] rounded-2xl ring-1 ring-ink/5"
          src={block.src}
          controls
          playsInline
        />
      )}
    </div>
  )
}

function PersonaCard({ persona }: { persona: Persona }) {
  return (
    <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-neutral-50 p-6 ring-1 ring-ink/5 sm:flex-row sm:items-start">
      <img
        src={persona.photo}
        alt={persona.name}
        loading="lazy"
        decoding="async"
        className="h-24 w-24 shrink-0 rounded-full object-cover ring-1 ring-ink/10"
      />
      <div>
        <p className="font-display text-xl text-ink">{persona.name}</p>
        <ul className="mt-2 space-y-1.5 text-base sm:text-lg text-neutral-600">
          {persona.bio.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function OptionsGrid({ options }: { options: Option[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {options.map((option) => (
        <div
          key={option.label}
          className={`relative rounded-2xl p-4 ring-1 ${
            option.chosen ? 'bg-accent-soft ring-accent' : 'bg-neutral-50 ring-ink/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${
                option.chosen ? 'bg-ink text-white' : 'bg-ink/10 text-ink/60'
              }`}
            >
              {option.label}
            </span>
            {option.chosen && (
              <span className="text-sm font-semibold uppercase tracking-wider text-ink">
                Chosen
              </span>
            )}
          </div>
          {option.image && (
            <div className="mt-3 flex h-28 items-center justify-center rounded-xl bg-white p-3 ring-1 ring-ink/5">
              <img
                src={option.image}
                alt={`Option ${option.label}`}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
          <p className="mt-3 text-base sm:text-lg text-neutral-600">{option.description}</p>
        </div>
      ))}
    </div>
  )
}

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const study = slug ? getCaseStudy(slug) : undefined

  if (!study) {
    return (
      <div id="top">
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="text-neutral-500">Case study not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div id="top">
      <Navbar />

      {/* No "← Back to work" text link here — Navbar's own fixed
          back-arrow button already covers "go back" on every non-home
          page, so a second text link would be redundant. */}
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-[164px] md:px-0">
        <p className="text-sm font-semibold uppercase tracking-wider text-ink/40">
          Case study · {study.year}
        </p>
        <h1 className="font-display mt-2 text-5xl leading-tight text-ink md:text-7xl">
          {study.title}
        </h1>

        <PixelWaveDivider className="mt-6" particleClassName="bg-ink/15" animated={false} />
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 py-6 sm:grid-cols-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-ink/40">My role</p>
            <p className="mt-1 text-base text-neutral-700">{study.role}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-ink/40">Year</p>
            <p className="mt-1 text-base text-neutral-700">{study.year}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-ink/40">Duration</p>
            <p className="mt-1 text-base text-neutral-700">{study.duration}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-ink/40">Tools</p>
            <p className="mt-1 text-base text-neutral-700">{study.tools.join(', ')}</p>
          </div>
        </div>
        <PixelWaveDivider particleClassName="bg-ink/15" animated={false} />

        <p className="mt-6 text-lg sm:text-xl text-neutral-600">{study.tagline}</p>
        {study.intro && <p className="mt-4 text-base leading-relaxed sm:text-xl text-neutral-600">{study.intro}</p>}

        <ImageRow srcs={[study.heroImage]} alt={study.title} />

        {study.sections.map((section) => (
          <section key={section.heading} className="mt-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/40">
              {section.heading}
            </p>
            {section.eyebrow && (
              <h2 className="font-display mt-2 text-4xl text-ink">{section.eyebrow}</h2>
            )}
            <div className="mt-4 space-y-6">
              {section.paragraphs.map((block, i) => (
                <ParagraphContent key={i} block={block} studyTitle={study.title} />
              ))}
            </div>
            {section.quote && (
              <blockquote
                className={`mt-6 rounded-2xl p-5 text-base leading-relaxed sm:text-xl text-neutral-700 italic ${
                  section.quote.bg ? '' : 'bg-accent-soft'
                }`}
                style={section.quote.bg ? { backgroundColor: section.quote.bg } : undefined}
              >
                “{section.quote.text}”
                <footer className="mt-2 text-base not-italic text-ink/40">
                  - {section.quote.attribution}
                </footer>
              </blockquote>
            )}
            {section.persona && <PersonaCard persona={section.persona} />}
            {section.bullets && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-base sm:text-xl text-neutral-700">
                {section.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
            {section.options && <OptionsGrid options={section.options} />}
            {section.images && (
              <ImageRow
                srcs={section.images}
                alt={`${study.title} - ${section.heading} screenshot`}
                maxHeight={section.imagesMaxHeight}
              />
            )}
            {section.carousel && (
              <>
                {section.carouselHeading && (
                  <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-ink/40">
                    {section.carouselHeading}
                  </p>
                )}
                <Carousel items={section.carousel} />
              </>
            )}
            {section.video && section.video.autoplayLoop && (
              <AutoplayLoopVideo
                src={section.video.src}
                className="mt-8 mx-auto block max-h-[600px] rounded-2xl ring-1 ring-ink/5"
              />
            )}
            {section.video && !section.video.autoplayLoop && (
              <video
                className="mt-8 mx-auto block max-h-[600px] rounded-2xl ring-1 ring-ink/5"
                src={section.video.src}
                controls
                playsInline
              />
            )}
          </section>
        ))}

        {(study.externalLink || study.githubLink) && (
          <div className="mt-16 flex flex-wrap gap-4 border-t border-ink/10 pt-8">
            {study.externalLink && (
              <a
                href={study.externalLink.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-ink px-5 py-2.5 text-base font-medium text-white transition-opacity hover:opacity-80"
              >
                {study.externalLink.label} →
              </a>
            )}
            {study.githubLink && (
              <a
                href={study.githubLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-ink/10 px-5 py-2.5 text-base font-medium transition-colors hover:bg-accent-soft"
              >
                See code (GitHub) →
              </a>
            )}
          </div>
        )}
      </article>

      <Footer />
    </div>
  )
}
