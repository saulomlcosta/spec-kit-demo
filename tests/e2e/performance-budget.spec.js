import { expect, test } from "@playwright/test";
import { createAlbum, createPhoto } from "./fixtures.js";

test.beforeEach(async ({ request }) => {
  await request.post("/api/test/reset");
});

test("keeps 50 albums and 100 photo tiles scannable", async ({ page, request }) => {
  for (let index = 0; index < 50; index += 1) {
    await createAlbum(request, `Album ${index + 1}`, "2026-04-10");
  }
  const tileAlbum = await createAlbum(request, "Tile Budget", "2026-04-11");
  for (let index = 0; index < 100; index += 1) {
    await createPhoto(request, tileAlbum.id, {
      sourcePath: `tests/e2e/assets/missing-${index}.jpg`,
      fileName: `missing-${index}.jpg`,
      previewStatus: "missing"
    });
  }

  await page.goto("/");
  await expect(page.locator(".album-card")).toHaveCount(51);
  await page.getByRole("button", { name: "Tile Budget 100 photos" }).click();
  await expect(page.locator(".photo-tile")).toHaveCount(100);
});
