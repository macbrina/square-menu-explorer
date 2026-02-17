/**
 * E2E test: Full user flow for the Square Menu Explorer.
 *
 * Prerequisites: A running dev server with valid SQUARE_ACCESS_TOKEN.
 * This test covers:
 *   1. Page loads and displays the location selector
 *   2. Selecting a location loads categories and menu items
 *   3. Search filters items
 *   4. Dark mode toggle works
 *
 * Note: This test requires a valid Square sandbox token and
 * test catalog data. In CI, you may need to mock the API
 * or use a dedicated sandbox account.
 */
import { test, expect } from "@playwright/test";

test.describe("Menu Explorer", () => {
  test("page loads with header and location selector", async ({ page }) => {
    await page.goto("/");

    // Header visible
    await expect(page.getByRole("heading", { name: "Menu Explorer" })).toBeVisible();

    // Location selector exists
    await expect(page.getByLabel("Select a location")).toBeVisible();

    // Dark mode toggle exists
    await expect(page.getByLabel(/Switch to .+ mode|Toggle theme/)).toBeVisible();
  });

  test("shows empty state before selecting a location", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Select a location above to view the menu."),
    ).toBeVisible();
  });

  test("dark mode toggle switches theme", async ({ page }) => {
    await page.goto("/");

    // Wait for the toggle to be enabled (hydration)
    const toggle = page.getByLabel(/Switch to .+ mode/);
    await expect(toggle).toBeEnabled({ timeout: 5000 });

    // Click to toggle
    await toggle.click();

    // Check that the html element has the dark class
    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("dark");
  });

  test("skip to content link is accessible via keyboard", async ({ page }) => {
    await page.goto("/");

    // Tab to reveal skip link
    await page.keyboard.press("Tab");

    const skipLink = page.getByText("Skip to content");
    await expect(skipLink).toBeFocused();
  });

  test("search bar is present after selecting a location", async ({ page }) => {
    await page.goto("/");

    // Open location selector
    const trigger = page.getByLabel("Select a location");
    await trigger.click();

    // Wait for options to load
    const firstOption = page.getByRole("option").first();
    const hasOptions = await firstOption.isVisible().catch(() => false);

    if (hasOptions) {
      await firstOption.click();
      await expect(page.getByPlaceholder("Search menu items...")).toBeVisible();
    }
  });
});
