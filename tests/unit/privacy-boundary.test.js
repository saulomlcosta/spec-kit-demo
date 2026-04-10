import assert from "node:assert/strict";
import test from "node:test";
import { createAlbum } from "../../server/albums-repository.js";
import { addPhoto } from "../../server/photos-repository.js";
import { createTestDatabase } from "./test-db.js";

test("stores metadata paths without storing image bytes", () => {
  const { db, cleanup } = createTestDatabase();
  try {
    const album = createAlbum(db, { name: "Privacy", albumDate: "2026-04-10" });
    addPhoto(db, { albumId: album.id, sourcePath: "C:/Photos/local.jpg" });

    const columns = db.prepare("PRAGMA table_info(photos)").all().map((column) => column.name);
    assert.ok(columns.includes("source_path"));
    assert.ok(!columns.includes("image_blob"));
    assert.ok(!columns.includes("bytes"));
  } finally {
    cleanup();
  }
});

test("rejects remote sources at the repository boundary", () => {
  const { db, cleanup } = createTestDatabase();
  try {
    const album = createAlbum(db, { name: "No upload", albumDate: "2026-04-10" });
    assert.throws(() => addPhoto(db, { albumId: album.id, sourcePath: "http://example.test/a.jpg" }), /local file path/);
  } finally {
    cleanup();
  }
});
