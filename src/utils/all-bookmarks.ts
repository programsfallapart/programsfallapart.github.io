import { getCollection } from 'astro:content'

import type { BookmarkModel } from '@interfaces/models'

export const getAllBookmarks = async (): Promise<BookmarkModel[]> => {
  const bookmarks = await getCollection('bookmarks', ({ data }) => !data.isDraft)

  return [...bookmarks].sort((a, b) => {
    const dateA = a.data.date?.getTime() ?? 0
    const dateB = b.data.date?.getTime() ?? 0
    return dateB - dateA
  })
}
