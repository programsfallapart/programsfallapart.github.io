export function computeTagCounts(
  allTags: string[],
  items: { tags: string[]; category: string }[],
  categories: string[],
): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {}
  for (const tag of allTags) {
    counts[tag] = { all: 0, ...Object.fromEntries(categories.map((c) => [c, 0])) }
  }

  for (const item of items) {
    for (const tag of item.tags) {
      if (!(tag in counts)) continue
      counts[tag].all++
      counts[tag][item.category]++
    }
  }

  return counts
}
