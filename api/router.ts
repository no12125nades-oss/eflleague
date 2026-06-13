import { authRouter } from "./auth-router";
import { localAuthRouter } from "./local-auth-router";
import { teamRouter } from "./team-router";
import { playerRouter } from "./player-router";
import { matchRouter } from "./match-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  team: teamRouter,
  player: playerRouter,
  match: matchRouter,
});

export type AppRouter = typeof appRouter;
