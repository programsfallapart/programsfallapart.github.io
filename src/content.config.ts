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

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    isDraft: z.boolean().optional(),
    title: z.string(),
    abbrlink: z.string(),
    tags: z.array(z.string()),
    description: z.string().optional(),
    order: z.number(),
  }),
})

const bookmarks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bookmarks' }),
  schema: z.object({
    isDraft: z.boolean().optional(),
    title: z.string(),
    url: z.string().url().optional(),
    type: z.enum(['blog-post', 'video', 'paper', 'book', 'course']),
    image: z.string().optional(),
    rating: z.number().min(1).max(3).optional(),
    tags: z.array(z.string()).optional(),
    summary: z.string().optional(),
    date: z.date().optional(),
  }),
})

export const collections = { posts, essays, bookmarks }
