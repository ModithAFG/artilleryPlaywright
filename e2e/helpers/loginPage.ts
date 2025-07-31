import { expect, Page } from '@playwright/test';
import { getTOTP } from './totp';

export async function testDashboard(page: Page) {
    await page.goto('https://testing.v3.sit.ambitionone.com.au/login');
  await page.fill('input[name="email"]', 'modith.george@afgonline.com.au');
  await page.fill('input[name="password"]', '7&xM3^h0kRKvvEB$');
  await page.click('button[type="button"]');

  // Wait for TOTP input to appear
  const totpCode = getTOTP('OESQBUCSY7SLJTL5');
  await page.fill('input[name="code"]', totpCode);
  await page.getByText('Submit').click();
  // ...assertions...

  await expect(
  page.locator('#menu-wrapper-page h3', { hasText: 'Dashboard' })
).toBeVisible({ timeout: 50000 });

await page.waitForSelector('#page-menu-trigger', { timeout: 20000 });
  //await expect(page.getByText('Notifications')).toBeVisible({ timeout: 50000 });
  await page.locator('#page-menu-trigger').click();
  await page.getByRole('link', { name: 'Contacts' }).click();
  await expect(page.locator('#menu-wrapper-page')).toContainText('Contacts');

  await page.locator('#page-menu-trigger').click();
  await page.getByRole('link', { name: 'Opportunities' }).click();
  await expect(page.locator('#menu-wrapper-page')).toContainText('Opportunities');
  await page.locator('#tab-selector').getByRole('link', { name: 'Contacts' }).click();
  await page.locator('#tab-selector').getByRole('link', { name: 'Opportunities' }).click();
  await page.locator('#page-menu-trigger').click();
  await page.locator('#page-menu-inner-scroll').getByRole('link', { name: 'Dashboard' }).click();
  await expect(page.locator('#menu-wrapper-page')).toContainText('Dashboard');

}

