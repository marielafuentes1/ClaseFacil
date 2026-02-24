import { test, expect } from '@playwright/test';

test('observacion personalizada con fecha y materia', async ({ page }) => {
  await page.goto('http://localhost:3000/observacion');
  await expect(page.getByRole('row', { name: 'Sofía Rodríguez 8 Observación' }).locator('input[type="date"]')).toBeVisible();
  await expect(page.getByRole('row', { name: 'Sofía Rodríguez 8 Observación' }).locator('input[type="time"]')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Matemática' }).first()).toBeVisible();
  await page.getByRole('row', { name: 'Sofía Rodríguez 8 Observación' }).getByRole('combobox').selectOption('Historia');
  await expect(page.getByRole('cell', { name: 'Historia' })).toBeVisible();
});