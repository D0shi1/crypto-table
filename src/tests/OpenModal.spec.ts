import { test, expect } from "@playwright/test";

test("Открытие и закрытие модального окна через уточнённый локатор", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  await page.click("text=Open Portfolio");

  await page.waitForSelector("h2.text-xl.font-bold");
  const isHeaderVisible = await page
    .getByRole("heading", { name: "Your Portfolio" })
    .isVisible();
  expect(isHeaderVisible).toBeTruthy();

  await page.click("text=Close");

  await page.waitForSelector("h2.text-xl.font-bold", { state: "hidden" });
  const isHeaderHidden = await page.locator("h2.text-xl.font-bold").isHidden();
  expect(isHeaderHidden).toBeTruthy();
});
