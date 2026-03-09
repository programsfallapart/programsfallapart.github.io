import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:4321',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop',
      use: { viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      use: { viewport: { width: 375, height: 812 } },
    },
  ],

  webServer: {
    command: process.env.CI ? 'npx astro preview' : 'npm run build && npm run preview',
    port: 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
