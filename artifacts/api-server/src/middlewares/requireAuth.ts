import { getAuth } from "@clerk/express";
import type { RequestHandler } from "express";

/**
 * Middleware that requires a valid Clerk session.
 * Attaches `res.locals.userId` (Clerk user ID) for downstream handlers.
 */
export const requireAuth: RequestHandler = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.locals.userId = userId;
  next();
};
