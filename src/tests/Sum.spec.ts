import { test, expect } from "@playwright/test";

test("Корректный расчёт суммы монет в портфеле", async ({ page }) => {
  await page.addInitScript(
    (data) => {
      window.localStorage.setItem("portfolio", data);
    },
    JSON.stringify([
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        priceUsd: "29345.67",
        amount: 1,
      },
    ])
  );

  await page.goto("http://localhost:3000");

  await page.click("text=Open Portfolio");

  await page.waitForSelector(".modal", { timeout: 60000 });

  await page.waitForSelector(".total-value-class", { timeout: 60000 });

  const totalValue = await page.textContent(".total-value-class");
  expect(totalValue?.trim()).toBe("$29345.67");
});