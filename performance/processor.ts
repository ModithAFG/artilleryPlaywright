import { goToAssertions } from '../e2e/helpers/browsePage';

export async function playwrightTest(page, vuContext, events, test) {
  const { step } = test;
  await step('Go to assertions page', async () => {
    await goToAssertions(page);
  });
}
