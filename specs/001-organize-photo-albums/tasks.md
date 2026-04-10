# Tasks: Photo Album Organizer

**Input**: Design documents from `/specs/001-organize-photo-albums/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/local-app-contract.md, quickstart.md

**Tests**: Test tasks are included because the constitution and implementation plan require automated service/data tests plus browser workflow coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `T001 [P] [US1] Description`

- **[P]**: Can run in parallel when it touches different files and has no dependency on incomplete tasks.
- **[Story]**: Maps a task to a specific user story phase.
- Every task includes exact file paths.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the local-first Vite application, minimal dependency set, and repository structure.

- [x] T001 Create Vite/Node project metadata, scripts, and minimal dependencies in package.json
- [x] T002 Create application entry files in index.html and src/styles.css
- [x] T003 [P] Create frontend module placeholders in src/main.js, src/albums.js, src/drag-reorder.js, src/photo-tiles.js, src/local-client.js, and src/accessibility.js
- [x] T004 [P] Create local service module placeholders in server/app.js, server/db.js, server/migrations.js, server/albums-repository.js, server/photos-repository.js, and server/local-files.js
- [x] T005 [P] Create test harness files in tests/unit/test-db.js, tests/e2e/fixtures.js, and playwright.config.js
- [x] T006 Configure ignored local runtime artifacts in .gitignore for node_modules/ and data/photo-albums.sqlite

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the data, service, UI shell, and test foundations required before any user story can be implemented.

**Critical**: No user story work can begin until this phase is complete.

- [x] T007 Implement local app shell markup and root containers in index.html
- [x] T008 Configure npm scripts for dev, unit tests, e2e tests, and local service startup in package.json
- [x] T009 Implement SQLite connection, data directory bootstrap, and database lifecycle helpers in server/db.js
- [x] T010 Implement SQLite migrations for albums, photos, date group order indexes, and metadata-only storage in server/migrations.js
- [x] T011 Implement album validation helpers for flat albums, known/unknown dates, and same-group ordering in server/albums-repository.js
- [x] T012 Implement local HTTP service bootstrap, JSON parsing, static app serving, and error response helpers in server/app.js
- [x] T013 [P] Implement frontend local service request wrapper and error normalization in src/local-client.js
- [x] T014 [P] Implement isolated SQLite test database helpers in tests/unit/test-db.js
- [x] T015 [P] Implement Playwright seeded fixture helpers for albums and photos in tests/e2e/fixtures.js
- [x] T016 Implement base responsive layout, empty-state, focus, and stable list styling in src/styles.css

**Checkpoint**: Foundation ready; user story implementation can begin.

---

## Phase 3: User Story 1 - Review Albums by Date (Priority: P1) MVP

**Goal**: Users can open the main page and review flat albums grouped by date, including an empty state and an `Undated` fallback group.

**Independent Test**: Create albums with multiple dates and unknown dates, open the main page, and verify each album appears under the correct date group.

### Tests for User Story 1

- [x] T017 [P] [US1] Add unit tests for date group derivation, `Undated` fallback, and no nested album representation in tests/unit/album-validation.test.js
- [x] T018 [P] [US1] Add e2e tests for main page date grouping, same-date grouping, distinguishable album summaries, and no-albums empty state in tests/e2e/date-grouping.spec.js

### Implementation for User Story 1

- [x] T019 [US1] Implement album creation and grouped album listing queries in server/albums-repository.js
- [x] T020 [US1] Implement `CreateAlbum` and `ListAlbumsByDate` local service routes in server/app.js
- [x] T021 [US1] Implement date group and album summary rendering in src/albums.js
- [x] T022 [US1] Wire main page initialization, loading, error, and no-albums empty states in src/main.js
- [x] T023 [US1] Add date group, album summary, `Undated`, and empty-state visual styles in src/styles.css
- [x] T024 [US1] Add focus order and screen-reader labels for date groups and album summaries in src/accessibility.js

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Reorganize Albums by Dragging (Priority: P2)

**Goal**: Users can reorder albums within a date group by drag-and-drop, persist that order, and avoid invalid nested or cross-date moves.

**Independent Test**: Drag an album to a new position within its date group, leave and return to the main page, and verify the selected order remains.

### Tests for User Story 2

- [x] T025 [P] [US2] Add unit tests for same-date-group order updates, invalid cross-group moves, invalid nesting, and duplicate prevention in tests/unit/album-order.test.js
- [x] T026 [P] [US2] Add e2e tests for drag reorder, persisted order after return, invalid drop rollback, and no duplicate album entry in tests/e2e/drag-reorder.spec.js

### Implementation for User Story 2

- [x] T027 [US2] Implement transactional same-date-group reorder persistence and validation in server/albums-repository.js
- [x] T028 [US2] Implement `ReorderAlbum` local service route and error responses in server/app.js
- [x] T029 [US2] Implement drag state, valid drop positions, invalid drop rollback, and same-group constraints in src/drag-reorder.js
- [x] T030 [US2] Wire reorder controls and saved order refresh into album list rendering in src/albums.js
- [x] T031 [US2] Implement keyboard-accessible non-pointer reorder controls in src/accessibility.js
- [x] T032 [US2] Add drag target, invalid drop, saved order, and keyboard reorder styles in src/styles.css

**Checkpoint**: User Stories 1 and 2 are independently functional and reordering persists.

---

## Phase 5: User Story 3 - Preview Photos in an Album (Priority: P3)

**Goal**: Users can open an album and scan its photos in a stable tile interface, including empty and missing-preview states.

**Independent Test**: Open albums with photos, many photos, no photos, and missing local files; verify the tile grid stays stable and scannable.

### Tests for User Story 3

- [x] T033 [P] [US3] Add unit tests for photo metadata ordering, local-only source validation, and preview status transitions in tests/unit/photo-preview.test.js
- [x] T034 [P] [US3] Add e2e tests for album tile previews, first 100 photo scannability, empty album state, and missing preview placeholders in tests/e2e/album-tiles.spec.js

### Implementation for User Story 3

- [x] T035 [US3] Implement ordered photo metadata queries and preview status updates in server/photos-repository.js
- [x] T036 [US3] Implement safe local preview file checks and local-only preview reads in server/local-files.js
- [x] T037 [US3] Implement `GetAlbumPhotos` and `ReadPhotoPreview` local service routes in server/app.js
- [x] T038 [US3] Implement album open/close navigation and album view state in src/main.js
- [x] T039 [US3] Implement stable photo tile rendering, missing preview placeholders, and no-photos empty state in src/photo-tiles.js
- [x] T040 [US3] Add responsive tile grid, fixed tile aspect ratio, loading, and placeholder styles in src/styles.css

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate privacy, performance, documentation, and end-to-end readiness across all user stories.

- [x] T041 [P] Add privacy guard tests for rejecting remote image sources and preserving metadata-only storage in tests/unit/privacy-boundary.test.js
- [x] T042 [P] Add browser performance budget tests for 50 albums and 100 photo tiles in tests/e2e/performance-budget.spec.js
- [x] T043 Harden local service privacy and no-upload guarantees across server/app.js and server/local-files.js
- [x] T044 Update final setup, test, and privacy validation notes in specs/001-organize-photo-albums/quickstart.md
- [x] T045 Create user-facing project usage notes for local setup and photo privacy in README.md
- [x] T046 Run npm test and npm run test:e2e, then record final validation notes in specs/001-organize-photo-albums/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; delivers the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and reuses US1 album list rendering; can be validated after US1.
- **User Story 3 (Phase 5)**: Depends on Foundational and album opening from US1; can be developed after the album list exists.
- **Polish (Phase 6)**: Depends on the targeted user stories being complete.

### User Story Dependencies

- **US1 - Review Albums by Date**: No story dependency after Foundational.
- **US2 - Reorganize Albums by Dragging**: Depends on US1 album list rendering for the main page interaction.
- **US3 - Preview Photos in an Album**: Depends on US1 album opening/navigation context.

### Within Each User Story

- Tests are written before implementation tasks in each story phase.
- Repository/service tasks precede frontend integration tasks.
- Frontend rendering tasks precede accessibility and visual-state refinements.
- Story checkpoint validation occurs before moving to the next priority when working sequentially.

### Parallel Opportunities

- T003, T004, and T005 can run in parallel after T001/T002 scope is understood.
- T013, T014, and T015 can run in parallel after T009-T012 define the service shape.
- US1 tests T017 and T018 can run in parallel.
- US2 tests T025 and T026 can run in parallel.
- US3 tests T033 and T034 can run in parallel.
- Polish tests T041 and T042 can run in parallel after all user stories are implemented.

---

## Parallel Example: User Story 1

```text
Task: "T017 [P] [US1] Add unit tests for date group derivation, `Undated` fallback, and no nested album representation in tests/unit/album-validation.test.js"
Task: "T018 [P] [US1] Add e2e tests for main page date grouping, same-date grouping, distinguishable album summaries, and no-albums empty state in tests/e2e/date-grouping.spec.js"
```

## Parallel Example: User Story 2

```text
Task: "T025 [P] [US2] Add unit tests for same-date-group order updates, invalid cross-group moves, invalid nesting, and duplicate prevention in tests/unit/album-order.test.js"
Task: "T026 [P] [US2] Add e2e tests for drag reorder, persisted order after return, invalid drop rollback, and no duplicate album entry in tests/e2e/drag-reorder.spec.js"
```

## Parallel Example: User Story 3

```text
Task: "T033 [P] [US3] Add unit tests for photo metadata ordering, local-only source validation, and preview status transitions in tests/unit/photo-preview.test.js"
Task: "T034 [P] [US3] Add e2e tests for album tile previews, first 100 photo scannability, empty album state, and missing preview placeholders in tests/e2e/album-tiles.spec.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate date grouping, album summaries, `Undated`, and no-albums empty state.

### Incremental Delivery

1. Deliver US1 so the main page can browse flat date-grouped albums.
2. Add US2 so album order can be changed and persisted within each date group.
3. Add US3 so each album can show stable photo tile previews.
4. Complete Phase 6 privacy, performance, documentation, and final validation tasks.

### Parallel Team Strategy

1. One developer completes shared setup and SQLite/service foundations.
2. A frontend-focused developer can work on US1 rendering while a test-focused developer writes the matching e2e tests.
3. After US1, US2 drag behavior and US3 tile previews can progress in parallel if shared files are coordinated.

---

## Notes

- `[P]` tasks use separate files or can run before dependent integration work.
- Test tasks are included because the plan requires Node unit tests and Playwright workflow tests.
- The MVP scope is Phase 1, Phase 2, and Phase 3 only.
- No task requires remote image upload or nested album support.
