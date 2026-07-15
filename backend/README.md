# Backend

NestJS API for Social Workspace: auth, profiles, feed, network, E2EE messaging, devices, uploads, and admin.

## Setup

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run start:dev
```

API default: **http://localhost:8000**. Swagger: **http://localhost:8000/api**.

With Docker Compose from the repo root:

```bash
docker compose up db backend-dev -d
npm run docker:migrate   # from backend/
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run start:dev` | Watch mode |
| `npm run build` / `start:prod` | Production |
| `npm run typecheck` | TypeScript |
| `npm run lint` / `format` | ESLint / Prettier |
| `npm run check` | typecheck + lint + format |
| `npm run db:migrate` / `db:generate` / `db:studio` | Prisma |
| `npm run docker:*` | Same Prisma ops inside `backend-dev` container |

## Layout

```
src/
├── auth/            # signup/signin, sessions, JWT guards
├── users/           # profiles, search, catalog
├── admin/           # admin-only user listing
├── upload/          # file upload
├── posts/           # feed posts + attachments
├── comments/        # post comments
├── likes/           # post reactions
├── connections/     # network requests
├── conversations/   # DMs + messaging gateway (Socket.IO)
├── devices/         # E2EE public device keys
├── shared/          # pagination, shared DTOs/utils
└── infrastructure/  # config, exception filter
prisma/              # schema, migrations, seed
```

Messaging stores **ciphertext only** (`ciphertext`, `nonce`, `keyVersion`). Private keys stay on the client. See the root `README.md` for the E2EE overview.

## Env

Copy `.env.example`. Important groups: `DATABASE_URL`, `API_PREFIX` / `API_VERSION`, CORS, JWT + refresh, cookies, upload paths.
