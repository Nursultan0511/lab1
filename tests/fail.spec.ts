import { test, expect } from '@playwright/test';

// Санаатай унах тест: trace viewer дээр алдааг мөшгөх зорилготой (Алхам 4).
// Энгийн `npx playwright test`-д skip болно. Унагахдаа:
//   RUN_FAIL_DEMO=1 npx playwright test tests/fail.spec.ts --project=chromium --trace on
test.skip(!process.env.RUN_FAIL_DEMO, 'Санаатай унах demo тест. RUN_FAIL_DEMO=1 үед ажиллана');

test('санаатай унах тест', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Буруу хүлээлт: бодит гарчиг нь "Products"
  await expect(page.locator('[data-test="title"]')).toHaveText('Бараанууд', { timeout: 5000 });
});
