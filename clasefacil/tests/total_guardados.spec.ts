import { test, expect } from '@playwright/test';

test('Verifica que los contadores de Totales Alumnos se guarden en tiempo real', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByText('Total Alumnos5').click();
  await page.getByText('5').first().click();
});