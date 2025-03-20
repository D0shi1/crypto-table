import { test, expect } from "@playwright/test";

test("Фильтрация работает корректно", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.fill(
    'input[placeholder="Search by name or symbol..."]',
    "bitcoin"
  );

  await page.waitForSelector("table tbody tr:has-text('Bitcoin')");

  const visibleRows = await page.locator("table tbody tr").count();
  expect(visibleRows).toBe(1);
});
