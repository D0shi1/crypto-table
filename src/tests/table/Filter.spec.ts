import { test, expect } from "@playwright/test";

test("Фильтрация по Market Cap работает корректно", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.click('th:has-text("Market Cap")');

  await page.waitForTimeout(1000);

  await page.click('th:has-text("Market Cap")');

  await page.waitForSelector("table tbody tr");

  const firstRowText = await page.locator("table tbody tr").first().textContent();
  expect(firstRowText).toContain("Bitcoin");
});