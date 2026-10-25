import { useEffect } from 'react'

const SITE_URL = 'https://barboragustafsson.com'
const SITE_NAME = 'Barbora Gustafsson'
export const DEFAULT_TITLE = `${SITE_NAME} - UX & Product Designer`

function setHeadTag(selector: string, attr: 'href' | 'content', value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value)
}

// Per-route <title> and canonical URL. index.html ships one static set for
// every route, which told search engines that /about, /code and every case
// study were duplicates of the homepage, and gave every tab/history entry
// (and screen-reader page announcement) the same title.
export function usePageMeta(title: string | null, path: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
    const url = `${SITE_URL}${path}`
    document.title = fullTitle
    setHeadTag('link[rel="canonical"]', 'href', url)
    setHeadTag('meta[property="og:url"]', 'content', url)
    setHeadTag('meta[property="og:title"]', 'content', fullTitle)
    setHeadTag('meta[name="twitter:title"]', 'content', fullTitle)
  }, [title, path])
}

// Keeps a page out of search results while it's mounted, for a page that's
// only meant to be reached by its link.
export function useNoIndex(active: boolean) {
  useEffect(() => {
    if (!active) return
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [active])
}

// The body background shows through anywhere a page doesn't paint (below a
// short page, during overscroll). It defaults to the dark `--color-page-bg`
// (index.css); pages with their own background color set it while mounted.
export function useBodyBackground(color: string) {
  useEffect(() => {
    const previous = document.body.style.backgroundColor
    document.body.style.backgroundColor = color
    return () => {
      document.body.style.backgroundColor = previous
    }
  }, [color])
}
