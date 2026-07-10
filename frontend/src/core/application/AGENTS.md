# `core/application`

Application use cases on top of the domain.

## Folders

- `services/` — orchestration (`AuthService`, `UserService`, `UploadService`, …)
- `dtos/` — input/query objects for use cases (not API wire DTOs)
- `errors/` — app-level errors (`ApiError`, …)

## Rules

- Services depend on domain repository **contracts**, never on `*ApiRepository` classes.
- Application DTOs are constructed by presentation/hooks or services; they are not JSON shapes from the backend.
- Do not import React, Next, or `infrastructure` here.
- Wire concrete repositories in `modules/`, not inside services.
