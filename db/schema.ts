import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  float,
  date,
  time,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const localUsers = mysqlTable("local_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  teamId: bigint("team_id", { mode: "number", unsigned: true }),
  avatar: text("avatar"),
  statsKd: float("stats_kd").default(0),
  statsRating: float("stats_rating").default(0),
  statsMaps: int("stats_maps").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type LocalUser = typeof localUsers.$inferSelect;
export type InsertLocalUser = typeof localUsers.$inferInsert;

export const teams = mysqlTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logo: text("logo"),
  tier: mysqlEnum("tier", ["1", "2", "3"]).notNull(),
  region: varchar("region", { length: 100 }),
  description: text("description"),
  points: int("points").default(0).notNull(),
  worldRank: int("world_rank").default(0),
  coach: varchar("coach", { length: 255 }),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

export const players = mysqlTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nickname: varchar("nickname", { length: 255 }).notNull(),
  photo: text("photo"),
  role: mysqlEnum("role", ["awper", "entry", "igl", "lurk", "support"]).notNull(),
  tier: mysqlEnum("tier", ["1", "2", "3"]).notNull(),
  teamId: bigint("team_id", { mode: "number", unsigned: true }),
  statsKd: float("stats_kd").default(0),
  statsRating: float("stats_rating").default(0),
  statsMaps: int("stats_maps").default(0),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

export const matches = mysqlTable("matches", {
  id: serial("id").primaryKey(),
  team1Id: bigint("team1_id", { mode: "number", unsigned: true }).notNull(),
  team2Id: bigint("team2_id", { mode: "number", unsigned: true }).notNull(),
  team1Score: int("team1_score").default(0),
  team2Score: int("team2_score").default(0),
  status: mysqlEnum("status", ["upcoming", "ongoing", "finished"]).notNull(),
  matchDate: date("match_date"),
  matchTime: time("match_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;
