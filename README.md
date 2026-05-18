# Generative AI Academy

Interactive monorepo for learning generative AI through guided topics, quizzes, progress tracking, and optional account sync.

## What this repository contains

| Path | Purpose |
| --- | --- |
| `artifacts/genai-learn` | Main learner-facing web app (React + Vite) |
| `artifacts/api-server` | Express API server for sync, profile, and leaderboard endpoints |
| `lib/db` | Drizzle ORM schema and database utilities |
| `lib/api-spec` | OpenAPI spec + codegen configuration |
| `lib/api-zod` | Shared Zod schemas generated from API contracts |
| `lib/api-client-react` | Shared React Query client hooks |
| `scripts` | Workspace utility scripts |

## Tech stack

- **Monorepo:** pnpm workspaces
- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Wouter
- **Backend:** Express 5, TypeScript, Pino
- **Data:** PostgreSQL + Drizzle ORM
- **Validation & contracts:** Zod, drizzle-zod, Orval
- **Auth:** Clerk (optional for local usage, required for full sync features)

## Quick start

### 1. Prerequisites

- Node.js 24+
- pnpm

### 2. Install dependencies

```bash
pnpm install
```

### 3. Run workspace checks

```bash
pnpm run typecheck
pnpm run build
```

### 4. Run the main frontend (`genai-learn`)

`artifacts/genai-learn` expects `PORT` and `BASE_PATH` to be set:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/genai-learn run dev
```

### 5. Run the API server

```bash
pnpm --filter @workspace/api-server run dev
```

## Useful workspace commands

```bash
pnpm run typecheck
pnpm run build
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/db run push
```

## GitHub Pages deployment

This repo includes a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) that:

1. Builds `artifacts/genai-learn`
2. Copies `index.html` to `404.html` for SPA route refresh support
3. Deploys to GitHub Pages

Expected site URL:

`https://himanshu-nakrani.github.io/Generative-AI-Academy/`

## License

MIT
