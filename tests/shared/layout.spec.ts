import { test, expect } from '@playwright/test'

const pages = [
  { name: 'home', path: '/' },
  { name: 'writings', path: '/writings/' },
  { name: 'bookmarks', path: '/bookmarks/' },
  { name: 'about', path: '/about/' },
  { name: 'post', path: '/posts/f108c748/' },
  { name: 'essay', path: '/essays/a1b2c3d4/' },
  { name: 'tags', path: '/tags/programming/1/' },
  { name: '404', path: '/this-does-not-exist/' },
]

for (const { name, path } of pages) {
  test.describe(`${name} page — shared layout`, () => {
    test('has a non-empty meta description', async ({ page }) => {
      await page.goto(path)
      const description = page.locator('meta[name="description"]')
      await expect(description).toHaveAttribute('content', /.+/)
    })

    test('header shows the logo, navigation, and theme toggle', async ({ page }) => {
      await page.goto(path)
      const header = page.locator('header')
      await expect(header).toBeVisible()
      await expect(header.getByRole('img', { name: /logo/i })).toBeVisible()
      await expect(header.getByRole('navigation')).toBeVisible()
      await expect(header.getByRole('button', { name: /toggle dark mode/i })).toBeVisible()
    })

    test('navigation contains exactly Home, Writings, Bookmarks, and About', async ({ page }) => {
      await page.goto(path)
      const nav = page.getByRole('navigation')
      const expectedLinks = ['Home', 'Writings', 'Bookmarks', 'About']
      await expect(nav.getByRole('link')).toHaveCount(expectedLinks.length)
      await expect(nav.getByRole('link')).toHaveText(expectedLinks)
    })

    test('skip-to-content link moves focus to main content', async ({ page }) => {
      await page.goto(path)
      const skipLink = page.locator('a[data-skip-link]')
      await skipLink.focus()
      await skipLink.click()
      await expect(page.locator('#main-content')).toBeFocused()
    })

    test('footer is visible', async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('footer')).toBeVisible()
    })
  })
}
