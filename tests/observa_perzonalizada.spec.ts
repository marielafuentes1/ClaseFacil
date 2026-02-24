import { test, expect } from '@playwright/test';

test('observacion persoonalizada en clases', async ({ page }) => {
  await page.goto('http://localhost:3000/observacion');
  await page.getByRole('button', { name: '➕ Agregar Nueva Observación' }).click();
  await page.getByRole('cell', { name: '0' }).getByPlaceholder('Observación...').fill('hola prueba');
  await expect(page.getByRole('cell', { name: 'hola prueba' }).getByPlaceholder('Observación...')).toBeVisible();
});