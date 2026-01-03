import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';

const playwrightTestConfig: PlaywrightTestConfig = defineConfig({
  testDir: './tests',
  testMatch: '**/*.playwright.{ts,tsx}',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [['html', { outputFolder: 'playwright-report' }]],

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 15'] },
    },
  ],

  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },

  timeout: 60_000,
  expect: {
    timeout: 20_000,
  },
});

export default playwrightTestConfig;
