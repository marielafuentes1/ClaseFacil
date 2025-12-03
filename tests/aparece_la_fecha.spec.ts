import { test, expect } from '@playwright/test';

test('en el diagrama aparece la fecha', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('cell', { name: '2/12/' })).toBeVisible();
});