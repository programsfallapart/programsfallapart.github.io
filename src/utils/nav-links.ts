export const navLinks = [
  { url: '/', title: 'Home' },
  { url: '/writings', title: 'Writings' },
  { url: '/bookmarks', title: 'Bookmarks' },
  { url: '/about', title: 'About' },
]

export function isActivePath(linkUrl: string, pathname: string): boolean {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (linkUrl === '/') return p === '/'
  // Individual posts and essays live under /posts and /essays but belong to
  // the Writings section — light up its nav item so "you are here" survives.
  if (linkUrl === '/writings' && (p.startsWith('/posts') || p.startsWith('/essays'))) {
    return true
  }
  return p === linkUrl || p.startsWith(linkUrl + '/')
}
