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

    test('article contains tag links pointing to the writings route', async ({ page }) => {
      await page.goto(path)
      const article = page.locator('article')
      const tagLinks = article.locator('a[href*="/writings/?tag="]')
      await expect(tagLinks.first()).toBeVisible()

      await expect.poll(async () => {
        const links = await tagLinks.all()
        for (const link of links) {
          const href = await link.getAttribute('href') ?? ''
          if (!href.startsWith('/writings/?tag=')) return false
        }
        return links.length > 0
      }).toBe(true)
    })
    test('clicking a tag link navigates to writings with that tag pre-selected', async ({ page }) => {
      await page.goto(path)
      const article = page.locator('article')
      const firstTagLink = article.locator('a[href*="/writings/?tag="]').first()
      await expect(firstTagLink).toBeVisible()
      const tagName = await firstTagLink.textContent() ?? ''

      await firstTagLink.click()
      await expect(page).toHaveURL(new RegExp(`/writings/\\?tag=${tagName}`))
      const tagGroup = page.getByRole('group', { name: /filter by tag/i })
      await expect(tagGroup.locator(`button[data-tag="${tagName}"]`)).toHaveAttribute('aria-pressed', 'true')
    })

    // --- Heading numbering ---

    test('every article h2 and h3 starts with a section number', async ({ page }) => {
      await page.goto(path)
      const headings = page.locator('article :is(h2, h3):not([data-footnotes] *)')
      await expect(headings.first()).toBeVisible()

      await expect.poll(async () => {
        const all = await headings.all()
        for (const heading of all) {
          const text = (await heading.textContent()) ?? ''
          if (!/^\d+(\.\d+)?\. /.test(text)) return false
        }
        return all.length > 0
      }).toBe(true)
    })

    // --- Table of Contents ---

    test('TOC navigation landmark is present with accessible label', async ({ page }) => {
      await page.goto(path)
      const toc = page.getByRole('navigation', { name: /table of contents/i })
      await expect(toc).toBeAttached()
    })

    test('TOC progress lines match the number of content H2 headings in the article', async ({ page }) => {
      await page.goto(path)
      const toc = page.getByRole('navigation', { name: /table of contents/i })
      const linesGroup = toc.getByRole('group', { name: /reading progress/i })
      const lines = linesGroup.locator('[role="presentation"]')
      await expect.poll(async () => {
        const allH2 = await page.locator('article h2').count()
        const footnoteH2 = await page.locator('article [data-footnotes] h2').count()
        const h2Count = allH2 - footnoteH2
        const lineCount = await lines.count()
        return h2Count > 0 && lineCount === h2Count
      }).toBe(true)
    })

    test('TOC panel contains links matching article headings', async ({ page }) => {
      await page.goto(path)
      const toc = page.getByRole('navigation', { name: /table of contents/i })
      const tocLinks = toc.locator('a[data-slug]')
      await expect(tocLinks.first()).toBeAttached()

      await expect.poll(async () => {
        const links = await tocLinks.all()
        for (const link of links) {
          const slug = await link.getAttribute('data-slug')
          if (!slug) return false
          const heading = page.locator(`article [id="${slug}"]`)
          if ((await heading.count()) === 0) return false
        }
        return links.length > 0
      }).toBe(true)
    })

    test('TOC panel shows on hover and hides when moving away', async ({ page }) => {
      await page.goto(path)
      const toc = page.getByRole('navigation', { name: /table of contents/i })
      const tocLinks = toc.locator('a[data-slug]')

      await expect(tocLinks.first()).not.toBeVisible()
      await toc.hover()
      await expect(tocLinks.first()).toBeVisible()

      await page.locator('article').hover()
      await expect(tocLinks.first()).not.toBeVisible()
    })

    test('clicking a TOC link scrolls to the corresponding heading', async ({ page }) => {
      await page.goto(path)
      const toc = page.getByRole('navigation', { name: /table of contents/i })
      await toc.hover()
      const tocLink = toc.locator('a[data-slug]').first()
      const slug = await tocLink.getAttribute('data-slug')
      await tocLink.click()

      await expect.poll(async () => {
        const heading = page.locator(`article [id="${slug}"]`)
        const box = await heading.boundingBox()
        return box !== null && box.y >= -10 && box.y < 300
      }).toBe(true)
    })

    test('every TOC link text starts with a section number', async ({ page }) => {
      await page.goto(path)
      const toc = page.getByRole('navigation', { name: /table of contents/i })
      const tocLinks = toc.locator('a[data-slug]')
      await expect(tocLinks.first()).toBeAttached()

      await expect.poll(async () => {
        const links = await tocLinks.all()
        for (const link of links) {
          const text = (await link.textContent()) ?? ''
          if (!/^\d+(\.\d+)?\. /.test(text)) return false
        }
        return links.length > 0
      }).toBe(true)
    })

    test('progress lines are decorative and hidden from screen readers', async ({ page }) => {
      await page.goto(path)
      const toc = page.getByRole('navigation', { name: /table of contents/i })
      const linesGroup = toc.getByRole('group', { name: /reading progress/i })
      const firstLine = linesGroup.locator('[aria-hidden="true"]').first()
      await expect(firstLine).toBeAttached()
    })
  })
}

test.describe('Blog post', () => {
  test('displays a publication date', async ({ page }) => {
    await page.goto('/posts/f108c748/')
    await expect(page.locator('article time')).toBeVisible()
  })

  test('renders code blocks with syntax highlighting', async ({ page }) => {
    await page.goto('/posts/f108c748/')
    const codeBlock = page.locator('pre code').first()
    await expect(codeBlock).toBeVisible()
  })
})

test.describe('Essay', () => {
  test('does not display a date', async ({ page }) => {
    await page.goto('/essays/a1b2c3d4/')
    await expect(page.locator('article time')).toHaveCount(0)
  })
})
