import { test, expect } from '@playwright/test';

test('observacion conectada ala base de datos', async ({ page }) => {
  await page.goto('http://localhost:3000/observacion');
  await page.getByRole('combobox').selectOption('vmfh5xcj41qa3ky');
  await page.getByRole('textbox', { name: 'Escribir observación...' }).click();
  await page.getByRole('textbox', { name: 'Escribir observación...' }).fill('prueba');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByText('Observación: prueba')).toBeVisible();
});