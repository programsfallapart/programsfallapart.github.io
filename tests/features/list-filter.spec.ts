import { test, expect } from '@playwright/test'

const pages = [
  {
    name: 'Writings',
    path: '/writings/',
    categoryLabel: /filter by category/i,
    searchLabel: /search writings/i,
  },
  {
    name: 'Bookmarks',
    path: '/bookmarks/',
    categoryLabel: /filter by type/i,
    searchLabel: /search bookmarks/i,
  },
]

for (const pg of pages) {
  test.describe(`${pg.name} page — list filter`, () => {
    // --- Content structure ---

    test('every row displays a type label', async ({ page }) => {
      await page.goto(pg.path)
      const rows = page.locator('[data-title]')
      await expect(rows.first()).toBeVisible()

      await expect.poll(async () => {
        const allRows = await rows.all()
        if (allRows.length === 0) return false
        for (const row of allRows) {
          const label = row.locator('[data-kind-label]')
          if (!(await label.isVisible())) return false
          if ((await label.textContent())?.trim() === '') return false
        }
        return true
      }).toBe(true)
    })

    // --- Category filtering ---

    test('deselecting a category restores all items', async ({ page }) => {
      await page.goto(pg.path)
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      // Wait for JS to initialize before capturing count
      await expect(page.locator('main [aria-live="polite"]')).toHaveText(/\d+ results?/)
      const totalCount = await allRows.count()

      const categoryGroup = page.getByRole('group', { name: pg.categoryLabel })
      const firstCatBtn = categoryGroup.locator('button[data-cat]:not([data-cat="all"])').first()
      await firstCatBtn.click()
      const visibleWhileFiltered = page.locator('[data-title]:visible')
      await expect(visibleWhileFiltered).not.toHaveCount(totalCount)

      await firstCatBtn.click() // deselect
      const visibleAfter = page.locator('[data-title]:visible')
      await expect(visibleAfter).toHaveCount(totalCount)
    })

    test('clicking the All category button resets category filtering', async ({ page }) => {
      await page.goto(pg.path)
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      // Wait for JS to initialize before capturing count
      await expect(page.locator('main [aria-live="polite"]')).toHaveText(/\d+ results?/)
      const totalCount = await allRows.count()

      const categoryGroup = page.getByRole('group', { name: pg.categoryLabel })
      const firstCatBtn = categoryGroup.locator('button[data-cat]:not([data-cat="all"])').first()
      await firstCatBtn.click()
      const visibleWhileFiltered = page.locator('[data-title]:visible')
      await expect(visibleWhileFiltered).not.toHaveCount(totalCount)

      const allBtn = categoryGroup.getByRole('button', { name: /^all$/i })
      await allBtn.click()

      const visibleAfter = page.locator('[data-title]:visible')
      await expect(visibleAfter).toHaveCount(totalCount)
    })

    // --- Tag filtering ---

    test('selecting a tag shows only items with that tag', async ({ page }) => {
      await page.goto(pg.path)
      const tagGroup = page.getByRole('group', { name: /filter by tag/i })
      const tagButtons = tagGroup.locator('button[data-tag]:not([data-tag="all"])')
      const firstPill = tagButtons.first()
      await expect(firstPill).toBeVisible()
      const tagName = await firstPill.getAttribute('data-tag')

      await firstPill.click()

      const visibleRows = page.locator('[data-title]:visible')
      await expect(visibleRows.first()).toBeVisible()

      await expect.poll(async () => {
        const rows = await visibleRows.all()
        if (rows.length === 0) return false
        for (const row of rows) {
          const tags = await row.getAttribute('data-tags') ?? ''
          if (!new RegExp(tagName!).test(tags)) return false
        }
        return true
      }).toBe(true)
    })

    test('deselecting a tag restores all items', async ({ page }) => {
      await page.goto(pg.path)
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      // Wait for JS to initialize before capturing count
      await expect(page.locator('main [aria-live="polite"]')).toHaveText(/\d+ results?/)
      const totalCount = await allRows.count()

      const tagGroup = page.getByRole('group', { name: /filter by tag/i })
      const firstPill = tagGroup.locator('button[data-tag]:not([data-tag="all"])').first()
      await firstPill.click()
      const visibleWhileFiltered = page.locator('[data-title]:visible')
      await expect(visibleWhileFiltered).not.toHaveCount(totalCount)

      await firstPill.click() // deselect
      const visibleAfter = page.locator('[data-title]:visible')
      await expect(visibleAfter).toHaveCount(totalCount)
    })

    test('clicking the All tag pill resets tag filtering', async ({ page }) => {
      await page.goto(pg.path)
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      // Wait for JS to initialize before capturing count
      await expect(page.locator('main [aria-live="polite"]')).toHaveText(/\d+ results?/)
      const totalCount = await allRows.count()

      const tagGroup = page.getByRole('group', { name: /filter by tag/i })
      const firstPill = tagGroup.locator('button[data-tag]:not([data-tag="all"])').first()
      await firstPill.click()
      const visibleWhileFiltered = page.locator('[data-title]:visible')
      await expect(visibleWhileFiltered).not.toHaveCount(totalCount)

      const allPill = tagGroup.getByRole('button', { name: /^all$/i })
      await allPill.click()

      const visibleAfter = page.locator('[data-title]:visible')
      await expect(visibleAfter).toHaveCount(totalCount)
    })

    test('selecting multiple categories shows the union of their items', async ({ page }) => {
      await page.goto(pg.path)
      const categoryGroup = page.getByRole('group', { name: pg.categoryLabel })
      const catButtons = categoryGroup.locator('button[data-cat]:not([data-cat="all"])')
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      // Wait for JS to initialize before capturing count
      await expect(page.locator('main [aria-live="polite"]')).toHaveText(/\d+ results?/)
      const totalCount = await allRows.count()

      // Select first category
      const firstBtn = catButtons.first()
      await firstBtn.click()
      const firstCat = await firstBtn.getAttribute('data-cat')
      const afterFirst = page.locator('[data-title]:visible')
      await expect(afterFirst).not.toHaveCount(totalCount)

      // Select second category — should add items
      const secondBtn = catButtons.nth(1)
      await secondBtn.click()
      const afterBoth = page.locator('[data-title]:visible')
      await expect(afterBoth).not.toHaveCount(totalCount)

      // Every visible row belongs to one of the two selected categories
      const secondCat = await secondBtn.getAttribute('data-cat')
      await expect.poll(async () => {
        const rows = await afterBoth.all()
        for (const row of rows) {
          const kind = await row.getAttribute('data-kind')
          if (kind !== firstCat && kind !== secondCat) return false
        }
        return rows.length > 0
      }).toBe(true)
    })

    test('selecting all category buttons shows all items', async ({ page }) => {
      await page.goto(pg.path)
      const categoryGroup = page.getByRole('group', { name: pg.categoryLabel })
      const catButtons = categoryGroup.locator('button[data-cat]:not([data-cat="all"])')
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      // Wait for JS to initialize before capturing count
      await expect(page.locator('main [aria-live="polite"]')).toHaveText(/\d+ results?/)
      const totalCount = await allRows.count()

      // Click every category button
      for (const btn of await catButtons.all()) {
        await btn.click()
      }

      const visibleRows = page.locator('[data-title]:visible')
      await expect(visibleRows).toHaveCount(totalCount)
    })

    // --- Search ---

    test('searching filters items to only those whose title matches', async ({ page }) => {
      await page.goto(pg.path)
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      // Wait for JS to initialize before capturing count
      await expect(page.locator('main [aria-live="polite"]')).toHaveText(/\d+ results?/)
      const totalCount = await allRows.count()
      const firstTitle = await allRows.first().getAttribute('data-title') ?? ''
      const searchTerm = firstTitle.split(' ')[0]

      const searchInput = page.getByRole('textbox')
      await searchInput.fill(searchTerm)

      const visibleRows = page.locator('[data-title]:visible')
      await expect(visibleRows).not.toHaveCount(totalCount)
      await expect(visibleRows.first()).toBeVisible()

      await expect.poll(async () => {
        const rows = await visibleRows.all()
        if (rows.length === 0) return false
        for (const row of rows) {
          const title = await row.getAttribute('data-title') ?? ''
          if (!new RegExp(searchTerm, 'i').test(title)) return false
        }
        return true
      }).toBe(true)
    })

    test('clearing the search restores all items', async ({ page }) => {
      await page.goto(pg.path)
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      // Wait for JS to initialize before capturing count
      await expect(page.locator('main [aria-live="polite"]')).toHaveText(/\d+ results?/)
      const totalCount = await allRows.count()

      const firstTitle = await allRows.first().getAttribute('data-title') ?? ''
      const searchInput = page.getByRole('textbox')
      await searchInput.fill(firstTitle)
      await expect(page.locator('[data-title]:visible')).not.toHaveCount(totalCount)

      await searchInput.fill('')
      const visibleAfter = page.locator('[data-title]:visible')
      await expect(visibleAfter).toHaveCount(totalCount)
    })

    test('search is case-insensitive', async ({ page }) => {
      await page.goto(pg.path)
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      const firstTitle = await allRows.first().getAttribute('data-title') ?? ''
      const searchTerm = firstTitle.split(' ')[0]

      const searchInput = page.getByRole('textbox')
      const visibleRows = page.locator('[data-title]:visible')
      const resultCount = page.locator('main [aria-live="polite"]')

      // Search with uppercase and wait for debounce to settle
      await searchInput.fill(searchTerm.toUpperCase())
      await expect(visibleRows.first()).toBeVisible()
      await expect(resultCount).toHaveText(/\d+ results?/)
      const upperText = await resultCount.textContent()

      // Clear and search with lowercase
      await searchInput.fill('')
      await expect(resultCount).not.toHaveText(upperText!)

      await searchInput.fill(searchTerm.toLowerCase())
      await expect(visibleRows.first()).toBeVisible()

      // Lowercase produces the same result count as uppercase
      await expect(resultCount).toHaveText(upperText!)
    })

    test('searching for a nonexistent term shows no results', async ({ page }) => {
      await page.goto(pg.path)
      const searchInput = page.getByRole('textbox')

      await searchInput.fill('zzzznonexistent')

      const visibleAfter = page.locator('[data-title]:visible')
      await expect(visibleAfter).toHaveCount(0)
    })

    // --- Empty state ---

    test('result count shows 0 when no items match', async ({ page }) => {
      await page.goto(pg.path)
      const resultCount = page.locator('main [aria-live="polite"]')
      await expect(resultCount).toHaveText(/\d+ results?/)

      const searchInput = page.getByRole('textbox')
      await searchInput.fill('zzzznonexistent')

      await expect(resultCount).toHaveText('0 results')
    })

    // --- Keyboard interaction ---

    test('category buttons can be activated with Enter and Space', async ({ page }) => {
      await page.goto(pg.path)
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      // Wait for JS to initialize before capturing count
      await expect(page.locator('main [aria-live="polite"]')).toHaveText(/\d+ results?/)
      const totalCount = await allRows.count()

      const categoryGroup = page.getByRole('group', { name: pg.categoryLabel })
      const firstCatBtn = categoryGroup.locator('button[data-cat]:not([data-cat="all"])').first()

      await firstCatBtn.focus()
      await page.keyboard.press('Enter')
      await expect(firstCatBtn).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('[data-title]:visible')).not.toHaveCount(totalCount)

      await page.keyboard.press('Space')
      await expect(firstCatBtn).toHaveAttribute('aria-pressed', 'false')
      await expect(page.locator('[data-title]:visible')).toHaveCount(totalCount)
    })

    test('tag pills can be activated with Enter and Space', async ({ page }) => {
      await page.goto(pg.path)
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      // Wait for JS to initialize before capturing count
      await expect(page.locator('main [aria-live="polite"]')).toHaveText(/\d+ results?/)
      const totalCount = await allRows.count()

      const tagGroup = page.getByRole('group', { name: /filter by tag/i })
      const firstPill = tagGroup.locator('button[data-tag]:not([data-tag="all"])').first()

      await firstPill.focus()
      await page.keyboard.press('Enter')
      await expect(firstPill).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('[data-title]:visible')).not.toHaveCount(totalCount)

      await page.keyboard.press('Space')
      await expect(firstPill).toHaveAttribute('aria-pressed', 'false')
      await expect(page.locator('[data-title]:visible')).toHaveCount(totalCount)
    })

    // --- Combined strict filter ---

    test('category, tag, and search filters combine strictly', async ({ page }) => {
      await page.goto(pg.path)
      const allRows = page.locator('[data-title]')
      await expect(allRows.first()).toBeVisible()
      // Wait for JS to initialize before capturing count
      await expect(page.locator('main [aria-live="polite"]')).toHaveText(/\d+ results?/)
      const totalCount = await allRows.count()

      const categoryGroup = page.getByRole('group', { name: pg.categoryLabel })
      const tagGroup = page.getByRole('group', { name: /filter by tag/i })

      const visibleRows = page.locator('[data-title]:visible')

      // Step 1: select a category
      const firstCatBtn = categoryGroup.locator('button[data-cat]:not([data-cat="all"])').first()
      await expect(firstCatBtn).toBeVisible()
      const selectedCat = await firstCatBtn.getAttribute('data-cat')
      await firstCatBtn.click()
      await expect(visibleRows).not.toHaveCount(totalCount)

      // Step 2: add a tag filter — should narrow further or stay the same
      const firstTagPill = tagGroup.locator('button[data-tag]:not([data-tag="all"])').first()
      await expect(firstTagPill).toBeVisible()
      const tagName = await firstTagPill.getAttribute('data-tag')
      await firstTagPill.click()
      await expect(visibleRows).not.toHaveCount(totalCount)

      // Step 3: add a search term from a visible row
      await expect(visibleRows.first()).toBeVisible()
      const firstVisibleTitle = await visibleRows.first().getAttribute('data-title') ?? ''
      const searchTerm = firstVisibleTitle.split(' ')[0]
      const searchInput = page.getByRole('textbox')
      await searchInput.fill(searchTerm)
      await expect(visibleRows.first()).toBeVisible()

      // Verify all constraints in a single retrying poll to avoid snapshot races
      await expect.poll(async () => {
        const allItems = await page.locator('[data-title]').all()
        for (const row of allItems) {
          const kind = await row.getAttribute('data-kind')
          const tags = await row.getAttribute('data-tags') ?? '[]'
          const title = await row.getAttribute('data-title') ?? ''
          const visible = await row.isVisible()
          const matchesCat = kind === selectedCat
          const matchesTag = new RegExp(tagName!).test(tags)
          const matchesSearch = new RegExp(searchTerm, 'i').test(title)

          if (visible) {
            // Every visible row must satisfy all three filters
            if (!matchesCat || !matchesTag || !matchesSearch) return false
          } else {
            // No hidden row should satisfy all three filters
            if (matchesCat && JSON.parse(tags).includes(tagName) && matchesSearch) return false
          }
        }
        return true
      }).toBe(true)
    })

    // --- Accessibility ---

    test('category buttons toggle aria-pressed when clicked', async ({ page }) => {
      await page.goto(pg.path)
      const categoryGroup = page.getByRole('group', { name: pg.categoryLabel })
      const firstCatBtn = categoryGroup.locator('button[data-cat]:not([data-cat="all"])').first()
      const allBtn = categoryGroup.getByRole('button', { name: /^all$/i })

      await expect(allBtn).toHaveAttribute('aria-pressed', 'true')
      await expect(firstCatBtn).toHaveAttribute('aria-pressed', 'false')

      await firstCatBtn.click()
      await expect(firstCatBtn).toHaveAttribute('aria-pressed', 'true')
      await expect(allBtn).toHaveAttribute('aria-pressed', 'false')

      await firstCatBtn.click()
      await expect(firstCatBtn).toHaveAttribute('aria-pressed', 'false')
      await expect(allBtn).toHaveAttribute('aria-pressed', 'true')
    })

    test('tag pills toggle aria-pressed when clicked', async ({ page }) => {
      await page.goto(pg.path)
      const tagGroup = page.getByRole('group', { name: /filter by tag/i })
      const allPill = tagGroup.getByRole('button', { name: /^all$/i })
      const firstPill = tagGroup.locator('button[data-tag]:not([data-tag="all"])').first()

      await expect(allPill).toHaveAttribute('aria-pressed', 'true')
      await expect(firstPill).toHaveAttribute('aria-pressed', 'false')

      await firstPill.click()
      await expect(firstPill).toHaveAttribute('aria-pressed', 'true')
      await expect(allPill).toHaveAttribute('aria-pressed', 'false')

      await firstPill.click()
      await expect(firstPill).toHaveAttribute('aria-pressed', 'false')
      await expect(allPill).toHaveAttribute('aria-pressed', 'true')
    })

    test('category and tag filter groups are labelled for screen readers', async ({ page }) => {
      await page.goto(pg.path)
      const categoryGroup = page.getByRole('group', { name: pg.categoryLabel })
      const tagGroup = page.getByRole('group', { name: /filter by tag/i })

      await expect(categoryGroup).toBeVisible()
      await expect(tagGroup).toBeVisible()
    })

    test('search input has an accessible label', async ({ page }) => {
      await page.goto(pg.path)
      const searchInput = page.getByRole('textbox', { name: pg.searchLabel })
      await expect(searchInput).toBeVisible()
    })

    test('result count updates with aria-live when filtering', async ({ page }) => {
      await page.goto(pg.path)
      const resultCount = page.locator('main [aria-live="polite"]')

      // Wait for JS to initialize and populate the count
      await expect(resultCount).toHaveText(/\d+ results?/)
      const initialText = await resultCount.textContent()

      // Select first category — guaranteed to reduce count
      const categoryGroup = page.getByRole('group', { name: pg.categoryLabel })
      const firstCatBtn = categoryGroup.locator('button[data-cat]:not([data-cat="all"])').first()
      await firstCatBtn.click()

      await expect(resultCount).not.toHaveText(initialText!)
      await expect(resultCount).toHaveText(/\d+ results?/)
    })
  })
}
