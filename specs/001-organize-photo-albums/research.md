# Research: Photo Album Organizer

## Decision: Use Vite with vanilla HTML, CSS, and JavaScript

**Rationale**: The user explicitly requested Vite and minimal libraries, with vanilla web
technologies where possible. Vite provides fast local development and asset handling without
requiring a component framework.

**Alternatives considered**:

- React/Vue/Svelte: rejected because the UI is simple enough to build with DOM modules and the
  user asked for minimal libraries.
- Static HTML without Vite: rejected because the requested Vite setup gives a standard dev/build
  workflow and easier module organization.

## Decision: Use a minimal local Node.js service for SQLite and local files

**Rationale**: A browser-only app cannot reliably manage a normal local SQLite database file and
durable local image file paths across sessions. A small local process can own the SQLite file,
read local image metadata, and serve previews from the user's machine without uploading images
anywhere.

**Alternatives considered**:

- SQLite compiled to WebAssembly in browser storage: rejected because it increases complexity and
  does not cleanly represent a normal local SQLite database file for this app.
- Electron or other desktop shells: rejected for initial scope because they add heavy runtime
  dependencies beyond the minimal-library requirement.
- Remote backend storage: rejected because images must not be uploaded anywhere.

## Decision: Store metadata only in SQLite

**Rationale**: The requirement says images are not uploaded and metadata is stored in SQLite.
The database will store album data, date groups, display order, photo metadata, and local file
references. Original image bytes remain in the user's chosen locations.

**Alternatives considered**:

- Copying photos into an app-managed folder: rejected for initial scope because it changes the
  "not uploaded" requirement into a file-management feature and increases storage risk.
- Storing image binaries in SQLite: rejected because it bloats the metadata database and makes
  photo management slower for the initial use case.

## Decision: Reorder albums within date groups only

**Rationale**: The spec defines albums as grouped by date and later narrowed drag-and-drop to
ordering inside a date group. This avoids changing album dates through drag gestures and
prevents accidental nested or duplicate albums.

**Alternatives considered**:

- Dragging albums across date groups to change dates: rejected for initial scope because it makes
  date semantics ambiguous and was not requested.
- Nested album targets: rejected because the feature explicitly prohibits nested albums.

## Decision: Use Playwright for browser workflow coverage

**Rationale**: Drag-and-drop, tile layout stability, empty states, and keyboard-accessible
reordering are user-facing browser behaviors. Playwright covers these flows without adding a UI
framework.

**Alternatives considered**:

- Manual-only testing: rejected because the constitution requires automated tests unless a
  justified exception exists.
- Unit-only testing: rejected because drag-and-drop and tile layout behavior need browser-level
  validation.

## Decision: Use Node.js built-in test runner for service and data rules

**Rationale**: Node's built-in test runner covers validation and repository logic without adding
an extra unit test dependency.

**Alternatives considered**:

- Vitest/Jest: rejected for initial scope to keep the dependency set small.
