// Format date as "January 5, 2026"
export const getFormatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

// Format as ISO "2026-01-05" for <time datetime>
export const isoDate = (date: Date) => {
  return date.toISOString().slice(0, 10)
}

// Format as "Jan 5, 2026"
export const formatedYMD = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
