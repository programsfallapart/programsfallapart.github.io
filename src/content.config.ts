import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    isDraft: z.boolean().optional(),
    language: z.enum(['en']).optional(),
    title: z.string(),
    date: z.date(),
    abbrlink: z.string(),
    tags: z.array(z.string()),
    description: z.string().optional(),
  }),
})

export const collections = { posts }
