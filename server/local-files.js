import fs from "node:fs";
import path from "node:path";

const REMOTE_SOURCE = /^[a-z][a-z0-9+.-]*:\/\//i;

export function assertLocalSource(sourcePath) {
  if (!sourcePath || REMOTE_SOURCE.test(sourcePath)) {
    throw new Error("Photo source must be a local file path.");
  }
  return sourcePath;
}

export function readLocalPreview(photo) {
  assertLocalSource(photo.sourcePath);
  const resolved = path.resolve(photo.sourcePath);
  if (!fs.existsSync(resolved)) {
    return null;
  }

  const extension = path.extname(resolved).toLowerCase();
  const mimeTypes = new Map([
    [".jpg", "image/jpeg"],
    [".jpeg", "image/jpeg"],
    [".png", "image/png"],
    [".gif", "image/gif"],
    [".webp", "image/webp"],
    [".svg", "image/svg+xml"]
  ]);

  return {
    path: resolved,
    contentType: mimeTypes.get(extension) || "application/octet-stream"
  };
}
