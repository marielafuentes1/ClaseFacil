import { test, expect } from '@playwright/test';

test(' se puede ver la lista completa de alumnos del día después de registrar la asistencia', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => { });
  });
  await page.getByRole('button', { name: 'Guardar Asistencia' }).click();
  await page.getByRole('button', { name: 'Ver detalles' }).click();
  await expect(page.getByRole('cell', { name: 'Juan Pérez' }).nth(1)).toBeVisible();
  await expect(page.locator('body')).toContainText('Juan Pérez');
});

