import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('has the exact site title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('Programs Fall Apart')
  })

  test('every essay row has a link but no date', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /latest essays/i })).toBeVisible()
    const essaysSection = page.locator('section', { has: page.getByRole('heading', { name: /latest essays/i }) })
    const essayRows = essaysSection.locator('[data-post-row]')
    await expect(essayRows.first()).toBeVisible()

    await expect.poll(async () => {
      const rows = await essayRows.all()
      if (rows.length === 0) return false
      for (const row of rows) {
        const link = row.getByRole('link')
        if (!(await link.isVisible())) return false
        const href = await link.getAttribute('href') ?? ''
        if (!/^\/essays\//.test(href)) return false
        if ((await row.locator('time').count()) !== 0) return false
      }
      return true
    }).toBe(true)
  })

  test('every post row has a link and a date', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /latest posts/i })).toBeVisible()
    const postsSection = page.locator('section', { has: page.getByRole('heading', { name: /latest posts/i }) })
    const postRows = postsSection.locator('[data-post-row]')
    await expect(postRows.first()).toBeVisible()

    await expect.poll(async () => {
      const rows = await postRows.all()
      if (rows.length === 0) return false
      for (const row of rows) {
        const link = row.getByRole('link')
        if (!(await link.isVisible())) return false
        const href = await link.getAttribute('href') ?? ''
        if (!/^\/posts\//.test(href)) return false
        if (!(await row.locator('time').isVisible())) return false
      }
      return true
    }).toBe(true)
  })

  test('clicking a section heading navigates to the writings page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { name: /latest essays/i }).getByRole('link').click()
    await expect(page).toHaveURL(/\/writings\/?$/)

    await page.goto('/')
    await page.getByRole('heading', { name: /latest posts/i }).getByRole('link').click()
    await expect(page).toHaveURL(/\/writings\/?$/)
  })

  test('each section shows at most 5 entries', async ({ page }) => {
    await page.goto('/')
    const essaysSection = page.locator('section', { has: page.getByRole('heading', { name: /latest essays/i }) })
    const essayLinks = essaysSection.locator('a[href^="/essays/"]')
    await expect.poll(() => essayLinks.count()).toBeLessThanOrEqual(5)

    const postsSection = page.locator('section', { has: page.getByRole('heading', { name: /latest posts/i }) })
    const postLinks = postsSection.locator('a[href^="/posts/"]')
    await expect.poll(() => postLinks.count()).toBeLessThanOrEqual(5)
  })

})
