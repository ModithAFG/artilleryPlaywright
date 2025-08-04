import { goToAssertions } from '../e2e/helpers/browsePage';
import { ensureLoggedIn, testContactsPage, testDashboard, testHomePage, testopportunities } from '../e2e/helpers/loginPage';
import path from 'path';
import fs from 'fs';

export async function playwrightTest(page, vuContext, events, test) {
  const { step } = test;
  await step('Go to assertions page', async () => {
    await goToAssertions(page);
  });
}
export async function loginUserAndSaveStorage(page, context, test) {
  // Always resolve from project root
  const storagePath = path.resolve(__dirname, '../../storageState.json');
  const storageState = JSON.parse(
    fs.readFileSync(storagePath, 'utf8')
  );
  if (Object.keys(storageState).length > 0) {
    console.log('Already logged in. Skipping login.');
    return;
  }
  const { step } = test;
  await step('Go to assertions page', async () => {
    await ensureLoggedIn(page);
  });
  console.log('Logging in and saving storage state...');
}  

  // //1. navigate to page and assert that we are not logged in
  // await page.goto(context.vars.target);
  // await expect(page.getByText('Authentication example')).toBeVisible();

  // //2. click login button and make sure we are redirected to `/login`
  // await page.getByRole('link', { name: 'Login' }).click();
  // await page.waitForURL('**/login');

  // //3. fill in your github username and click login button
  // await page.getByLabel('username').fill(context.vars.githubUsername);
  // await page.getByRole('button', { name: 'Login' }).click();

  // //4. ensure we are redirected to profile page and logged in
  // await page.waitForURL('**/profile-sg');
  // await expect(page.getByText('Your GitHub profile')).toBeVisible();

  // //5. save iron session cookie to storage.json
  // // NOTE: we use the $dirname utility so Playwright can resolve the full path
  // await page
  //   .context()
  //   .storageState({ path: `${context.vars.$dirname}/storage.json` });


export async function fintellTest(page, vuContext, events, test) {
  const { step } = test;
  await step('Go to home and test navigation', async () => {
    await page.goto(vuContext.vars.target);
    await testHomePage(page);
    await testContactsPage(page);
    await testopportunities(page);
  });
}
