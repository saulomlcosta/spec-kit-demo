import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { createAlbum, createPhoto } from "./fixtures.js";

const fixtureDir = path.resolve("tests/e2e/assets");
const fixtureImage = path.join(fixtureDir, "tile.svg");

test.beforeAll(() => {
  fs.mkdirSync(fixtureDir, { recursive: true });
  fs.writeFileSync(fixtureImage, '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="green"/></svg>');
});

test.beforeEach(async ({ request }) => {
  await request.post("/api/test/reset");
});

test("shows photo tiles and empty album state", async ({ page, request }) => {
  const album = await createAlbum(request, "Tiles", "2026-04-10");
  const empty = await createAlbum(request, "Empty", "2026-04-10");
  await createPhoto(request, album.id, { sourcePath: fixtureImage, fileName: "tile.svg" });

  await page.goto("/");
  await page.getByRole("button", { name: "Tiles 1 photo" }).click();
  await expect(page.locator(".photo-tile")).toHaveCount(1);
  await expect(page.getByText("tile.svg")).toBeVisible();

  await page.getByRole("button", { name: "Back to albums" }).click();
  await page.getByRole("button", { name: "Empty 0 photos" }).click();
  await expect(page.getByText("This album has no photos yet.")).toBeVisible();
  expect(empty.name).toBe("Empty");
});

test("shows placeholders for missing previews", async ({ page, request }) => {
  const album = await createAlbum(request, "Missing", "2026-04-10");
  await createPhoto(request, album.id, { sourcePath: "tests/e2e/assets/missing.jpg", fileName: "missing.jpg", previewStatus: "missing" });

  await page.goto("/");
  await page.getByRole("button", { name: "Missing 1 photo" }).click();

  await expect(page.getByText("Preview unavailable")).toBeVisible();
});
