import { test, expect } from '@playwright/test';
import { login, logout, URL } from './helpers';

test.use({ testIdAttribute: 'data-test' });

test.describe('Алхам 5: Logout-оор төгсгөх, test isolation', () => {
  // Тест бүр өөрөө нэвтэрнэ, өмнөх тестээс юу ч өвлөхгүй
  test.beforeEach(async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // Тест бүрийг logout-оор төгсгөнө (тест унасан ч ажиллана)
  test.afterEach(async ({ page }) => {
    if (page.url().includes('saucedemo.com') && !page.url().endsWith('.com/')) {
      await logout(page);
    }
  });

  test('бараа сагслаад гарах', async ({ page }) => {
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('сагс эхлэхдээ хоосон (өмнөх тестээс хамааралгүй)', async ({ page }) => {
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
  });

  test('бараа эрэмбэлэх', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('lohi');
    await expect(page.getByTestId('inventory-item-price').first()).toHaveText('$7.99');
  });

  test('logout хийсний дараа inventory руу шууд орох боломжгүй', async ({ page }) => {
    await logout(page);
    await page.goto(URL + '/inventory.html');
    await expect(page.getByTestId('error')).toContainText("only access '/inventory.html' when you are logged in");
  });
});
