<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend agent notes

- Clean Architecture layers under `src/` each have their own `AGENTS.md`. Read the one for the folder you edit.
- Dependency rule: `app` → `presentation` → `modules` / application services → `core` ← `infrastructure`. Outer layers depend inward; domain never imports React, Next, or HTTP details.
- Quality gate before finishing frontend work: `npm run check` (from `frontend/`).
- Product direction: social app (posts, chats, …). Do not reintroduce a todo feature.
