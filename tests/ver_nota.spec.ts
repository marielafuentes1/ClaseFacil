import { test, expect } from '@playwright/test';

test('puedo ver nota', async ({ page }) => {
  await page.goto('http://localhost:3000/notas');
  await expect(page.getByPlaceholder('Agregar calificación...')).toBeVisible();
  await page.getByPlaceholder('Agregar calificación...').click();
  await expect(page.getByRole('cell', { name: '10' })).toBeVisible();
});