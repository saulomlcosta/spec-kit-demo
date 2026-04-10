import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { runMigrations } from "./migrations.js";

export function createDatabase(filename = process.env.PHOTO_ALBUM_DB || "data/photo-albums.sqlite") {
  const resolved = path.resolve(filename);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  const db = new Database(resolved);
  db.pragma("foreign_keys = ON");
  runMigrations(db);
  return db;
}
