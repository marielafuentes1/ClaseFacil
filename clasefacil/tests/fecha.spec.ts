import { test, expect } from '@playwright/test';npm install -D @playwright/test


test('En la planilla de asitencia muestra la fecha del dia', async ({ page }) => {
  await page.goto('http://localhost,:3002/');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('cell', { name: '/11/2025' }).first().click();
});