function getGiscusTheme() {
  const section = document.querySelector('.giscus')!
  const isDark = document.documentElement.classList.contains('dark')
  return isDark ? section.getAttribute('data-dark-theme')! : section.getAttribute('data-light-theme')!
}

function setGiscusTheme(theme: string) {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme } } },
    'https://giscus.app'
  )
}

function loadGiscus() {
  const existing = document.querySelector('script[src="https://giscus.app/client.js"]')
  if (existing) existing.remove()

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'programsfallapart/programsfallapart.github.io')
  script.setAttribute('data-repo-id', 'R_kgDOLtiadA')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', 'DIC_kwDOLtiadM4Ceq7K')
  script.setAttribute('data-mapping', 'url')
  script.setAttribute('data-strict', '1')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', getGiscusTheme())
  script.setAttribute('data-lang', 'en')
  script.setAttribute('data-loading', 'lazy')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true
  document.querySelector('.giscus')?.appendChild(script)
}

// Load giscus only when comments section enters viewport
const giscusSection = document.querySelector('.giscus')
if (giscusSection) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      observer.disconnect()
      loadGiscus()
      // Watch for theme toggles only after giscus loads
      const themeObserver = new MutationObserver(() => {
        setGiscusTheme(getGiscusTheme())
      })
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    }
  }, { rootMargin: '200px' })
  observer.observe(giscusSection)
}
