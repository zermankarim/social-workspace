# Social Workspace

Pet fullstack project: auth, roles, uploads today; posts, chats, and social features next.

## Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, React Query, Zustand |
| Backend | NestJS, TypeScript, Prisma |
| Database | PostgreSQL |
| Infra | Docker Compose |

## Repository structure

```
.
├── backend/                 # NestJS API
├── frontend/                # Next.js client (Clean Architecture)
├── docker-compose.yaml
└── README.md
```

Agent guidance for frontend layers lives in `frontend/src/**/AGENTS.md`.

## Requirements

- Node.js 20+
- npm
- Docker & Docker Compose (for DB and containerized backend)

## Quick start

### 1. Infrastructure

```bash
docker compose up db backend-dev -d
```

Starts PostgreSQL and the backend with hot-reload on port **8000**.

Optional: `pgadmin` on port **5050** (`docker compose up pgadmin -d`).

### 2. Backend (local, without Docker)

```bash
cd backend
cp .env.example .env   # fill in values
npm install
npm run db:generate
npm run db:migrate
npm run start:dev
```

Migrations inside the Docker container:

```bash
cd backend
npm run docker:migrate
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local   # fill in values
npm install
npm run dev
```

Client default URL: **http://localhost:3000**

## Configuration

Environment variables are documented in:

- `backend/.env.example` — database, JWT, CORS, cookies, upload, API prefix/version
- `frontend/.env.example` — API URL and Next.js rewrite proxy

Secrets and real URLs are **not committed**. Copy the example files locally and fill in your own values.

Frontend ↔ backend integration notes:

- `NEXT_PUBLIC_API_URL` must match backend `API_PREFIX` / `API_VERSION` (e.g. `/api/v1`)
- For cookie-based auth: set `CORS_CREDENTIALS=true` and a correct `CORS_ORIGINS`

## API

- Controller base path is configured via `API_PREFIX` and `API_VERSION` (NestJS global prefix)
- Swagger UI: `http://localhost:8000/api` (may differ from the versioned API path)
- Authentication: JWT in httpOnly cookies (`access_token`, `refresh_token`)

For the current endpoint list, use Swagger or browse `backend/src/` modules.

## Architecture

### Backend

NestJS feature modules (`auth`, `users`, `admin`, `upload`, …). Typical pieces:

- controllers / services
- Prisma for data access
- JWT guards and role-based access (`ADMIN` / `USER`)
- DTOs + validation pipe

### Frontend

[Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html):

```
frontend/src/
├── core/              # domain + application (entities, services, repository contracts)
├── infrastructure/    # HTTP, API DTOs, mappers, repository implementations
├── modules/           # DI / wiring (AppContainer)
├── presentation/      # UI, hooks, stores, validations
└── app/               # Next.js routes (thin layer)
```

New frontend feature flow: entity → repository contract → API repository + mapper → service → module → hook → component.

See each layer’s `AGENTS.md` before changing that folder.

## Useful commands

### Backend

```bash
npm run start:dev      # dev server
npm run build          # production build
npm run typecheck
npm run lint
npm run format
npm run db:studio      # Prisma Studio
```

### Frontend

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run format
npm run check          # typecheck + lint + format:check
```

## Roles & extending the project

Roles: `ADMIN` / `USER`. Add capabilities via Prisma models, Nest modules, and matching frontend Clean Architecture layers.

When adding a feature:

1. Prisma schema + migration (if new data is needed)
2. Backend module (controller, service, DTOs)
3. Frontend layers following the existing pattern
4. Update `.env.example` if needed — never commit secrets

## License

Private / pet project.
