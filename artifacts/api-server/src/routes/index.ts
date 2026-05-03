import { Router, type IRouter } from "express";
import healthRouter from "./health";
import syncRouter from "./sync";
import leaderboardRouter from "./leaderboard";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(syncRouter);
router.use(leaderboardRouter);
router.use(usersRouter);

export default router;
