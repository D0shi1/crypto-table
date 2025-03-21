import { test, expect } from "@playwright/test";

test("Добавление монеты в портфель", async ({ page }) => {
  const mockPortfolioData = JSON.stringify([]);

  await page.addInitScript((data) => {
    window.localStorage.setItem("portfolio", data);
  }, mockPortfolioData);

  await page.goto("http://localhost:3000");

  await page.waitForSelector("text=Add");
  await page.locator("text=Add >> nth=0").click();

  await page.waitForSelector('td.px-10.py-4:has-text("Bitcoin")');
  const isBitcoinVisible = await page
    .locator('td.px-10.py-4:has-text("Bitcoin")')
    .isVisible();
  expect(isBitcoinVisible).toBeTruthy();
});
