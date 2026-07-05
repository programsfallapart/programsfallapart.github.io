import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig, passthroughImageService } from 'astro/config'
import expressiveCode from 'astro-expressive-code'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

import rehypeExternalLinks from 'rehype-external-links'
import rehypeHeadingNumbers from './src/plugins/rehype-heading-numbers'
import { oxideDark, oxideLight } from './src/styles/code-theme.mjs'

// https://astro.build/config
export default defineConfig({
  site: 'https://programsfallapart.com',
  // Inline all CSS into each page's <head> so the stylesheet is never a
  // separate render-blocking request (removes it from the critical chain).
  build: {
    inlineStylesheets: 'always',
  },
  image: {
   service: passthroughImageService(),
 },
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { rel: 'nofollow', target: '_blank' }],
      rehypeHeadingNumbers,
    ],
  },
  integrations: [
    expressiveCode({
      themes: [oxideDark, oxideLight],
      themeCssSelector: (theme) => {
        return theme.type === 'dark' ? '.dark' : ':root:not(.dark)'
      },
      plugins: [pluginLineNumbers()],
      defaultProps: {
        showLineNumbers: true,
      },
      emitExternalStylesheet: false,
      styleOverrides: {
        borderRadius: '0.1rem',
        codeFontFamily: "'JetBrains Mono', monospace",
        codeFontSize: '0.8rem',
      },
    }),
    mdx(),
    sitemap(),
    tailwind({ applyBaseStyles: false }),
  ],
})
