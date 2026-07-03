import type { CollectionEntry } from 'astro:content'

export type PostModel = CollectionEntry<'posts'>

export type EssayModel = CollectionEntry<'essays'>

export type BookmarkModel = CollectionEntry<'bookmarks'>

export type WritingEntry =
  | { kind: 'post'; entry: PostModel }
  | { kind: 'essay'; entry: EssayModel }
