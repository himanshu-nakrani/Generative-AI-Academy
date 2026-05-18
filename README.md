# Generative AI Academy

[![Deploy GitHub Pages](https://github.com/himanshu-nakrani/Generative-AI-Academy/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/himanshu-nakrani/Generative-AI-Academy/actions/workflows/deploy-pages.yml)

An interactive learning platform for generative AI concepts, built as a pnpm monorepo with a modern React frontend and an optional sync backend.

- **Live site:** https://himanshu-nakrani.github.io/Generative-AI-Academy/
- **Primary app:** `artifacts/genai-learn`
- **Repository:** `himanshu-nakrani/Generative-AI-Academy`

## Why this project exists

Generative AI Academy is designed as a practical, hands-on curriculum experience rather than a static notes site. It combines structured topic learning, quizzes, and progress analytics with optional account-based sync so users can learn locally first and connect cross-device features when signed in.

## Product highlights

### Learning experience

- 40 topic modules with prerequisite-aware progression
- Learning paths, glossary, resources, and full-text search
- Notes and bookmarks for personal study flow

### Assessment and feedback

- 200 MCQ questions across topic quizzes
- Daily challenge and timed quiz mode
- Quiz statistics and weak-area visibility

### Motivation and retention

- XP and levels
- Achievement system (24 badges)
- Streak tracking and activity heatmap
- Daily quests and weekly goals

### Focus and accessibility

- Focus mode with immersive reading and timer
- Keyboard shortcuts and quick navigation patterns
- Theme toggle (light/dark) and responsive UI

### Optional cloud features

- Clerk authentication with OAuth providers
- Sync profile/progress/bookmarks/achievements to backend
- Leaderboard (including team filter support)

## Monorepo structure

| Path | Purpose |
| --- | --- |
| `artifacts/genai-learn` | Main learner-facing React app (Vite + TypeScript) |
| `artifacts/api-server` | Express API for sync, leaderboard, and user profile |
| `artifacts/warm-scholar` | Additional learning app variant |
| `artifacts/mockup-sandbox` | Sandbox app for UI and mockup iteration |
| `lib/db` | Drizzle schema, DB connection, migrations/push config |
| `lib/api-spec` | OpenAPI source and Orval codegen config |
| `lib/api-zod` | Shared Zod validators from API contracts |
| `lib/api-client-react` | Shared React Query client hooks |
| `scripts` | Workspace utility scripts |

## Architecture at a glance

```mermaid
flowchart LR
  A[GenAI Learn Frontend<br/>React + Vite] --> B[Local-first state<br/>localStorage]
  A -->|optional signed-in sync| C[API Server<br/>Express 5]
  C --> D[(PostgreSQL<br/>Drizzle ORM)]
  E[OpenAPI Spec + Orval] --> F[Shared API client + Zod schemas]
  F --> A
  F --> C
```

## Tech stack

- **Monorepo:** pnpm workspaces
- **Language:** TypeScript
- **Frontend:** React 19, Vite, Wouter, Tailwind CSS, shadcn/ui
- **Backend:** Express 5, Pino
- **Data:** PostgreSQL + Drizzle ORM
- **Contracts & validation:** OpenAPI, Orval, Zod, drizzle-zod
- **Auth:** Clerk (`@clerk/react`, `@clerk/express`)

## Local development

### Prerequisites

- Node.js 24+
- pnpm

### Install

```bash
pnpm install
```

### Run the main frontend (`genai-learn`)

> `PORT` and `BASE_PATH` are required by Vite config in this repo.

```bash
PORT=5173 BASE_PATH=/ VITE_CLERK_PUBLISHABLE_KEY=pk_test_placeholder pnpm --filter @workspace/genai-learn run dev
```

### Run the API server

> `PORT` and `DATABASE_URL` are required. Clerk keys are needed for authenticated flows.

```bash
PORT=8080 DATABASE_URL=postgresql://user:pass@localhost:5432/genai CLERK_PUBLISHABLE_KEY=pk_test_xxx CLERK_SECRET_KEY=sk_test_xxx pnpm --filter @workspace/api-server run dev
```

### Useful workspace commands

```bash
pnpm run typecheck
pnpm run build
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/db run push
```

## API surface (high level)

| Route | Purpose |
| --- | --- |
| `POST /api/sync` | Push local progress/bookmarks/achievements |
| `GET /api/sync` | Fetch synced user learning state |
| `GET /api/leaderboard` | Fetch leaderboard data |
| `GET /api/user/me` | Get current user profile |
| `PATCH /api/user/me` | Update profile fields (for example team name) |

## GitHub Pages deployment

This repository deploys `artifacts/genai-learn` to GitHub Pages via `.github/workflows/deploy-pages.yml`.

The workflow:

1. Installs dependencies with pnpm
2. Builds `@workspace/genai-learn` with `BASE_PATH=/Generative-AI-Academy/`
3. Copies `index.html` to `404.html` for SPA refresh-route support
4. Publishes build output (`artifacts/genai-learn/dist/public`) to GitHub Pages

## Contributing

1. Create a feature branch from `main`.
2. Make focused changes with clear commit messages.
3. Run relevant workspace checks.
4. Open a pull request with context, scope, and screenshots for UI updates.

## License

MIT
