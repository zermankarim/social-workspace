# Social Workspace

Pet fullstack network for careers and professional connections: profiles, feed, network graph, and **end-to-end encrypted** direct messaging.

## Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, React Query, Zustand, next-intl, Socket.IO client |
| Backend | NestJS, TypeScript, Prisma, Passport JWT, Socket.IO |
| Database | PostgreSQL |
| Infra | Docker Compose |

## Features

- **Auth** — signup / signin / refresh; JWT in httpOnly cookies; multi-session support; roles `ADMIN` / `USER`
- **Profiles** — intro, experience, education, skills, languages, avatar/cover; user search; preferred locale (`en` / `ru`)
- **Feed** — posts with text, image attachments, edit/delete; reactions (Like, Celebrate, Support, Love, Insightful, Funny)
- **Comments** — nested under posts; text + images; edit/delete
- **Mentions & emoji** — `@[Name](uuid)` tokens with autocomplete and profile links; emoji picker in composers (posts, comments, DMs)
- **Network** — connection requests (pending / accept / reject / remove); messaging only with accepted connections
- **Messaging (E2EE DMs)** — direct conversations, unread badges, live delivery, presence, read receipts, image attachments, soft-delete fields
- **Realtime** — Socket.IO (`/ws`): new messages, read receipts, online/offline presence
- **Uploads** — shared file upload for avatars, posts, comments, and message media
- **Admin** — admin-only user listing
- **i18n & theme** — English / Russian UI; light/dark theme

Placeholders in nav (not implemented yet): Jobs, Notifications.

### Messaging E2EE (high level)

Private keys **never leave the browser**. The API stores ciphertext envelopes only.

1. On login, the client ensures a **device** exists: ECDH **P-256** identity + signed-prekey pairs in local storage; public keys registered via `/devices`.
2. Outbound DM: derive a shared secret with `ECDH(sender identity private, peer signed-prekey public)` → HKDF → **AES-GCM**; send `ciphertext`, `nonce`, `keyVersion`, optional `senderDeviceId`.
3. Inbound / own copies: decrypt with the matching ECDH keys on that device.
4. Attachments use uploaded URLs (metadata on the server); message body remains E2EE.

Peer must open Messaging at least once so a device row exists. Presence and unread counts work on envelopes, not plaintext. Presence is in-memory per API process (fine for local/single instance).

## Repository structure

```
.
├── backend/                 # NestJS API
├── frontend/                # Next.js client (Clean Architecture)
├── docker-compose.yaml
└── README.md
```

Agent guidance for frontend layers lives in `frontend/src/**/AGENTS.md`. Backend conventions: `backend/AGENTS.md`.

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
- `frontend/.env.example` — API URL, Next.js rewrite proxy, WebSocket origin

Secrets and real URLs are **not committed**. Copy the example files locally and fill in your own values.

Frontend ↔ backend integration notes:

- `NEXT_PUBLIC_API_URL` must match backend `API_PREFIX` / `API_VERSION` (e.g. `/api/v1`)
- `API_URL` — backend origin for Next.js rewrites (e.g. `http://localhost:8000`)
- `NEXT_PUBLIC_WS_URL` — Socket.IO origin (same host as the API, e.g. `http://localhost:8000`)
- For cookie-based auth: set `CORS_CREDENTIALS=true` and a correct `CORS_ORIGINS`

## API

- Controller base path is configured via `API_PREFIX` and `API_VERSION` (NestJS global prefix)
- Swagger UI: `http://localhost:8000/api` (may differ from the versioned API path)
- Authentication: JWT in httpOnly cookies (`access_token`, `refresh_token`)
- Realtime: Socket.IO namespace `/ws` (JWT from cookie on handshake)

Feature modules include `auth`, `users`, `admin`, `upload`, `posts`, `comments`, `likes`, `connections`, `conversations`, `devices`.

## Architecture

### Backend

NestJS feature modules. Typical pieces:

- controllers / services / repositories
- Prisma for data access
- JWT guards and role-based access (`ADMIN` / `USER`)
- DTOs + validation pipe + Swagger
- messaging gateway for Socket.IO events

### Frontend

[Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html):

```
frontend/src/
├── core/              # domain + application (entities, services, repository contracts)
├── infrastructure/    # HTTP, API DTOs, mappers, repos, messaging crypto, Socket.IO client
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
npm run check          # typecheck + lint + format
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
