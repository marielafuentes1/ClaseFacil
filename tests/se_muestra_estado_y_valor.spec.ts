import { test, expect } from '@playwright/test';

test('debe mostrar la columna alumno y estado', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('cell', { name: 'alumno' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'estado' })).toBeVisible();
});