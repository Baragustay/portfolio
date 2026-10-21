// Full case study detail content, pulled from barboragustafsson.com
// (2026-09-18). Rendered by CaseStudyPage.tsx at /work/:slug.

export type Persona = {
  photo: string
  name: string
  bio: string[]
}

export type Option = {
  label: string // 'A' | 'B' | 'C' ...
  description: string
  image?: string
  chosen?: boolean
}

// A paragraph slot is either plain text or an inline media block, so
// images/video can be placed exactly between two specific paragraphs
// instead of only ever at the end of a whole section (which is what
// `images`/`video` below still do, for content that doesn't need that
// precision).
export type ParagraphBlock =
  // `[text](/work/slug)` inside the string renders as a link.
  | string
  // `small`: kept inside the text column at a modest height, for a
  // supporting image that shouldn't compete with the design work.
  | { type: 'image'; src: string; alt?: string; small?: boolean }
  | {
      type: 'video'
      src: string
      heading?: string
      autoplayLoop?: boolean
      // 'tablet': shown inside a landscape tablet, with a play/pause button
      // and progress bar so it reads as a film, not a screenshot.
      frame?: 'tablet'
      caption?: string
    }
  // Two tablet screen recordings side by side on desktop (stacked on
  // phones), wider than the text column, to compare two products.
  | { type: 'videoPair'; videos: { src: string; caption: string }[] }

export type Section = {
  // Starts a chapter: an entry in the floating chapter menu that jumps to
  // this section (`nav` is its short label there; `title` names its anchor).
  chapter?: { title: string; nav: string }
  // One headline per section that states its point, so reading only the
  // headlines tells the story.
  heading: string
  paragraphs: ParagraphBlock[]
  bullets?: string[]
  // `bg`: per-quote background override (hex), falls back to the
  // shared `bg-accent-soft` used everywhere else when not set.
  quote?: { text: string; attribution: string; bg?: string }
  persona?: Persona
  options?: Option[]
  images?: string[]
  // Per-section override of `ImageRow`'s default 489px target/ceiling
  // height, for a section whose image should render smaller.
  imagesMaxHeight?: number
  // Small label rendered directly above `carousel` below (e.g. "Design
  // iterations").
  carouselHeading?: string
  // Step-through sequence (prev/next + dots) for showing how a design
  // changed across iterations, distinct from `images` (a same-line
  // justified row for viewing several finished shots at once).
  carousel?: { src: string; caption?: string }[]
  // Inline video with real playback controls (not the homepage bento
  // grid's autoplay-muted-loop treatment) — used for a walkthrough demo
  // long/detailed enough that a visitor would actually want to scrub
  // and rewatch parts of it, not just glance at a loop.
  // `autoplayLoop`: a short ambient loop (muted, no controls) for a quick
  // glance-preview, as opposed to the default controls-and-scrub player
  // meant for a longer walkthrough someone would actually want to seek
  // around in.
  video?: { src: string; caption?: string; autoplayLoop?: boolean }
}

export type CaseStudy = {
  slug: string
  title: string
  tagline: string
  intro: string
  year: string
  role: string
  duration: string
  tools: string[]
  heroImage: string
  sections: Section[]
  externalLink?: { label: string; href: string }
  // Further live links, shown as outline buttons after `externalLink`.
  moreLinks?: { label: string; href: string }[]
  githubLink?: string
  // Full-width opening band: the logo (or the name as a wordmark when there
  // is none), what was made, who for and what with, next to `heroImage`
  // (which then isn't repeated below). `background` is CSS for the band,
  // in the project's own colors; it defaults to Midoma's dark gradient.
  hero?: {
    logo?: string
    client: string
    deliverables: string[]
    builtWith: string
    builtWithLogo?: string
    imageAlt: string
    background?: string
  }
  // UX skills used in the project, shown as a small pie chart at the top of
  // the study. `share` is that skill's percentage of the work; they add up
  // to 100.
  skills?: { name: string; share: number }[]
  // One line under the chart saying how the shares were estimated.
  skillsNote?: string
  // 'midoma': the client's lavender page gradient behind the study.
  theme?: 'midoma'
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'piggy-bank',
    title: 'Piggy Bank App',
    tagline: 'Teaching young children financial responsibility, even before they can count and read',
    intro:
      'Small children want to handle their own money, but in a cash-free world parents rarely carry coins. I designed the child-facing part of a money-saving app, for children who can’t read yet.',
    year: '2026',
    role: 'UX/UI designer, end-to-end',
    duration: '4 weeks',
    tools: ['Figma', 'Illustrator', 'Claude (brainstorming)', 'Gemini (user photo and avatars)'],
    heroImage: '/work/images/piggy-bank-1.webp',
    hero: {
      client: 'Children ages 4–7 and their parents',
      deliverables: ['Child app', 'UX research', 'Prototype'],
      builtWith: 'Figma and Illustrator',
      imageAlt: 'The Piggy Bank app on a phone: Freja’s piggy banks, each filled with its own color, and her total',
      background: 'radial-gradient(55% 80% at 0% 0%, rgb(247 216 247 / 0.22), transparent 70%), linear-gradient(135deg, #3b1f73 0%, #4a2a8c 100%)',
    },
    skills: [
      { name: 'Visual and UI design', share: 25 },
      { name: 'User research', share: 20 },
      { name: 'Accessibility (non-readers)', share: 15 },
      { name: 'Prototyping', share: 15 },
      { name: 'Usability testing', share: 15 },
      { name: 'Competitor analysis', share: 10 },
    ],
    skillsNote: 'Estimated share of my time on the project, looking back at how long each part took.',
    sections: [
      {
        chapter: { title: 'The brief', nav: 'Brief' },
        heading: 'Children want to handle money, but parents no longer carry coins',
        paragraphs: [
          'This was a personal project. I wanted to practice designing for young children and learn what is specific to that kind of work, so I picked a real problem: small children want to handle money, but parents often don’t carry coins on them. I designed the child’s side of a money-saving app, end to end, in four weeks.',
          'I defined the questions I wanted the design to answer:',
        ],
        bullets: [
          'How can children who can’t read yet still use the app on their own?',
          'How can both parents and children keep track of pocket money easily?',
          'How can the app stay simple enough for small children to enjoy, without losing what it is for?',
        ],
      },
      {
        chapter: { title: 'Research', nav: 'Research' },
        heading: 'No app on the market was made for the youngest savers',
        paragraphs: [
          'To begin with, I looked at what was already out there. Bank apps were hard to test without creating an account and paying a subscription, and apps from private developers were often buggy or unfinished. Bomad, for example, is made for older kids and is moving towards real bank accounts. None focused on the youngest age group.',
          'Then I read App Store reviews of piggy bank apps, Reddit threads and Facebook discussions, and talked informally with 5 parents at a local playground. Here’s what I found:',
        ],
        quote: {
          text: 'Yes, children definitely want to be able to track their money, they even work with it in kindergarten. But I think Lova (name changed) is too small for a bank account so I just hold onto the money and write it down in my Notes app on my phone. It’s not very convenient but kind of works.',
          attribution: 'Parent of two, Uppsala',
          bg: '#f7d8f7',
        },
        bullets: [
          'Parents struggle to keep track of how much pocket money their child has earned or spent.',
          'Children don’t track their money either, but they’re very good at asking for more.',
          'Young children want their own say in what happens with their money.',
        ],
      },
      {
        chapter: { title: 'Design', nav: 'Design' },
        heading: 'Every screen works without reading',
        paragraphs: [
          'Children ages 4 to 7 can’t read, or can’t read well, so autonomy and accessibility mattered most. Every text and number had to work without reading. As a bonus, an app that talks lets parents know what the child is doing without watching over their shoulder.',
          'Here are the rules I followed:',
        ],
        bullets: [
          'All text and numbers are read aloud on tap, so a child never has to read.',
          'Every button has an icon and its own color, so nothing depends on reading.',
          'Colors guide the child throughout: green for money in, red for money out.',
          'Large text in a legible font, short words like “Total” instead of “Altogether you have saved”, and repetition to help remember meaning.',
          'High contrast and large tap targets, sized for developing motor skills.',
          'Functionality limited on purpose, to keep the focus on saving, reading and counting.',
        ],
      },
      {
        heading: 'Fewer features, but every one feels good to use',
        paragraphs: [
          'My first idea was to fill each piggy bank with a picture of what the child is saving for, for example a rabbit photo inside a pig shape. It turned out to be visual clutter, with low contrast and unclear cues. Instead, each pig now fills up with its own color.',
          {
            type: 'image',
            src: '/work/images/piggy-bank-2.webp',
            alt: 'Piggy Bank history screen showing color-coded transactions, next to an earlier layout of the same screen',
          },
          'I also kept the app small on purpose. The child can take photos and choose an avatar, count and move coins, and drag and drop (or tap and tap) money into their piggy banks. History shows big colorful numbers and pictures of what they earned or spent money on.',
          { type: 'video', src: '/work/videos/piggy-bank-demo.mp4', autoplayLoop: true },
        ],
        carouselHeading: 'Design iterations',
        carousel: [
          { src: '/work/images/piggy-bank-evolution-1.webp', caption: 'v1: low contrast, repeated notification text and one confusing savings visual' },
          { src: '/work/images/piggy-bank-evolution-2.webp', caption: 'v2: a simpler balance overview, but the details/overview toggle wasn’t needed for this age group' },
          { src: '/work/images/piggy-bank-evolution-3.webp', caption: 'v3: each pig filled with a photo of the savings goal; too much clutter, low contrast' },
          { src: '/work/images/piggy-bank-evolution-4.webp', caption: 'v4: back to one flat color per goal, with a more cohesive palette' },
          { src: '/work/images/piggy-bank-evolution-5.webp', caption: 'v5: final direction, with large hand-drawn type, one flat color per goal and a simple color-coded menu' },
        ],
      },
      {
        heading: 'A simple app for the child, with the parent side as a concept',
        paragraphs: [
          'I designed the child’s app: simple and fun. The admin would happen in a sister app on the parent’s phone, which I kept as a concept, outside the scope of the study. A few adult settings can be reached inside the child’s app, so nobody has to switch devices. They are hidden behind a math question only adults can answer.',
          'Fewer options mean no decision fatigue, so the child stays focused on what the app is for: learning to save money, read and count.',
          { type: 'video', src: '/work/videos/piggy-bank-walkthrough.mp4', heading: 'Full app walkthrough' },
        ],
        images: ['/work/images/piggy-bank-4.webp'],
      },
      {
        chapter: { title: 'Testing', nav: 'Testing' },
        heading: 'Children lost interest in the prototype, but loved the demo',
        paragraphs: [
          'I tested the high-fidelity Figma prototype with three children, ages 3, 5 and 8. It didn’t go as expected. The prototype was a bit laggy and not fully working, so the children lost interest quickly. For this age group, a working MVP would give better results than a Figma prototype.',
          'So I also walked the children through the intended flow in a guided demo. They were excited about the design, and all three wanted the app for real, to track their own savings.',
        ],
        images: ['/work/images/piggy-bank-3.webp'],
        imagesMaxHeight: 310,
      },
      {
        chapter: { title: 'Outcomes', nav: 'Outcomes' },
        heading: 'A promising concept, and what the study couldn’t prove',
        paragraphs: [
          'All three children wanted the app, but only one of them was in the 4–7 target range, and a guided demo isn’t a usability test. So the study ends with a promising concept, not a validated one. Proving it would take:',
        ],
        bullets: [
          'A working MVP, so testing measures real interaction, not a laggy prototype.',
          'Testing with more children ages 4–7, including ones who can’t read, to confirm the audio reader removes the reading barrier.',
          'A designed and tested parent app, including a check that the math-question lock is easy for parents to use.',
          'Completion rates on logging in, sorting money and checking history. A high drop-off on sorting would mean drag and drop needs a simpler option, like tap to select.',
          'A comparison of how often parents check the parent app with their old method, a Notes app or mental math. That’s the real success metric: does it replace something that wasn’t working?',
          'Repeat tests with the same children after a few weeks, because an app looks different on day one than once the novelty wears off.',
        ],
      },
      {
        heading: 'Less is more: removing features made the app better',
        paragraphs: [
          'The biggest lesson was getting comfortable removing features I had already designed. It’s tempting to think a good app has many options. But what 4 to 7 year olds can actually do asks for simplicity. Using that space for larger fonts, bigger tap targets and audio made the app better and more accessible.',
          'I also learned that a child’s app can’t be judged on its own. Designing the parent side would likely have shown missing pieces in the child’s app too.',
        ],
      },
    ],
  },
  {
    slug: 'midoma',
    title: 'Midoma: redesign and design system for a growing company',
    tagline: 'A design system built to grow with the company, across two websites',
    intro:
      'Midoma is a growing Prague property company with plans to expand into new branches. It needed a website for property owners (midoma.cz), a portal for tenants, and a design system that keeps every future part of the brand consistent, even when new designers join.',
    year: '2026',
    role: 'Solo: UX, design system and development, with Claude Code',
    duration: '10 days',
    tools: ['Figma', 'Claude Code', 'Astro', 'React', 'Tailwind'],
    heroImage: '/work/images/midoma-hero.webp',
    hero: {
      logo: '/work/images/midoma-logo-white.webp',
      client: 'Midoma Správa, property management in Prague',
      deliverables: ['Website', 'Tenant portal', 'Design system'],
      builtWith: 'Claude Code',
      builtWithLogo: '/work/images/claude-code.svg',
      imageAlt: 'Midoma website on a laptop and the tenant portal on a phone',
    },
    skills: [
      { name: 'Design systems', share: 20 },
      { name: 'Visual and UI design', share: 18 },
      { name: 'Accessibility', share: 14 },
      { name: 'Prototyping and front-end', share: 14 },
      { name: 'Information architecture', share: 10 },
      { name: 'UX auditing', share: 9 },
      { name: 'Usability testing (synthetic)', share: 9 },
      { name: 'User research (reused)', share: 6 },
    ],
    skillsNote:
      'Estimated share of my time on the project, looking back at how long each part took. User research is low because I reused the research from the original website.',
    // Midoma's own look: lavender page.
    theme: 'midoma',
    externalLink: { label: 'Visit midoma.cz', href: 'https://midoma.cz/' },
    moreLinks: [{ label: 'Visit najemnici.midoma.cz', href: 'https://najemnici.midoma.cz/' }],
    sections: [
      {
        chapter: { title: 'The brief', nav: 'Brief' },
        heading: 'A forced name change was the chance to rebuild an outdated website',
        paragraphs: [
          'Midoma used to be called SolidHomes. I created its brand and built its first website in WordPress when I was less skilled, which you can read about in the [SolidHomes case study](/work/solidhomes). With the company growing and planning new branches, that website had become a problem. Over time it stopped looking professional, and it needed constant updates. The tipping point came when the company had to change its name because of competition. Instead of putting a new name on an old site, I decided to rebuild it from the ground up.',
          'I worked completely alone. I didn’t start from zero, though: I reused the user research, competitor research and stakeholder interviews I had done for the original website, and applied them with better design thinking, more refined skills and a much faster tech stack.',
          'The website has two kinds of users. Owners of apartment buildings, often families, are choosing a company to trust with their property. Tenants of those buildings want to report a fault, find a phone number or read a notice, quickly. Many of them are older.',
          'I defined the design and business goals I wanted to achieve with the project:',
        ],
        bullets: [
          'I wanted one consistent look that every future branch of the company can use, even when new designers join.',
          'I wanted a modern design that older owners and tenants find easy to use and trustworthy.',
        ],
        images: ['/work/images/midoma-before-after.webp'],
      },
      {
        chapter: { title: 'The design system', nav: 'Design system' },
        heading: 'I started with foundations: every color named by its job',
        paragraphs: [
          'Before I get to how the goals were achieved, let’s take a look at the process of making the design system. For inspiration, I looked at Dribbble and image search to understand the current trends.',
          'One major design constraint I had to take into account was that the logo and its green had to stay. The structure and content of the old site were also working well, so I kept them and focused on the details.',
          'To begin with, I defined the basic building blocks: typography, colors and corners. Every color got a name that describes its job rather than its look, for example cta, sea or danger. This way a new designer knows where a color may go before using it.',
          { type: 'image', src: '/work/images/midoma-foundations.webp', alt: 'Foundations sheet: Manrope for headings and Overpass for text with the type scale from 48 px page titles to 15 px small text, color swatches grouped as brand, one job each (sea for forms, domsys for the app, danger for emergencies only) and grounds and tiles, and corner radii of 12, 20, 32 px and pill' },
        ],
      },
      {
        heading: 'The foundations grew into 11 documented components',
        paragraphs: [
          'Things got more interesting and tangible when I started combining these foundations into components, like buttons, cards and the header, and then into patterns like the bento home page. Every component documents its rules, what a page must provide and what not to do.',
          { type: 'image', src: '/work/images/midoma-strip.webp', alt: 'How the system builds up: tokens, then 11 components, then patterns such as the bento home page, the menu and the page header, then the two websites' },
          { type: 'image', src: '/work/images/midoma-components.webp', alt: 'Live components from both sites: the header with page title, bento tiles, a step list, a notice card, the AskUs box and the orange main button' },
        ],
      },
      {
        heading: 'Goal 1: one system keeps both sites, and every future branch, consistent',
        paragraphs: [
          'The old site had inconsistent sizing, spacing and colors, and with new branches coming, this would only get worse. Here’s how I made sure the system stays consistent:',
          '1. I wrote down six design principles that every screen follows. They explain why the sites look the way they do, and they get the company, designers and developers on the same page.',
          { type: 'image', src: '/work/images/midoma-principles.webp', alt: 'Six design principles: one main CTA per screen, task-oriented design, be wary of borders, every color has one job, smooth transitions, readable for older eyes' },
          '2. I kept the whole design system as Markdown files: the tokens, the rules, a page per component and a changelog of every version. It also exists as a Claude skill, so it can be transferred to any new project very easily. This way the next designer, or the next branch of the company, starts from the system instead of a blank page.',
          '3. I used the system on two websites at once. Both share the logo, header, type and orange call to action, but each asks something different of its visitors. midoma.cz is clear and structured, because owners are choosing a business to trust with their building. The tenant portal skips the introduction and opens on one tile per task, because tenants just want to solve a problem as fast as possible.',
          {
            type: 'videoPair',
            videos: [
              { src: '/work/videos/midoma-owners.mp4', caption: 'midoma.cz: built to earn owners’ trust' },
              { src: '/work/videos/midoma-tenants.mp4', caption: 'Tenant portal: the fastest way to find information' },
            ],
          },
        ],
      },
      {
        heading: 'Goal 2: same colors, new rules, so older users always see the next step',
        paragraphs: [
          'Color plays a big part in how quickly people understand a page. Earlier, in the old site, I overused green and purple. Green filled backgrounds, blocks and buttons, so nothing stood out. I explored more muted combinations and kept coming back to purple, because it matches the green but feels fresher. Therefore I kept the same colors and changed the rules for using them. Here are the changes I made:',
          { type: 'image', src: '/work/images/midoma-green.webp', alt: 'Imagery that supports the brand identity: the green Midoma logo next to the site photos, each chosen for its trees, greenery or plants, and the purple and lavender interface colors' },
        ],
        bullets: [
          'I removed green from interface elements like backgrounds, blocks and buttons. Instead, I chose photos with trees, gardens and plants, so the brand green from the logo carries through the page without looking dated.',
          'I made orange the color of the main action only, one per screen. Because nothing else is orange, the next step always stands out.',
          'I separated blocks by color instead of borders, so pages feel calm and each block is easy to tell apart.',
          'I raised the smallest reading size to 15 px and kept every text and background pair at least 4.5:1, because many owners and tenants are older.',
        ],
      },
      {
        chapter: { title: 'Built and tested with AI', nav: 'AI' },
        heading: 'AI-assisted UX and development: from prompts to rules to a design system',
        paragraphs: [
          'I started by writing a product requirements document (PRD) with Claude in chat. Then I moved to Claude Code, rebuilt the old site one-to-one and redesigned it one prompt at a time. Every decision became a written rule that the next change had to follow, and over time these rules became the design system.',
          'Before building the tenant portal, I also asked Claude to review the plan from three points of view: a tenant in a hurry, a first-time tenant and a manager. Accessibility audits followed every round of changes.',
        ],
      },
      {
        heading: '1,010 synthetic test scenarios found issues before publishing',
        paragraphs: [
          'With almost no real traffic yet, I asked Claude to test the sites the way real people do. It ran 1,010 scenarios in four suites: screens (550 combinations of page and screen size, from 320 to 1920 px and at 200% zoom), odd addresses, form fuzzing (filling the forms with nonsense, and worse) and quiz paths. On top of that, it walked five personas through real tasks, among them Jarmila, 72, and Petr, who uses a screen reader.',
          { type: 'image', src: '/work/images/midoma-testing.webp', alt: 'What synthetic testing found: issues across screen sizes, forms, the quiz and five personas' },
          'The AI found the issues, but I decided what to fix:',
        ],
        bullets: [
          'Fixed: the Back button left the quiz and lost every answer.',
          'Fixed: screen readers read whole cards as one paragraph.',
          'Not changed: moving the emergency tile higher. I want to test this with real tenants first.',
          'After the fixes, all 11 re-tests passed.',
        ],
      },
      {
        chapter: { title: 'Outcomes', nav: 'Outcomes' },
        heading: 'The system now works for the company, designers, developers and users',
        paragraphs: [
          { type: 'image', small: true, src: '/work/images/midoma-lighthouse.webp', alt: 'Lighthouse scores: midoma.cz performance 97 on mobile and 99 on desktop, the tenant portal 95 and 100; accessibility, best practices and SEO 100 on both sites' },
        ],
        bullets: [
          'Company: both websites now look consistent, any new branch can build on the same system, and both sites publish a plain-language summary for AI assistants (llms.txt).',
          'Designers: written rules, components and a changelog, kept in Markdown and as a Claude skill, make it a lot easier for a new designer or a new project to start.',
          'Developers: the system is built from the code, so what is documented is what is live.',
          'Owners and tenants: both sites score 100 for accessibility, SEO and best practices, with performance at 95–100.',
        ],
      },
      {
        heading: 'Synthetic users helped, but real users come next',
        paragraphs: [
          'Synthetic testing turned out to be a great tool for issues that could otherwise go unnoticed for a long time, for example the “Tenants” label overflowing the logo when a phone uses large text. But the personas are simulated. They don’t feel the stress of a burst pipe, and they can’t tell me whether they trust what they see.',
          'Next time, I would make real user testing part of the whole project. This work is clearly missing how actual users experience it. Now that both websites are live, this knowledge will come from real use, and over the next months I will gather feedback through short surveys, in a gentle, non-invasive way.',
          'Building this design system took a lot of back and forth, especially with the colors. But it was definitely worth the effort.',
        ],
      },
    ],
  },
  {
    slug: 'solidhomes',
    title: 'SolidHomes',
    tagline: 'Building trust for a family property business with no online presence',
    intro:
      'SolidHomes is a property management company in Prague that had no brand when I started. The stakeholders knew they needed to grow, but not who they wanted to reach. This case study covers the research and the branding: how interviews, a benchmark and three logo concepts turned that uncertainty into a clear brand.',
    year: '2024',
    role: 'Designer: research and brand identity',
    duration: '14 days',
    tools: ['Figma', 'Illustrator'],
    heroImage: '/work/images/solidhomes-1.webp',
    hero: {
      logo: '/work/images/solidhomes-logo-white.webp',
      client: 'SolidHomes, a family property management company in Prague',
      deliverables: ['Brand identity', 'UX research'],
      builtWith: 'Figma and Illustrator',
      imageAlt: 'The SolidHomes brand in use on the company’s website',
      background: 'radial-gradient(55% 80% at 0% 0%, rgb(122 178 98 / 0.28), transparent 70%), linear-gradient(135deg, #22382a 0%, #2b4433 100%)',
    },
    skills: [
      { name: 'Brand identity', share: 30 },
      { name: 'User research', share: 20 },
      { name: 'Stakeholder management', share: 20 },
      { name: 'Competitive benchmarking', share: 15 },
      { name: 'Accessibility (color)', share: 15 },
    ],
    skillsNote: 'Estimated share of my time on the project, looking back at how long each part took.',
    sections: [
      {
        chapter: { title: 'The brief', nav: 'Brief' },
        heading: 'A company with no brand, no audience and no website',
        paragraphs: [
          'SolidHomes needed to grow its market presence, but it had no brand identity and no defined audience. Before anything could be designed, someone had to find out who the company was for. The company has since been renamed Midoma, and the [Midoma case study](/work/midoma) shows how I rebuilt it with a design system.',
          'I defined the goals I wanted to achieve with the project:',
        ],
        bullets: [
          'I wanted a clear brand position, in a market split between cold corporate sites and outdated, text-heavy ones.',
          'I wanted older Czech property owners, who are skeptical of modern interfaces, to trust the brand.',
          'I wanted a brand system complete enough for the client to build on.',
        ],
      },
      {
        chapter: { title: 'Research', nav: 'Research' },
        heading: '“Anybody”: defining the audience was the first design problem',
        paragraphs: [
          'To begin with, I did secondary market research and a competitor analysis, then interviewed property owners about what they expect. The market had two extremes: polished, sales-driven sites on one end and outdated information dumps on the other. Neither built real trust with the audience SolidHomes needed.',
          'When I asked the client who they wanted to reach, the answer shaped the whole research phase. Defining the audience wasn’t optional, it was the first design problem to solve. I created a persona for that audience: older adults, families who own buildings and people with limited technical confidence.',
        ],
        quote: {
          text: 'Anybody. I would be happy to sell my services to frogs for all I care.',
          attribution: 'Stakeholder, at project kickoff',
        },
        persona: {
          photo: '/work/images/solidhomes-3.webp',
          name: 'Jan Novák, 58',
          bio: [
            'Prague-based teacher and residential property owner',
            'Values clear communication and direct contact options',
            'Prefers trustworthy, professional design over modern or sales-driven interfaces',
            'Not confident with technology, expects information to be easy to find without scrolling',
            'Wants to understand services and pricing before making contact',
            'Represents the wider audience: older adults, families owning buildings, users with limited technical confidence',
          ],
        },
      },
      {
        heading: 'A speed benchmark settled what opinions couldn’t',
        paragraphs: [
          'The stakeholders’ opinions on brand direction were split, and more conversation didn’t help. So instead of asking for another opinion, I benchmarked page weight and estimated bounce rate on 6 competitor sites.',
          'The text-heavy sites were slow. Going by industry benchmarks for that load time, they likely lost well over 70% of visitors before the page finished loading. The polished sites loaded fine, but used language the property owners I interviewed called untrustworthy. This defined the brand position: fast, structured and plainly worded, between the two extremes.',
        ],
      },
      {
        chapter: { title: 'Branding', nav: 'Branding' },
        heading: 'Three logo concepts gave the client words for what they wanted',
        paragraphs: [
          'The stakeholders couldn’t describe their preferences in words, so I explored three logo concepts. Reacting to visuals gave them a language for it. They saw what was missing in each option, and the decision made itself.',
        ],
        options: [
          {
            label: 'A',
            description: 'Sleek black typography, high-end and minimal. It looked refined but felt cold, wrong for an audience looking for personal, trustworthy service.',
            image: '/work/images/solidhomes-logo-a.webp',
          },
          {
            label: 'B',
            description: 'A playful custom font with bright colors. Energetic, but too casual for the context and the audience.',
            image: '/work/images/solidhomes-logo-b.webp',
          },
          {
            label: 'C',
            description: 'A clean sans-serif with a green accent. Credible without being cold. Green set SolidHomes apart from mostly blue competitors, while reading as stable and approachable.',
            image: '/work/images/solidhomes-logo-c.webp',
            chosen: true,
          },
        ],
      },
      {
        heading: 'Every brand color got one job, chosen for older eyes',
        paragraphs: [
          'The brand green anchors the identity, but it couldn’t carry everything on its own. The audience includes older people whose eyesight may be declining, so contrast wasn’t optional. Here’s how I divided the work between the colors:',
        ],
        bullets: [
          'Green anchors the brand and sets SolidHomes apart from mostly blue competitors.',
          'Purple carries buttons and calls to action, because it contrasts strongly with green without competing with it.',
          'Yellow is for links on dark backgrounds, where green would disappear.',
        ],
      },
      {
        heading: 'A complete brand system the client can build on',
        paragraphs: [
          'I delivered the main logo, a favicon, a stacked version for email signatures, the full color palette and a typography specification. The brand launched with the company’s bilingual website. When the company later had to change its name, the logo and its green carried over into [Midoma](/work/midoma).',
        ],
      },
      {
        chapter: { title: 'Outcomes', nav: 'Outcomes' },
        heading: 'Research turned an undefined brief into a clear brand',
        paragraphs: ['SolidHomes went from no identity to a defined position, a persona for its audience and a complete brand system. Here’s what the research changed:'],
        bullets: [
          'The audience went from “anybody” to a persona: older owners, families and people with limited technical confidence.',
          'A split stakeholder debate was settled by a benchmark instead of taste.',
          'The logo was chosen by reacting to three concepts, not by writing a brief.',
        ],
      },
      {
        heading: 'A client who can’t say what they want is still telling you something',
        paragraphs: [
          'The most useful thing I did on this project wasn’t design work. It was changing how I worked with the stakeholders. When someone can’t put their audience or brand into words, asking for a clearer brief doesn’t help. Showing three different options and watching which one made them uncomfortable taught me more than any interview question.',
          'Advocating for the user here meant first defining who that user was. Once the persona existed, the logo, the colors and the tone of the copy all made sense.',
        ],
      },
    ],
  },
  {
    slug: 'promptkee',
    title: 'PromptKee',
    tagline: 'Helping teachers actually use the AI tools they already have',
    intro:
      'Teachers in Uppsala got access to powerful AI tools and a short onboarding session. Most of them stopped using the tools, because the interface assumed knowledge they didn’t have. I designed and built PromptKee to fix that.',
    year: '2026',
    role: 'Product designer, end-to-end',
    duration: '10 weeks',
    tools: ['Figma', 'Claude'],
    heroImage: '/work/images/promptkee-1.webp',
    hero: {
      client: 'Teachers in Uppsala',
      deliverables: ['Web app', 'UX research'],
      builtWith: 'Figma and Claude',
      imageAlt: 'PromptKee on four phones: the start page, choosing a task and filling in a form',
      background: 'radial-gradient(55% 80% at 0% 0%, rgb(214 72 140 / 0.3), transparent 70%), linear-gradient(135deg, #3a1838 0%, #2d1b4a 100%)',
    },
    skills: [
      { name: 'User research', share: 20 },
      { name: 'Content and UX writing', share: 15 },
      { name: 'Visual and UI design', share: 15 },
      { name: 'Prototyping and front-end', share: 15 },
      { name: 'Usability testing', share: 15 },
      { name: 'Research synthesis', share: 10 },
      { name: 'Ideation and concepts', share: 10 },
    ],
    skillsNote: 'Estimated share of my time on the project, looking back at how long each part took.',
    sections: [
      {
        chapter: { title: 'The brief', nav: 'Brief' },
        heading: 'Teachers had AI tools, but most of them stopped using them',
        paragraphs: ['I worked as the product designer, end to end, for 10 weeks. I defined the goals I wanted to achieve:'],
        bullets: [
          'I wanted teachers to write reliable prompts without learning prompt engineering.',
          'I wanted to remove the language uncertainty before they even start.',
          'I wanted the tool to work during real lesson prep, not only in training sessions.',
        ],
      },
      {
        chapter: { title: 'Research', nav: 'Research' },
        heading: 'It was a trust problem, not an adoption problem',
        paragraphs: [
          'To begin with, I interviewed teachers and read what people say openly about AI tools on platforms like Reddit. I used an AI tool to scrape and summarize 42 discussion threads, so I could get through much more material than by hand.',
          'Two things came up again and again. Teachers didn’t know what makes a prompt work or how to reduce the risk of hallucinations. Small changes in wording gave completely different results, so the tool felt unpredictable and they stopped trusting it. Several teachers were also unsure whether to write in Swedish or English, and that alone stopped some of them from starting.',
          'When I sorted the threads by complaint, about two-thirds were about not trusting the output, and a much smaller share about not being interested in AI at all. That’s why built-in accuracy rules became the core of the product.',
        ],
        quote: { text: 'AI can’t be trusted, it makes stuff up constantly.', attribution: 'Teacher interviewed during research' },
        persona: {
          photo: '/work/images/promptkee-2.webp',
          name: 'Johanna, 46',
          bio: [
            'History and Swedish teacher at a primary school, mentor',
            'Prepares own materials carefully and adapts content to student interests',
            'Has tried AI tools but finds results unreliable and inconsistent',
            'Unsure whether to write prompts in Swedish or English, and whether it matters',
            'Feels that AI takes more time than it saves',
            'Open to AI usage, uses it for brainstorming ideas',
            'Interested in learning more about AI, but the time investment has not felt worth it so far',
          ],
        },
      },
      {
        chapter: { title: 'Design', nav: 'Design' },
        heading: 'Of three directions, only pre-filled forms helped during lesson prep',
        paragraphs: ['I followed the double diamond and explored three directions, then compared them against what teachers need:'],
        options: [
          { label: 'A', description: 'A prompting coach. Great for learning, but it didn’t help teachers during actual lesson planning.' },
          { label: 'B', description: 'An AI-powered checker. Accurate, but it used too many tokens to be sustainable.' },
          { label: 'C', description: 'Pre-filled forms with a rule-based checker. Gentle guidance and a practical result, ready to use straight away.', chosen: true },
        ],
        images: ['/work/images/promptkee-3.webp'],
      },
      {
        heading: 'A ready-to-use prompt in three steps',
        paragraphs: [
          'PromptKee is a web-based prompt generator. From the research, I identified the 10 most common ways teachers use AI, and each one got its own pre-filled form. Teachers fill in the details, generate a prompt and paste it into whichever AI tool they use.',
          'Every prompt includes built-in rules: the AI can’t lie, must admit when it doesn’t know something and must keep the output suitable for school. Teachers don’t need to know any of this, because it happens automatically.',
        ],
      },
      {
        chapter: { title: 'Outcomes', nav: 'Outcomes' },
        heading: 'Teachers who had given up on AI wrote a prompt on their first try',
        paragraphs: [
          '2 out of 2 teachers who had given up on AI completed a structured prompt on their first try, without help. With the interface in Swedish, I saw no language hesitation. All 3 teachers in the wider test group responded positively.',
          'Testing also showed that the interface still assumed more understanding of AI than most teachers have. They had no mental model of what the tool does behind the scenes. I had underestimated this. The fix would be simpler language and contextual cues that make the process more transparent.',
        ],
      },
      {
        heading: 'What the study left unanswered',
        paragraphs: ['Teachers have no time for onboarding, so the design has to be obvious right away or it won’t be used. A small test couldn’t answer everything:'],
        bullets: [
          'Are the 10 categories the right ones, or are there gaps that only show up in real use?',
          'Do teachers find AI answers more reliable with the built-in rules?',
          'Is copying and pasting enough friction to stop people from coming back?',
          'Does the tool change how teachers feel about AI over time, not just in the moment?',
        ],
      },
      {
        heading: 'Access to a tool is not the same as being able to use it',
        paragraphs: [
          'Giving people a tool is not enough. If the interaction is unclear, they stop and blame the tool. The teachers I spoke with were right to be frustrated: the way in just had too much friction.',
          'Language also turned out to be a UX problem, not only a content one. For some users, an interface in their own language decides whether they feel confident enough to start at all. That makes it an accessibility question too.',
        ],
      },
    ],
    externalLink: { label: 'View the live tool', href: 'https://bgux.net/promptkee/' },
  },
  {
    slug: 'memory-game',
    title: 'JavaScript Memory Game',
    tagline: 'What does good UX look like when your user is four years old and losing patience?',
    intro:
      'This started as a JavaScript course project, and I turned it into a UX research problem. Children ages 3 to 8 have very different abilities, attention spans and motor control, so making one game for all of them meant testing with real children.',
    year: '2025',
    role: 'Designer and developer, end-to-end',
    duration: '4 weeks',
    tools: ['JavaScript', 'HTML5', 'CSS3', 'Figma'],
    heroImage: '/work/images/memory-game-1.webp',
    hero: {
      client: 'Children ages 3–8',
      deliverables: ['Web game', 'Usability testing'],
      builtWith: 'JavaScript, HTML and CSS',
      imageAlt: 'The memory game: animal cards and three difficulty buttons',
      background: 'radial-gradient(50% 75% at 100% 100%, rgb(236 213 143 / 0.22), transparent 70%), linear-gradient(135deg, #2a2266 0%, #3a2f86 100%)',
    },
    skills: [
      { name: 'Front-end (JavaScript)', share: 25 },
      { name: 'Observational research', share: 20 },
      { name: 'Usability testing', share: 15 },
      { name: 'Interaction design', share: 15 },
      { name: 'Visual and UI design', share: 15 },
      { name: 'Accessibility', share: 10 },
    ],
    skillsNote: 'Estimated share of my time on the project, looking back at how long each part took.',
    sections: [
      {
        chapter: { title: 'The brief', nav: 'Brief' },
        heading: 'One memory game for children ages 3 to 8',
        paragraphs: ['I designed and built the game end to end, in four weeks. My users couldn’t tell me what was wrong, so I defined the questions the design had to answer:'],
        bullets: [
          'How can a game work for a 3-year-old without boring an 8-year-old?',
          'How can touch work for children with limited fine motor control?',
          'How can the game keep children playing, when frustration makes them quit?',
        ],
      },
      {
        chapter: { title: 'Research', nav: 'Research' },
        heading: 'A frustrated four-year-old does not try again',
        paragraphs: ['Children this age can’t explain what isn’t working, so I watched them play instead of asking them. I ran informal test sessions across the whole age range. Four things came up again and again:'],
        quote: { text: 'The timer is too fast! I can’t remember that quick!', attribution: 'Testing participant, age 4' },
        bullets: [
          'Younger children couldn’t handle time pressure.',
          'Familiar animals worked better than abstract shapes.',
          'Touch accuracy varied a lot by age.',
          'The reaction to failure was fast and total.',
        ],
        images: ['/work/images/memory-game-2.webp'],
      },
      {
        heading: 'Timing every round showed where children give up',
        paragraphs: [
          'Alongside my notes, I timed every round with a stopwatch. A round took about 46 seconds on easy and 21 seconds on hard, so the difficulty levels pace as intended. The timing also showed the frustration threshold: rounds that ran past about 90 seconds without a match ended with a child giving up. That set the upper limit for how long a round may run.',
        ],
      },
      {
        chapter: { title: 'Design', nav: 'Design' },
        heading: 'Three levels, familiar animals and touch targets for small hands',
        paragraphs: ['Following the double diamond, I turned these findings into design rules. Here’s what I did:'],
        bullets: [
          'I made three difficulty levels mapped to age. Easy mode has fewer cards and more time, hard mode is fast-paced for older children.',
          'I used purple and yellow for strong contrast, and animal photos children recognize right away.',
          'I added a clear flip animation, so every tap confirms itself.',
          'I sized fonts, card spacing and touch targets for young children’s motor skills, not standard web conventions.',
        ],
        images: ['/work/images/memory-game-3.webp'],
      },
      {
        chapter: { title: 'Outcomes', nav: 'Outcomes' },
        heading: 'Each level reached the age it was made for',
        paragraphs: [
          'In testing, 3-year-olds completed easy mode, and 8-year-olds found hard mode challenging. The most unexpected finding was that younger children sometimes stopped playing to explore the visuals, and ran out of time. That’s a problem, but it also means the visuals were doing their job.',
          'Looking back, here’s what the game still lacks:',
        ],
        bullets: [
          'Reliable touch handling for children under 5: taps still drop occasionally.',
          'Difficulty that adapts in real time to how the child plays, so nobody has to choose a level.',
          'Structured usability testing with a larger group, to confirm the findings hold.',
          'Completion rate and round time per level from real usage data, instead of a stopwatch in a few sessions.',
        ],
      },
      {
        heading: 'Designing for children means testing every assumption again',
        paragraphs: [
          'Children won’t tell you the timer is too fast in a feedback form, they just stop playing. Every assumption I brought from web design had to be tested again: touch targets that seemed generous weren’t, and time limits that seemed fair weren’t.',
          'The most valuable moment wasn’t a design decision. It was watching a 4-year-old forget to play because she was too interested in the animals. Accessibility for this audience isn’t only contrast and font sizes, it’s understanding what attention looks like at four and designing around it.',
        ],
      },
    ],
    externalLink: { label: 'Play the game', href: 'https://bgux.net/gameMemory/' },
    githubLink: 'https://github.com/Baragustay/Memory-Game',
  },
]

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug)
}
