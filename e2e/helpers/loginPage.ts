import { expect, Page } from '@playwright/test';
import { getTOTP } from './totp';
import { collectWebVitals } from './webVitals';


// export async function testDashboard(page: Page) {
//     await page.goto('https://testing.v3.sit.ambitionone.com.au/login');
//     await page.fill('input[name="email"]', 'modith.george@afgonline.com.au');
//     await page.fill('input[name="password"]', '7&xM3^h0kRKvvEB$');
//     await page.click('button[type="button"]');

//     // Wait for TOTP input to appear
//     const totpCode = getTOTP('OESQBUCSY7SLJTL5');
//     await page.fill('input[name="code"]', totpCode);
//     await page.getByText('Submit').click();
//     // ...assertions...

//     await expect(
//         page.locator('#menu-wrapper-page h3', { hasText: 'Dashboard' })
//     ).toBeVisible({ timeout: 50000 });


// }

export async function testHomePage(page: Page) {
    console.log('Testing Home Page...');
    await page.goto('https://testing.v3.sit.ambitionone.com.au')
    await page.waitForSelector('#page-menu-trigger', { timeout: 40000 });
    await page.waitForLoadState('domcontentloaded'); // or 'load'
    await collectWebVitals(page);
    await page.locator('#page-menu-trigger').click();
    await page.getByRole('link', { name: 'Contacts' }).click();
    
    await expect(page.locator('#menu-wrapper-page')).toContainText('Contacts');
    console.log('Current URL before Contacts assertion:', await page.url());
    //   await page.waitForLoadState('networkidle');
    await page.locator('#page-menu-trigger').click();
    console.log('Current URL before Contacts assertion:', await page.url());
    await page.getByRole('link', { name: 'Opportunities' }).click();
    console.log('Current URL before Contacts assertion:', await page.url());
    await expect(page.locator('#menu-wrapper-page')).toContainText('Opportunities');

    console.log('Current URL before Contacts assertion:', await page.url());
    await page.locator('#tab-selector').getByRole('link', { name: 'Contacts' }).click();
    console.log('Current URL before Contacts assertion:', await page.url());
    await expect(page.locator('#menu-wrapper-page')).toContainText('Contacts');

    await page.locator('#tab-selector').getByRole('link', { name: 'Opportunities' }).click();
    console.log('Current URL before Contacts assertion:', await page.url());
    await page.locator('#page-menu-trigger').click();

}

export async function testContactsPage(page: Page) {
    await page.goto('https://testing.v3.sit.ambitionone.com.au/contacts');
    await expect(page.locator('#menu-wrapper-page')).toContainText('Contacts');
    await collectWebVitals(page);
} export async function testopportunities(page: Page) {
    await page.goto('https://testing.v3.sit.ambitionone.com.au/opportunities');
    await expect(page.locator('#menu-wrapper-page')).toContainText('Opportunities');
    await collectWebVitals(page);
}

export async function ensureLoggedIn(page: Page) {
    console.log('Ensuring user is logged in...');
    await page.goto('https://testing.v3.sit.ambitionone.com.au');
    // Check if already logged in
    await page.waitForSelector('#page-menu-trigger', { timeout: 60000 });
    if (await page.locator('#menu-wrapper-page h3', { hasText: 'Dashboard' }).isVisible({ timeout: 50000 }) || await page.locator('#page-menu-trigger').isVisible({ timeout: 50000 })) {
        console.log('User is already logged in, skipping login steps.');
        return; // Already logged in, skip login steps
    }
    console.log('User is not logged in, performing login steps...');
    console.log('Current URL:', await page.url());
    console.log('Page content:', await page.locator('#menu-wrapper-page h3', { hasText: 'Dashboard' }).isVisible({ timeout: 50000 }) || await page.locator('#page-menu-trigger').isVisible({ timeout: 50000 }));
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
    console.log('User logged in successfully.');
    console.log('Current URL after login:', await page.url());
    console.log('Page content after login:', await page.content());
}

