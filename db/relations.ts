import { relations } from "drizzle-orm";
import { teams, players, matches, localUsers } from "./schema";

export const teamsRelations = relations(teams, ({ many }) => ({
  players: many(players),
  team1Matches: many(matches, { relationName: "team1" }),
  team2Matches: many(matches, { relationName: "team2" }),
}));

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  team1: one(teams, {
    fields: [matches.team1Id],
    references: [teams.id],
    relationName: "team1",
  }),
  team2: one(teams, {
    fields: [matches.team2Id],
    references: [teams.id],
    relationName: "team2",
  }),
}));

export const localUsersRelations = relations(localUsers, ({ one }) => ({
  team: one(teams, {
    fields: [localUsers.teamId],
    references: [teams.id],
  }),
}));
