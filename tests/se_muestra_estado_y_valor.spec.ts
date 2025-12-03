import { test, expect } from '@playwright/test';

test('en la planilla existe la columna de alumnos y su estado', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('cell', { name: 'alumno' }).click();
  await page.getByRole('cell', { name: 'estado' }).click();
});