export function deriveDateGroupKey(albumDate) {
  if (!albumDate) return "undated";
  return albumDate.slice(0, 10);
}

export function dateGroupLabel(key) {
  return key === "undated" ? "Undated" : key;
}

export function validateAlbumName(name) {
  const normalized = String(name || "").trim();
  if (!normalized) {
    throw new Error("Album name is required.");
  }
  if (normalized.length > 120) {
    throw new Error("Album name must be 120 characters or fewer.");
  }
  return normalized;
}

export function createAlbum(db, input) {
  const name = validateAlbumName(input.name);
  const albumDate = input.albumDate || null;
  const dateGroupKey = deriveDateGroupKey(albumDate);
  const nextOrder = db.prepare("SELECT COALESCE(MAX(sort_order), -1) + 1 AS value FROM albums WHERE date_group_key = ?").get(dateGroupKey).value;

  const result = db.prepare(`
    INSERT INTO albums (name, album_date, date_group_key, sort_order)
    VALUES (?, ?, ?, ?)
  `).run(name, albumDate, dateGroupKey, nextOrder);

  return getAlbum(db, result.lastInsertRowid);
}

export function getAlbum(db, albumId) {
  return db.prepare(`
    SELECT
      a.id,
      a.name,
      a.album_date AS albumDate,
      a.date_group_key AS dateGroupKey,
      a.sort_order AS sortOrder,
      COUNT(p.id) AS photoCount
    FROM albums a
    LEFT JOIN photos p ON p.album_id = a.id
    WHERE a.id = ?
    GROUP BY a.id
  `).get(albumId);
}

export function listAlbumsByDate(db) {
  const rows = db.prepare(`
    SELECT
      a.id,
      a.name,
      a.album_date AS albumDate,
      a.date_group_key AS dateGroupKey,
      a.sort_order AS sortOrder,
      COUNT(p.id) AS photoCount
    FROM albums a
    LEFT JOIN photos p ON p.album_id = a.id
    GROUP BY a.id
    ORDER BY CASE WHEN a.date_group_key = 'undated' THEN 1 ELSE 0 END,
      a.date_group_key DESC,
      a.sort_order ASC,
      a.id ASC
  `).all();

  const groups = [];
  for (const album of rows) {
    let group = groups.find((item) => item.key === album.dateGroupKey);
    if (!group) {
      group = { key: album.dateGroupKey, label: dateGroupLabel(album.dateGroupKey), albumCount: 0, albums: [] };
      groups.push(group);
    }
    group.albums.push(album);
    group.albumCount = group.albums.length;
  }
  return groups;
}

export function reorderAlbum(db, { albumId, dateGroupKey, targetIndex }) {
  const album = getAlbum(db, albumId);
  if (!album) {
    throw new Error("Album not found.");
  }
  if (album.dateGroupKey !== dateGroupKey) {
    throw new Error("Albums can only be reordered within their current date group.");
  }

  const reorder = db.transaction(() => {
    const albums = db.prepare(`
      SELECT id FROM albums
      WHERE date_group_key = ?
      ORDER BY sort_order ASC, id ASC
    `).all(dateGroupKey);

    const withoutAlbum = albums.filter((item) => item.id !== album.id);
    const boundedIndex = Math.max(0, Math.min(Number(targetIndex), withoutAlbum.length));
    withoutAlbum.splice(boundedIndex, 0, { id: album.id });

    const update = db.prepare("UPDATE albums SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    withoutAlbum.forEach((item, index) => update.run(index, item.id));
  });

  reorder();
  return listAlbumsByDate(db);
}
