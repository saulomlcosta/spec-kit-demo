# Quickstart: Photo Album Organizer

## Prerequisites

- Node.js LTS installed locally.
- A local folder containing sample photos for manual validation.

## Setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Start the local app:

   ```powershell
   npm run dev
   ```

3. Open the local URL printed by Vite.

## Validation Flow

1. Create at least three albums across two different dates.
2. Confirm the main page groups albums by date and shows an `Undated` group for albums without a known date.
3. Drag an album within a date group to a new position.
4. Leave and return to the main page, then confirm the new album order remains.
5. Try to drag an album onto another album and confirm no nested album or duplicate album appears.
6. Open an album with photos and confirm photos appear as stable tiles.
7. Open an empty album and confirm the album empty state appears.
8. Temporarily make one referenced local photo unavailable and confirm the tile grid shows a placeholder without layout shift.

## Test Commands

```powershell
npm test
npm run test:e2e
```

Validation completed on 2026-04-10:

- `npm test`: passed 10 unit tests for album validation, album ordering, photo previews, and privacy boundaries.
- `npm run test:e2e`: passed 7 Playwright tests for date grouping, empty states, keyboard reorder, invalid reorder handling, photo tiles, missing previews, and the 50-album/100-tile performance budget.

## Privacy Check

- Confirm original photo files remain in their source folders.
- Confirm the local SQLite database stores metadata only.
- Confirm the app does not require a remote account or remote upload destination.
- Confirm remote photo sources are rejected by unit tests and local service validation.
