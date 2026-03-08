export const navLinks = [
  { url: '/', title: 'Home' },
  { url: '/writings', title: 'Writings' },
  { url: '/bookmarks', title: 'Bookmarks' },
  { url: '/about', title: 'About' },
]

export function isActivePath(linkUrl: string, pathname: string): boolean {
  const p = pathname.replace(/\/+$/, '') || '/'
  if (linkUrl === '/') return p === '/'
  return p === linkUrl || p.startsWith(linkUrl + '/')
}
