import { test, expect } from '@playwright/test';

test('Dada la planilla de asistecia, al guardar el presente, deberia aparecer mensaje "Guardar asistenacia"', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('row', { name: '/11/2025 Juan Pérez Presente' }).getByRole('combobox').selectOption('Ausente');
    await page.getByRole('row', { name: '/11/2025 Juan Pérez Ausente' }).getByPlaceholder('Agregar observación...').click();
    await page.getByRole('row', { name: '/11/2025 Juan Pérez Ausente' }).getByPlaceholder('Agregar observación...').fill('agrego una observacion');
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => { });
    });
    await page.getByRole('button', { name: 'Guardar Asistencia' }).click();
    await page.getByRole('button', { name: 'Ver detalles' }).click();
    await page.getByRole('button', { name: 'Ver detalles' }).click();
    await page.getByText('lunes, 17 de noviembre de 2025Presentes: 4 | Ausentes: 1 | Tarde: 0Ver detalles').click();
});