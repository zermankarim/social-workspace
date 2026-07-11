# `presentation`

UI layer: components, hooks, stores, client validations.

## Folders

- `components/` — React UI (feature folders + shared `ui/`)
- `hooks/` — React Query / mutation wrappers around `appContainer` services
- `stores/` — Zustand (auth, theme, …)
- `validations/` — Zod schemas for forms
- `config/` — nav and other UI config
- `lib/` — small presentation helpers (query client, theme storage)

## i18n

- Use `next-intl` (`useTranslations` / `getTranslations`). Dictionaries: `frontend/messages/{locale}.json`.
- Locale is stored in the `NEXT_LOCALE` cookie via `src/i18n/set-locale.ts` (client preference for now).
- Supported locales: `en`, `ru` (`src/i18n/config.ts`).
- TODO(backend): persist preferred language on the user profile and sync after auth; keep the cookie as a local/SSR cache.

## Rules

- Hooks call application services via `appContainer`; do not call `fetch` or repositories directly.
- Components stay mostly presentational; data fetching belongs in hooks.
- Do not import infrastructure DTOs/mappers — consume domain entities from hooks.
- Prefer existing `ui/` primitives before adding new base controls.
- Client components (`"use client"`) only where needed (hooks, interactivity).
- Prefer translation keys over hardcoded UI copy in new components.
