import assert from "node:assert/strict";
import test from "node:test";
import { createAlbum, listAlbumsByDate, reorderAlbum } from "../../server/albums-repository.js";
import { createTestDatabase } from "./test-db.js";

test("reorders albums within the same date group", () => {
  const { db, cleanup } = createTestDatabase();
  try {
    const first = createAlbum(db, { name: "First", albumDate: "2026-04-10" });
    createAlbum(db, { name: "Second", albumDate: "2026-04-10" });
    createAlbum(db, { name: "Third", albumDate: "2026-04-10" });

    reorderAlbum(db, { albumId: first.id, dateGroupKey: "2026-04-10", targetIndex: 2 });

    const group = listAlbumsByDate(db).find((item) => item.key === "2026-04-10");
    assert.deepEqual(group.albums.map((album) => album.name), ["Second", "Third", "First"]);
  } finally {
    cleanup();
  }
});

test("rejects cross-group reorder attempts and preserves order", () => {
  const { db, cleanup } = createTestDatabase();
  try {
    const album = createAlbum(db, { name: "April", albumDate: "2026-04-10" });
    createAlbum(db, { name: "May", albumDate: "2026-05-10" });

    assert.throws(
      () => reorderAlbum(db, { albumId: album.id, dateGroupKey: "2026-05-10", targetIndex: 0 }),
      /current date group/
    );

    const april = listAlbumsByDate(db).find((item) => item.key === "2026-04-10");
    assert.deepEqual(april.albums.map((item) => item.name), ["April"]);
  } finally {
    cleanup();
  }
});
