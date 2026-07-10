# Frontend

Next.js client for Social Workspace. Uses Clean Architecture under `src/`.

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                            | Purpose                         |
| --------------------------------- | ------------------------------- |
| `npm run dev`                     | Dev server                      |
| `npm run build` / `start`         | Production build / serve        |
| `npm run typecheck`               | TypeScript (`tsc --noEmit`)     |
| `npm run lint` / `lint:fix`       | ESLint                          |
| `npm run format` / `format:check` | Prettier                        |
| `npm run check`                   | typecheck + lint + format:check |

## Architecture

```
src/
├── core/              # domain + application
├── infrastructure/    # HTTP, API DTOs, mappers, repos
├── modules/           # AppContainer DI wiring
├── presentation/      # UI, hooks, stores, validations
└── app/               # Next.js App Router (thin)
```

Read `AGENTS.md` in each of those folders before editing them. Root `AGENTS.md` covers Next.js version caveats.

## Env

See `.env.example`:

- `NEXT_PUBLIC_API_URL` — public API base path (must match backend prefix/version)
- `API_URL` — backend origin for Next.js rewrites
