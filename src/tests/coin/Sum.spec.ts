import { test, expect } from "@playwright/test";

test("Корректный расчёт суммы монет в портфеле", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const bitcoinPriceText = await page
    .locator("table tbody tr:has-text('Bitcoin') td:nth-child(5)")
    .textContent();
  const bitcoinPrice = parseFloat(bitcoinPriceText?.replace(/[^0-9.-]+/g, "") || "0");

  await page.click("table tbody tr:has-text('Bitcoin') button:has-text('Add to Portfolio')");

  await page.click("text=Open Portfolio");

  await page.waitForSelector(".modal", { timeout: 60000 });

  const totalValueText = await page.textContent(".total-value-class");
  const totalValue = parseFloat(totalValueText?.replace(/[^0-9.-]+/g, "") || "0");

  expect(totalValue).toBe(bitcoinPrice);
});