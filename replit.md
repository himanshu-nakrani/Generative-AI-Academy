# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### GenAI Learn (`artifacts/genai-learn`)
- React + Vite + Wouter + TailwindCSS v4 + shadcn/ui
- Static content, no backend dependency for content (all localStorage-first)
- Auth via Clerk (`@clerk/react`) — Replit-managed, provisioned via `setupClerkWhitelabelAuth`
- 40 topics, 200 MCQ quiz questions, daily challenge, full-text search + filters
- Routes: `/`, `/topics`, `/topic/:slug`, `/learning-paths`, `/glossary`, `/resources`, `/progress`, `/map`, `/notes`, `/quiz/:slug`, `/search`, `/sign-in/*?`, `/sign-up/*?`
- localStorage keys: `genai-learn:completed`, `genai-learn:theme`, `genai-learn:recent`, `genai-learn:streak`, `genai-learn:last-date`, `genai-learn:best-streak`, `genai-learn:prefs`, `genai-learn:highlights`, `genai-learn:quiz-scores`, `genai-learn:daily-challenge`
- Dark mode: `@custom-variant dark (&:is(.dark *))`, toggled via `document.documentElement.classList.toggle("dark", dark)`

### API Server (`artifacts/api-server`)
- Express 5 + pino logging
- Clerk proxy middleware at `/api/__clerk` (active in all environments)
- `@clerk/express` middleware for route protection

## Auth (Clerk)

- Replit-managed Clerk instance (provisioned, `pk_test_...` key)
- `VITE_CLERK_PUBLISHABLE_KEY` — auto-set env var for frontend
- `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — auto-set secrets for backend
- `VITE_CLERK_PROXY_URL` — empty in dev, auto-set in production by deployment system
- Sign-in page: `/sign-in`, Sign-up page: `/sign-up`
- Auth is optional (app fully usable without login); login enables cross-device sync (future)
