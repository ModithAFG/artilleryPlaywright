import { test, expect } from '@playwright/test';
import { goToAssertions } from '../helpers/assertLink';

test('test', async ({ page }) => {
  await goToAssertions(page);
});