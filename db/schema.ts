import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  integer,
  real,
  date,
  time,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const tierEnum = pgEnum("tier", ["1", "2", "3"]);
export const playerRoleEnum = pgEnum("player_role", ["awper", "entry", "igl", "lurk", "support"]);
export const matchStatusEnum = pgEnum("match_status", ["upcoming", "ongoing", "finished"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const localUsers = pgTable("local_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  role: userRoleEnum("role").default("user").notNull(),
  teamId: bigint("team_id", { mode: "number" }),
  avatar: text("avatar"),
  statsKd: real("stats_kd").default(0),
  statsRating: real("stats_rating").default(0),
  statsMaps: integer("stats_maps").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = typeof localUsers.$inferInsert;

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logo: text("logo"),
  tier: tierEnum("tier").notNull(),
  region: varchar("region", { length: 100 }),
  description: text("description"),
  points: integer("points").default(0).notNull(),
  worldRank: integer("world_rank").default(0),
  coach: varchar("coach", { length: 255 }),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nickname: varchar("nickname", { length: 255 }).notNull(),
  photo: text("photo"),
  role: playerRoleEnum("role").notNull(),
  tier: tierEnum("tier").notNull(),
  teamId: bigint("team_id", { mode: "number" }),
  statsKd: real("stats_kd").default(0),
  statsRating: real("stats_rating").default(0),
  statsMaps: integer("stats_maps").default(0),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  team1Id: bigint("team1_id", { mode: "number" }).notNull(),
  team2Id: bigint("team2_id", { mode: "number" }).notNull(),
  team1Score: integer("team1_score").default(0),
  team2Score: integer("team2_score").default(0),
  status: matchStatusEnum("status").notNull(),
  matchDate: date("match_date"),
  matchTime: time("match_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;
