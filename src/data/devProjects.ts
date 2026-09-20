// Dev/code side projects. Two sources:
// 1) Live demo cards pulled from https://frontend.barboragustafsson.com
//    (her curated frontend portfolio site).
// 2) GitHub-only repos with no separate live demo, pulled from the real
//    github.com/Baragustay repo list via the GitHub API, not guessed.
//    `sweden-police-api-react` isn't repeated here since it's already
//    the Polis Web App entry's `githubHref`. `catch-a-fact-CV-game`,
//    `Memory-Game`, and `Baragustay.github.io` (an old school project)
//    are left out — the first two already have their own featured spots
//    elsewhere, the third isn't representative of current work.
//
// PromptKee and the Memory Game both appear on the frontend site too,
// but are excluded here since both already have full case-study detail
// pages of their own (`/work/promptkee`, `/work/memory-game`).
//
// TimeSlot Booking (`VANILLA_JS_Simple_TimeSlot_Booking_CRUD`) was
// removed entirely — its live page throws a real error (a 404 on one of
// its own resources on load), and it isn't in the public GitHub repo
// list either, so there was no working link left to point to.
//
// A project's primary click target is its live demo when it has one;
// GitHub-only projects link straight to the repo instead. `githubHref`
// is only ever set where a real repo URL is known — never guessed.
export type DevProject = {
  id: string
  name: string
  description: string
  language: string
  languageColor: string
  liveHref?: string
  githubHref?: string
}

export const devProjects: DevProject[] = [
  {
    id: 'react-activity-app',
    name: 'Activity Tracking App',
    description: 'React web app practicing API calls and modern hooks.',
    language: 'React',
    languageColor: '#61dafb',
    liveHref: 'https://frontend.barboragustafsson.com/REACT-activity-app/',
  },
  {
    id: 'polis-webbapp',
    name: 'Polis Web App',
    description: 'Connected to a public Swedish REST API.',
    language: 'React + API',
    languageColor: '#61dafb',
    liveHref: 'https://frontend.barboragustafsson.com/REACT_polis-webbapp_API/',
    githubHref: 'https://github.com/Baragustay/sweden-police-api-react',
  },
  {
    id: 'angular-tracker',
    name: 'Angular Tracker',
    description: 'Component design and state management in Angular.',
    language: 'Angular',
    languageColor: '#dd0031',
    liveHref: 'https://frontend.barboragustafsson.com/ANGULAR_activity-tracking-app/',
  },
  {
    id: 'vanilla-js-crud',
    name: 'CRUD App',
    description: 'DOM manipulation and local storage persistence.',
    language: 'Vanilla JS',
    languageColor: '#f7df1e',
    liveHref: 'https://frontend.barboragustafsson.com/VANILLA_JS-CRUD/',
  },
  {
    id: 'seo-site',
    name: 'SEO Optimized Site',
    description: 'Semantic HTML focused on search engine performance.',
    language: 'HTML · SEO',
    languageColor: '#e34c26',
    liveHref: 'https://frontend.barboragustafsson.com/WEBSITE_Birgitta_SEO_Fokus/',
  },
  {
    id: 'artisan-bakery',
    name: 'Artisan Bakery',
    description:
      'A fully responsive branding project and website for a local bakery, focusing on high-quality imagery and performant CSS.',
    language: 'HTML · CSS · Branding',
    languageColor: '#e34c26',
    liveHref: 'https://frontend.barboragustafsson.com/WEBSITE_HobbyBakerWebsite_Media_Fokus/',
  },
  {
    id: 'filmlib-react-native',
    name: 'FilmLib',
    description: 'Film browsing library - React Native app with a MongoDB-backed CRUD API, for iOS and Android.',
    language: 'React Native',
    languageColor: '#61dafb',
    githubHref: 'https://github.com/Baragustay/filmlib-react-native',
  },
  {
    id: 'pwa-angular',
    name: 'PWA Angular',
    description: 'Progressive Web App built with Angular.',
    language: 'Angular',
    languageColor: '#dd0031',
    githubHref: 'https://github.com/Baragustay/PWA-Angular',
  },
  {
    id: 'react-advice-app',
    name: 'Advice App',
    description: 'Simple fact/advice web app consuming a public API.',
    language: 'React',
    languageColor: '#61dafb',
    githubHref: 'https://github.com/Baragustay/react-advice-app',
  },
  {
    id: 'nodejs-mongodb-api',
    name: 'Node.js + MongoDB API',
    description: 'Backend API built with Express and Mongoose, learning Node.js and MongoDB.',
    language: 'Node.js',
    languageColor: '#3c873a',
    githubHref: 'https://github.com/Baragustay/nodejs-mongodb-api',
  },
]
