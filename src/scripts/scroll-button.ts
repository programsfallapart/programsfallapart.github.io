const pageScroll = () => {
  const navIcon = document.querySelector('.nav-icon')
  if (!navIcon) return
  if (document.documentElement.scrollHeight !== document.documentElement.clientHeight) {
    navIcon.classList.remove('hidden')
  }
  let scrollTicking = false
  window.addEventListener('scroll', () => {
    if (scrollTicking) return
    scrollTicking = true
    requestAnimationFrame(() => {
      navIcon.classList.remove('hidden')
      if (window.scrollY !== 0) {
        navIcon.classList.remove('rotate-180')
        navIcon.classList.add('to-down', 'rotate-0')
        navIcon.setAttribute('aria-label', 'Scroll to top')
      } else {
        navIcon.classList.add('rotate-180')
        navIcon.classList.remove('to-down', 'rotate-0')
        navIcon.setAttribute('aria-label', 'Scroll to bottom')
      }
      scrollTicking = false
    })
  }, { passive: true })

  function handleActivate() {
    const totalH = document.body.scrollHeight || document.documentElement.scrollHeight
    if (navIcon.classList.contains('to-down')) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: totalH, behavior: 'smooth' })
    }
  }

  navIcon.addEventListener('click', handleActivate)
  navIcon.addEventListener('keydown', ((e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleActivate()
    }
  }) as EventListener)
}
document.addEventListener('astro:page-load', pageScroll)
