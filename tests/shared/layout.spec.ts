import { test, expect } from '@playwright/test'

const pages = [
  { name: 'home', path: '/' },
  { name: 'writings', path: '/writings/' },
  { name: 'bookmarks', path: '/bookmarks/' },
  { name: 'about', path: '/about/' },
  { name: 'post', path: '/posts/f108c748/' },
  { name: 'essay', path: '/essays/a1b2c3d4/' },
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

    // --- Music player ---

    test('music toggle button is visible with correct initial state', async ({ page }) => {
      await page.goto(path)
      const musicBtn = page.getByRole('button', { name: /play ambient music/i })
      await expect(musicBtn).toBeVisible()
      await expect(musicBtn).toHaveAttribute('aria-pressed', 'false')
    })

    test('clicking music toggle starts playback and updates aria state', async ({ page }) => {
      await page.goto(path)
      const musicBtn = page.locator('#musicToggle')
      await musicBtn.click()
      await expect(musicBtn).toHaveAttribute('aria-pressed', 'true')
      await expect(musicBtn).toHaveAttribute('aria-label', /pause ambient music/i)
    })

    test('now playing bar appears when music is playing', async ({ page }) => {
      await page.goto(path)
      await page.locator('#musicToggle').click()
      const nowPlaying = page.locator('#nowPlaying')
      await expect(nowPlaying).toBeVisible()
      await expect(nowPlaying).not.toBeEmpty()
    })

    test('prev and next track buttons are accessible', async ({ page }) => {
      await page.goto(path)
      await page.locator('#musicToggle').click()
      await expect(page.getByRole('button', { name: /previous track/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /next track/i })).toBeVisible()
    })

    test('clicking next track changes the displayed track name', async ({ page }) => {
      await page.goto(path)
      await page.locator('#musicToggle').click()
      const nowPlaying = page.locator('#nowPlaying')
      await expect(nowPlaying).not.toBeEmpty()
      const firstTrack = await nowPlaying.textContent()

      await page.getByRole('button', { name: /next track/i }).click()
      await expect(nowPlaying).not.toHaveText(firstTrack!)
    })

    test('clicking music toggle again pauses playback', async ({ page }) => {
      await page.goto(path)
      const musicBtn = page.locator('#musicToggle')
      await musicBtn.click()
      await expect(musicBtn).toHaveAttribute('aria-pressed', 'true')

      await musicBtn.click()
      await expect(musicBtn).toHaveAttribute('aria-pressed', 'false')
      await expect(musicBtn).toHaveAttribute('aria-label', /play ambient music/i)
    })

    test('now playing region has aria-live for screen readers', async ({ page }) => {
      await page.goto(path)
      const nowPlaying = page.locator('#nowPlaying')
      await expect(nowPlaying).toHaveAttribute('aria-live', 'polite')
    })
  })
}

test('music continues playing the same track after navigating to another page', async ({ page }) => {
  await page.goto('/')
  const musicBtn = page.locator('#musicToggle')
  await musicBtn.click()
  await expect(musicBtn).toHaveAttribute('aria-pressed', 'true')

  const nowPlaying = page.locator('#nowPlaying')
  await expect(nowPlaying).not.toBeEmpty()
  const trackBefore = await nowPlaying.textContent()

  await page.getByRole('navigation', { name: /main/i }).getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/\/about/)

  await expect(musicBtn).toHaveAttribute('aria-pressed', 'true')
  await expect(nowPlaying).toHaveText(trackBefore!)
})
