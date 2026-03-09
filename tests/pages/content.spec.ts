import { test, expect } from '@playwright/test'

const contentPages = [
  { type: 'Blog post', path: '/posts/f108c748/' },
  { type: 'Essay', path: '/essays/a1b2c3d4/' },
]

for (const { type, path } of contentPages) {
  test.describe(type, () => {
    test('displays the full article with its title', async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('article')).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    test('renders code blocks with syntax highlighting', async ({ page }) => {
      await page.goto(path)
      const codeBlock = page.locator('pre code').first()
      await expect(codeBlock).toBeVisible()
    })

    test('article contains tag links pointing to the tags route', async ({ page }) => {
      await page.goto(path)
      const article = page.locator('article')
      const tagLinks = article.locator('a[href^="/tags/"]')
      await expect(tagLinks.first()).toBeVisible()

      await expect.poll(async () => {
        const links = await tagLinks.all()
        for (const link of links) {
          const href = await link.getAttribute('href') ?? ''
          if (!href.startsWith('/tags/')) return false
        }
        return links.length > 0
      }).toBe(true)
    })
    test('clicking a tag link navigates to the tags page', async ({ page }) => {
      await page.goto(path)
      const article = page.locator('article')
      const firstTagLink = article.locator('a[href^="/tags/"]').first()
      await expect(firstTagLink).toBeVisible()
      const href = await firstTagLink.getAttribute('href') ?? ''

      await firstTagLink.click()
      await expect(page).toHaveURL(new RegExp(href))
      await expect(page.locator('[data-post-row]').first()).toBeVisible()
    })
  })
}

test.describe('Blog post', () => {
  test('displays a publication date', async ({ page }) => {
    await page.goto('/posts/f108c748/')
    await expect(page.locator('article time')).toBeVisible()
  })

})

test.describe('Essay', () => {
  test('does not display a date', async ({ page }) => {
    await page.goto('/essays/a1b2c3d4/')
    await expect(page.locator('article time')).toHaveCount(0)
  })
})
