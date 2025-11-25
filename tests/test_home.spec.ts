import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('img', { name: 'Next.js logo' }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Vercel logomark Deploy now' }).click();
    const page1 = await page1Promise;
});