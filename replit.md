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
- Routes: `/`, `/topics`, `/topic/:slug`, `/learning-paths`, `/glossary`, `/resources`, `/progress`, `/map`, `/notes`, `/quiz/:slug`, `/search`, `/achievements`, `/bookmarks`, `/profile`, `/streaks`, `/quiz-stats`, `/leaderboard`, `/analytics`, `/sign-in/*?`, `/sign-up/*?`
- **Phase 5 features** (gamification + social + content):
  - Analytics dashboard (`/analytics`): category completion bars, quiz performance chart, activity heatmap, weak areas, time invested
  - Daily Quests: `useDailyQuests` hook, 3 rotating quests/day seeded by date, DailyQuests widget on Home, toast on completion
  - Focus Mode: full-screen immersive reading overlay (`f` key or Aa panel), Pomodoro timer, reading progress bar, auto-complete at 90% scroll, `Escape` to exit
  - Timed Quiz Mode: mode-select screen (Normal / Timed 30s per question), countdown bar, auto-submit on timeout
  - Team Leaderboard: `teamName` column in DB (migration applied), Profile team-name editor, Leaderboard team filter
  - Content improvements: Key Takeaways collapsible card at top of every topic (auto-derived from section first sentences)
  - XP system: `useXP` hook (topics×10, quiz×5, perfect×25, achievements×15, streak day×3, quest bonuses), level badge in Navbar, XP progress bar on Profile
- **Phase 3A features** (smart learning): Streaks heatmap (`/streaks`), quiz analytics dashboard (`/quiz-stats`), smart topic recommendations (Home widget + hook)
- **Phase 3B features** (polish & power): Theme toggle (sun/moon + auto), keyboard shortcuts (`?` modal + `j`/`k`/`b`/`m`/`r`/`f` hotkeys), weekly goals widget (Home), 24+ hour auth with OAuth ready
- **Phase 4 features** (backend sync): PostgreSQL schema (users, progress, streaks, achievements, bookmarks), REST API (`POST /api/sync`, `GET /api/sync`, `GET /api/leaderboard`, `GET /api/user/me`, `PATCH /api/user/me`), auto sync on login + every 5 min + on unload, Leaderboard page (`/leaderboard`), Profile sync status + "Sync Now" button
- localStorage keys: `genai-learn:completed`, `genai-learn:theme`, `genai-learn:recent`, `genai-learn:streak`, `genai-learn:last-date`, `genai-learn:best-streak`, `genai-learn:prefs`, `genai-learn:highlights`, `genai-learn:quiz-scores`, `genai-learn:daily-challenge`, `genai-learn:bookmarks`, `genai-learn:srs`, `genai-learn:achievements`, `genai-learn:daily-quests`, `genai-learn:xp-bonus`
- Phase 2 features: Achievement system (24 badges, 4 categories, rarity tiers), Bookmarks (save/reading list), Spaced Repetition (SRS scheduling for completed topics, due-for-review widget on Home), Voice Reader (Web Speech API in TopicDetail sidebar), Social Sharing (ShareModal with copy/Web Share API), Export Progress (JSON download), Prerequisite lock indicators on Topics page
- Context providers order: ClerkProvider → AppProvider → AchievementsProvider → PrefsProvider
- Dark mode: `@custom-variant dark (&:is(.dark *))`, toggled via `document.documentElement.classList.toggle("dark", dark)`
- Custom events: `genai:topic-visit` (TopicDetail on load), `genai:quiz-complete` (Quiz on finish) — consumed by Analytics + useXP

### API Server (`artifacts/api-server`)
- Express 5 + pino logging
- Clerk proxy middleware at `/api/__clerk` (active in all environments)
- `@clerk/express` middleware for route protection

## Auth (Clerk)

- Replit-managed Clerk instance (provisioned, `pk_test_...` key)
- `VITE_CLERK_PUBLISHABLE_KEY` — auto-set env var for frontend
- `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — auto-set secrets for backend
- `VITE_CLERK_PROXY_URL` — empty in dev, auto-set in production by deployment system
- **OAuth Enabled**: Google, GitHub, Discord OAuth buttons integrated at top of sign-in/sign-up pages
  - Social buttons placement: "top" (prominent), configured in `clerkAppearance`
  - Sign-up tip: "Fast signup: Google or GitHub above — takes 10 seconds!"
  - Sign-in tip: "Use Google or GitHub OAuth for instant signup with one click"
  - OAuth provider setup: Configure in [Clerk Dashboard](https://dashboard.clerk.com) under "User & Authentication" > "Social Connections"
- Sign-in page: `/sign-in`, Sign-up page: `/sign-up`
- Auth is optional (app fully usable without login); login enables cross-device sync (future)
