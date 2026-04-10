# Data Model: Photo Album Organizer

## Album

Represents a flat user-managed photo album.

**Fields**:

- `id`: Stable unique identifier.
- `name`: User-facing album name.
- `albumDate`: Date used for grouping. Nullable when unknown.
- `dateGroupKey`: Derived grouping key, using `undated` when `albumDate` is unknown.
- `sortOrder`: Numeric order within the album's date group.
- `coverPhotoId`: Optional photo used as the album cover.
- `createdAt`: Creation timestamp.
- `updatedAt`: Last metadata update timestamp.

**Relationships**:

- Has many `Photo` records.
- Belongs to one `DateGroup` derived from `albumDate`.
- Must not contain another `Album`.

**Validation Rules**:

- `name` must be present and distinguishable within the same date group.
- `sortOrder` must be unique within a date group after reordering.
- `albumDate` may be unknown, but unknown dates must map to the fallback `Undated` group.
- Album nesting is invalid in every state.

## Photo

Represents an image item shown as a tile preview inside one album.

**Fields**:

- `id`: Stable unique identifier.
- `albumId`: Owning album identifier.
- `sourcePath`: Local file reference on the user's machine.
- `fileName`: Display name derived from the local file.
- `capturedAt`: Optional original capture timestamp.
- `previewStatus`: `pending`, `available`, `missing`, or `error`.
- `tileOrder`: Display order inside the album.
- `width`: Optional image width when known.
- `height`: Optional image height when known.
- `createdAt`: Metadata creation timestamp.
- `updatedAt`: Last metadata update timestamp.

**Relationships**:

- Belongs to exactly one `Album` for this feature.

**Validation Rules**:

- `sourcePath` must reference a local file; remote URLs are invalid for imported photos.
- A missing or unreadable file must keep its `Photo` record but move preview status to `missing`
  or `error` so the tile grid can show a stable placeholder.
- `tileOrder` must be stable when the album is opened.

## DateGroup

Represents the visual grouping of albums by date on the main page.

**Fields**:

- `key`: Derived stable group key, such as an ISO date or `undated`.
- `label`: User-facing group label, such as `2026-04-10` or `Undated`.
- `albumCount`: Number of albums in the group.

**Relationships**:

- Contains zero or more `Album` records by derived grouping.

**Validation Rules**:

- The `Undated` fallback group must exist whenever at least one album has no known date.
- Date groups are not albums and cannot be drag targets for nesting.

## AlbumOrder

Represents the saved ordering result after a valid drag-and-drop or keyboard reorder.

**Fields**:

- `albumId`: Album being ordered.
- `dateGroupKey`: Date group where the album is displayed.
- `sortOrder`: Position inside the date group.
- `updatedAt`: Timestamp for the latest order change.

**Validation Rules**:

- Ordering changes are valid only within the same `dateGroupKey`.
- Dropping an album outside a valid order position must leave the prior order unchanged.
- Reordering must not duplicate an album or change an album into a child of another album.

## State Transitions

- Album preview state: empty -> has photos -> missing previews possible -> recovered when files
  are readable again.
- Photo preview state: pending -> available, pending -> missing, pending -> error, missing ->
  available if the local file becomes readable.
- Reorder state: idle -> dragging -> valid target -> saved order; idle -> dragging -> invalid
  target -> previous order restored.
