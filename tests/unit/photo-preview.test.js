import assert from "node:assert/strict";
import test from "node:test";
import { createAlbum } from "../../server/albums-repository.js";
import { addPhoto, getAlbumPhotos, updatePreviewStatus } from "../../server/photos-repository.js";
import { createTestDatabase } from "./test-db.js";

test("stores ordered local photo metadata", () => {
  const { db, cleanup } = createTestDatabase();
  try {
    const album = createAlbum(db, { name: "Tiles", albumDate: "2026-04-10" });
    addPhoto(db, { albumId: album.id, sourcePath: "tests/fixtures/one.jpg" });
    addPhoto(db, { albumId: album.id, sourcePath: "tests/fixtures/two.jpg" });

    const photos = getAlbumPhotos(db, album.id);
    assert.deepEqual(photos.map((photo) => photo.fileName), ["one.jpg", "two.jpg"]);
    assert.deepEqual(photos.map((photo) => photo.tileOrder), [0, 1]);
  } finally {
    cleanup();
  }
});

test("rejects remote image sources", () => {
  const { db, cleanup } = createTestDatabase();
  try {
    const album = createAlbum(db, { name: "Remote", albumDate: "2026-04-10" });
    assert.throws(
      () => addPhoto(db, { albumId: album.id, sourcePath: "https://example.com/photo.jpg" }),
      /local file path/
    );
  } finally {
    cleanup();
  }
});

test("updates preview status transitions", () => {
  const { db, cleanup } = createTestDatabase();
  try {
    const album = createAlbum(db, { name: "Missing", albumDate: "2026-04-10" });
    const photo = addPhoto(db, { albumId: album.id, sourcePath: "tests/fixtures/missing.jpg" });
    const updated = updatePreviewStatus(db, photo.id, "missing");

    assert.equal(updated.previewStatus, "missing");
  } finally {
    cleanup();
  }
});
