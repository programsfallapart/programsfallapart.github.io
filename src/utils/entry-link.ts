import type { WritingEntry } from '@interfaces/models'

export const getEntryLink = ({ kind, entry }: WritingEntry) =>
  `/${kind}s/${entry.data.abbrlink}`
