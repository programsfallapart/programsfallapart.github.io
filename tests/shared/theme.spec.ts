import { test, expect } from '@playwright/test'

test.describe('Theme toggle', () => {
  test('starts in dark mode by default', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('switches to light mode when the toggle is clicked', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.getByRole('button', { name: /toggle dark mode/i }).click()

    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('returns to dark mode on a second click', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: /toggle dark mode/i })

    await toggle.click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await toggle.click()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('remembers the chosen theme after navigating to another page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /toggle dark mode/i }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await page.goto('/writings/')
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })

  test('remembers the chosen theme after a full page reload', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /toggle dark mode/i }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await page.reload()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })
})
