// Technical skill groups — shared between CodePage.tsx and
// AboutPage.tsx (appended after its own UX/Design rows there) so the
// two pages can't drift out of sync with each other the way they did
// before this file existed.
export const DEV_SKILL_GROUPS = [
  { label: 'Languages', value: 'C#, JavaScript, TypeScript, HTML, CSS, PHP' },
  {
    label: 'Frameworks & Tools',
    value: 'ASP.NET, React, Angular, jQuery, Bootstrap, Tailwind, WordPress, Wix, Git, npm, VS Code',
  },
  { label: 'Databases', value: "SQL, MongoDB, and schema design with ER/crow's foot diagrams" },
  { label: 'Deployment & Hosting', value: 'Netlify, Hostinger, site migrations, WordPress management and backups' },
  { label: 'Focus Areas', value: 'PWAs, SPAs, APIs, SEO, and security fundamentals like preventing SQL injection' },
]
