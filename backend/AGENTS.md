# Backend agent notes

NestJS API. Feature modules under `src/`; Prisma under `prisma/`.

## Conventions

- One feature folder per domain (`auth`, `users`, `admin`, `upload`, …): module, controller(s), service, DTOs.
- Shared pagination/query helpers live in `shared/`.
- Config and global filters live in `infrastructure/`.
- Protect routes with JWT + role guards; do not skip auth for new mutating endpoints without a clear reason.
- Validate input with DTO classes + class-validator; keep Swagger decorators in sync.
- Persist via Prisma only — no ad-hoc SQL unless justified.
- After schema changes: migration + update `.env.example` if new env vars appear. Never commit secrets.

## Quality

From `backend/`:

```bash
npm run typecheck
npm run lint
npm run format:check
```

Or the combined gate: `npm run check`.

Use `npm run format` / `npm run lint:fix` only when intentionally applying auto-fixes.

## Product direction

Moving from a todo app toward social features (posts, chats, …). Do not reintroduce todos unless explicitly requested.
