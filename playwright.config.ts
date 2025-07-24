import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e/tests',
  //reporter: 'html',
  reporter: [
    ['@artilleryio/playwright-reporter', { name: 'My Test Suite' }],
  ],
  use: {
    baseURL: 'https://playwright.dev/'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
