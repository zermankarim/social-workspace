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
- Signed-in users: `User.preferredLocale` from the API is the source of truth; cookie `NEXT_LOCALE` is the SSR/local cache (`src/i18n/`).
- On login/refresh, cookie is synced from the profile. Locale switcher PATCHes `/users/me` when authenticated.
- Guests: cookie only. Supported locales: `en`, `ru`.

## Rules

- Hooks call application services via `appContainer`; do not call `fetch` or repositories directly.
- Components stay mostly presentational; data fetching belongs in hooks.
- Do not import infrastructure DTOs/mappers — consume domain entities from hooks.
- Prefer existing `ui/` primitives before adding new base controls.
- Client components (`"use client"`) only where needed (hooks, interactivity).
- Prefer translation keys over hardcoded UI copy in new components.
