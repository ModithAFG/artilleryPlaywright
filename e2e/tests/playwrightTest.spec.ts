import { test, expect } from '@playwright/test';
import { goToAssertions } from '../helpers/browsePage';
import {  ensureLoggedIn, testContactsPage, testHomePage, testopportunities } from '../helpers/loginPage';
import fs from 'fs';
import path from 'path';

// test('test', async ({ page }) => {
//   console.log('Starting ensureLoggedIn');
//   await goToAssertions(page);
// });

test('login with TOTP', async ({ page }) => {
   console.log('Starting ensureLoggedIn');
   await ensureLoggedIn(page);
   console.log('Finished ensureLoggedIn, starting testHomePage');
   await testHomePage(page);
   await page.close();
   console.log('Finished testHomePage');
});


test('check contacts page', async ({ page }) => {
  await testContactsPage(page);
  console.log('Finished testContactsPage');
  //await page.close();
});

test('check opportunities page ', async ({ page }) => {
   
   await testopportunities(page);
   console.log('Finished testopportunities');
   await page.close();
});

// test.beforeEach(async ({ page }) => {
//   const scriptPath = path.resolve(__dirname, '../../node_modules/web-vitals/dist/web-vitals.iife.js');
//   const scriptContent = fs.readFileSync(scriptPath, 'utf8');
//   await page.addInitScript({ content: scriptContent });
// });