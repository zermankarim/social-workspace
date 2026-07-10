# `infrastructure`

Adapters: HTTP client, API DTOs, mappers, repository implementations.

## Folders

- `http/` — `HttpClient` (cookies, refresh retry, error mapping)
- `api/dto/` — wire/response TypeScript shapes from the backend
- `mappers/` — API DTO → domain entity
- `repositories/` — `*ApiRepository` implementing domain contracts
- `config/` — API base URL and related config

## Rules

- Only this layer talks to the network.
- Map every API response through a mapper before returning domain types.
- Keep API DTO interfaces close to the backend contract; do not leak them into `presentation` or `domain`.
- Repositories throw/propagate `ApiError` (or let `HttpClient` do so) consistently.
- Do not import React components or Next.js route APIs here.
