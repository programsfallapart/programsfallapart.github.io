import { getCollection } from 'astro:content'

import type { PostModel, EssayModel, WritingEntry } from '@interfaces/models'

const byDateDesc = <T extends { data: { date: Date } }>(a: T, b: T) =>
  b.data.date.getTime() - a.data.date.getTime()

export const getAllPosts = async (): Promise<PostModel[]> => {
  const posts = await getCollection('posts', ({ data }) => !data.isDraft)
  return [...posts].sort(byDateDesc)
}

export const getAllEssays = async (): Promise<EssayModel[]> => {
  const essays = await getCollection('essays', ({ data }) => !data.isDraft)
  return [...essays].sort(byDateDesc)
}

export const getAllWritings = async (): Promise<WritingEntry[]> => {
  const [posts, essays] = await Promise.all([getAllPosts(), getAllEssays()])
  const combined: WritingEntry[] = [
    ...posts.map((entry) => ({ kind: 'post' as const, entry })),
    ...essays.map((entry) => ({ kind: 'essay' as const, entry })),
  ]
  return combined.sort((a, b) => byDateDesc(a.entry, b.entry))
}
