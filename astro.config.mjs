import AstroPWA from '@vite-pwa/astro'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig, passthroughImageService } from 'astro/config'

import rehypeExternalLinks from 'rehype-external-links'
import rehypePrism from 'rehype-prism-plus'
import remarkRehype from 'remark-rehype'

// https://astro.build/config
export default defineConfig({
  site: 'https://programsfallapart.com',
  prefetch: {
    prefetchAll: true,
  },
  image: {
   service: passthroughImageService(),
 },
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [remarkRehype],
    rehypePlugins: [
      [rehypePrism, { showLineNumbers: true }],
      [rehypeExternalLinks, { rel: 'nofollow', target: '_blank' }],
    ],
  },
  integrations: [
    mdx(),
    sitemap(),
    tailwind({ applyBaseStyles: false }),
    AstroPWA({
      registerType: 'prompt',
      devOptions: { enabled: false },
      workbox: {
        navigateFallback: '/404',
        globPatterns: ['**/*'],
        navigateFallbackDenylist: [/.*\.xml$/],
      },
      includeAssets: ['**/*'],
      manifest: {
        name: 'Programs Fall Apart',
        short_name: 'Programs Fall Apart',
        description: '',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [],
      },
    }),
  ],
})
