// What changed because of each case study's design work, shown at the top
// of its page (CaseStudyPage.tsx) and on hover over its homepage tile
// (BentoGrid.tsx). Kept apart from caseStudyContent.ts so the homepage
// doesn't pull the full write-ups into its bundle.
//
// Every figure here comes from that study's own research and Outcomes
// sections — update both together. At most four points, each led by
// what it shows.

export type Impact = {
  // Finished studies say what they achieved; a concept that was never
  // launched says what it is expected to achieve, without invented
  // numbers. `note` says how solid the evidence is.
  label: 'Impact' | 'Expected impact'
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
    highlight: 'Children who save',
    summary: 'and take responsibility for their own pocket money, with less stress for parents',
    points: [
      'Less stress for parents: one shared record replaces the Notes app and mental math',
      'More interest in saving: children see each piggy fill up toward their own goals',
      'More responsibility: children decide where their money goes, guided by audio and color instead of text',
    ],
    note: 'Expected, not measured: this is a design exploration, not a built app. Based on talks with 5 parents and a guided demo where all 3 children wanted the app for real.',
  },
  midoma: {
    label: 'Expected impact',
    highlight: '~30% fewer calls',
    summary: 'expected at first, as tenants find answers themselves, and a company new clients can find on Google and in AI search',
    points: [
      'Happier tenants: what they need to know is on their phone, any time',
      'Fewer phone calls: an estimated 30% fewer at first about things tenants can look up themselves, like what’s in their contracts',
      'More new clients: visible on Google and in AI search, where property owners look for management',
      'More time for property managers: less of the day spent answering the same tenant questions',
    ],
  },
  promptkee: {
    label: 'Expected impact',
    highlight: 'More teachers using AI',
    summary: 'with more trust in the tools they already have and a clearer idea of what AI can do',
    points: [
      'Wider adoption: teachers who had given up on AI start using it again',
      'More trust: structured prompts give answers teachers can rely on',
      'Better understanding: building a prompt step by step shows what AI can and can’t do',
      'Early sign: 2 of 2 teachers who had given up on AI completed a prompt on their first try, without help',
    ],
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
    highlight: 'Children had fun',
    summary: 'ages 3–8 played, stayed engaged, and found their way around the game on their own',
    points: [
      'Easy to start: children began playing and changed levels without struggling',
      'Engaged: familiar animal photos kept them interested, and younger children even stopped to explore them',
      'Each level fit its age: 3-year-olds completed easy mode, 8-year-olds found hard mode challenging',
    ],
    note: 'From informal test sessions with a small group of children.',
  },
}
