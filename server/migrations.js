export function runMigrations(db) {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      album_date TEXT,
      date_group_key TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      cover_photo_id INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      album_id INTEGER NOT NULL,
      source_path TEXT NOT NULL,
      file_name TEXT NOT NULL,
      captured_at TEXT,
      preview_status TEXT NOT NULL DEFAULT 'pending',
      tile_order INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_albums_group_order ON albums(date_group_key, sort_order, id);
    CREATE INDEX IF NOT EXISTS idx_photos_album_order ON photos(album_id, tile_order, id);
  `);
}
