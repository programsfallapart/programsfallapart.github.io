import { test, expect } from '@playwright/test'

test.describe('Bookmarks page', () => {
  test('displays all bookmarked items with star ratings', async ({ page }) => {
    await page.goto('/bookmarks/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const bookmarks = page.locator('[data-title]')
    await expect(bookmarks.first()).toBeVisible()

    const ratings = page.locator('main [role="img"][aria-label*="Rating"]')
    await expect(ratings.first()).toBeVisible()
    await expect(ratings.first()).toHaveAttribute('aria-label', /Rating: \d out of 3/)
  })

  test('explains the three rating tiers in a legend', async ({ page }) => {
    await page.goto('/bookmarks/')
    await expect(page.getByText(/caught my eye/i)).toBeVisible()
    await expect(page.getByText(/stayed with me/i)).toBeVisible()
    await expect(page.getByText(/rewired me/i)).toBeVisible()
  })

  test('at least one bookmark has no rating element', async ({ page }) => {
    await page.goto('/bookmarks/')
    const rows = page.locator('[data-title]')
    await expect(rows.first()).toBeVisible()

    await expect.poll(async () => {
      const allRows = await rows.all()
      for (const row of allRows) {
        if ((await row.locator('[role="img"]').count()) === 0) return true
      }
      return false
    }).toBe(true)
  })

  test('bookmark links open in a new tab', async ({ page }) => {
    await page.goto('/bookmarks/')
    const links = page.locator('[data-title] a[target="_blank"]')
    await expect(links.first()).toBeVisible()
    await expect(links.first()).toHaveAttribute('rel', /noopener/)
    await expect(links.first()).toHaveAttribute('rel', /noreferrer/)
    await expect(links.first()).toHaveText(/opens in new tab/i)
  })
})
