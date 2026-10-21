// Homepage "Work" tile grid data — case studies and animation/video pieces
// shown together in one feed. Real content pulled from barboragustafsson.com
// (2026-09-18). See project memory `portfolio-v2-work-section`.
//
// Real tiles only, no color-fill filler. Earlier versions padded
// the grid out with decorative color tiles when the item count felt
// sparse; retired along with the pink/green palette they used (see
// `portfolio-v2-stack-brand`).

type BaseTile = {
  id: string
}

export type CaseStudyTile = BaseTile & {
  kind: 'case-study'
  slug: string // matches the slug in caseStudyContent.ts, used for the detail route
  title: string
  tagline: string
  goal: string
  benefits: string[]
  year: string
  tags: string[]
  image: string
  // Set when `image` is a transparent device mockup rather than a
  // full-bleed thumbnail: the homepage tile shows it whole, on this
  // CSS background, instead of cropping it to fill.
  mockupBackground?: string
}

// Midoma's navy brand ground, behind its device mockup on the homepage
// tile and its case study hero.
export const MIDOMA_BG = `radial-gradient(55% 80% at 0% 0%, rgb(121 115 211 / 0.3), transparent 70%),
  radial-gradient(45% 70% at 100% 100%, rgb(131 198 233 / 0.18), transparent 70%),
  linear-gradient(135deg, #2e4b61 0%, #2a3a64 100%)`

export type VideoTile = BaseTile & {
  kind: 'video'
  title: string
  role: string
  description: string
  videoSrc: string
}

// A live app with no case study of its own — its tile links straight
// out to the running app instead of a /work/ detail page.
export type AppTile = BaseTile & {
  kind: 'app'
  title: string
  label: string // shown as a badge beside the title, e.g. "Live RAG app"
  goal: string
  year: string
  tags: string[]
  image: string
  url: string
}

export type WorkTile = CaseStudyTile | VideoTile | AppTile

export const workItems: WorkTile[] = [
  {
    id: 'midoma',
    kind: 'case-study',
    slug: 'midoma',
    title: 'Midoma',
    tagline: 'A design system for a growing company, across two websites.',
    goal: 'One design system that keeps a growing brand consistent, for owners and tenants alike.',
    benefits: [
      'Two sites that are instantly told apart, but clearly one family',
      '1,010 synthetic test scenarios run with Claude',
      'Accessibility and SEO scored 100 on both live sites',
    ],
    year: '2026',
    tags: ['Design System', 'UX Audit', 'Synthetic Testing', 'Claude Code', 'Accessibility'],
    // Laptop and phone mockup (the website and the tenant portal) instead
    // of a full-screen screenshot, whose big headline text competed with
    // the tile's own caption.
    image: '/work/images/midoma-devices.webp',
    mockupBackground: MIDOMA_BG,
  },
  {
    id: 'piggy-bank',
    kind: 'case-study',
    slug: 'piggy-bank',
    title: 'Piggy Bank',
    tagline: 'Young children learning to handle money in a cash-free world.',
    goal: 'Reducing caregivers\' mental load around tracking pocket money.',
    benefits: [
      'Builds early financial literacy through play',
      'Designed to support reading with on-tap audio',
      'Develops counting skills with visual, hands-on saving',
    ],
    year: '2026',
    tags: ['UX/UI Design', 'Accessibility', 'FinTech', 'Children'],
    image: '/work/images/piggy-bank-thumb.webp',
  },
  {
    id: 'squinty',
    kind: 'app',
    title: 'Squinty',
    label: 'Live RAG app',
    goal: 'Privacy policies and terms of 23 popular services, explained in plain English, with every claim linked to the original text.',
    year: '2026',
    tags: ['Design & Build', 'RAG', 'AI', 'React', 'Accessibility'],
    image: '/work/images/squinty-thumb.webp',
    url: 'https://squinty.barboragustafsson.com/',
  },
  {
    id: 'promptkee',
    kind: 'case-study',
    slug: 'promptkee',
    title: 'PromptKee',
    tagline: 'Teachers giving up on AI? Never.',
    goal: 'Help teachers use the AI tools they already have, without extra training.',
    benefits: [
      'Removes language uncertainty for non-native English speakers',
      'Cuts prompt-writing friction with pre-filled, rule-based forms',
      'Builds trust through built-in accuracy safeguards',
    ],
    year: '2026',
    tags: ['UX Research', 'Product Design', 'EdTech', 'AI Tools'],
    image: '/work/images/promptkee-thumb.webp',
  },
  {
    id: 'coop',
    kind: 'video',
    title: 'Coop Christmas Commercial',
    role: 'Motion Graphics · 2024',
    description: 'After Effects, own photography and design, goal to mimic Coop’s visual identity.',
    videoSrc: '/work/videos/coop-christmas.mp4',
  },
  {
    id: 'solidhomes',
    kind: 'case-study',
    slug: 'solidhomes',
    title: 'SolidHomes',
    tagline: 'Building trust for a property business with no online presence.',
    goal: 'Turn zero brand identity into a brand older property owners trust.',
    benefits: [
      'A brand position based on research, not taste',
      'A persona for an older, less technical audience',
      'Brand colors chosen for contrast and older eyes',
      'A complete brand system: logo, favicon, palette and typography',
    ],
    year: '2024',
    tags: ['Branding', 'UX Research', 'Competitor Analysis', 'Personas'],
    image: '/work/images/solidhomes-thumb.webp',
  },
  {
    id: 'memory-game',
    kind: 'case-study',
    slug: 'memory-game',
    title: 'Memory Game',
    tagline: 'What does good UX look like when your user is four years old and losing patience?',
    goal: 'One memory game that stays fun across ages 3 to 8.',
    benefits: [
      'Age-based difficulty keeps every player challenged, not frustrated',
      'Touch targets sized for developing motor skills',
      'High-contrast visuals support recognition and engagement',
    ],
    year: '2025',
    tags: ['JavaScript', 'HTML5', 'CSS3', 'Figma'],
    image: '/work/images/memory-game-thumb.webp',
  },
  {
    id: 'explainer',
    kind: 'video',
    title: 'Explainer: JavaScript',
    role: 'Motion Graphics · 2024',
    description: 'After Effects, fast-paced explainer in TikTok style, own voiceover.',
    videoSrc: '/work/videos/js-explainer.mp4',
  },
]
