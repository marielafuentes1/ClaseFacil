import { test, expect } from '@playwright/test';

test('se puede escribir en observaciones', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Agregar observación...' }).click();
  await page.getByRole('textbox', { name: 'Agregar observación...' }).fill('abcd');
  await expect(page.getByRole('cell', { name: 'abcd' })).toBeVisible();
});