import { test, expect } from '@playwright/test'

test.describe('About page', () => {
  test('presents the author introduction', async ({ page }) => {
    await page.goto('/about/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText(/Amira/)).toBeVisible()
  })

  test('provides a contact email link', async ({ page }) => {
    await page.goto('/about/')
    const emailLink = page.getByRole('link', { name: /email/i })
    await expect(emailLink).toBeVisible()
    await expect(emailLink).toHaveAttribute('href', 'mailto:amira@programsfallapart.com')
  })

  test('twitter link points to the correct account', async ({ page }) => {
    await page.goto('/about/')
    const twitterLink = page.getByRole('link', { name: /twitter/i })
    await expect(twitterLink).toBeVisible()
    await expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/pfa_amira')
  })

  test('credits section lists the correct fonts, music source, and framework', async ({ page }) => {
    await page.goto('/about/')
    await expect(page.getByText(/credits/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /EB Garamond/i })).toHaveAttribute('href', 'https://fonts.google.com/specimen/EB+Garamond')
    await expect(page.getByRole('link', { name: /JetBrains Mono/i })).toHaveAttribute('href', 'https://fonts.google.com/specimen/JetBrains+Mono')
    await expect(page.getByRole('link', { name: /classicals\.de/i })).toHaveAttribute('href', 'https://www.classicals.de')
    await expect(page.getByRole('link', { name: /CC BY-NC 4\.0/i })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by-nc/4.0/')
    await expect(page.getByRole('link', { name: /Astro/i })).toHaveAttribute('href', 'https://astro.build')
  })

  test('all external links have rel="noopener noreferrer"', async ({ page }) => {
    await page.goto('/about/')
    const externalLinks = page.locator('a[target="_blank"]')
    await expect(externalLinks.first()).toBeVisible()

    await expect.poll(async () => {
      const links = await externalLinks.all()
      for (const link of links) {
        const rel = await link.getAttribute('rel') ?? ''
        if (!rel.includes('noopener') || !rel.includes('noreferrer')) return false
      }
      return links.length > 0
    }).toBe(true)
  })
})
