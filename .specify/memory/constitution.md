<!--
Sync Impact Report
Version change: 0.0.0 (template) -> 1.0.0
Modified principles:
- PRINCIPLE_1_NAME placeholder -> I. Code Quality Is Enforced
- PRINCIPLE_2_NAME placeholder -> II. Tests Define Done
- PRINCIPLE_3_NAME placeholder -> III. Consistent User Experience
- PRINCIPLE_4_NAME placeholder -> IV. Measurable Performance
- PRINCIPLE_5_NAME placeholder -> V. AGENTS.md Is Binding Runtime Guidance
Added sections:
- Quality Standards
- Development Workflow
Removed sections:
- Template placeholder comments and undefined placeholder sections
Templates requiring updates:
- PENDING .specify/templates/plan-template.md - AGENTS.md forbids template edits; Constitution Check needs explicit quality, testing, UX, performance, and AGENTS.md gates.
- PENDING .specify/templates/spec-template.md - AGENTS.md forbids template edits; feature specs need explicit UX consistency and measurable performance prompts.
- PENDING .specify/templates/tasks-template.md - AGENTS.md forbids template edits; task generation needs mandatory test, quality, UX, and performance validation tasks when applicable.
- REVIEWED .specify/templates/agent-file-template.md - no direct edits made because AGENTS.md forbids template edits.
- REVIEWED .specify/templates/checklist-template.md - no direct edits made because AGENTS.md forbids template edits.
- NOT FOUND .specify/templates/commands/*.md - commands template directory does not exist in this repository.
Runtime guidance:
- REVIEWED AGENTS.md - followed by limiting template edits and explaining before edits.
Follow-up TODOs:
- None.
-->
# Demo Constitution

## Core Principles

### I. Code Quality Is Enforced
All production code MUST be readable, maintainable, and scoped to the feature being changed.
Implementations MUST follow the repository structure, language conventions, and local helper
patterns already present before introducing new abstractions. Formatting, linting, and static
analysis checks MUST pass where configured. Unrelated refactors, generated churn, and broad
rewrites require explicit justification in the plan or review notes.

Rationale: code quality is a delivery requirement, not cleanup work. Small, coherent changes are
easier to review, test, and evolve.

### II. Tests Define Done
Every feature plan MUST identify the relevant automated test levels before implementation:
unit, integration, contract, end-to-end, or an explicit reason automation is not applicable.
New or changed behavior MUST include automated tests unless the plan documents a risk-based
exception and a manual verification path. Bug fixes MUST include a regression test whenever the
failure can be reproduced in automation. Relevant tests MUST be run before completion; skipped
or unavailable checks MUST be reported with the reason.

Rationale: independently testable stories and regression coverage are required to keep delivery
incremental and prevent silent behavior changes.

### III. Consistent User Experience
User-facing behavior MUST be specified as prioritized, independently testable journeys with
acceptance criteria. Interfaces MUST reuse established interaction patterns, terminology,
validation behavior, error handling, accessibility expectations, and responsive layout rules
unless a feature plan documents a user-centered reason to diverge. User-facing copy MUST be
clear, task-focused, and consistent across related flows.

Rationale: consistency reduces user confusion and makes acceptance testing meaningful across
features, not just within isolated screens or endpoints.

### IV. Measurable Performance
Every feature plan MUST define performance goals or explicitly mark them as not applicable with
reasoning. Performance-sensitive work MUST include measurable budgets such as latency,
throughput, memory, bundle size, startup time, frame rate, or query count. Implementations MUST
avoid unnecessary work in hot paths and MUST validate relevant performance risks before release.
Performance regressions that exceed documented budgets block completion unless accepted by the
user with a mitigation plan.

Rationale: performance requirements must be explicit enough to test, review, and trade off
against scope.

### V. AGENTS.md Is Binding Runtime Guidance
Contributors and agents MUST read and follow `AGENTS.md` before changing files. When
`AGENTS.md` restricts file edits, template updates, Spec Kit behavior, or communication style,
those instructions govern the work unless the user explicitly authorizes a narrower exception.
Agents MUST explain intended changes before editing and MUST not modify `.specify/templates`
without explicit user authorization.

Rationale: repository-local agent guidance captures operational rules that affect how Spec Kit
artifacts are created and maintained.

## Quality Standards

Code quality, testing, user experience, and performance requirements MUST be represented in
specifications, plans, tasks, and reviews for every feature where they apply. A compliant plan
MUST include:

- A code quality approach covering structure, conventions, and checks.
- A testing approach covering required automated tests and any justified exceptions.
- A user experience consistency review for user-facing behavior.
- Measurable performance goals or a documented reason performance is not applicable.
- Confirmation that `AGENTS.md` has been followed.

Complexity is allowed only when the plan documents the user need, the rejected simpler
alternative, and the validation strategy.

## Development Workflow

Specifications MUST describe user value, prioritized journeys, acceptance scenarios, edge
cases, functional requirements, assumptions, and measurable success criteria. Plans MUST pass the
Constitution Check before implementation research and MUST be re-checked after design. Tasks
MUST be organized so each user story can be implemented and tested independently, with quality,
test, UX, and performance work represented as first-class tasks when applicable.

Reviews MUST verify that the implementation matches the approved spec and plan, follows
`AGENTS.md`, includes relevant tests, preserves user experience consistency, and meets
documented performance budgets. Any deviation from this constitution MUST be recorded in the
plan's complexity tracking or review notes with explicit rationale.

## Governance

This constitution governs feature specifications, implementation plans, tasks, reviews, and
agent activity in this repository. `AGENTS.md` remains binding runtime guidance and MUST be
consulted before file changes. If this constitution and `AGENTS.md` appear to conflict, work
MUST pause for explicit user direction unless the user has already authorized a narrow exception
for the requested change.

Amendments require an explicit user request, an update to this file, and a Sync Impact Report
covering changed principles, affected templates, runtime guidance, and follow-up work. Dependent
templates and guidance documents MUST be updated when permitted by `AGENTS.md`; if edits are not
permitted, they MUST be listed as pending follow-up in the Sync Impact Report.

Versioning follows semantic versioning:

- MAJOR for removing principles or redefining governance in a backward-incompatible way.
- MINOR for adding principles, adding governance sections, or materially expanding standards.
- PATCH for clarifications, typo fixes, and non-semantic wording changes.

Compliance review is required during planning, task generation, implementation review, and final
verification. Work that cannot satisfy a MUST-level requirement cannot be completed until the
exception is documented and accepted by the user.

**Version**: 1.0.0 | **Ratified**: 2026-04-10 | **Last Amended**: 2026-04-10
