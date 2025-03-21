import { test, expect } from "@playwright/test";

test("Поиск возвращает корректные результаты", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.fill('input[placeholder="Search by name or symbol..."]', "eth");

  const isEthereumVisible = await page
    .locator("td:has-text('Ethereum')")
    .isVisible();
  expect(isEthereumVisible).toBeTruthy();
});
