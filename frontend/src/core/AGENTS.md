# `core` — domain & application

Innermost frontend layer. No React, Next.js, fetch, or UI imports.

## Layout

- `domain/` — entities, enums, value objects, repository **contracts** (abstract classes)
- `application/` — use-case services, app DTOs, app errors

## Rules

- Domain entities are plain TypeScript classes/types with business meaning.
- Repository contracts live in `domain/repositories` and define what the app needs, not how HTTP works.
- Application services orchestrate repositories; they stay free of framework APIs.
- Prefer explicit types and classes over implicit `any` / loose records.

When adding a feature, start here (entity + repository contract + service), then implement infrastructure.
