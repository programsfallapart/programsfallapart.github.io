import { defineConfig } from '@playwright/test'

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/*.test.ts'],
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['./tests/reporters/progress-reporter.ts']] : 'list',

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
    command: isCI ? 'npx astro preview' : 'npm run build && npm run preview',
    port: 4321,
    reuseExistingServer: !isCI,
    timeout: 30_000,
  },
})
