import { getCollection } from 'astro:content'

import type { EssayModel } from '@interfaces/models'

export const getAllEssays = async (): Promise<EssayModel[]> => {
  const essays = await getCollection('essays', ({ data }) => !data.isDraft)

  const allEssays = [...essays].sort((a, b) => a.data.order - b.data.order)

  return allEssays
}
