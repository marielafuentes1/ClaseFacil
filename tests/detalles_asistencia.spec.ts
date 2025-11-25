import { test, expect } from '@playwright/test';

test('se puede ver la lista completa de alumnos del día después de registrar la asistencia', async ({ page }) => {
  await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Guardar Asistencia' }).click();
     await page.getByRole('button', { name: 'Ver detalles' }).click();
    await page.getByRole('heading', { name: 'Detalles de Asistencia' }).click
  });