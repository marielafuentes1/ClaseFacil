import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('textbox', { name: 'Agregar observación...' }).fill('trabajando');
    await page.getByRole('cell', { name: 'observaciones' }).click();
    await page.getByRole('textbox', { name: 'Agregar observación...' }).click();

});