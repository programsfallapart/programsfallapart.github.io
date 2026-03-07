import AstroPWA from '@vite-pwa/astro'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig, passthroughImageService } from 'astro/config'
import expressiveCode from 'astro-expressive-code'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

import rehypeExternalLinks from 'rehype-external-links'

// https://astro.build/config
export default defineConfig({
  site: 'https://programsfallapart.com',
  prefetch: true,
  image: {
   service: passthroughImageService(),
 },
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { rel: 'nofollow', target: '_blank' }],
    ],
  },
  integrations: [
    expressiveCode({
      themes: ['vitesse-light', 'vitesse-dark'],
      themeCssSelector: (theme) => {
        return theme.type === 'dark' ? '.dark' : ':root:not(.dark)'
      },
      plugins: [pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: true,
      },
      styleOverrides: {
        borderRadius: '0.1rem',
        codeFontFamily: "'JetBrains Mono', monospace",
        codeFontSize: '0.8rem',
      },
    }),
    mdx(),
    sitemap(),
    tailwind({ applyBaseStyles: false }),
    AstroPWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: false },
      workbox: {
        navigateFallback: '/404',
        globPatterns: ['**/*.{js,css,woff2,svg,ico}'],
        navigateFallbackDenylist: [/.*\.xml$/],
      },
      includeAssets: ['**/*.{woff2,svg,ico}'],
      manifest: {
        name: 'Programs Fall Apart',
        short_name: 'Programs Fall Apart',
        description: 'A blog about programming, software engineering, and the search for understanding',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [],
      },
    }),
  ],
})
