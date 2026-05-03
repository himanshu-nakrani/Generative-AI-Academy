#!/bin/bash
cd /vercel/share/v0-project
export VITE_CLERK_PUBLISHABLE_KEY="${VITE_CLERK_PUBLISHABLE_KEY:-pk_test_bmVhdC1jaG93LTI0LmNsZXJrLmFjY291bnRzLmRldiQ}"
pnpm install
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/genai-learn run dev
