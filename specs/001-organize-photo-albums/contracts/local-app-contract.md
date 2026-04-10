# Local App Contract: Photo Album Organizer

This contract describes the observable behavior between the vanilla frontend and the local
application service. The service is local to the user's machine and must not upload photo files
or metadata to a remote destination.

## Privacy Boundary

- Photo files remain in their original local locations.
- The local metadata database stores album, order, and preview metadata only.
- The app must not send image bytes, file paths, or metadata to remote services.
- Local preview reads are allowed only to render album covers and photo tiles in the app.

## Main Page Contract

**When albums exist**:

- The main page presents albums grouped by date group label.
- Albums with unknown dates appear under `Undated`.
- Each album item includes enough information to distinguish it from other albums in the same
  date group, including name and photo count.
- Albums are flat items; dropping onto another album must not create containment.

**When no albums exist**:

- The main page presents an empty state explaining that albums can be added.

## Reorder Contract

**Valid reorder**:

- Input: album identifier, original date group, original position, target position in the same
  date group.
- Result: album order is saved for that date group and returned in the new order.
- Persistence: returning to the main page shows the selected order.

**Invalid reorder**:

- Input: album dragged outside a valid position, dropped onto another album as a nesting target,
  or moved to a different date group.
- Result: album returns to its previous valid position.
- Integrity: no nested album and no duplicate album entry is created.

**Keyboard reorder**:

- Input: focused album and a non-pointer reorder action.
- Result: same ordering rules and persistence as pointer drag-and-drop.

## Album View Contract

**When an album has photos**:

- The album view presents photo previews as stable tiles.
- At least the first 100 photos remain scannable without requiring users to open each photo.
- Tile order is stable across page refreshes.

**When previews are pending or unavailable**:

- The tile position remains stable.
- The app shows a placeholder for missing or unreadable previews.
- The album remains browsable.

**When an album has no photos**:

- The album view presents an empty state for the album.

## Local Service Operations

- `ListAlbumsByDate`: returns date groups with flat album summaries ordered by saved sort order.
- `CreateAlbum`: creates an album with name, optional album date, and initial sort order.
- `ReorderAlbum`: validates same-date-group ordering and persists the new sort order.
- `GetAlbumPhotos`: returns ordered photo metadata for tile previews.
- `ReadPhotoPreview`: reads a local image preview for rendering inside the app without remote upload.

## Error Handling

- Invalid nesting attempts return a user-visible non-destructive error and preserve prior order.
- Missing local files show tile placeholders and keep metadata available for later recovery.
- SQLite write failures preserve the last saved order and tell the user the reorder was not saved.
