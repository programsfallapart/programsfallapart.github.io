import { test, expect } from '@playwright/test'

test.describe('Tags page', () => {
  test('displays posts filtered by tag with a heading', async ({ page }) => {
    await page.goto('/tags/programming/1/')
    await expect(page.getByText('programming')).toBeVisible()
    const posts = page.locator('[data-post-row]')
    await expect(posts.first()).toBeVisible()
  })

  test('each post row has a date and a link', async ({ page }) => {
    await page.goto('/tags/programming/1/')
    const firstRow = page.locator('[data-post-row]').first()
    await expect(firstRow.locator('time')).toBeVisible()
    await expect(firstRow.getByRole('link')).toBeVisible()
  })

  test('returns 404 for a non-existent tag', async ({ page }) => {
    const response = await page.goto('/tags/zzzznonexistent/1/')
    expect(response?.status()).toBe(404)
  })

  test('displays pagination with the current page number', async ({ page }) => {
    await page.goto('/tags/programming/1/')
    const pagination = page.getByRole('navigation', { name: /pagination/i })
    await expect(pagination).toBeVisible()
    await expect(pagination.locator('[aria-current="page"]')).toBeVisible()
  })

  test('all displayed posts have the filtered tag', async ({ page }) => {
    await page.goto('/tags/programming/1/')
    const posts = page.locator('[data-post-row]')
    await expect(posts.first()).toBeVisible()

    await expect.poll(async () => {
      const rows = await posts.all()
      if (rows.length === 0) return false
      for (const row of rows) {
        const link = row.getByRole('link')
        const href = await link.getAttribute('href') ?? ''
        if (!href.startsWith('/posts/') && !href.startsWith('/essays/')) return false
      }
      return true
    }).toBe(true)
  })
})
