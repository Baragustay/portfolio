// Homepage "Work" tile grid data — case studies and animation/video pieces
// shown together in one feed. Real content pulled from barboragustafsson.com
// (2026-09-18). See project memory `portfolio-v2-work-section`.
//
// Exactly 6 real tiles, no color-fill filler. Earlier versions padded
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
}

export type VideoTile = BaseTile & {
  kind: 'video'
  title: string
  role: string
  description: string
  videoSrc: string
}

export type WorkTile = CaseStudyTile | VideoTile

export const workItems: WorkTile[] = [
  {
    id: 'piggy-bank',
    kind: 'case-study',
    slug: 'piggy-bank',
    title: 'Piggy Bank',
    tagline: 'Young children learning to handle money in a cash-free world.',
    goal: 'Reducing caregivers\' mental load around tracking pocket money.',
    benefits: [
      'Builds early financial literacy through play',
      'Strengthens reading skills via on-tap audio',
      'Develops counting skills with visual, hands-on saving',
    ],
    year: '2026',
    tags: ['UX/UI Design', 'Accessibility', 'FinTech', 'Children'],
    image: '/work/images/piggy-bank-thumb.webp',
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
    goal: 'Turn zero brand identity into a trustworthy online business.',
    benefits: [
      'Accessible, WCAG compliant design for an older audience',
      'Design that evokes trust in users',
      'Bilingual site that builds credibility with local clients',
      'Real client inquiries within weeks of launch',
    ],
    year: '2025',
    tags: ['UI & UX Design', 'Web Design', 'WordPress Development', 'User Testing', 'Maintenance', 'SEO'],
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
