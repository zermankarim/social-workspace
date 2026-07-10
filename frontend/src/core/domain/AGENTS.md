# `core/domain`

Pure domain model. No application DTOs, no mappers, no HTTP.

## Folders

- `entities/` — domain objects (`User`, pagination wrappers, …)
- `enums/` — domain enums (`ProfileRole`, `SortBy`, `SortOrder`, …)
- `value-objects/` — small immutable concepts (`AuthCredentials`, …)
- `repositories/` — abstract repository contracts only

## Rules

- Do not import from `application`, `infrastructure`, `presentation`, or `app`.
- Repository methods return domain types, not API response shapes.
- Keep entities focused; mapping from API belongs in `infrastructure/mappers`.
