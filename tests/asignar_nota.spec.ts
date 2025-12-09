import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/notas');
  await expect(page.getByPlaceholder('Agregar calificación...')).toBeVisible();
  await page.getByPlaceholder('Agregar calificación...').fill('8');
});