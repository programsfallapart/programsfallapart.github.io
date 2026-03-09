import { defineConfig } from '@playwright/test'

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/*.test.ts'],
  fullyParallel: true,
  forbidOnly: isCI,
  retries: 0,
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
  ],

  webServer: {
    command: isCI ? 'npx astro preview' : 'npm run build && npm run preview',
    port: 4321,
    reuseExistingServer: !isCI,
    timeout: 10_000,
  },
})
