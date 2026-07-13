---
name: nest-next-react
description: Implement NestJS, Next.js, and React features end-to-end with portable stack practices and this repo's Clean Architecture. Use when adding or changing API endpoints, Prisma models, frontend features, pages, hooks, or full-stack flows in Nest/Next/React code.
---

# NestJS + Next.js + React

Portable stack rules first; then this repo’s end-to-end workflow. Prefer existing patterns over inventing parallel ones.

## Portable stack practices

### NestJS

- Feature modules by domain: module → controller → service → DTOs → persistence.
- Controllers stay thin; business logic lives in services.
- Validate with DTO classes + class-validator (or the project’s chosen validator).
- Guard mutating routes with auth; use role guards when access is restricted.
- Prefer pagination/cursors for lists; index hot query paths.
- Keep modules loosely coupled — no god services; share via clear interfaces/modules.
- Never commit secrets; document new env vars in `.env.example`.

### Next.js (App Router)

- Pages/layouts are a thin routing shell — compose UI, don’t bury domain logic.
- Server Components by default; `"use client"` only for hooks, interactivity, browser APIs.
- Read the installed Next docs under `node_modules/next/dist/docs/` when APIs may differ from training data.
- Prefer existing auth/layout guards over ad-hoc checks on every page.

### React

- Keep components mostly presentational; data fetching and mutations in hooks.
- Prefer the design system / shared UI primitives before new base controls.
- Explicit types; avoid `any` and leaking wire/API shapes into UI.
- Handle loading, empty, and error states; keep forms accessible.
- i18n: prefer translation keys over hardcoded copy when the project uses i18n.

### Cross-cutting

- Type-safe contracts between API and client (DTOs ↔ mappers ↔ domain).
- Small, reversible changes; match naming and folder layout of nearby code.
- Run the package quality gate before calling work done (`typecheck` / `lint` / `check`).

## This repo

Canonical layout and rules live in AGENTS files — **read the one for the folder you edit**:

| Area | Doc |
|------|-----|
| Backend overview | `backend/AGENTS.md` |
| Frontend overview + Next caveats | `frontend/AGENTS.md` |
| App Router shell | `frontend/src/app/AGENTS.md` |
| Domain + application | `frontend/src/core/AGENTS.md` |
| HTTP / DTOs / repos | `frontend/src/infrastructure/AGENTS.md` |
| DI / AppContainer | `frontend/src/modules/AGENTS.md` |
| UI / hooks / i18n | `frontend/src/presentation/AGENTS.md` |

Product language: professional social network (profiles, feed, connections, posts, messages). Do not name or clone competing platforms. Do not reintroduce todo-app features.

**Quality gates**

- Backend (from `backend/`): `npm run check`
- Frontend (from `frontend/`): `npm run check`

## End-to-end feature workflow (this workspace)

Copy and track:

```
Feature progress:
- [ ] 1. API contract + Prisma (if needed)
- [ ] 2. Nest module (controller, service, DTOs, guards)
- [ ] 3. Frontend domain + application
- [ ] 4. Infrastructure (DTO, mapper, ApiRepository)
- [ ] 5. Module wiring (AppContainer)
- [ ] 6. Presentation (hooks, UI, i18n)
- [ ] 7. App route (thin page)
- [ ] 8. Quality gates
```

### 1. API contract + Prisma

- Extend `backend/prisma` schema when persistence changes; add migration; update `.env.example` if new env vars appear.
- Persist via Prisma only unless justified otherwise.
- Design for growth: clear module boundaries, indexes, pagination for lists.

### 2. Nest feature module

Typical folder under `backend/src/<domain>/`:

- `*.module.ts`, `controllers/`, `services/`, `dto/`, repositories/mappers when the domain already uses them
- Register the module in `app.module.ts`
- JWT + role guards on mutating / sensitive routes; keep Swagger decorators in sync with DTOs

### 3. Frontend domain + application

Start inward (`frontend/src/core/`):

- Domain entity / types + repository **contract** (abstract) in `domain/`
- Application service + app DTOs/errors in `application/`
- No React, Next, or HTTP imports in `core`

### 4. Infrastructure

In `frontend/src/infrastructure/`:

- API DTO shapes matching the backend wire format
- Mapper: API DTO → domain entity
- `*ApiRepository` implementing the domain contract via `HttpClient`
- Do not leak API DTOs into `presentation` or `domain`

### 5. Module wiring

In `frontend/src/modules/`:

- Add/update `*.module.ts` factory (repository + service)
- Register the service on `AppContainer`
- Presentation must not `new` repositories/services itself

### 6. Presentation

In `frontend/src/presentation/`:

- Hooks (React Query) call `appContainer.*Service`
- Components consume domain entities from hooks; prefer existing `ui/` primitives
- Zod in `validations/` for forms; `next-intl` keys in `frontend/messages/{en,ru}.json`

### 7. App route

In `frontend/src/app/`: thin page composing presentation components; no direct `fetch` or infrastructure imports.

### 8. Done checklist

- [ ] Auth/guards on new mutating API routes
- [ ] Mappers cover new response fields
- [ ] i18n keys for new user-facing copy
- [ ] `npm run check` in `backend/` and/or `frontend/` as touched

## Decision guide

| Change type | Touch |
|-------------|--------|
| Schema / persistence | Prisma → Nest service/repo → FE DTOs/mappers |
| API only | Nest module; update FE infrastructure if clients exist |
| UI only against existing API | presentation (+ app route); do not bypass layers with `fetch` |
| New domain concept | full E2E path above |

When unsure between a quick hack and a scalable boundary, choose the boundary that matches existing module layout.
