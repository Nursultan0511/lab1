import { test, expect } from '@playwright/test';

// saucedemo нь data-test атрибут ашигладаг
test.use({ testIdAttribute: 'data-test' });

const URL = 'https://www.saucedemo.com';

async function login(page, user: string, pass: string) {
  await page.goto(URL);
  await page.getByPlaceholder('Username').fill(user);
  await page.getByPlaceholder('Password').fill(pass);
  await page.getByRole('button', { name: 'Login' }).click();
}

test.describe('Алхам 3: Assertions', () => {
  test('амжилттай нэвтрэх: URL, гарчиг, бараа харагдах', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
    await expect(page.getByTestId('inventory-list')).toBeVisible();
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
  });

  test('амжилтгүй нэвтрэх: буруу нууц үг', async ({ page }) => {
    await login(page, 'standard_user', 'wrong_password');

    await expect(page).toHaveURL(URL + '/');
    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page.getByTestId('error')).toContainText(
      'Username and password do not match'
    );
  });

  test('амжилтгүй нэвтрэх: хоосон талбар', async ({ page }) => {
    await page.goto(URL);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByTestId('error')).toHaveText(
      'Epic sadface: Username is required'
    );
  });

  test('нэвтэрсний дараа: бараа сагслах', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();

    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.getByTestId('inventory-item')).toHaveCount(1);
    await expect(page.getByTestId('inventory-item-name')).toHaveText(
      'Sauce Labs Backpack'
    );
  });
});
