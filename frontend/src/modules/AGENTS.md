# `modules`

Composition root / DI wiring.

## Role

- `*.module.ts` — factory that builds repository + service for one feature
- `app.container.ts` — singleton `AppContainer` exposing services to the UI

## Rules

- This is the only place that should `new` infrastructure repositories and inject them into application services.
- When adding a feature: create `FooModule`, register `fooService` on `AppContainer`.
- Presentation code should use `appContainer.fooService` (usually via hooks), not construct services itself.
- Keep modules thin — no business logic.
