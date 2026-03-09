import { test, expect, type Page } from '@playwright/test'

// Mask dynamic content so visual tests only catch styling/layout changes,
// not content additions like new posts or bookmarks.
const dynamicSelectors = [
  '.post-row',
  '.writing-row',
  'article',
  '.result-count',
  '.rating-legend',
  'time',
]

async function maskDynamicContent(page: Page) {
  for (const selector of dynamicSelectors) {
    for (const el of await page.locator(selector).all()) {
      await el.evaluate((node) => {
        node.style.visibility = 'hidden'
      })
    }
  }
}

const pages = [
  { name: 'home', path: '/' },
  { name: 'writings', path: '/writings/' },
  { name: 'bookmarks', path: '/bookmarks/' },
  { name: 'about', path: '/about/' },
  { name: 'post', path: '/posts/f108c748/' },
  { name: 'essay', path: '/essays/a1b2c3d4/' },
]

for (const { name, path } of pages) {
  test.describe(`${name} page`, () => {
    test(`matches the dark-mode baseline screenshot`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      await maskDynamicContent(page)
      await expect(page).toHaveScreenshot(`${name}-dark.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      })
    })

    test(`matches the light-mode baseline screenshot`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      await page.getByRole('button', { name: /toggle dark mode/i }).click()
      await page.waitForTimeout(300)
      await maskDynamicContent(page)
      await expect(page).toHaveScreenshot(`${name}-light.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      })
    })
  })
}
