import { goToAssertions } from '../e2e/helpers/browsePage';
import { testDashboard } from '../e2e/helpers/loginPage';

export async function playwrightTest(page, vuContext, events, test) {
  const { step } = test;
  await step('Go to assertions page', async () => {
    await goToAssertions(page);
  });
}

export async function fintellTest(page, vuContext, events, test) {
  const { step } = test;
  await step('Go to assertions page', async () => {
    await testDashboard(page);
  });
}
