import { test, expect } from "@playwright/test";

test.describe("bootstrap", () => {
  test("home page responds", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Create Next App/i);
    await expect(page.getByRole("main")).toBeVisible();
  });
});
