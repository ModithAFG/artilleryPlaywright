import { test, expect } from '@playwright/test';
import { goToAssertions } from '../helpers/browsePage';

test('test', async ({ page }) => {
  await goToAssertions(page);
});