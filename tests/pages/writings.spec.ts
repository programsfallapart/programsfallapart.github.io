import { test, expect } from '@playwright/test'

test.describe('Writings page', () => {
  test('displays all posts with dates and all essays with a dash instead of a date', async ({ page }) => {
    await page.goto('/writings/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const posts = page.locator('[data-kind="posts"]')
    await expect(posts.first()).toBeVisible()
    await expect(posts.first().locator('time')).toBeVisible()

    const essays = page.locator('[data-kind="essays"]')
    await expect(essays.first()).toBeVisible()
    await expect(essays.first().locator('time')).toHaveCount(0)
  })

  test('post rows link to /posts/ and essay rows link to /essays/', async ({ page }) => {
    await page.goto('/writings/')
    const posts = page.locator('[data-kind="posts"]')
    await expect(posts.first()).toBeVisible()

    await expect.poll(async () => {
      const postRows = await posts.all()
      for (const row of postRows) {
        const href = await row.getByRole('link').getAttribute('href') ?? ''
        if (!href.startsWith('/posts/')) return false
      }
      return postRows.length > 0
    }).toBe(true)

    const essays = page.locator('[data-kind="essays"]')
    await expect(essays.first()).toBeVisible()

    await expect.poll(async () => {
      const essayRows = await essays.all()
      for (const row of essayRows) {
        const href = await row.getByRole('link').getAttribute('href') ?? ''
        if (!href.startsWith('/essays/')) return false
      }
      return essayRows.length > 0
    }).toBe(true)
  })
})
