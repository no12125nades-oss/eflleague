import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { matches, teams } from "@db/schema";
import { eq, desc, and, or } from "drizzle-orm";

export const matchRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        status: z.enum(["upcoming", "ongoing", "finished"]).optional(),
        teamId: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.status) {
        conditions.push(eq(matches.status, input.status));
      }
      if (input?.teamId) {
        conditions.push(
          or(
            eq(matches.team1Id, input.teamId),
            eq(matches.team2Id, input.teamId)
          )
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const result = await db
        .select({
          match: matches,
          team1Name: teams.name,
          team2Name: teams.name,
        })
        .from(matches)
        .leftJoin(teams, eq(matches.team1Id, teams.id))
        .where(where)
        .orderBy(desc(matches.matchDate));

      const enrichedMatches = [];
      for (const r of result) {
        let team1Name = r.team1Name;
        let team2Name = null;

        const [t2] = await db
          .select()
          .from(teams)
          .where(eq(teams.id, r.match.team2Id));
        team2Name = t2?.name ?? null;

        enrichedMatches.push({
          ...r.match,
          team1Name,
          team2Name,
        });
      }

      return enrichedMatches;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [match] = await db
        .select()
        .from(matches)
        .where(eq(matches.id, input.id));

      if (!match) return null;

      const [team1] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, match.team1Id));
      const [team2] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, match.team2Id));

      return {
        ...match,
        team1Name: team1?.name ?? null,
        team2Name: team2?.name ?? null,
        team1Logo: team1?.logo ?? null,
        team2Logo: team2?.logo ?? null,
      };
    }),

  create: publicQuery
    .input(
      z.object({
        team1Id: z.number(),
        team2Id: z.number(),
        team1Score: z.number().default(0),
        team2Score: z.number().default(0),
        status: z.enum(["upcoming", "ongoing", "finished"]),
        matchDate: z.string().optional(),
        matchTime: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const data: Record<string, unknown> = {
        team1Id: input.team1Id,
        team2Id: input.team2Id,
        team1Score: input.team1Score,
        team2Score: input.team2Score,
        status: input.status,
      };
      if (input.matchDate) data.matchDate = input.matchDate;
      if (input.matchTime) data.matchTime = input.matchTime;

      const [createdMatch] = await db
  .insert(matches)
  .values(data as typeof matches.$inferInsert)
  .returning({ id: matches.id });

return { id: createdMatch.id };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        team1Id: z.number().optional(),
        team2Id: z.number().optional(),
        team1Score: z.number().optional(),
        team2Score: z.number().optional(),
        status: z.enum(["upcoming", "ongoing", "finished"]).optional(),
        matchDate: z.string().optional(),
        matchTime: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(data)) {
        if (val !== undefined) updateData[key] = val;
      }

      if (Object.keys(updateData).length > 0) {
        await db.update(matches).set(updateData as typeof matches.$inferInsert).where(eq(matches.id, id));
      }
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(matches).where(eq(matches.id, input.id));
      return { success: true };
    }),
});
