# `app` — Next.js App Router

Thin routing shell. No business logic, no direct API calls.

## Layout

- `(auth)/` — login / register (guest)
- `(app)/` — authenticated shell (dashboard, admin, …)
- `layout.tsx` — root providers, metadata, fonts

## Rules

- Pages compose presentation components and set metadata; keep them thin.
- Auth/role gating belongs in presentation guards / layouts, not duplicated ad hoc in every page.
- Do not put domain/application/infrastructure imports in pages unless unavoidable — prefer presentation hooks/components.
- Follow `frontend/AGENTS.md` for this Next.js version (read Next docs under `node_modules` when unsure).
