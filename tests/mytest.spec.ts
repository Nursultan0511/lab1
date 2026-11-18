import { test, expect } from '@playwright/test';

// saucedemo нь data-testid биш data-test атрибут ашигладаг тул getByTestId-д зориулж тохируулна
test.use({ testIdAttribute: 'data-test' });

const URL = 'https://www.saucedemo.com';

test.describe('Saucedemo', () => {
  test('амжилттай нэвтрэх', async ({ page }) => {
    await page.goto(URL);
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('буруу нууц үгээр нэвтрэхэд алдаа харуулах', async ({ page }) => {
    await page.goto(URL);
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByTestId('error')).toContainText('do not match');
  });

  test('бараа сагсанд нэмж, захиалга хийх', async ({ page }) => {
    // Нэвтрэх
    await page.goto(URL);
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Сагсанд нэмэх
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    // Сагс руу орж, checkout хийх
    await page.getByTestId('shopping-cart-link').click();
    await expect(page.getByText('Your Cart')).toBeVisible();
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByPlaceholder('First Name').fill('Nursultan');
    await page.getByPlaceholder('Last Name').fill('D');
    await page.getByPlaceholder('Zip/Postal Code').fill('14200');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Finish' }).click();

    await expect(page.getByText('Thank you for your order!')).toBeVisible();
  });

  test('системээс гарах', async ({ page }) => {
    await page.goto(URL);
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByTestId('logout-sidebar-link').click();

    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});
