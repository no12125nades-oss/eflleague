import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { teams, players } from "@db/schema";
import { eq, desc, asc, like, and } from "drizzle-orm";

export const teamRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        tier: z.enum(["1", "2", "3"]).optional(),
        search: z.string().optional(),
        sortBy: z.enum(["points", "name", "worldRank"]).default("points"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.tier) {
        conditions.push(eq(teams.tier, input.tier));
      }
      if (input?.search) {
        conditions.push(like(teams.name, `%${input.search}%`));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const orderCol =
        input?.sortBy === "name"
          ? teams.name
          : input?.sortBy === "worldRank"
          ? teams.worldRank
          : teams.points;

      const orderFn = input?.sortOrder === "asc" ? asc : desc;

      return db.select().from(teams).where(where).orderBy(orderFn(orderCol));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [team] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, input.id));

      if (!team) return null;

      const teamPlayers = await db
        .select()
        .from(players)
        .where(eq(players.teamId, input.id));

      return { ...team, players: teamPlayers };
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        logo: z.string().optional(),
        tier: z.enum(["1", "2", "3"]),
        region: z.string().optional(),
        description: z.string().optional(),
        points: z.number().default(0),
        worldRank: z.number().optional(),
        coach: z.string().optional(),
        country: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(teams).values(input);
      return { id: Number(result.insertId) };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        logo: z.string().optional(),
        tier: z.enum(["1", "2", "3"]).optional(),
        region: z.string().optional(),
        description: z.string().optional(),
        points: z.number().optional(),
        worldRank: z.number().optional(),
        coach: z.string().optional(),
        country: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(teams).set(data).where(eq(teams.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(teams).where(eq(teams.id, input.id));
      return { success: true };
    }),
});
