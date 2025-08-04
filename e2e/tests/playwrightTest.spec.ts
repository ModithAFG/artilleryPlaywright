import { test, expect } from '@playwright/test';
import { goToAssertions } from '../helpers/browsePage';
import {  ensureLoggedIn, testDashboard, testHomePage } from '../helpers/loginPage';

// test('test', async ({ page }) => {
//   await goToAssertions(page);
// });

test('login with TOTP', async ({ page }) => {
   await ensureLoggedIn(page);
   await testHomePage(page);
});