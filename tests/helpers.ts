import { Page, expect } from '@playwright/test';

export const URL = 'https://www.saucedemo.com';

export async function login(page: Page, user = 'standard_user', pass = 'secret_sauce') {
  await page.goto(URL);
  await page.getByPlaceholder('Username').fill(user);
  await page.getByPlaceholder('Password').fill(pass);
  await page.getByRole('button', { name: 'Login' }).click();
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByTestId('logout-sidebar-link').click();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
}
