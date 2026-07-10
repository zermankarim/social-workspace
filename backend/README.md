# Backend

NestJS API for Social Workspace: auth (JWT cookies + sessions), users, admin, file upload.

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
| `npm run db:migrate` / `db:generate` / `db:studio` | Prisma |
| `npm run docker:*` | Same Prisma ops inside `backend-dev` container |

## Layout

```
src/
├── auth/            # signup/signin, sessions, JWT guards
├── users/           # user domain helpers
├── admin/           # admin-only user listing
├── upload/          # file upload
├── shared/          # pagination, shared DTOs/utils
└── infrastructure/  # config, exception filter
prisma/              # schema, migrations, seed
```

## Env

Copy `.env.example`. Important groups: `DATABASE_URL`, `API_PREFIX` / `API_VERSION`, CORS, JWT + refresh, cookies, upload paths.
