import { test, expect } from '@playwright/test';
import { goToAssertions } from '../helpers/browsePage';
import {  testDashboard } from '../helpers/loginPage';

// test('test', async ({ page }) => {
//   await goToAssertions(page);
// });

test('login with TOTP', async ({ page }) => {
   await testDashboard(page);
});