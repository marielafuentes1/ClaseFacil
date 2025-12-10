// import { test, expect } from '@playwright/test';

// test('probando los estados', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   await expect(page.getByRole('row', { name: '/12/2025 daiana Presente' }).getByRole('combobox')).toBeVisible();
//   await page.getByRole('row', { name: '/12/2025 daiana Presente' }).getByRole('combobox').selectOption('Tarde');
//   await expect(page.getByRole('cell', { name: 'Tarde' }).getByRole('combobox')).toBeVisible();
// });

// import { test, expect } from '@playwright/test';


// test('test', async ({ page }) => {
//   await page.goto('http://localhost:3000/notas');
//   await expect(page.getByPlaceholder('Agregar calificación...')).toBeVisible();
//   await page.getByPlaceholder('Agregar calificación...').fill('8');
// });
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await expect(page.getByRole('row', { name: '/12/2025 daiana Presente' }).getByRole('combobox')).toBeVisible();
   await page.getByPlaceholder('cell', { name: 'Tarde' });
});

