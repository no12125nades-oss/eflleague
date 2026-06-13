import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { players, teams } from "@db/schema";
import { eq, desc, asc, like, and } from "drizzle-orm";

export const playerRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          tier: z.enum(["1", "2", "3"]).optional(),
          role: z.enum(["awper", "entry", "igl", "lurk", "support"]).optional(),
          teamId: z.number().optional(),
          search: z.string().optional(),
          sortBy: z.enum(["name", "nickname", "statsKd", "statsRating"]).default("statsRating"),
          sortOrder: z.enum(["asc", "desc"]).default("desc"),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.tier) conditions.push(eq(players.tier, input.tier));
      if (input?.role) conditions.push(eq(players.role, input.role));
      if (input?.teamId) conditions.push(eq(players.teamId, input.teamId));
      if (input?.search) conditions.push(like(players.nickname, `%${input.search}%`));

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const orderCol =
        input?.sortBy === "name"
          ? players.name
          : input?.sortBy === "nickname"
            ? players.nickname
            : input?.sortBy === "statsKd"
              ? players.statsKd
              : players.statsRating;

      const orderFn = input?.sortOrder === "asc" ? asc : desc;

      const result = await db
        .select({
          player: players,
          teamName: teams.name,
        })
        .from(players)
        .leftJoin(teams, eq(players.teamId, teams.id))
        .where(where)
        .orderBy(orderFn(orderCol));

      return result.map((r) => ({
        ...r.player,
        teamName: r.teamName,
      }));
    }),

  getById: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();

    const [player] = await db.select().from(players).where(eq(players.id, input.id));
    if (!player) return null;

    let teamName = null;

    if (player.teamId) {
      const [team] = await db.select().from(teams).where(eq(teams.id, player.teamId));
      teamName = team?.name ?? null;
    }

    return { ...player, teamName };
  }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        nickname: z.string().min(1),
        photo: z.string().optional(),
        role: z.enum(["awper", "entry", "igl", "lurk", "support"]),
        tier: z.enum(["1", "2", "3"]),
        teamId: z.number().optional(),
        statsKd: z.number().optional(),
        statsRating: z.number().optional(),
        statsMaps: z.number().optional(),
        country: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const [createdPlayer] = await db
        .insert(players)
        .values(input)
        .returning({ id: players.id });

      return { id: createdPlayer.id };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        nickname: z.string().min(1).optional(),
        photo: z.string().optional(),
        role: z.enum(["awper", "entry", "igl", "lurk", "support"]).optional(),
        tier: z.enum(["1", "2", "3"]).optional(),
        teamId: z.number().optional(),
        statsKd: z.number().optional(),
        statsRating: z.number().optional(),
        statsMaps: z.number().optional(),
        country: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;

      await db.update(players).set(data).where(eq(players.id, id));

      return { success: true };
    }),

  delete: publicQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = getDb();

    await db.delete(players).where(eq(players.id, input.id));

    return { success: true };
  }),
});
