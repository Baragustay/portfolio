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
  | string
  | { type: 'image'; src: string; alt?: string }
  | { type: 'video'; src: string; heading?: string; autoplayLoop?: boolean }

export type Section = {
  heading: string
  eyebrow?: string
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
  // iterations") — separate from `eyebrow`, which belongs to the
  // section as a whole and sits up near `heading`.
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
  githubLink?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'piggy-bank',
    title: 'Piggy Bank App',
    tagline: 'Children ages 4-7 handling money in a cash-free world: an interface for the child-facing part of a money-saving app.',
    intro: '',
    year: '2026',
    role: 'UX/UI designer, end-to-end',
    duration: '4 weeks',
    tools: ['Figma', 'Illustrator', 'Claude (brainstorming)', 'Gemini (image generation)'],
    heroImage: '/work/images/piggy-bank-1.webp',
    sections: [
      {
        heading: 'The challenge',
        paragraphs: [
          'Small children want to be able to handle money but parents often don’t carry coins on them.',
        ],
        bullets: [
          'How do we make sure children who can’t read yet can still fully engage with the app?',
          'How do we create a tool that makes it easy for both parents and small children to track pocket money?',
          'How do we keep the app simple enough for small children to enjoy, without losing functionality?',
        ],
      },
      {
        heading: 'Research',
        eyebrow: "What's the problem?",
        paragraphs: [
          'Younger children wanting to handle their pocket money in a cashless society is a problem many parents and caregivers are already trying to solve. There are various apps both from banks and private developers  already avilable.',
          'Bomad, for example, is a piggy bank app designed for older kids, now moving towards connecting with real bank accounts. But there is currently no "go-to" solution that parents trust and kids enjoy. Competitor analysis showed that bank apps were hard to test without creating accounts and paying subscriptions, and the apps from private developers were often buggy or unfinished - none focused specifically on the youngest age group.',
          'Secondary research (comment sections under various piggy bank apps in the App Store, Reddit threads and Facebook discussions) and informal conversations with 5 parents at a local playground revealed what users are looking for and what’s missing on the market.',
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
        heading: 'Process',
        eyebrow: 'Design challenges',
        paragraphs: [
          'Clear and simple messaging, making saving feel visual: the first idea was to fill the piggy bank with an image of what the child is saving for - for example a rabbit photo inside a pig shape. That turned out to be visual clutter with low contrast and unclear visual cues. Instead, each pig fills up with its own color. Large buttons or clickable objects ensure children don’t miss them, and simple words are used across the app instead of longer phrases - "Total" not "Altogether you have saved."',
          'Autonomy and accessibility mattered most: children aged 4-7 can’t read, or can’t read well, so every text and number needed to work without literacy. As a bonus, the talking app gives parents awareness of what the child is doing without having to watch over their shoulder.',
          {
            type: 'image',
            src: '/work/images/piggy-bank-2.webp',
            alt: 'Piggy Bank history screen showing colour-coded transactions, next to an earlier layout of the same screen',
          },
          'Keeping the app fun while functionality is limited on purpose: the child can take photos and choose their own avatar, count and move coins inside a piggy bank, and drag-and-drop (or tap-and-tap) to sort money into their piggy banks. History shows big colorful numbers and pictures of what they earned or spent money on. Limited options, but every one of them feels good to use.',
          { type: 'video', src: '/work/videos/piggy-bank-demo.mp4', autoplayLoop: true },
        ],
        bullets: [
          'All text and numbers get read aloud on tap, so a child never has to read to use the app',
          'Icons and distinct colors on every button, so nothing depends on reading',
          'Color guidance throughout: green for money in, red for money out',
          'Large text in a legible font, short words, and repetition to help memorize meaning',
          'High contrast and large tap targets sized for developing motor skills',
          'Functionality limited on purpose, to keep focus on saving, reading, and counting',
        ],
        carouselHeading: 'Design iterations',
        carousel: [
          { src: '/work/images/piggy-bank-evolution-1.webp', caption: 'v1 - low contrast, redundant notification text, a confusing single savings visualisation' },
          { src: '/work/images/piggy-bank-evolution-2.webp', caption: 'v2 - simplified the balance overview, but the details/overview toggle turned out redundant for this age group' },
          { src: '/work/images/piggy-bank-evolution-3.webp', caption: 'v3 - tried filling each pig with a photo of what the child was saving for; too much visual clutter, low contrast' },
          { src: '/work/images/piggy-bank-evolution-4.webp', caption: 'v4 - back to flat color fills per goal, refining the palette for cohesiveness' },
          { src: '/work/images/piggy-bank-evolution-5.webp', caption: 'v5 - final direction: large hand-drawn type, one flat color per goal, a simplified color-coded menu' },
        ],
      },
      {
        heading: 'Solution',
        eyebrow: 'A mobile app with audio guidance and two different interfaces',
        paragraphs: [
          'A dual mobile app with a simple, fun interface for children and a sister app on the caretaker’s device where all administrative tasks take place. Some adult settings can be accessed inside the child’s app so adjustments can be made without switching devices - these are hidden behind a math equation only adults can answer.',
          'The child’s interface has limited functionality on purpose. Fewer options means no decision fatigue. The child stays focused on what the app is actually for: learning to save money, read, and count. Every text and number has voice support so children who can’t read yet can use the app on their own.',
        ],
        images: ['/work/images/piggy-bank-4.webp'],
      },
      {
        heading: 'User testing',
        eyebrow: 'Kids couldn’t use the Figma prototype, but validated the concept when shown a demo',
        paragraphs: [
          'I tested the high-fidelity Figma prototype with three children (ages 3, 5 and 8), but the testing didn’t go as expected. Since the prototype was a bit laggy and not fully functional, the children lost interest quickly - for this age group, a working MVP would likely produce better test results than a Figma prototype.',
          'I also ran a guided demonstration, walking the children through the intended user flow. Children were excited about the design, and all three expressed interest in having the app for real so they could track their own savings and explore on their own.',
          'The child’s interface walks through four main paths: logging in / failed login, viewing savings, receiving money and sorting it into piggy banks, and exploring what’s inside each piggy bank (history, changing user avatar, logging out). Every screen uses large tap targets and simple icons so the app works without reading - in the full product, all text and numbers would be accompanied by audio on tap.',
        ],
        images: ['/work/images/piggy-bank-3.webp'],
        imagesMaxHeight: 310,
      },
      {
        heading: 'Outcomes',
        eyebrow: 'A validated concept',
        paragraphs: [
          'This project is a validated concept. Guided demo confirmed interest from children in the target age range, but the working MVP needed to properly test usability with 4-7 year olds still needs to be built.',
        ],
        bullets: [
          'Build a working MVP so testing measures real interaction, not a laggy prototype',
          'Design and test the caretaker-facing app, currently out of scope for this phase',
          'Re-test the on-tap audio reader with non-readers specifically, to confirm it removes the literacy barrier it was designed for',
          'Validate the math-equation adult lock with real parents, to check it is not confusing to set up or to use',
        ],
      },
      {
        heading: 'Measuring Success',
        paragraphs: [
          'This project didn’t launch, so there’s no usage data yet. Here’s how I’d use it if it had.',
          'I’d track completion rate on each core flow: logging in, sorting money into piggy banks, checking history. A high drop-off on sorting would tell me the drag-and-drop interaction needs a simpler option, like tap-to-select instead.',
          'I’d watch how often kids tap the on-tap reader versus ignore it. Low usage might mean the audio cue isn’t obvious enough, not that kids don’t want it.',
          'I’d ask parents to compare how often they check the caretaker app against how often they used their old method, a Notes app or mental math. That’s the real success metric: did this replace something that wasn’t working.',
          'I’d retest with the same kids after a few weeks, not just once. A novelty app looks different on day one than it does once the novelty wears off.',
          {
            type: 'video',
            src: '/work/videos/piggy-bank-walkthrough.mp4',
            heading: 'Full app walkthrough',
          },
        ],
      },
      {
        heading: 'Reflection',
        eyebrow: 'Less is more',
        paragraphs: [
          'The biggest takeaway from this project was getting comfortable removing features that were already designed and added. It’s tempting to see a good app as one with many options and room for personalisation. But user data and the actual capabilities of 4-7 year olds ask for simplicity. Stripping features and using that space for larger fonts, bigger tap targets, and audio feedback made the app better and more accessible.',
          'To create a full app design, the adult interface needs to be thought out and designed as well. That process would likely reveal some missing pieces in the child’s interface and help improve it too.',
        ],
      },
    ],
  },
  {
    slug: 'solidhomes',
    title: 'SolidHomes',
    tagline: 'Building trust for a family property business with no online presence',
    intro:
      'SolidHomes is a Prague-based property management company with no website and no brand identity at the start of this project. Stakeholders knew they needed to grow their market presence but couldn’t define who they were trying to reach or how they wanted to be perceived. This is the story of how research, three logo concepts, and a lot of stakeholder conversations turned that uncertainty into a cohesive brand and a live bilingual website.',
    year: '2025–2026',
    role: 'Product designer, end-to-end',
    duration: '10 weeks',
    tools: ['Figma', 'Illustrator', 'WordPress'],
    heroImage: '/work/images/solidhomes-1.webp',
    sections: [
      {
        heading: 'The challenge',
        paragraphs: ['No brand, no audience, no starting point.'],
        bullets: [
          'Help stakeholders define a brand position in a market split between cold corporate sites and outdated text-heavy ones?',
          'Build trust with older Czech property owners who are skeptical of modern interfaces?',
          'Create a site that a non-technical client can actually maintain after handoff?',
        ],
      },
      {
        heading: 'Research',
        eyebrow: 'Understanding the problem before building anything',
        paragraphs: [
          'I started with secondary market research and competitor analysis, then conducted interviews with property owners to understand their expectations. The market analysis revealed a clear split: highly polished sales-driven sites on one end, outdated information dumps on the other. Neither was building real trust with the audience SolidHomes needed.',
          'Early stakeholder conversations revealed that the client had no defined target audience. When asked who they wanted to reach, the answer was: "Anybody. I would be happy to sell my services to frogs for all I care." That quote shaped the entire research phase - defining the audience wasn’t optional, it was the first design problem to solve.',
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
            'Representative of the broader audience: older adults, families owning buildings, users with limited technical confidence',
          ],
        },
      },
      {
        heading: 'Data & insights',
        eyebrow: 'Letting numbers settle an argument opinions couldn’t',
        paragraphs: [
          'Stakeholder opinions on brand direction were split with no way to resolve it through more conversation, so I ran a quick benchmark instead of asking for another opinion: page weight and estimated bounce rate across 6 competitor sites. The text-heavy "information dump" sites were slow to load and, going by industry benchmarks for that load time, likely losing well over 70% of visitors before the page even finished rendering. The polished, sales-driven sites loaded fine but used language the interview participants specifically described as untrustworthy. Neither extreme was a style preference to settle by taste, it was a measurable trust-and-speed gap to close.',
          'That benchmark, not a subjective design opinion, is what defined the brand position: fast-loading, structured, and plainly worded rather than either extreme.',
        ],
      },
      {
        heading: 'Process',
        eyebrow: 'Double diamond, applied',
        paragraphs: [
          'Discover: competitor audit, stakeholder interviews, property owner research to define target audience. Define: core audience identified - older users, families, low technical confidence - with brand positioning placed deliberately between the two market extremes. Develop: three logo concepts explored, brand system built from the chosen direction, wireframes developed with shallow navigation and large accessible type. Deliver: high-fidelity prototype, WordPress implementation, bilingual SEO-optimised site launched.',
          'The three-concept exercise turned out to solve more than a branding problem. Stakeholders couldn’t articulate their preferences in words, but responding to visuals gave them a language for it. They saw what was missing in each option, and the decision made itself.',
        ],
        options: [
          {
            label: 'A',
            description:
              'Sleek black typography, high-end and minimal. Looked refined but felt cold - wrong for an audience seeking personal, trustworthy service.',
            image: '/work/images/solidhomes-logo-a.webp',
          },
          {
            label: 'B',
            description:
              'Playful custom font with bright colors. Energetic, but too casual for the context and demographic.',
            image: '/work/images/solidhomes-logo-b.webp',
          },
          {
            label: 'C',
            description:
              'Clean sans-serif with a green accent. Credible without being cold - green differentiated SolidHomes from a blue-dominated competitor landscape while reading as stable and approachable.',
            image: '/work/images/solidhomes-logo-c.webp',
            chosen: true,
          },
        ],
      },
      {
        heading: 'Solution',
        paragraphs: [
          'SolidHomes launched with a bilingual website presenting services, pricing, and contact options clearly for an older, less technical audience. Typography was set larger than standard - 20px body minimum - with generous line height and a shallow navigation structure that doesn’t require scrolling to find key information. A city map showing managed properties replaced a description-only approach, giving users something visual to anchor their understanding of the business.',
          'The color system was built around accessibility from the start. The brand green anchors the identity but couldn’t carry the whole site functionally: purple handles buttons and CTAs because it creates strong contrast against green without competing with it, and yellow covers links on dark backgrounds, where green would disappear. Neither choice was aesthetic first - both exist because the target audience includes older users with potentially declining vision, and color contrast isn’t optional for them.',
          'The brand system included a main logo, favicon, stacked email signature version, full color palette, and typography specification, giving the client a complete foundation to build from.',
        ],
        images: ['/work/images/solidhomes-2.webp', '/work/images/solidhomes-4.webp'],
      },
      {
        heading: 'Outcomes',
        paragraphs: [
          'SolidHomes went from no online presence to a live, professional site with a defined brand identity. Real client inquiries started coming in within weeks of the January 2026 launch, with the full brand system, bilingual content, and SEO foundation in place. SEO is still in its early building phase, so organic traffic is low, but the infrastructure is in place and the key metrics to watch over the next three to six months are defined.',
          'Early analytics from the first six weeks post-launch showed an average session of around 2 minutes 40 seconds and a mobile bounce rate near 38%, a meaningful improvement over the well-over-70% bounce rate estimated for the old-style competitor sites used as the original benchmark, though the sample is still small enough that this reads as an early signal, not a conclusion.',
        ],
        bullets: [
          'Will organic visibility for "property management Prague" grow as the SEO foundation matures?',
          'Does the contact form convert, or do visitors call or email directly?',
          'Can the client update content independently over time without breaking the layout?',
          'Does having services and pricing available online actually reduce the time spent explaining the business in initial conversations?',
        ],
      },
      {
        heading: 'Reflection',
        eyebrow: "A client who can't tell you what they want is still telling you something",
        paragraphs: [
          'The most useful thing I did on this project wasn’t design work, it was reframing the stakeholder relationship. When someone can’t define their audience or their brand position in words, pushing for clearer briefs doesn’t help. Showing them three distinct options and watching which one makes them uncomfortable taught me more about what SolidHomes needed than any interview question could have.',
          'Advocating for the user here meant first doing the work of defining who that user actually was. The persona wasn’t a formality, it was the thing that made every subsequent decision defensible. Once the persona existed, the font size decision made sense, the navigation depth made sense, the tone of the copy made sense. Good design for this project meant starting with research the client didn’t know they needed.',
        ],
      },
    ],
  },
  {
    slug: 'promptkee',
    title: 'PromptKee',
    tagline: 'Helping teachers actually use the AI tools they already have',
    intro:
      'Teachers in Uppsala were given access to powerful AI tools and a short onboarding session. Most stopped using them. The interface assumed knowledge they didn’t have. This is the story of what happened when I tried to fix that.',
    year: '2026',
    role: 'Product designer, end-to-end',
    duration: '10 weeks',
    tools: ['Figma', 'Claude'],
    heroImage: '/work/images/promptkee-1.webp',
    sections: [
      {
        heading: 'The challenge',
        paragraphs: ['Three problems standing between teachers and AI.'],
        bullets: [
          'Help teachers write reliable prompts without teaching them prompt engineering?',
          'Remove language uncertainty before they even start?',
          'Make the tool usable during actual lesson prep, not in dedicated training sessions?',
        ],
      },
      {
        heading: 'Research',
        eyebrow: 'Understanding the problem before building anything',
        paragraphs: [
          'I conducted qualitative interviews with teachers and supplemented that with secondary research on platforms like Reddit, where people talk openly about their frustrations with AI tools. To speed that up, I used an AI tool to scrape and summarise discussion threads, which let me get through a much larger volume of material than I could have manually.',
          'What came up consistently: teachers did not know what made a prompt work and how to reduce the risk of AI hallucinations. Small changes in wording produced completely different results, with no explanation why. The tool felt unpredictable, so they stopped trusting it. Several teachers were genuinely unsure whether to write in Swedish or English and whether it affected the quality of the answer - that uncertainty alone was enough to stop some of them from starting.',
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
        heading: 'Data & insights',
        eyebrow: 'Reframing the problem with a number, not a hunch',
        paragraphs: [
          'The AI-assisted scrape covered 42 Reddit threads on teachers and AI tools. Coding those threads by complaint type showed roughly two-thirds referenced not trusting the output (hallucinations, inconsistent results, no idea why wording changed the answer), against a much smaller share citing lack of interest in AI at all. That ratio reframed the whole brief in Define: this was a trust problem wearing an adoption problem’s clothes, and it’s the reason the built-in accuracy rules became the product’s core feature rather than a footnote.',
        ],
      },
      {
        heading: 'Process',
        eyebrow: 'Double diamond, applied',
        paragraphs: [
          'Discover: teacher interviews and secondary research to understand real pain points. Define: core barriers identified as language uncertainty and cognitive load. Develop: three solution directions explored and evaluated against user needs. Deliver: designed, built, and launched - currently in user testing.',
        ],
        options: [
          {
            label: 'A',
            description:
              'Prompting coach. Great as a learning tool, but did nothing to help teachers during actual lesson planning.',
          },
          {
            label: 'B',
            description:
              'AI-powered checker. Functionally accurate but wasteful on tokens - not sustainable from a practical standpoint.',
          },
          {
            label: 'C',
            description:
              'Pre-filled forms + rule-based checker. Gentle guidance with a practical output, ready to use straight away.',
            chosen: true,
          },
        ],
        images: ['/work/images/promptkee-3.webp'],
      },
      {
        heading: 'Solution',
        eyebrow: 'A structured prompt in 3 steps',
        paragraphs: [
          'PromptKee is a web-based prompt generator. Based on research I identified the 10 most common AI use cases for teachers - each one has its own pre-filled form. Teachers fill in the relevant details, generate a prompt, and paste it into whichever AI tool they use.',
          'The generated prompt includes built-in rules: the AI cannot lie, must admit when it does not know something, and must always produce output suitable for a school environment. Teachers do not need to know any of this - it is handled automatically.',
        ],
      },
      {
        heading: 'Outcomes',
        eyebrow: 'Early signals are encouraging',
        paragraphs: [
          '2 out of 2 teachers who previously gave up on AI completed a structured prompt without help on their first try, and zero language hesitation was observed when the interface was shown in Swedish.',
          'All three teachers in the broader testing group responded positively to the concept. Testing also revealed that the interface still assumed more understanding of how AI works than most teachers have - users lacked a mental model for what the tool was doing behind the scenes. That’s something I had underestimated in the initial design, and it directly shaped the next iteration: simplifying the language and adding contextual cues to make the process more transparent.',
        ],
      },
      {
        heading: 'What testing taught me',
        eyebrow: 'The challenge I am still working on',
        paragraphs: [
          'The core tension in this project is how to give teachers a genuinely useful tool without asking them to learn anything new. Teachers do not have time for onboarding - the design has to be immediately obvious or it will not get used at all.',
        ],
        bullets: [
          'Are the 10 categories the right 10, or are there gaps that only show up in real use?',
          'Do teachers feel AI responses are more reliable when the built-in rules are applied?',
          'Is the copy-paste step a friction point significant enough to affect whether people return?',
          'Does using the tool change how teachers feel about AI over time, not just in the moment?',
        ],
      },
      {
        heading: 'Reflection',
        eyebrow: 'Access ≠ usability',
        paragraphs: [
          'Giving people a tool is not enough. If the interaction is unclear, users will stop and blame the tool, not the onboarding. The teachers I spoke with were not wrong to be frustrated - the entry point just had too much friction.',
          'Language turned out to be a UX problem, not just a content one. Offering the interface in the user’s own language is not a nice-to-have. For some users it directly affects whether they feel confident enough to start at all. That is an accessibility consideration as much as anything else.',
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
      'This started as a JavaScript course project. I turned it into a UX research problem. Children ages 3 to 8 have completely different cognitive abilities, attention spans, and motor control. Building one game that works across that range meant testing with real kids and redesigning everything I thought I already knew about interaction design.',
    year: '2025',
    role: 'Designer and developer, end-to-end',
    duration: '4 weeks',
    tools: ['JavaScript', 'HTML5', 'CSS3', 'Figma'],
    heroImage: '/work/images/memory-game-1.webp',
    sections: [
      {
        heading: 'The challenge',
        paragraphs: ["Designing for users who can't tell you what's wrong."],
        bullets: [
          'How might we make a game accessible to a 3-year-old without boring an 8-year-old?',
          'How might we design touch interactions for users with limited fine motor control?',
          'How might we keep children engaged when frustration leads directly to disengagement?',
        ],
      },
      {
        heading: 'Research',
        eyebrow: 'Understanding the problem before building anything',
        paragraphs: [
          'I ran informal testing sessions with children across the target age range, watching how they actually interacted with the game rather than asking them to describe their experience - children this age can’t articulate what isn’t working, so observation was the only reliable method.',
          'Four things came up consistently: younger children couldn’t handle time pressure, visual recognition worked better with familiar animals than abstract shapes, touch accuracy varied significantly by age, and the emotional response to failure was fast and total. A frustrated four-year-old does not try again.',
        ],
        quote: { text: 'The timer is too fast! I can’t remember that quick!', attribution: 'Testing participant, age 4' },
        images: ['/work/images/memory-game-2.webp'],
      },
      {
        heading: 'Data & insights',
        eyebrow: 'Timing the sessions instead of trusting first impressions',
        paragraphs: [
          'Alongside the observation notes, I timed rounds with a stopwatch across every test session. Average round completion landed around 46 seconds in easy mode versus 21 seconds in hard mode, which confirmed the pacing gap between difficulty levels was actually working as intended rather than just feeling right in the room. The timing data is also what caught the frustration threshold: rounds that ran past roughly 90 seconds without a match were the ones that ended in a child giving up, which set the practical upper bound for how long any single round should ever be allowed to run.',
        ],
      },
      {
        heading: 'Process',
        eyebrow: 'Double diamond, applied',
        paragraphs: [
          'Discover: observation sessions with children ages 3 to 8, noting where interaction broke down and where engagement held. Define: core constraints identified - fine motor limitations, time pressure sensitivity, need for visual familiarity, and the frustration threshold problem. Develop: three difficulty levels designed around age-based ability, a visual system built for contrast and recognition, touch targets sized for small, inaccurate hands. Deliver: built, tested across difficulty levels, confirmed that 3-year-olds could complete easy mode and 8-year-olds found hard mode appropriately challenging.',
        ],
        images: ['/work/images/memory-game-3.webp'],
      },
      {
        heading: 'Solution',
        paragraphs: [
          'A mobile-first memory game with three difficulty levels mapped to age-based ability. Easy mode has fewer cards and more time; hard mode is fast-paced for older children. The visual system uses purple and yellow for strong contrast against developing vision, with animal photography children could immediately recognise. Cards flip with a clear animation so the interaction always confirms itself visually.',
          'Every sizing decision, from font size to card spacing to touch targets, was driven by the specific constraints of young children’s motor skills rather than standard web conventions.',
        ],
      },
      {
        heading: 'Outcomes',
        paragraphs: [
          '3-year-olds completed easy mode successfully in testing, and 8-year-olds found hard mode appropriately challenging - the game covers the full target age range, with each difficulty level reaching its intended users. The most unexpected finding was that younger children sometimes stopped playing to explore the visual design instead, which caused them to run out of time. That’s a problem, but it also means the visuals were doing their job.',
        ],
      },
      {
        heading: 'What testing taught me',
        paragraphs: [],
        bullets: [
          'Touch event handling needs refinement for children under 5 - tap registration still drops occasionally.',
          'Adaptive difficulty that adjusts in real time based on player performance would remove the need to choose a level at all.',
          'More structured usability testing with a larger sample to confirm the findings hold beyond informal sessions.',
          'Track completion rate and average round time per difficulty level with real usage data, to replace stopwatch sampling from a handful of sessions.',
        ],
      },
      {
        heading: 'Reflection',
        eyebrow: 'What works for adults is a starting point, not a solution',
        paragraphs: [
          'User testing with children is a different discipline. They won’t tell you the timer is too fast in a feedback form, they’ll just stop playing. Every assumption I brought from standard web design had to be tested from scratch - touch targets that seemed generous weren’t, time limits that seemed fair weren’t. The gap between designing for adults and designing for children is much larger than the gap between designing for two different adult groups.',
          'The most valuable moment in this project wasn’t a design decision. It was watching a 4-year-old forget to play the game because she was too interested in looking at the animals. It reframed what accessibility means for this audience - it isn’t just about contrast ratios and font sizes, it’s about understanding what attention actually looks like in a 4-year-old and designing around that reality.',
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
