const { active } = require('./palettes.config.cjs')

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: active.accent,
        muted: 'var(--color-muted)',
        'primary-dark': active['primary-dark'],
        'primary-gray': active['primary-gray'],
        'primary-white': active['primary-white'],
      },
    },
  },
  plugins: [],
}
