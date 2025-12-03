import { test, expect } from '@playwright/test';

test('probando los estado con las mutaciones que hice', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('row', { name: '/12/2025 daiana Presente' }).getByRole('combobox')).toBeVisible();
  await page.getByRole('row', { name: '/12/2025 daiana Presente' }).getByRole('combobox').selectOption('Ausente');
  await page.getByRole('row', { name: '/12/2025 daiana Presente' }).getByRole('combobox').selectOption('Tarde');
  await expect(page.getByRole('cell', { name: 'Tarde' }).getByRole('combobox')).toBeVisible();
});