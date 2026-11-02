# Copilot instructions for this repository

## Project overview

This repository is a small browser-only to-do app built with plain HTML, CSS, and JavaScript. There is no framework, bundler, or backend. The app is a single-page interface loaded from `index.html`, with styling in `style.css` and behavior in `script.js`.

## Build, test, and lint commands

There is no package.json, no npm scripts, and no automated test or lint setup in this repository.

Use these commands for validation:

- Open `index.html` directly in a browser to run the app.
- For smoke testing, check the main flows manually in the browser:
  - add a task
  - mark a task complete/incomplete
  - delete a task
  - filter by All / Active / Done
  - clear completed tasks
  - reload the page and confirm tasks persist via browser localStorage

There is no single automated test command to run; treat browser-based manual validation as the project’s validation path.

## High-level architecture

- `index.html` defines the static UI structure and loads the stylesheet and script.
- `style.css` contains all app styling and responsive layout rules.
- `script.js` is the application logic and is the primary file to edit for behavior changes.
- The application state is a single in-memory `tasks` array, initialized from `localStorage` via `loadTasks()`.
- `renderTasks()` is the central rendering function that updates the list, count summary, empty state, and filter results after any state change.
- User actions (submit, toggle, delete, clear completed, filter selection) all flow through event listeners and then update state before re-rendering.

## Key conventions and patterns

- Keep the app dependency-free: do not add a framework, bundler, or package manager unless the repo explicitly changes direction.
- Treat `tasks` as the source of truth; update it first, then call `saveTasks()` and `renderTasks()`.
- Preserve the browser-local persistence model: the app stores serialized tasks in `localStorage` under the `my-tasks` key.
- When changing filters, use the existing `data-filter` values (`all`, `active`, `completed`) and keep the active button state in sync with the app state.
- Use the current DOM pattern for imperative list rendering: create elements, add classes, set text content, and attach listeners per task item.
- Prefer graceful degradation for browser compatibility. `crypto.randomUUID()` is used when available, with a timestamp/random fallback for older browsers.
- Keep the user-facing behavior focused on a single-page task manager. Do not introduce backend logic, server-side persistence, or async data fetching unless the project scope expands.

## Documentation to keep in sync

- `README.md` is the project’s primary user-facing overview and should remain aligned with any functional changes.
- If there are future changes to how the app is run, the `Run it` section should be updated to match the actual entry point and workflow.
