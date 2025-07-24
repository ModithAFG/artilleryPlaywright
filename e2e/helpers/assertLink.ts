import { expect, Page } from '@playwright/test';

export async function goToAssertions(page: Page) {
    await page.goto('/');
    await page.getByRole('link', { name: 'Get started' }).click();
    await page.getByRole('button', { name: 'Search (Ctrl+K)' }).click();
    await page.getByRole('searchbox', { name: 'Search' }).fill('assert');
    await page.getByRole('option', { name: 'Assertions', exact: true }).getByRole('link').click();
    await page.getByRole('link', { name: 'await expect(locator).toBeAttached()' }).click();
    await page.getByRole('link', { name: 'BrowserContext' }).click();
}