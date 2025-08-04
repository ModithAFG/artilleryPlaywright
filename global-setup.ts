import { chromium } from '@playwright/test';
import { getTOTP } from './e2e/helpers/totp';

async function globalSetup() {

    console.log('Running global setup...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://testing.v3.sit.ambitionone.com.au/login');
  await page.fill('input[name="email"]', 'modith.george@afgonline.com.au');
  await page.fill('input[name="password"]', '7&xM3^h0kRKvvEB$');
  await page.click('button[type="button"]');
  const totpCode = getTOTP('OESQBUCSY7SLJTL5');
  await page.fill('input[name="code"]', totpCode);
  await page.getByText('Submit').click();
  // Wait for dashboard or some element that confirms login
  await page.waitForSelector('#menu-wrapper-page h3');
  await page.context().storageState({ path: 'storageState.json' });
  console.log('Global setup completed, storage state saved.');
  await browser.close();
}

export default globalSetup;