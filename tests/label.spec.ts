import { test, expect } from '@playwright/test';

test('getByLabel: todo дуусгах', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await page.getByPlaceholder('What needs to be done?').fill('Lab 1 дуусгах');
  await page.getByPlaceholder('What needs to be done?').press('Enter');
  await page.getByLabel('Toggle Todo').check();
  await expect(page.getByText('Lab 1 дуусгах')).toBeVisible();
});
