import { expect, test } from "@playwright/test";
import { createAlbum } from "./fixtures.js";

test.beforeEach(async ({ request }) => {
  await request.post("/api/test/reset");
});

test("persists album reorder with keyboard controls", async ({ page, request }) => {
  await createAlbum(request, "First", "2026-04-10");
  await createAlbum(request, "Second", "2026-04-10");

  await page.goto("/");
  await page.getByRole("button", { name: "Move Second up" }).click();
  await page.getByRole("button", { name: "Refresh" }).click();

  const cards = page.locator(".album-card__open span");
  await expect(cards.nth(0)).toHaveText("Second");
  await expect(cards.nth(1)).toHaveText("First");
});

test("rejects invalid cross-group reorder through the local contract", async ({ request }) => {
  const album = await createAlbum(request, "April", "2026-04-10");
  await createAlbum(request, "May", "2026-05-10");

  const response = await request.post("/api/albums/reorder", {
    data: { albumId: album.id, dateGroupKey: "2026-05-10", targetIndex: 0 }
  });

  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toMatchObject({
    error: expect.stringContaining("current date group")
  });
});
