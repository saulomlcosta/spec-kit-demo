import assert from "node:assert/strict";
import test from "node:test";
import { createAlbum, deriveDateGroupKey, listAlbumsByDate } from "../../server/albums-repository.js";
import { createTestDatabase } from "./test-db.js";

test("derives date groups and uses Undated fallback", () => {
  assert.equal(deriveDateGroupKey("2026-04-10"), "2026-04-10");
  assert.equal(deriveDateGroupKey(null), "undated");
});

test("groups flat albums by date with an Undated fallback", () => {
  const { db, cleanup } = createTestDatabase();
  try {
    createAlbum(db, { name: "April", albumDate: "2026-04-10" });
    createAlbum(db, { name: "No date" });
    createAlbum(db, { name: "April second", albumDate: "2026-04-10" });

    const groups = listAlbumsByDate(db);
    const april = groups.find((group) => group.key === "2026-04-10");
    const undated = groups.find((group) => group.key === "undated");

    assert.equal(april.albumCount, 2);
    assert.deepEqual(april.albums.map((album) => album.name), ["April", "April second"]);
    assert.equal(undated.label, "Undated");
    assert.equal(undated.albumCount, 1);
    assert.ok(!("albums" in april.albums[0]), "album records must not nest albums");
  } finally {
    cleanup();
  }
});

test("rejects blank album names", () => {
  const { db, cleanup } = createTestDatabase();
  try {
    assert.throws(() => createAlbum(db, { name: " " }), /Album name is required/);
  } finally {
    cleanup();
  }
});
