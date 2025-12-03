import { test, expect } from '@playwright/test';

test('aparece la fecha', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('cell', { name: 'fecha' }).click();
  await page.getByRole('cell', { name: '2/12/' }).click();
});