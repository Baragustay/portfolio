// What changed because of each case study's design work, shown at the top
// of its page (CaseStudyPage.tsx) and on hover over its homepage tile
// (BentoGrid.tsx). Kept apart from caseStudyContent.ts so the homepage
// doesn't pull the full write-ups into its bundle.
//
// Every figure here comes from that study's own research and Outcomes
// sections — update both together. At most three points, each led by
// what it shows.

export type Impact = {
  // 'Impact' for shipped work with real results, 'Early impact' for a
  // first small round of testing, 'Expected impact' for a concept that
  // hasn't launched (so nothing is measured yet).
  label: 'Impact' | 'Early impact' | 'Expected impact'
  // The one number or phrase a hiring manager should leave with…
  highlight: string
  // …and the rest of that sentence.
  summary: string
  points: string[]
  // Honest caveat about how solid the evidence is.
  note?: string
}

export const impactBySlug: Record<string, Impact> = {
  'piggy-bank': {
    label: 'Expected impact',
    highlight: 'Ages 4–7',
    summary: 'the age group the app is designed for: pocket money without reading, guided by audio on tap and color cues',
    points: [
      'Reading-free by design: audio on tap, icons and color cues on every screen',
      'One shared record replaces the parents’ Notes app and mental math',
      'Early interest: all 3 children in a guided demo wanted the app for real',
    ],
    note: 'Not launched yet. Based on parent research and a guided demo; a working MVP is the next step to measure it.',
  },
  midoma: {
    label: 'Impact',
    highlight: '1 system, 2 products',
    summary: 'a token-based design system that lets future branches scale without new design debt',
    points: [
      'Shift-left QA: 1,010 synthetic test scenarios caught usability and accessibility defects before publishing',
      'WCAG AA contrast, 15 px minimum type and Lighthouse accessibility 100 on both sites',
      'Performance as UX: first-visit JavaScript on the tenant portal cut by 48%, Lighthouse performance 95–100',
    ],
    note: 'Leading indicators only. Behavioral metrics like task success will come from live analytics and surveys.',
  },
  promptkee: {
    label: 'Early impact',
    highlight: '2 of 2',
    summary: 'teachers who had given up on AI completed a structured prompt on their first try, without help',
    points: [
      'Lower barrier to entry: no language hesitation with the interface in Swedish',
      'All 3 teachers in the wider test group responded positively',
      'Shipped: a live tool, now in user testing',
    ],
    note: 'Early signal from a small test group.',
  },
  solidhomes: {
    label: 'Impact',
    highlight: '1 brand system',
    summary: 'that gave a company with no identity a clear position between cold corporate and outdated competitors',
    points: [
      'Evidence-based positioning: a benchmark of 6 competitor sites settled a split stakeholder debate',
      'Stakeholder alignment: three logo concepts turned an undefined brief into a decision',
      'Complete handoff: logo, favicon, email signature, palette and typography',
    ],
    note: 'Outcomes of the research and design process. Brand perception itself isn’t measured in this case study.',
  },
  'memory-game': {
    label: 'Impact',
    highlight: 'Ages 3–8',
    summary: 'in one game: 3-year-olds complete easy mode, 8-year-olds find hard mode challenging',
    points: [
      'Rounds kept under ~90 s, the frustration threshold found in testing',
      'Difficulty levels pace as intended: ~46 s per round on easy vs ~21 s on hard',
    ],
    note: 'From informal test sessions with a small group of children.',
  },
}
