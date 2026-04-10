import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createDatabase } from "../../server/db.js";

export function createTestDatabase() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "photo-albums-"));
  const file = path.join(dir, "test.sqlite");
  const db = createDatabase(file);
  return {
    db,
    file,
    cleanup() {
      db.close();
      fs.rmSync(dir, { recursive: true, force: true });
    }
  };
}
