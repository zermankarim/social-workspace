# `presentation`

UI layer: components, hooks, stores, client validations.

## Folders

- `components/` — React UI (feature folders + shared `ui/`)
- `hooks/` — React Query / mutation wrappers around `appContainer` services
- `stores/` — Zustand (auth, theme, …)
- `validations/` — Zod schemas for forms
- `config/` — nav and other UI config
- `lib/` — small presentation helpers (query client, theme storage)

## Rules

- Hooks call application services via `appContainer`; do not call `fetch` or repositories directly.
- Components stay mostly presentational; data fetching belongs in hooks.
- Do not import infrastructure DTOs/mappers — consume domain entities from hooks.
- Prefer existing `ui/` primitives before adding new base controls.
- Client components (`"use client"`) only where needed (hooks, interactivity).
