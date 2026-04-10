# Implementation Plan: Photo Album Organizer

**Branch**: `001-organize-photo-albums` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-organize-photo-albums/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a local-first photo album organizer where users browse date-grouped albums, reorder albums
within date groups by drag-and-drop, and preview album photos as stable tiles. The implementation
uses a Vite-powered vanilla HTML/CSS/JavaScript frontend with a minimal local Node.js service for
SQLite metadata and local image file access. Original image files remain on the user's device and
are never uploaded to any remote service.

## Technical Context

**Language/Version**: JavaScript (ES2024) on Node.js LTS  
**Primary Dependencies**: Vite, better-sqlite3, Playwright for end-to-end tests; avoid UI frameworks and use browser/Node built-ins where practical  
**Storage**: Local SQLite database for metadata; original image files stay in their source locations and are never uploaded  
**Testing**: Node.js built-in test runner for data/service logic; Playwright for album grouping, drag-and-drop, empty states, and tile preview flows  
**Target Platform**: Local desktop browser application served from the user's machine  
**Project Type**: Local-first web application with vanilla Vite frontend and minimal local Node.js service  
**Performance Goals**: Main page remains responsive with at least 50 albums; users can locate albums in under 30 seconds and reorder within 10 seconds; first 100 photo tiles in an album remain scannable without layout shifts  
**Constraints**: No remote image uploads; no nested albums; minimal runtime libraries; offline-capable for previously indexed metadata and local images; accessible non-pointer path for reordering  
**Scale/Scope**: Single-user personal photo library, at least 50 albums and 100 photos in an album for initial validation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code quality: PASS. Plan uses a small vanilla frontend plus a focused local service, avoids UI framework churn, and scopes dependencies to Vite, SQLite access, and tests.
- Testing standards: PASS. Automated service/data tests and end-to-end UI tests are planned for the date grouping, drag-and-drop, persistence, empty-state, and tile-preview flows.
- User experience consistency: PASS. Spec defines prioritized user journeys, stable tile layout, clear empty states, fallback "Undated" grouping, and an accessible non-pointer ordering path.
- Performance requirements: PASS. Plan carries measurable budgets from the spec for 50 albums, 100 photo previews, responsiveness, and layout stability.
- AGENTS.md runtime guidance: PASS. Templates are not modified; feature artifacts are generated under the explicit `/speckit-plan` request.

Post-design re-check: PASS. Research, data model, contracts, and quickstart preserve the same constraints and introduce no unresolved constitution violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-organize-photo-albums/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- local-app-contract.md
|-- checklists/
|   `-- requirements.md
`-- tasks.md
```

### Source Code (repository root)

```text
index.html
package.json
src/
|-- main.js
|-- styles.css
|-- albums.js
|-- drag-reorder.js
|-- photo-tiles.js
|-- local-client.js
`-- accessibility.js

server/
|-- app.js
|-- db.js
|-- migrations.js
|-- albums-repository.js
|-- photos-repository.js
`-- local-files.js

data/
`-- photo-albums.sqlite        # Runtime-created local metadata database; not committed

tests/
|-- unit/
|   |-- album-order.test.js
|   `-- album-validation.test.js
`-- e2e/
    |-- date-grouping.spec.js
    |-- drag-reorder.spec.js
    `-- album-tiles.spec.js
```

**Structure Decision**: Use a single local web application split into a vanilla Vite frontend
and a small local Node.js service. The split is required so SQLite metadata and local image
paths can remain on the user's machine without relying on remote upload flows or heavy desktop
shell dependencies.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Local Node.js service alongside Vite frontend | Browser-only JavaScript cannot reliably persist a normal local SQLite database and durable local image file paths across sessions | A pure static Vite app would either need browser-specific storage that is not a normal local SQLite database or would lose durable access to local image locations |
