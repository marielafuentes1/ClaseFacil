import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/consignas');
  await page.getByRole('textbox', { name: 'Escribí la consigna aquí' }).click();
  await page.getByRole('textbox', { name: 'Escribí la consigna aquí' }).fill('HOLA PRUEBA');
  await expect(page.getByRole('button', { name: 'Guardar consigna' })).toBeVisible();
  await expect(page.getByText('HOLA PRUEBA')).toBeVisible();
  await expect(page.getByText('Adjuntar archivo o imagen')).toBeVisible();
});