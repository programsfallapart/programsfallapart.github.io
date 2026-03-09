import { test, expect } from '@playwright/test'

test.describe('404 page', () => {
  test('displays 404 for an invalid route', async ({ page }) => {
    const response = await page.goto('/this-does-not-exist/')
    expect(response?.status()).toBe(404)
    await expect(page.getByText('404')).toBeVisible()
  })
})
