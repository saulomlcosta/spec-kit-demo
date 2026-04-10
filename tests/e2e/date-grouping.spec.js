import { expect, test } from "@playwright/test";
import { createAlbum } from "./fixtures.js";

test.beforeEach(async ({ request }) => {
  await request.post("/api/test/reset");
});

test("groups albums by date and shows undated fallback", async ({ page, request }) => {
  await createAlbum(request, "Beach", "2026-04-10");
  await createAlbum(request, "Family", "2026-04-10");
  await createAlbum(request, "Loose scans");

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "2026-04-10" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Undated" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Beach 0 photos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Family 0 photos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Loose scans 0 photos" })).toBeVisible();
});

test("shows no-albums empty state", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#album-groups .empty-state")).toHaveText("No albums yet. Create an album to get started.");
});
