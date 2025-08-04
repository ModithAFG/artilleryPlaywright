import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e/tests',
  reporter: 'html',
  // reporter: [
  //  // for artillery cloud reports
  //  // ['@artilleryio/playwright-reporter', { name: 'My Test Suite' }],
  // ],
  use: {
    baseURL: 'https://testing.v3.sit.ambitionone.com.au',
    storageState: 'storageState.json',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  globalSetup: require.resolve('./global-setup.ts'),
});
