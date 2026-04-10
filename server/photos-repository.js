import path from "node:path";
import { assertLocalSource } from "./local-files.js";

export function addPhoto(db, input) {
  assertLocalSource(input.sourcePath);
  const fileName = input.fileName || path.basename(input.sourcePath);
  const nextOrder = db.prepare("SELECT COALESCE(MAX(tile_order), -1) + 1 AS value FROM photos WHERE album_id = ?").get(input.albumId).value;

  const result = db.prepare(`
    INSERT INTO photos (album_id, source_path, file_name, captured_at, preview_status, tile_order, width, height)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.albumId,
    input.sourcePath,
    fileName,
    input.capturedAt || null,
    input.previewStatus || "pending",
    nextOrder,
    input.width || null,
    input.height || null
  );

  return getPhoto(db, result.lastInsertRowid);
}

export function getPhoto(db, photoId) {
  return db.prepare(`
    SELECT
      id,
      album_id AS albumId,
      source_path AS sourcePath,
      file_name AS fileName,
      captured_at AS capturedAt,
      preview_status AS previewStatus,
      tile_order AS tileOrder,
      width,
      height
    FROM photos
    WHERE id = ?
  `).get(photoId);
}

export function getAlbumPhotos(db, albumId) {
  return db.prepare(`
    SELECT
      id,
      album_id AS albumId,
      source_path AS sourcePath,
      file_name AS fileName,
      captured_at AS capturedAt,
      preview_status AS previewStatus,
      tile_order AS tileOrder,
      width,
      height
    FROM photos
    WHERE album_id = ?
    ORDER BY tile_order ASC, id ASC
  `).all(albumId);
}

export function updatePreviewStatus(db, photoId, previewStatus) {
  db.prepare("UPDATE photos SET preview_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(previewStatus, photoId);
  return getPhoto(db, photoId);
}
