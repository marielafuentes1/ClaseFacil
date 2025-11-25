import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('cell', { name: 'Juan Pérez' }).click();
  await expect(page.getByRole('row', { name: '/11/2025 Juan Pérez Presente' }).getByRole('combobox')).toBeVisible();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Guardar Asistencia' }).click();
});