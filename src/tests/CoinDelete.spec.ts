import { test, expect } from "@playwright/test";

test("Удаление монеты из портфолио с использованием моков localStorage", async ({
  page,
}) => {
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
        marketCapUsd: "563400000000",
        changePercent24Hr: "2.34",
        rank: "1",
        supply: "19300000",
        maxSupply: "21000000",
        amount: 1,
      },
    ])
  );

  await page.goto("http://localhost:3000");

  await page.waitForSelector("text=Open Portfolio", { timeout: 60000 });
  await page.locator("text=Open Portfolio").scrollIntoViewIfNeeded();
  await page.click("text=Open Portfolio");

  await page.waitForSelector("text=Bitcoin");
  const isBitcoinVisible = await page.locator("text=Bitcoin").isVisible();
  expect(isBitcoinVisible).toBeTruthy();

  await page.click("text=Remove");
  const isBitcoinGone = await page.locator("text=Bitcoin").isVisible();
  expect(isBitcoinGone).toBeFalsy();
});
