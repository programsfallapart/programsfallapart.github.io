document.addEventListener('astro:page-load', () => {
  const themeBtn = document.getElementById('themeToggle')
  function syncThemePressed() {
    const isDark = document.documentElement.classList.contains('dark')
    themeBtn?.setAttribute('aria-pressed', String(isDark))
  }
  syncThemePressed()
  themeBtn?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark')
    const isDark = document.documentElement.classList.contains('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    syncThemePressed()
  })
})
